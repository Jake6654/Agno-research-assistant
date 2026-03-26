from agno.agent import Agent
from agno.models.openai import OpenAIChat

planner_agent = Agent(
    id="planner-agent",
    name="Planner Agent",
    model=OpenAIChat(id="gpt-5.4-nano"),
    instructions="""
You are a routing planner.

Decide whether the user's question:
1. needs search first, or
2. can go directly to writing.

Return JSON only.
""",
    markdown=False,
)