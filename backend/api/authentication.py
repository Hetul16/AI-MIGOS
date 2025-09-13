from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from core.firebase import get_db
from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional, List

router = APIRouter()
security = HTTPBearer()

# ------------------- Schemas -------------------
class UserSync(BaseModel):
    full_name: str
    email: EmailStr
    travel_preferences: Optional[List[str]] = []
    subscribe_newsletter: bool = False

class GoogleAuthRequest(BaseModel):
    id_token: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    travel_preferences: Optional[List[str]] = None
    subscribe_newsletter: Optional[bool] = None
    profile_complete: Optional[bool] = None

# ------------------- Helpers -------------------
async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# ------------------- Authentication Endpoints -------------------
@router.post("/auth/register")
async def sync_registered_user(
    user_data: UserSync, 
    current_user: dict = Depends(verify_firebase_token)
):
    """
    Sync user data after Firebase Auth registration is complete.
    Frontend handles Firebase Auth user creation.
    """
    try:
        uid = current_user['uid']
        email = current_user.get('email')
        
        # Verify the email matches
        if email != user_data.email:
            raise HTTPException(status_code=400, detail="Email mismatch with authenticated user")
        
        # Create or update user document in Firestore
        user_doc = {
            "uid": uid,
            "full_name": user_data.full_name,
            "email": user_data.email,
            "travel_preferences": user_data.travel_preferences,
            "subscribe_newsletter": user_data.subscribe_newsletter,
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
            "profile_complete": False,
            "auth_provider": "email"
        }
        
        get_db().collection("users").document(uid).set(user_doc)
        
        return {
            "success": True, 
            "message": "User data synced successfully", 
            "user_id": uid
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User sync failed: {str(e)}")

@router.post("/auth/login")
async def sync_login(current_user: dict = Depends(verify_firebase_token)):
    """
    Sync login activity after Firebase Auth login is complete.
    Frontend handles Firebase Auth authentication.
    """
    try:
        uid = current_user['uid']
        
        # Update last login in Firestore
        user_ref = get_db().collection("users").document(uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        user_ref.update({"last_login": datetime.utcnow()})
        
        return {
            "success": True, 
            "message": "Login synced successfully", 
            "user_id": uid
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login sync failed: {str(e)}")

@router.post("/auth/google")
async def sync_google_auth(auth_request: GoogleAuthRequest):
    """
    Handle Google OAuth token verification and user sync.
    Frontend sends the ID token after Google authentication.
    """
    try:
        # Verify the Google ID token
        decoded_token = auth.verify_id_token(auth_request.id_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email')
        name = decoded_token.get('name', '')

        user_ref = get_db().collection("users").document(uid)
        user_doc = user_ref.get()
        is_new_user = not user_doc.exists

        if is_new_user:
            # Create new user document for Google OAuth user
            user_data = {
                "uid": uid,
                "full_name": name,
                "email": email,
                "travel_preferences": [],
                "subscribe_newsletter": False,
                "created_at": datetime.utcnow(),
                "last_login": datetime.utcnow(),
                "profile_complete": False,
                "auth_provider": "google"
            }
            user_ref.set(user_data)
        else:
            # Update existing user's last login
            user_ref.update({"last_login": datetime.utcnow()})

        return {
            "success": True,
            "message": "Google authentication synced successfully",
            "user_id": uid,
            "is_new_user": is_new_user
        }
        
    except Exception as e:
        print(f"Google auth error: {str(e)}")  # Add logging
        raise HTTPException(status_code=400, detail=f"Google authentication sync failed: {str(e)}")

# ------------------- User Profile Endpoints -------------------
@router.get("/user/profile")
async def get_user_profile(current_user: dict = Depends(verify_firebase_token)):
    """Get user profile data from Firestore."""
    try:
        uid = current_user['uid']
        user_doc = get_db().collection("users").document(uid).get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        profile_data = user_doc.to_dict()
        # Remove sensitive data before sending
        profile_data.pop('uid', None)
        
        return {"success": True, "profile": profile_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")

@router.put("/user/profile")
async def update_user_profile(
    profile_data: UserProfileUpdate, 
    current_user: dict = Depends(verify_firebase_token)
):
    """Update user profile data in Firestore."""
    try:
        uid = current_user['uid']
        user_ref = get_db().collection("users").document(uid)
        
        # Check if user exists
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Prepare update data (only include non-None values)
        update_data = {
            "updated_at": datetime.utcnow()
        }
        
        if profile_data.full_name is not None:
            update_data["full_name"] = profile_data.full_name
        if profile_data.travel_preferences is not None:
            update_data["travel_preferences"] = profile_data.travel_preferences
        if profile_data.subscribe_newsletter is not None:
            update_data["subscribe_newsletter"] = profile_data.subscribe_newsletter
        if profile_data.profile_complete is not None:
            update_data["profile_complete"] = profile_data.profile_complete
        
        user_ref.update(update_data)
        
        return {"success": True, "message": "Profile updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile update failed: {str(e)}")

# ------------------- Travel Preferences Endpoints -------------------
@router.get("/user/travel-preferences")
async def get_travel_preferences(current_user: dict = Depends(verify_firebase_token)):
    """Get user's travel preferences."""
    try:
        uid = current_user['uid']
        user_doc = get_db().collection("users").document(uid).get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        preferences = user_doc.to_dict().get('travel_preferences', [])
        return {"success": True, "preferences": preferences}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch preferences: {str(e)}")

@router.put("/user/travel-preferences")
async def update_travel_preferences(
    preferences_data: dict,
    current_user: dict = Depends(verify_firebase_token)
):
    """Update user's travel preferences."""
    try:
        uid = current_user['uid']
        preferences = preferences_data.get('preferences', [])
        
        user_ref = get_db().collection("users").document(uid)
        
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_ref.update({
            "travel_preferences": preferences, 
            "updated_at": datetime.utcnow()
        })
        
        return {"success": True, "message": "Travel preferences updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update preferences: {str(e)}")

# ------------------- Health Check -------------------
@router.get("/auth/health")
async def health_check():
    """Health check endpoint for authentication service."""
    return {"status": "healthy", "service": "authentication", "timestamp": datetime.utcnow()}   