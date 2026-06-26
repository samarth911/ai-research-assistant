from __future__ import annotations

import logging
import os
import threading
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from backend.pdf.generator import generate_report_pdf
from backend.utils.report_parser import parse_sections
from crew import research_crew


DATA_DIR = Path("backend/data")
DATA_DIR.mkdir(parents=True, exist_ok=True)

logger = logging.getLogger(__name__)


def _safe_error_message(exc: Exception) -> str:
    message = str(exc).strip() or exc.__class__.__name__
    for secret in (os.getenv("GROQ_API_KEY", ""), os.getenv("SERPER_API_KEY", "")):
        if secret and secret in message:
            message = message.replace(secret, "***")
    if len(message) > 180:
        message = f"{message[:177]}..."
    return message


@dataclass
class TaskState:
    task_id: str
    topic: str
    status: str = "queued"
    stage: str = "queued"
    progress: int = 0
    message: str = "Waiting to start"
    report_markdown: str = ""
    sections: dict[str, str] = field(default_factory=dict)
    error: str | None = None
    pdf_path: str | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: datetime | None = None


class ResearchService:
    def __init__(self) -> None:
        self._tasks: dict[str, TaskState] = {}
        self._lock = threading.Lock()

    def create_task(self, topic: str) -> str:
        task_id = str(uuid.uuid4())
        task = TaskState(task_id=task_id, topic=topic.strip())
        with self._lock:
            self._tasks[task_id] = task

        thread = threading.Thread(target=self._run_task, args=(task_id,), daemon=True)
        thread.start()
        return task_id

    def get_task(self, task_id: str) -> TaskState | None:
        with self._lock:
            return self._tasks.get(task_id)

    def ensure_pdf(self, task_id: str) -> str | None:
        task = self.get_task(task_id)
        if not task:
            return None
        if task.pdf_path and Path(task.pdf_path).exists():
            return task.pdf_path

        self._update(task_id, stage="generating_pdf", message="Generating PDF...", progress=94)
        pdf_path = self._create_pdf(task)
        if not pdf_path:
            return None
        self._update(task_id, progress=100, stage="completed", message="Done")
        return pdf_path

    def _update(self, task_id: str, **kwargs) -> None:
        with self._lock:
            task = self._tasks[task_id]
            for key, value in kwargs.items():
                setattr(task, key, value)
            task.updated_at = datetime.now(timezone.utc)

    def _run_task(self, task_id: str) -> None:
        task = self.get_task(task_id)
        if not task:
            return

        self._update(
            task_id,
            status="running",
            stage="researching",
            progress=10,
            message="Researching sources...",
        )

        stop_stage_thread = threading.Event()
        stage_thread = threading.Thread(
            target=self._animate_stages,
            args=(task_id, stop_stage_thread),
            daemon=True,
        )
        stage_thread.start()

        try:
            result = self._kickoff_with_retry(task.topic)
            stop_stage_thread.set()
            stage_thread.join(timeout=1)

            markdown_report = str(result).strip()
            final_report_path = Path("final_report.md")
            if final_report_path.exists():
                markdown_report = final_report_path.read_text(encoding="utf-8").strip()

            sections = parse_sections(markdown_report)
            self._update(
                task_id,
                stage="generating_pdf",
                progress=92,
                message="Generating PDF...",
                report_markdown=markdown_report,
                sections=sections,
            )

            pdf_path = self._create_pdf(self.get_task(task_id))
            self._update(
                task_id,
                status="completed",
                stage="completed",
                progress=100,
                message="Research complete",
                completed_at=datetime.now(timezone.utc),
                pdf_path=pdf_path,
            )
        except Exception as exc:
            stop_stage_thread.set()
            stage_thread.join(timeout=1)
            logger.exception("Research task failed for task_id=%s", task_id)
            detail = _safe_error_message(exc)
            self._update(
                task_id,
                status="failed",
                stage="failed",
                progress=100,
                message="Research failed",
                error=(
                    "The assistant could not complete this request. "
                    f"Please retry with a narrower topic. ({detail})"
                ),
            )

    def _kickoff_with_retry(self, topic: str):
        last_error: Exception | None = None
        for attempt in range(3):
            try:
                return research_crew.kickoff(inputs={"topic": topic})
            except Exception as exc:
                last_error = exc
                message = str(exc)
                if "rate_limit_exceeded" not in message and "Rate limit reached" not in message:
                    raise

                wait_seconds = 6 + attempt * 4
                time.sleep(wait_seconds)

        if last_error:
            raise last_error
        raise RuntimeError("Research failed unexpectedly.")

    def _animate_stages(self, task_id: str, stop_event: threading.Event) -> None:
        stages = [
            ("researching", "Researching sources...", 12, 34),
            ("analyzing", "Analyzing findings...", 36, 62),
            ("writing", "Writing report...", 64, 88),
        ]

        while not stop_event.is_set():
            for stage, message, start, end in stages:
                for progress in range(start, end + 1, 2):
                    if stop_event.is_set():
                        return
                    self._update(task_id, stage=stage, message=message, progress=progress)
                    time.sleep(0.65)

    def _create_pdf(self, task: TaskState | None) -> str | None:
        if not task:
            return None
        output_path = DATA_DIR / f"{task.task_id}.pdf"
        generate_report_pdf(task.topic, task.sections, output_path)
        return str(output_path)


research_service = ResearchService()
