import os
import requests
from google.adk import Agent
from google.genai import types
from .prompt import SYSTEM_PROMPT


BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000/api/v1")
MODEL_NAME = os.getenv("ADK_RUNTIME_MODEL", "gemini-2.0-flash")


def _auth_headers(id_token: str):
    return {"Authorization": f"Bearer {id_token}", "Content-Type": "application/json"}


def get_weather(itinerary_id: str, id_token: str):
    url = f"{BACKEND_BASE_URL}/trips/{itinerary_id}/weather"
    r = requests.get(url, headers=_auth_headers(id_token), timeout=20)
    r.raise_for_status()
    return r.json()


def apply_customizations(itinerary_id: str, actions: list[dict], id_token: str):
    url = f"{BACKEND_BASE_URL}/trips/{itinerary_id}/customize"
    payload = {"actions": actions}
    r = requests.post(url, json=payload, headers=_auth_headers(id_token), timeout=20)
    r.raise_for_status()
    return r.json()


realtime_adjuster = Agent(
    name="realtime_adjuster",
    model=MODEL_NAME,
    description="Monitors and applies itinerary adjustments.",
    instruction=SYSTEM_PROMPT,
    tools=[get_weather, apply_customizations],
    generate_content_config=types.GenerateContentConfig(
        safety_settings=[
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
        ]
    ),
)


root_agent = realtime_adjuster


