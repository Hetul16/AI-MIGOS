from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import router
from api.authentication import router as auth_router
from api.trips import router as trips_router
from api.payments import router as payments_router
from core.firebase import init_firebase

# Initialize Firebase
init_firebase()

app = FastAPI(title="TravelAI Pro API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:4028"],  # frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount authentication router
app.include_router(auth_router, prefix="/api", tags=["Authentication & User"])
app.include_router(trips_router, prefix="/api", tags=["Trips"])
app.include_router(payments_router, prefix="/api", tags=["Payments & Booking"])

@app.get("/")
def root():
    return {"message": "TravelAI Pro API is running"}

# Health check
@app.get("/api/health")
async def health_check():
    from datetime import datetime
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
