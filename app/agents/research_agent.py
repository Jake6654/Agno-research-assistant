from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.db.sqlite import SqliteDb
from app.core.config import settings

research_Agent = Agent(
  name="Research Agent",
  model=OpenAIChat(id="gpt-5.4", api_key=settings.OPENAI_API_KEY),
  # define the role and behavior
  db=SqliteDb(db_file="agno_sessions.db"),
  instructions="""
You are a helpful research assistant.

Rules:
1. Answer clearly and directly.
2. Use short sections when useful.
3. Distinguish facts from uncertainty.
4. Do not invent sources.
5. Keep the answer concise but helpful.

Output style:
- Brief overview
- Key points
- Final takeaway

""",
add_history_to_context=True,
num_history_runs=3,
markdown=True # makes the output easier to read
)

