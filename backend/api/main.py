import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.requests import Request
from starlette.responses import JSONResponse

from backend.models.schemas import (
    ResearchCreateResponse,
    ResearchRequest,
    ResearchResultResponse,
    TaskStatusResponse,
)
from backend.services.research_service import research_service


app = FastAPI(
    title="AI Research Assistant API",
    version="1.0.0",
    description="FastAPI backend for CrewAI-powered research reports.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "message": "Invalid input. Please provide a non-empty topic with at least 3 characters.",
            "path": str(request.url.path),
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "message": "Unexpected server error. Please try again in a moment.",
            "path": str(request.url.path),
        },
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/config")
def health_config() -> dict[str, bool]:
    """Check required env vars are present (values are never exposed)."""
    required_keys = [
        "GROQ_API_KEY",
        "SERPER_API_KEY",
        "RESEARCH_AGENT_LLM",
        "ANALYST_AGENT_LLM",
        "WRITER_AGENT_LLM",
        "RESEARCH_AGENT_TEMPERATURE",
        "ANALYST_AGENT_TEMPERATURE",
        "WRITER_AGENT_TEMPERATURE",
    ]
    return {key: bool(os.getenv(key)) for key in required_keys}


@app.post("/research", response_model=ResearchCreateResponse)
def start_research(payload: ResearchRequest) -> ResearchCreateResponse:
    task_id = research_service.create_task(payload.topic)
    return ResearchCreateResponse(task_id=task_id, status="queued")


@app.get("/status/{task_id}", response_model=TaskStatusResponse)
def get_status(task_id: str) -> TaskStatusResponse:
    task = research_service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return TaskStatusResponse(
        task_id=task.task_id,
        topic=task.topic,
        status=task.status,
        stage=task.stage,
        progress=task.progress,
        message=task.message,
        created_at=task.created_at,
        updated_at=task.updated_at,
        error=task.error,
    )


@app.get("/result/{task_id}", response_model=ResearchResultResponse)
def get_result(task_id: str) -> ResearchResultResponse:
    task = research_service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.status != "completed":
        raise HTTPException(status_code=409, detail="Task is not completed yet")

    return ResearchResultResponse(
        task_id=task.task_id,
        topic=task.topic,
        report_markdown=task.report_markdown,
        sections=task.sections,
        created_at=task.created_at,
        completed_at=task.completed_at,
    )


@app.get("/pdf/{task_id}")
def download_pdf(task_id: str) -> FileResponse:
    task = research_service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.status != "completed":
        raise HTTPException(status_code=409, detail="Task is not completed yet")

    pdf_path = research_service.ensure_pdf(task_id)
    if not pdf_path:
        raise HTTPException(status_code=500, detail="Unable to generate PDF")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"research-report-{task_id}.pdf",
    )
