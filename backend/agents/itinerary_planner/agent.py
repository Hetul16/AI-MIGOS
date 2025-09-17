"""
Itinerary Planner Agent (ADK) - no custom business logic.
Wraps backend endpoints to create and fetch itineraries.
"""
import os
import requests
from google.adk import Agent
from google.genai import types
from .prompt import SYSTEM_PROMPT


BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000/api/v1")
MODEL_NAME = os.getenv("ADK_RUNTIME_MODEL", "gemini-2.0-flash")


def _auth_headers(id_token: str):
    return {"Authorization": f"Bearer {id_token}", "Content-Type": "application/json"}


def generate_itinerary(
    destination: str,
    id_token: str,
    origin: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    duration_days: int | None = None,
    budget_in_inr: float | None = None,
    themes: list[str] | None = None,
    travelers: int | None = 1,
    preferences: dict | None = None,
):
    url = f"{BACKEND_BASE_URL}/trips/create"
    payload = {
        "destination": destination,
        "origin": origin,
        "start_date": start_date,
        "end_date": end_date,
        "duration_days": duration_days,
        "budget_in_inr": budget_in_inr,
        "themes": themes or [],
        "travelers": travelers or 1,
        "preferences": preferences or {},
    }
    r = requests.post(url, json=payload, headers=_auth_headers(id_token), timeout=20)
    r.raise_for_status()
    return r.json()


def fetch_itinerary(itinerary_id: str, id_token: str):
    url = f"{BACKEND_BASE_URL}/trips/{itinerary_id}"
    r = requests.get(url, headers=_auth_headers(id_token), timeout=20)
    r.raise_for_status()
    return r.json()


itinerary_planner = Agent(
    name="itinerary_planner",
    model=MODEL_NAME,
    description="Generates initial itineraries and fetches them from backend.",
    instruction=SYSTEM_PROMPT,
    tools=[generate_itinerary, fetch_itinerary],
    generate_content_config=types.GenerateContentConfig(
        safety_settings=[
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
        ]
    ),
)


root_agent = itinerary_planner


