export type TaskStatus = "queued" | "running" | "completed" | "failed";

export type TaskStage =
  | "queued"
  | "researching"
  | "analyzing"
  | "writing"
  | "generating_pdf"
  | "completed"
  | "failed";

export interface StartResearchResponse {
  task_id: string;
  status: "queued";
}

export interface StatusResponse {
  task_id: string;
  topic: string;
  status: TaskStatus;
  stage: TaskStage;
  progress: number;
  message: string;
  created_at: string;
  updated_at: string;
  error?: string;
}

export interface ResultResponse {
  task_id: string;
  topic: string;
  report_markdown: string;
  sections: Record<string, string>;
  created_at: string;
  completed_at?: string;
}
