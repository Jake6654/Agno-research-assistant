from agno.agent import Agent
from agno.models.openai import OpenAIChat

research_Agent = Agent(
  name="Research Agent",
  model=OpenAIChat(id="gpt-5.4"),
  # define the role and behavior
  instructions="""
You are a helpful research assistant.

Your job:
1. Understand the user's question.
2. Givea clear and practical answer.
3. Keep the answer structured
4. Say when something is uncertain

""",
markdown=True # makes the output easier to read
)

