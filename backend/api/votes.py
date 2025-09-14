from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import uuid4

from core.firebase import db
from api.authentication import verify_firebase_token

router = APIRouter(prefix="/api/v1", tags=["Votes"])

# Firestore refs
def votes_col():
    return db.collection("votes")

# Pydantic models
class VoteCreateRequest(BaseModel):
    itinerary_id: str
    activity_id: Optional[str] = None
    option_id: str # The ID of the option being voted for

# Endpoints
@router.post("/votes")
async def add_vote(body: VoteCreateRequest, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    vote_id = f"vote_{uuid4().hex[:12]}"
    
    vote_doc = {
        "id": vote_id,
        "itinerary_id": body.itinerary_id,
        "activity_id": body.activity_id,
        "user_id": uid,
        "option_id": body.option_id,
        "created_at": datetime.utcnow(),
    }
    
    votes_col().document(vote_id).set(vote_doc)
    return {"success": True, "vote_id": vote_id}

@router.get("/itineraries/{itinerary_id}/votes")
async def get_itinerary_votes(itinerary_id: str, current_user: dict = Depends(verify_firebase_token)):
    # For simplicity, assuming any authenticated user can view votes on an itinerary they have access to.
    
    votes = []
    query = votes_col().where("itinerary_id", "==", itinerary_id).stream()
    for doc in query:
        votes.append(doc.to_dict())
    return {"success": True, "votes": votes}

@router.get("/activities/{activity_id}/votes")
async def get_activity_votes(activity_id: str, current_user: dict = Depends(verify_firebase_token)):
    # For simplicity, assuming any authenticated user can view votes on an activity they have access to.
    
    votes = []
    query = votes_col().where("activity_id", "==", activity_id).stream()
    for doc in query:
        votes.append(doc.to_dict())
    return {"success": True, "votes": votes}

@router.delete("/votes/{vote_id}")
async def delete_vote(vote_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = votes_col().document(vote_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Vote not found")
    
    vote = doc.to_dict()
    if vote["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden") # Only the author can delete their vote
    
    doc_ref.delete()
    return {"success": True, "message": "Vote deleted successfully"}
