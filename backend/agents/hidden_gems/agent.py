import os
import requests
from google.adk import Agent
from google.genai import types
from .prompt import SYSTEM_PROMPT


BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000/api/v1")
MODEL_NAME = os.getenv("ADK_RUNTIME_MODEL", "gemini-2.0-flash")


def _auth_headers(id_token: str):
    return {"Authorization": f"Bearer {id_token}", "Content-Type": "application/json"}


def list_hidden_gems(itinerary_id: str, id_token: str, filter: str | None = None, radius_m: int | None = None):
    url = f"{BACKEND_BASE_URL}/trips/{itinerary_id}/hidden_gems"
    params = {}
    if filter:
        params["filter"] = filter
    if radius_m:
        params["radius_m"] = radius_m
    r = requests.get(url, params=params, headers=_auth_headers(id_token), timeout=30)
    r.raise_for_status()
    return r.json()


hidden_gems = Agent(
    name="hidden_gems",
    model=MODEL_NAME,
    description="Curates hidden gems via backend endpoint.",
    instruction=SYSTEM_PROMPT,
    tools=[list_hidden_gems],
    generate_content_config=types.GenerateContentConfig(
        safety_settings=[
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
        ]
    ),
)


root_agent = hidden_gems


