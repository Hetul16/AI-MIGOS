from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import uuid4

from core.firebase import db
from api.authentication import verify_firebase_token

router = APIRouter(prefix="/api/v1", tags=["Reservations"])

# Firestore refs
def reservations_col():
    return db.collection("reservations")

# Pydantic models
class ReservationCreateRequest(BaseModel):
    itinerary_id: str
    activity_id: Optional[str] = None
    service_type: str # e.g., 'flight', 'hotel', 'activity', 'package'
    service_details: dict # Specific details of the service
    amount: float
    currency: str = "INR"

class ReservationUpdateRequest(BaseModel):
    status: Optional[str] = None # e.g., 'pending_payment', 'held', 'cancelled', 'expired', 'paid'
    expires_at: Optional[datetime] = None

# Endpoints
@router.post("/reservations")
async def create_reservation(body: ReservationCreateRequest, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    reservation_id = f"res_{uuid4().hex[:12]}"
    
    reservation_doc = {
        "id": reservation_id,
        "user_id": uid,
        "itinerary_id": body.itinerary_id,
        "activity_id": body.activity_id,
        "service_type": body.service_type,
        "service_details": body.service_details,
        "amount": body.amount,
        "currency": body.currency,
        "status": "pending_payment", # Initial status
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    reservations_col().document(reservation_id).set(reservation_doc)
    return {"success": True, "reservation_id": reservation_id, "status": "pending_payment"}

@router.get("/reservations/{reservation_id}")
async def get_reservation(reservation_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc = reservations_col().document(reservation_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    reservation = doc.to_dict()
    if reservation["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    return {"success": True, "reservation": reservation}

@router.get("/reservations")
async def get_all_reservations(current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    reservations = []
    query = reservations_col().where("user_id", "==", uid).order_by("created_at", direction="DESCENDING").stream()
    for doc in query:
        reservations.append(doc.to_dict())
    return {"success": True, "reservations": reservations}

@router.put("/reservations/{reservation_id}")
async def update_reservation(reservation_id: str, body: ReservationUpdateRequest, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = reservations_col().document(reservation_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    reservation = doc.to_dict()
    if reservation["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    update_data = body.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    doc_ref.update(update_data)
    return {"success": True, "message": "Reservation updated successfully"}

@router.delete("/reservations/{reservation_id}")
async def delete_reservation(reservation_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = reservations_col().document(reservation_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    reservation = doc.to_dict()
    if reservation["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    doc_ref.delete()
    return {"success": True, "message": "Reservation deleted successfully"}
