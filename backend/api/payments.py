# api/payments.py
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import uuid4
import os
import logging
import stripe

from core.firebase import db
from api.authentication import verify_firebase_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["Payments & Booking"])

# Stripe setup (test mode keys in .env)
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

# Firestore refs
def reservations_col():
    return db.collection("reservations")

def payments_col():
    return db.collection("payments")

def bookings_col():
    return db.collection("bookings")


# ------------------------
# Pydantic models
# ------------------------
class CheckoutRequest(BaseModel):
    reservation_id: str
    amount: float
    currency: str = "INR"


# ------------------------
# Endpoints
# ------------------------

@router.post("/payments/checkout")
async def create_checkout(body: CheckoutRequest, current_user: dict = Depends(verify_firebase_token)):
    """
    Create a Stripe PaymentIntent for a reservation.
    """
    uid = current_user["uid"]
    res_doc = reservations_col().document(body.reservation_id).get()
    if not res_doc.exists:
        raise HTTPException(status_code=404, detail="Reservation not found")
    res = res_doc.to_dict()
    if res["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    if res["status"] not in ["held"]:
        raise HTTPException(status_code=400, detail="Reservation not valid for payment")

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(body.amount * 100),  # Stripe expects paise/cents
            currency=body.currency.lower(),
            metadata={"reservation_id": body.reservation_id, "user_id": uid},
        )
        payment_id = f"pay_{uuid4().hex[:12]}"
        payment_doc = {
            "id": payment_id,
            "reservation_id": body.reservation_id,
            "user_id": uid,
            "status": "created",
            "stripe_payment_intent_id": intent.id,
            "amount": body.amount,
            "currency": body.currency,
            "created_at": datetime.utcnow(),
        }
        payments_col().document(payment_id).set(payment_doc)

        return {
            "success": True,
            "payment_id": payment_id,
            "client_secret": intent.client_secret,
            "reservation_id": body.reservation_id,
        }
    except Exception as e:
        logger.exception("Stripe create_payment failed")
        raise HTTPException(status_code=500, detail="Payment creation failed")


@router.post("/payments/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Handle Stripe webhook events.
    """
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Stripe webhook secret not configured")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception:
        logger.exception("Webhook parsing failed")
        raise HTTPException(status_code=400, detail="Webhook error")

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "payment_intent.succeeded":
        intent_id = data["id"]
        background_tasks.add_task(mark_payment_success, intent_id)
    elif event_type == "payment_intent.payment_failed":
        intent_id = data["id"]
        background_tasks.add_task(mark_payment_failed, intent_id)

    return {"success": True}


def mark_payment_success(intent_id: str):
    try:
        q = payments_col().where("stripe_payment_intent_id", "==", intent_id).limit(1).get()
        for doc in q:
            payment = doc.to_dict()
            payments_col().document(doc.id).update({"status": "succeeded", "updated_at": datetime.utcnow()})
            # also update reservation
            reservations_col().document(payment["reservation_id"]).update({"status": "paid"})
    except Exception:
        logger.exception("mark_payment_success failed")


def mark_payment_failed(intent_id: str):
    try:
        q = payments_col().where("stripe_payment_intent_id", "==", intent_id).limit(1).get()
        for doc in q:
            payments_col().document(doc.id).update({"status": "failed", "updated_at": datetime.utcnow()})
    except Exception:
        logger.exception("mark_payment_failed failed")


@router.post("/trips/{itinerary_id}/book")
async def finalize_booking(itinerary_id: str, reservation_id: str, payment_id: str, current_user: dict = Depends(verify_firebase_token)):
    """
    Finalize booking after successful payment.
    """
    uid = current_user["uid"]
    res_doc = reservations_col().document(reservation_id).get()
    pay_doc = payments_col().document(payment_id).get()

    if not res_doc.exists or not pay_doc.exists:
        raise HTTPException(status_code=404, detail="Reservation or Payment not found")

    res = res_doc.to_dict()
    pay = pay_doc.to_dict()

    if res["user_id"] != uid or pay["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    if pay["status"] != "succeeded":
        raise HTTPException(status_code=400, detail="Payment not succeeded")

    booking_id = f"bk_{uuid4().hex[:12]}"
    booking_doc = {
        "id": booking_id,
        "itinerary_id": itinerary_id,
        "reservation_id": reservation_id,
        "payment_id": payment_id,
        "user_id": uid,
        "status": "confirmed",
        "provider_refs": [],  # in real integration, fill with provider booking IDs
        "created_at": datetime.utcnow(),
    }
    bookings_col().document(booking_id).set(booking_doc)
    # update reservation & itinerary
    reservations_col().document(reservation_id).update({"status": "booked"})
    db.collection("itineraries").document(itinerary_id).update({"status": "booked"})

    return {"success": True, "booking_id": booking_id, "status": "confirmed"}


@router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc = bookings_col().document(booking_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Booking not found")
    b = doc.to_dict()
    if b["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    return {"success": True, "booking": b}


@router.post("/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: str, current_user: dict = Depends(verify_firebase_token)):
    uid = current_user["uid"]
    doc = bookings_col().document(booking_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Booking not found")
    b = doc.to_dict()
    if b["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    if b["status"] == "cancelled":
        return {"success": True, "message": "Already cancelled"}
    bookings_col().document(booking_id).update({"status": "cancelled", "cancelled_at": datetime.utcnow()})
    return {"success": True, "message": "Booking cancelled"}
