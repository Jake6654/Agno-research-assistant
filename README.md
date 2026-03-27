## Agno Research Assistant

This project is a small research assistant built with FastAPI, Agno, and OpenAI models. It combines a simple API layer with a multi-step research pipeline that can decide whether a question needs web search, collect structured findings, and then turn those findings into a readable final answer.

The repository currently contains two execution styles:

1. A pipeline-backed API at `POST /research`
2. A standalone Agno agent exposed through AgentOS and `playground.py`

The pipeline-backed API is the main path for search-enabled research responses.

## Overview

The app is designed around a clear separation of concerns:

- FastAPI handles request and response flow.
- A planner agent decides whether a query should go through search first.
- A search agent uses OpenAI Responses API with the `web_search` tool and returns structured JSON.
- A writer agent transforms search findings into a clean Korean Markdown answer.
- A standalone `research_Agent` exists for direct conversational use through Agno AgentOS and now routes answers through the same research pipeline.

Core files:

- [main.py](/Users/jake/Documents/agno-research-assistant/app/main.py)
- [research_pipeline.py](/Users/jake/Documents/agno-research-assistant/app/services/research_pipeline.py)
- [planner_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/planner_agent.py)
- [search_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/search_agent.py)
- [writer_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/writer_agent.py)
- [research_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/research_agent.py)

## Architecture

### API Layer

The FastAPI app is defined in [main.py](/Users/jake/Documents/agno-research-assistant/app/main.py). It mounts:

- `GET /health`
- `POST /research`

`POST /research` accepts a question and optional session metadata, runs the research pipeline, and returns the final answer as a string under the `response` field.

### Pipeline

The main orchestration logic lives in [research_pipeline.py](/Users/jake/Documents/agno-research-assistant/app/services/research_pipeline.py).

Pipeline flow:

1. The user sends a question to `POST /research`.
2. `planner_agent` decides whether the query is `write_only` or should use `search_then_write`.
3. If the route is `write_only`, the question goes directly to `writer_agent`.
4. If the route requires search, `run_search_agent()` performs a web search and returns structured JSON.
5. The JSON is validated through the Pydantic schema in [pipeline.py](/Users/jake/Documents/agno-research-assistant/app/schemas/pipeline.py).
6. The validated findings are passed into `writer_agent`.
7. `writer_agent` produces the final Markdown answer returned by the API.

### AgentOS Path

The project also defines a standalone Agno agent in [research_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/research_agent.py) and mounts it through [agent_os.py](/Users/jake/Documents/agno-research-assistant/app/agent_os.py).

This path is useful for experimentation, and it now uses the same search pipeline. In other words:

- `/research` uses planner -> search -> writer
- `research_Agent` calls the shared `run_research_pipeline` flow

That distinction matters when testing search behavior.

## Agent Design

### Planner Agent

File:
- [planner_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/planner_agent.py)

Purpose:
- Decide whether a question can be answered directly or should go through search first.

Design notes:
- Uses a lightweight model (`gpt-5.4-nano`) to keep routing inexpensive.
- Returns JSON only.
- Keeps decision-making separate from writing and retrieval.

Why this split helps:
- Avoids unnecessary web search for simple or timeless questions.
- Keeps downstream agents focused on one job each.

### Search Agent

File:
- [search_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/search_agent.py)

Purpose:
- Perform web search and return structured findings.

Design notes:
- Uses the OpenAI Responses API directly.
- Enables the `web_search` tool.
- Uses `tool_choice="required"` so the model must actually use the tool in this path.
- Returns JSON with:
  - `normalized_question`
  - `findings`
  - `missing_information`

Why this split helps:
- Keeps retrieval logic separate from natural-language answer generation.
- Makes the output easier to validate and debug.
- Creates a clean handoff to the writer agent.

### Writer Agent

File:
- [writer_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/writer_agent.py)

Purpose:
- Convert raw findings into a user-friendly answer.

Design notes:
- Uses a stronger generation model (`gpt-5.4`) for final response quality.
- Receives structured findings instead of doing retrieval itself.
- Follows a fixed Markdown response format:
  - `## 한눈에 보기`
  - `## 추천 자료`
  - `## 참고 메모`

Why this split helps:
- Makes the final answer consistent and easier to scan.
- Reduces the risk of the final model inventing sources.
- Keeps formatting logic in one place.

### Research Agent

File:
- [research_agent.py](/Users/jake/Documents/agno-research-assistant/app/agents/research_agent.py)

Purpose:
- Provide a standalone research assistant through Agno AgentOS.

Design notes:
- Uses `OpenAIChat` inside Agno.
- Stores session history in SQLite.
- Best suited for experimentation and direct conversation.

Behavior:
- This agent now calls the shared planner -> search -> writer pipeline via a tool.
- You can validate search-backed behavior from either AgentOS or `POST /research`.

## Data Contracts

The API request and response schemas live in [research.py](/Users/jake/Documents/agno-research-assistant/app/schemas/research.py).

Request:

```json
{
  "question": "string",
  "user_id": "optional string",
  "session_id": "optional string"
}
```

Response:

```json
{
  "response": "string"
}
```

The search result schema lives in [pipeline.py](/Users/jake/Documents/agno-research-assistant/app/schemas/pipeline.py) and validates the handoff between retrieval and writing.

## Local Setup

### Requirements

- Python 3.10+
- An OpenAI API key

### Environment

Create a `.env` file with:

```bash
OPENAI_API_KEY=your_api_key_here
```

Configuration is loaded from [config.py](/Users/jake/Documents/agno-research-assistant/app/core/config.py).

### Install Dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Run the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Testing Guide

### 1. Health Check

Use this first to confirm the app is running:

```bash
curl -sS "http://127.0.0.1:8000/health" | jq
```

Expected response:

```json
{
  "status": "ok"
}
```

### 2. Test the Research Pipeline

This is the main end-to-end test for planner -> search -> writer:

```bash
curl -sS -X POST "http://127.0.0.1:8000/research" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Recommend 5 recent papers, articles, or technical blog posts about serverless LLM systems. For each item, include the title, link, and a short summary.",
    "session_id": "test-search-001"
  }' | jq
```

What to check:

- The response contains a `response` field.
- The answer uses the expected Markdown sections.
- The listed items include titles, links, and summaries.
- The answer should not claim search was unavailable when findings exist.

### 3. Test a Simpler Query

This helps verify planner behavior for less search-heavy questions:

```bash
curl -sS -X POST "http://127.0.0.1:8000/research" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is retrieval augmented generation?",
    "session_id": "test-basic-001"
  }' | jq
```

What to check:

- The API still returns a valid `response`.
- The output remains readable and structured.

### 4. Test the Standalone Agno Agent

You can also run:

```bash
python3 playground.py
```

This exercises the standalone `research_Agent`, not the `/research` pipeline.

Use this when you want to inspect AgentOS behavior that now follows the same search pipeline.

## Suggested Manual Test Cases

These prompts are useful for checking different behaviors:

- A current-events-style research query that should require search
- A timeless conceptual question that may route more directly
- A query asking for cited resources with links
- A query with ambiguity, to see how the answer handles uncertainty

Examples:

- `What are the latest approaches to serverless LLM serving?`
- `Explain retrieval augmented generation in simple terms.`
- `Recommend recent technical posts on AI inference orchestration.`

## Known Limitations

- AgentOS and `/research` both depend on model/tool behavior for routing and retrieval quality.
- The quality of search results depends on model tool use and source availability.
- There are currently no automated unit or integration tests in the repository.
- The planner output is assumed to be valid JSON and could be hardened further.

## Future Improvements

- Add automated tests for planner routing, search result validation, and API responses.
- Unify the AgentOS path with the pipeline so all entry points support the same search behavior.
- Add richer source metadata such as publication date and domain.
- Persist research traces for easier debugging and evaluation.
