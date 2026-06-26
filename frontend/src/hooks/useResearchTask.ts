import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchResult, fetchStatus, startResearch } from "../services/api";
import type { ResultResponse, StatusResponse } from "../types";

const POLL_MS = 1800;

export function useResearchTask() {
  const [topic, setTopic] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearPolling = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const loadResult = useCallback(async (id: string) => {
    const data = await fetchResult(id);
    setResult(data);
  }, []);

  const pollStatus = useCallback(
    async (id: string) => {
      try {
        const nextStatus = await fetchStatus(id);
        setStatus(nextStatus);

        if (nextStatus.status === "completed") {
          await loadResult(id);
          clearPolling();
          return;
        }

        if (nextStatus.status === "failed") {
          setError(nextStatus.error || "Research failed unexpectedly.");
          clearPolling();
          return;
        }

        timerRef.current = window.setTimeout(() => {
          void pollStatus(id);
        }, POLL_MS);
      } catch {
        setError("Network issue while checking status. Please retry.");
        clearPolling();
      }
    },
    [clearPolling, loadResult]
  );

  const submitTopic = useCallback(async () => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setError("Please enter a research topic.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setStatus(null);

    try {
      const created = await startResearch(cleanTopic);
      setTaskId(created.task_id);
      await pollStatus(created.task_id);
    } catch {
      setError("Unable to start research right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [pollStatus, topic]);

  const reset = useCallback(() => {
    clearPolling();
    setTaskId(null);
    setStatus(null);
    setResult(null);
    setError(null);
  }, [clearPolling]);

  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  const isRunning = useMemo(() => {
    if (!status) {
      return false;
    }
    return status.status === "queued" || status.status === "running";
  }, [status]);

  return {
    topic,
    setTopic,
    taskId,
    status,
    result,
    error,
    isSubmitting,
    isRunning,
    submitTopic,
    reset,
  };
}
