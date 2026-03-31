from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.db.sqlite import SqliteDb
from agno.tools.decorator import tool
from app.core.config import settings
from app.services.research_pipeline import run_research_pipeline


@tool(show_result=True, stop_after_tool_call=True)
def run_search_pipeline(question: str, session_id: str | None = None) -> str:
  """Run the shared planner->search->writer pipeline."""
  try:
    return run_research_pipeline(question=question, session_id=session_id)
  except Exception as e:
    return f"Pipeline execution failed: {e}"

research_Agent = Agent(
  name="Research Agent",
  model=OpenAIChat(id="gpt-5.4", api_key=settings.OPENAI_API_KEY),
  tools=[run_search_pipeline],
  tool_choice="required",
  tool_call_limit=1,
  # define the role and behavior
  db=SqliteDb(db_file="agno_sessions.db"),
  instructions="""
You are a research orchestrator for this app.

For each user request, call the tool `run_search_pipeline` exactly once.
Do not answer from your own knowledge.

""",
add_history_to_context=True,
num_history_runs=3,
markdown=True # makes the output easier to read
)
