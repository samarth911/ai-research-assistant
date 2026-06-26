# AI Research Assistant

Production-ready AI research platform with a modern React frontend and FastAPI backend, while preserving the existing CrewAI agent pipeline:

Research Agent -> Analysis Agent -> Writing Agent

## What Changed

- Removed Streamlit application entrypoint.
- Added FastAPI backend with task orchestration and clean REST APIs.
- Added React + Vite + Tailwind + Framer Motion frontend. (Using AI)
- Added PDF generation using ReportLab.
- Added report preview and PDF preview/download flow.
- Added Docker and deployment configuration for modern hosting.

## Project Structure

```
.
├── agents/
├── tasks/
├── crew.py
├── main.py
├── backend/
│   ├── api/main.py
│   ├── services/research_service.py
│   ├── models/schemas.py
│   ├── pdf/generator.py
│   ├── utils/report_parser.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/components/
│   ├── src/hooks/
│   ├── src/pages/
│   ├── src/services/
│   ├── package.json
│   ├── Dockerfile
│   └── vercel.json
├── docker-compose.yml
└── .env.example
```

## Backend API

- `POST /research`
	- Starts research for a topic
	- Returns task id
- `GET /status/{task_id}`
	- Returns pipeline stage and progress
- `GET /result/{task_id}`
	- Returns final markdown report + structured sections
- `GET /pdf/{task_id}`
	- Returns generated PDF file
- `GET /health`
	- Health check endpoint

## Environment Variables

Copy `.env.example` to `.env` and fill keys:

- `GROQ_API_KEY`
- `SERPER_API_KEY`
- `RESEARCH_AGENT_LLM`
- `ANALYST_AGENT_LLM`
- `WRITER_AGENT_LLM`
- `RESEARCH_AGENT_TEMPERATURE`
- `ANALYST_AGENT_TEMPERATURE`
- `WRITER_AGENT_TEMPERATURE`
- `VITE_API_BASE_URL`

## Local Development

### 1) Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and calls backend at `http://localhost:8000` by default.

## Docker Run

```bash
docker compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:4173`

## Deployment

<img width="1505" height="857" alt="Screenshot 2026-06-26 at 13 17 51" src="https://github.com/user-attachments/assets/f67d667f-ff17-4f03-905c-d4f0b31fa6c8" />


### Frontend (Vercel)

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Set env var:
	- `VITE_API_BASE_URL=https://your-backend-domain`

### Backend (Render)

- Use `backend/render.yaml` or Docker deploy with `backend/Dockerfile`
- Configure all required environment variables from `.env.example`

## Error Handling

- Empty topic: user-friendly validation message.
- Network or backend failure: graceful error modal on frontend.
- AI task failure: clean failure state and retry path.
- PDF generation failure: protected by backend error responses.
- Stack traces are not exposed to clients.

## Notes on AI Pipeline

The underlying CrewAI task chain is intentionally preserved:

1. Research Specialist
2. Data Analyst
3. Content Writer

Only delivery architecture and UI were modernized.
