"""
Orchestrator Agent (single-file) - delegates to local sub-agents (no A2A).
"""
import os
from google.adk import Agent
from google.genai import types

# Force Gemini for reliable orchestration
ORCHESTRATOR_MODEL = "gemini-2.0-flash"

from .itinerary_planner.agent import itinerary_planner
from .hidden_gems.agent import hidden_gems
from .realtime_adjuster.agent import realtime_adjuster
from .booking_agent.agent import booking_agent
from .concierge_agent.agent import concierge_agent

# --- Root Orchestrator ---

root_agent = Agent(
    model=ORCHESTRATOR_MODEL,
    name="travel_orchestrator",
    description="Delegates to sub-agents only; never responds directly.",
    instruction=(
        "Always transfer_to_agent based on intent: "
        "planner (create/fetch), gems (POIs), "
        "realtime (weather/customize), booking (reserve/checkout/book), "
        "concierge (chat)."
    ),
    sub_agents=[itinerary_planner, hidden_gems, realtime_adjuster, booking_agent, concierge_agent],
    generate_content_config=types.GenerateContentConfig(
        safety_settings=[
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
        ]
    ),
)
