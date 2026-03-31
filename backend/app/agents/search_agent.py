# app/agents/search_agent.py

import json
from openai import OpenAI
from app.core.config import settings


client = OpenAI(api_key=settings.OPENAI_API_KEY)

SEARCH_SYSTEM_PROMPT = """
You are a research search agent.

Your job:
- Search the web for relevant and recent information
- Focus on factual findings
- Return structured JSON only

Rules:
- Do not write the final answer for the user
- Extract useful findings from web results
- Include title, url, and short summary when possible
- If information is insufficient, say so in missing_information
- Return ONLY valid JSON

Output schema:
{
  "normalized_question": "string",
  "findings": [
    {
      "title": "string",
      "url": "string",
      "summary": "string"
    }
  ],
  "missing_information": ["string"]
}
""".strip()


def run_search_agent(question: str) -> dict:
    # Since Agno abstracts tool usage, it's hard to do fine grained control. That's why we call OpenAI client directly
    response = client.responses.create(
        model="gpt-5.4-mini",
        input=[
            {"role": "system", "content": SEARCH_SYSTEM_PROMPT},
            {"role": "user", "content": question},
        ],
        # This forces ai to use web search tool
        tools=[{"type": "web_search"}],
        tool_choice="required",
    )

    # This code ensures that the model output is valid JSON
    # Even if we explicitly instruct the model to return only JSON, it may still wrap the output inside markdown code fences like """ """. This code removes those markdown fences
    content_text = (response.output_text or "").strip()
    if content_text.startswith("```"):
        lines = content_text.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        content_text = "\n".join(lines).strip()
        if content_text.startswith("json"):
            content_text = content_text[4:].strip()

    return json.loads(content_text)
