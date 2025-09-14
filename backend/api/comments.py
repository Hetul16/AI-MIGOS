from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import uuid4

from core.firebase import db
from api.authentication import verify_firebase_token

router = APIRouter(prefix="/api/v1", tags=["Comments"])

# Firestore refs
def comments_col():
    return db.collection("comments")

# Pydantic models
class CommentCreateRequest(BaseModel):
    itinerary_id: str
    activity_id: Optional[str] = None
    text: str

class CommentUpdateRequest(BaseModel):
    text: str

# Endpoints
@router.post("/comments")
async def add_comment(body: CommentCreateRequest, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    comment_id = f"cmt_{uuid4().hex[:12]}"
    
    comment_doc = {
        "id": comment_id,
        "itinerary_id": body.itinerary_id,
        "activity_id": body.activity_id,
        "user_id": uid,
        "text": body.text,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    comments_col().document(comment_id).set(comment_doc)
    return {"success": True, "comment_id": comment_id}

@router.get("/itineraries/{itinerary_id}/comments")
async def get_itinerary_comments(itinerary_id: str, current_user: dict = Depends(verify_firebase_token)):
    # For simplicity, assuming any authenticated user can view comments on an itinerary they have access to.
    # In a real app, you'd check if the user is a member of the itinerary.
    
    comments = []
    query = comments_col().where("itinerary_id", "==", itinerary_id).order_by("created_at", direction="ASCENDING").stream()
    for doc in query:
        comments.append(doc.to_dict())
    return {"success": True, "comments": comments}

@router.get("/activities/{activity_id}/comments")
async def get_activity_comments(activity_id: str, current_user: dict = Depends(verify_firebase_token)):
    # For simplicity, assuming any authenticated user can view comments on an activity they have access to.
    
    comments = []
    query = comments_col().where("activity_id", "==", activity_id).order_by("created_at", direction="ASCENDING").stream()
    for doc in query:
        comments.append(doc.to_dict())
    return {"success": True, "comments": comments}

@router.put("/comments/{comment_id}")
async def update_comment(comment_id: str, body: CommentUpdateRequest, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = comments_col().document(comment_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comment = doc.to_dict()
    if comment["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden") # Only the author can update their comment
    
    update_data = body.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    doc_ref.update(update_data)
    return {"success": True, "message": "Comment updated successfully"}

@router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = comments_col().document(comment_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comment = doc.to_dict()
    # Only the author or an itinerary owner/editor can delete a comment
    if comment["user_id"] != uid:
        # Further check for itinerary owner/editor permissions
        raise HTTPException(status_code=403, detail="Forbidden")
    
    doc_ref.delete()
    return {"success": True, "message": "Comment deleted successfully"}
