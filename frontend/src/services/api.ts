import axios from "axios";

import type {
  ResultResponse,
  StartResearchResponse,
  StatusResponse,
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

export async function startResearch(topic: string): Promise<StartResearchResponse> {
  const response = await client.post<StartResearchResponse>("/research", { topic });
  return response.data;
}

export async function fetchStatus(taskId: string): Promise<StatusResponse> {
  const response = await client.get<StatusResponse>(`/status/${taskId}`);
  return response.data;
}

export async function fetchResult(taskId: string): Promise<ResultResponse> {
  const response = await client.get<ResultResponse>(`/result/${taskId}`);
  return response.data;
}

export function getPdfUrl(taskId: string): string {
  return `${API_BASE}/pdf/${taskId}`;
}
