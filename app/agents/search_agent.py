from agno.agent import Agent
from agno.models.openai import OpenAIChat

search_agent = Agent(
    id="search-agent",
    name="Search Agent",
    model=OpenAIChat(id="gpt-5.4-mini"),
    instructions="""
You are a search specialist.

Your job is to analyze the question and return structured findings.

Return JSON only with:
- normalized_question
- subquestions
- findings
- missing_information
""",
    markdown=False,
)