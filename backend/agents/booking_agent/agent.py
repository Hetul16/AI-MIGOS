import os
import requests
from google.adk import Agent
from google.genai import types
from .prompt import SYSTEM_PROMPT


BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000/api/v1")
MODEL_NAME = os.getenv("ADK_RUNTIME_MODEL", "gemini-2.0-flash")


def _auth_headers(id_token: str):
    return {"Authorization": f"Bearer {id_token}", "Content-Type": "application/json"}


def reserve_items(itinerary_id: str, items: list[dict], id_token: str, hold_ttl_minutes: int | None = None, idempotency_key: str | None = None):
    url = f"{BACKEND_BASE_URL}/trips/{itinerary_id}/reserve"
    payload = {"items": items, "hold_ttl_minutes": hold_ttl_minutes, "idempotency_key": idempotency_key}
    r = requests.post(url, json=payload, headers=_auth_headers(id_token), timeout=30)
    r.raise_for_status()
    return r.json()


def create_checkout(reservation_id: str, amount: float, currency: str, id_token: str):
    url = f"{BACKEND_BASE_URL}/payments/checkout"
    payload = {"reservation_id": reservation_id, "amount": amount, "currency": currency}
    r = requests.post(url, json=payload, headers=_auth_headers(id_token), timeout=30)
    r.raise_for_status()
    return r.json()


def finalize_booking(itinerary_id: str, reservation_id: str, payment_id: str, id_token: str):
    url = f"{BACKEND_BASE_URL}/trips/{itinerary_id}/book"
    params = {"reservation_id": reservation_id, "payment_id": payment_id}
    r = requests.post(url, params=params, headers=_auth_headers(id_token), timeout=30)
    r.raise_for_status()
    return r.json()


booking_agent = Agent(
    name="booking_agent",
    model=MODEL_NAME,
    description="Handles reservations, payments, and bookings.",
    instruction=SYSTEM_PROMPT,
    tools=[reserve_items, create_checkout, finalize_booking],
    generate_content_config=types.GenerateContentConfig(
        safety_settings=[
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
        ]
    ),
)


root_agent = booking_agent


