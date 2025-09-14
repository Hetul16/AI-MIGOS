from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import uuid4

from core.firebase import db
from api.authentication import verify_firebase_token

router = APIRouter(prefix="/api/v1", tags=["Weather Alerts"])

# Firestore refs
def weather_alerts_col():
    return db.collection("weather_alerts")

# Pydantic models
class WeatherAlertCreateRequest(BaseModel):
    itinerary_id: str
    location: str # City/region for the alert
    date: datetime
    type: str # e.g., 'warning', 'advisory'
    message: str
    severity: str # e.g., 'low', 'medium', 'high'

class WeatherAlertUpdateRequest(BaseModel):
    type: Optional[str] = None
    message: Optional[str] = None
    severity: Optional[str] = None

# Endpoints
@router.post("/weather_alerts")
async def add_weather_alert(body: WeatherAlertCreateRequest, current_user: dict = Depends(verify_firebase_token)):
    # This endpoint might be called by a background job or an admin, not directly by a user.
    # For simplicity, we'll allow authenticated users to create for now.
    
    alert_id = f"alert_{uuid4().hex[:12]}"
    
    alert_doc = {
        "id": alert_id,
        "itinerary_id": body.itinerary_id,
        "location": body.location,
        "date": body.date,
        "type": body.type,
        "message": body.message,
        "severity": body.severity,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    weather_alerts_col().document(alert_id).set(alert_doc)
    return {"success": True, "alert_id": alert_id}

@router.get("/weather_alerts/{alert_id}")
async def get_weather_alert(alert_id: str, current_user: dict = Depends(verify_firebase_token)):
    doc = weather_alerts_col().document(alert_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Weather alert not found")
    
    alert = doc.to_dict()
    # Access control could be implemented here if alerts are private
    return {"success": True, "alert": alert}

@router.get("/itineraries/{itinerary_id}/weather_alerts")
async def get_itinerary_weather_alerts(itinerary_id: str, current_user: dict = Depends(verify_firebase_token)):
    alerts = []
    query = weather_alerts_col().where("itinerary_id", "==", itinerary_id).order_by("date", direction="ASCENDING").stream()
    for doc in query:
        alerts.append(doc.to_dict())
    return {"success": True, "weather_alerts": alerts}

@router.put("/weather_alerts/{alert_id}")
async def update_weather_alert(alert_id: str, body: WeatherAlertUpdateRequest, current_user: dict = Depends(verify_firebase_token)):
    # This endpoint might be restricted to admins or background jobs
    
    doc_ref = weather_alerts_col().document(alert_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Weather alert not found")
    
    update_data = body.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    doc_ref.update(update_data)
    return {"success": True, "message": "Weather alert updated successfully"}

@router.delete("/weather_alerts/{alert_id}")
async def delete_weather_alert(alert_id: str, current_user: dict = Depends(verify_firebase_token)):
    # This endpoint might be restricted to admins or background jobs
    
    doc_ref = weather_alerts_col().document(alert_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Weather alert not found")
    
    doc_ref.delete()
    return {"success": True, "message": "Weather alert deleted successfully"}
