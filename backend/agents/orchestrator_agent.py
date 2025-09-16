"""
Orchestrator Agent (single-file) - delegates to sub-agents only.
No agent.json or prompt required for orchestrator; it exposes root_agent for A2A.
"""
import os
from google.adk import Agent
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent, AGENT_CARD_WELL_KNOWN_PATH
from google.genai import types


# Force Gemini for reliable transfer_to_agent behavior
ORCHESTRATOR_MODEL = "gemini-2.0-flash"
PORT = int(os.getenv("A2A_PORT", "8100"))
BASE = f"http://localhost:{PORT}"


itinerary_planner = RemoteA2aAgent(
    name="itinerary_planner",
    description="Creates and fetches itineraries.",
    agent_card=f"{BASE}/a2a/itinerary_planner{AGENT_CARD_WELL_KNOWN_PATH}",
)

hidden_gems = RemoteA2aAgent(
    name="hidden_gems",
    description="Retrieves POIs/hidden gems.",
    agent_card=f"{BASE}/a2a/hidden_gems{AGENT_CARD_WELL_KNOWN_PATH}",
)

realtime_adjuster = RemoteA2aAgent(
    name="realtime_adjuster",
    description="Weather and customize actions.",
    agent_card=f"{BASE}/a2a/realtime_adjuster{AGENT_CARD_WELL_KNOWN_PATH}",
)

booking_agent = RemoteA2aAgent(
    name="booking_agent",
    description="Reservations, payments, booking finalization.",
    agent_card=f"{BASE}/a2a/booking_agent{AGENT_CARD_WELL_KNOWN_PATH}",
)

concierge_agent = RemoteA2aAgent(
    name="concierge_agent",
    description="Conversational guidance.",
    agent_card=f"{BASE}/a2a/concierge_agent{AGENT_CARD_WELL_KNOWN_PATH}",
)


root_agent = Agent(
    model=ORCHESTRATOR_MODEL,
    name="travel_orchestrator",
    description="Delegates to sub-agents only; never responds directly.",
    instruction=(
        "Always transfer_to_agent based on intent: planner (create/fetch), gems (POIs), "
        "realtime (weather/customize), booking (reserve/checkout/book), concierge (chat)."
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


