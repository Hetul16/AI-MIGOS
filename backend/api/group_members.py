from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import uuid4

from core.firebase import db
from api.authentication import verify_firebase_token

router = APIRouter(prefix="/api/v1", tags=["Group Collaboration"])

# Firestore refs
def group_members_col():
    return db.collection("group_members")

# Pydantic models
class GroupMemberCreateRequest(BaseModel):
    itinerary_id: str
    user_id: str # The user being invited
    role: str = "viewer" # e.g., 'owner', 'editor', 'viewer'

class GroupMemberUpdateRequest(BaseModel):
    role: Optional[str] = None
    status: Optional[str] = None # e.g., 'pending', 'accepted', 'declined'

# Endpoints
@router.post("/group_members")
async def add_group_member(body: GroupMemberCreateRequest, current_user: dict = Depends(verify_firebase_token)):
    # Only the owner or editor can invite new members
    # This would require checking the role of current_user for the given itinerary_id
    # For simplicity, we'll assume the current_user has permission for now.
    
    group_member_id = f"gm_{uuid4().hex[:12]}"
    
    group_member_doc = {
        "id": group_member_id,
        "itinerary_id": body.itinerary_id,
        "user_id": body.user_id,
        "role": body.role,
        "status": "pending", # Initial status
        "invited_by_user_id": current_user["uid"],
        "invited_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    group_members_col().document(group_member_id).set(group_member_doc)
    return {"success": True, "group_member_id": group_member_id, "status": "pending"}

@router.get("/group_members/{group_member_id}")
async def get_group_member(group_member_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc = group_members_col().document(group_member_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Group member not found")
    
    group_member = doc.to_dict()
    # Ensure the current user is either the invited user or has access to the itinerary
    if group_member["user_id"] != uid and group_member["invited_by_user_id"] != uid:
        # Further check if current_user has access to itinerary (e.g., is owner/editor)
        # This would involve fetching itinerary and checking its group_members or owner_id
        raise HTTPException(status_code=403, detail="Forbidden")
    
    return {"success": True, "group_member": group_member}

@router.get("/itineraries/{itinerary_id}/group_members")
async def get_itinerary_group_members(itinerary_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    members = []
    # Check if current_user has access to this itinerary (e.g., is a member)
    # For simplicity, we'll assume access if they are authenticated.
    
    query = group_members_col().where("itinerary_id", "==", itinerary_id).stream()
    for doc in query:
        members.append(doc.to_dict())
    return {"success": True, "group_members": members}

@router.put("/group_members/{group_member_id}")
async def update_group_member(group_member_id: str, body: GroupMemberUpdateRequest, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = group_members_col().document(group_member_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Group member not found")
    
    group_member = doc.to_dict()
    # Only the invited user can accept/decline, or owner/editor can change role/status
    if group_member["user_id"] != uid and group_member["invited_by_user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    update_data = body.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    doc_ref.update(update_data)
    return {"success": True, "message": "Group member updated successfully"}

@router.delete("/group_members/{group_member_id}")
async def remove_group_member(group_member_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc_ref = group_members_col().document(group_member_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Group member not found")
    
    group_member = doc.to_dict()
    # Only the invited user can leave, or owner/editor can remove
    if group_member["user_id"] != uid and group_member["invited_by_user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    doc_ref.delete()
    return {"success": True, "message": "Group member removed successfully"}
