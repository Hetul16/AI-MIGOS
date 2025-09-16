from google.adk import Agent
from google.genai import types
from .prompt import SYSTEM_PROMPT
import os


MODEL_NAME = os.getenv("ADK_RUNTIME_MODEL", "gemini-2.0-flash")


def chat(message: str, locale: str | None = None):
    # Placeholder tool: actual delegation is handled by orchestrator
    reply = f"[{locale or 'en-IN'}] {message}"
    return {"reply": reply}


concierge_agent = Agent(
    name="concierge_agent",
    model=MODEL_NAME,
    description="Multilingual conversational layer.",
    instruction=SYSTEM_PROMPT,
    tools=[chat],
    generate_content_config=types.GenerateContentConfig(
        safety_settings=[
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=types.HarmBlockThreshold.OFF,
            ),
        ]
    ),
)


root_agent = concierge_agent


