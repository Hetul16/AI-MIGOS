from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import uuid4

from core.firebase import db
from api.authentication import verify_firebase_token

router = APIRouter(prefix="/api/v1", tags=["Hidden Gems"])

# Firestore refs
def hidden_gems_col():
    return db.collection("hidden_gems")

# Pydantic models
class Location(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    latitude: float
    longitude: float

class HiddenGemCreateRequest(BaseModel):
    name: str
    description: str
    location: Location
    category: str # e.g., 'restaurant', 'landmark', 'nature'
    image_url: Optional[str] = None
    itinerary_id: Optional[str] = None # If a gem is specifically suggested for a trip

class HiddenGemUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[Location] = None
    category: Optional[str] = None
    image_url: Optional[str] = None

# Endpoints
@router.post("/hidden_gems")
async def add_hidden_gem(body: HiddenGemCreateRequest, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    gem_id = f"gem_{uuid4().hex[:12]}"
    
    gem_doc = {
        "id": gem_id,
        "name": body.name,
        "description": body.description,
        "location": body.location.dict(),
        "category": body.category,
        "image_url": body.image_url,
        "submitted_by_user_id": uid,
        "itinerary_id": body.itinerary_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    hidden_gems_col().document(gem_id).set(gem_doc)
    return {"success": True, "gem_id": gem_id}

@router.get("/hidden_gems/{gem_id}")
async def get_hidden_gem(gem_id: str, current_user: dict = Depends(verify_firebase_token)):
    doc = hidden_gems_col().document(gem_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Hidden gem not found")
    
    gem = doc.to_dict()
    # Access control could be implemented here if gems are private
    return {"success": True, "gem": gem}

@router.get("/hidden_gems")
async def get_all_hidden_gems(itinerary_id: Optional[str] = None, current_user: dict = Depends(verify_firebase_token)):
    gems = []
    query = hidden_gems_col()
    
    if itinerary_id:
        query = query.where("itinerary_id", "==", itinerary_id)
        
    query = query.order_by("created_at", direction="DESCENDING").stream()
    for doc in query:
        gems.append(doc.to_dict())
    return {"success": True, "hidden_gems": gems}

@router.put("/hidden_gems/{gem_id}")
async def update_hidden_gem(gem_id: str, body: HiddenGemUpdateRequest, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = hidden_gems_col().document(gem_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Hidden gem not found")
    
    gem = doc.to_dict()
    if gem["submitted_by_user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden") # Only the author can update their gem
    
    update_data = body.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    doc_ref.update(update_data)
    return {"success": True, "message": "Hidden gem updated successfully"}

@router.delete("/hidden_gems/{gem_id}")
async def delete_hidden_gem(gem_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = hidden_gems_col().document(gem_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Hidden gem not found")
    
    gem = doc.to_dict()
    if gem["submitted_by_user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden") # Only the author can delete their gem
    
    doc_ref.delete()
    return {"success": True, "message": "Hidden gem deleted successfully"}
