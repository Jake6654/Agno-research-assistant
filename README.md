## Agno Research Assistant

This repository now uses a split structure:

- `backend/`: FastAPI + Agno research pipeline
- `frontend/`: Next.js UI that calls the backend `/research` API

## Project Structure

```text
agno-research-assistant/
  backend/
    app/
    requirements.txt
    .env
  frontend/
    app/
    package.json
    .env.local.example
```

## 1) Run Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

Environment file:

```bash
# backend/.env
OPENAI_API_KEY=your_api_key_here
```

## 2) Run Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs at `http://127.0.0.1:3000`.

`frontend/.env.local` defaults to:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## API Contract

`POST /research`

Request:

```json
{
  "question": "string",
  "session_id": "optional string"
}
```

Response:

```json
{
  "response": "string"
}
```
