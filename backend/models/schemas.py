from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ResearchRequest(BaseModel):
    topic: str = Field(min_length=3, max_length=240)


class ResearchCreateResponse(BaseModel):
    task_id: str
    status: Literal["queued"]


class TaskStatusResponse(BaseModel):
    task_id: str
    topic: str
    status: Literal["queued", "running", "completed", "failed"]
    stage: Literal["queued", "researching", "analyzing", "writing", "generating_pdf", "completed", "failed"]
    progress: int = Field(ge=0, le=100)
    message: str
    created_at: datetime
    updated_at: datetime
    error: str | None = None


class ResearchResultResponse(BaseModel):
    task_id: str
    topic: str
    report_markdown: str
    sections: dict[str, str]
    created_at: datetime
    completed_at: datetime | None = None
