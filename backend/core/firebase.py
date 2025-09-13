import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize db as None
db = None

def init_firebase():
    global db
    try:
        if not firebase_admin._apps:
            # Check if service account key exists
            key_path = "firebase-service-account-key.json"
            if not os.path.exists(key_path):
                raise FileNotFoundError(f"Firebase service account key not found at {key_path}")
            
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        print("✅ Firebase initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Firebase initialization failed: {str(e)}")
        db = None
        return False

def get_db():
    """Get Firestore database instance"""
    global db
    if db is None:
        raise Exception("Firebase not initialized. Call init_firebase() first.")
    return db
