import { motion } from "framer-motion";

import type { TaskStage } from "../types";
import { StatusCard } from "./StatusCard";

interface ProgressTrackerProps {
  progress: number;
  stage: TaskStage;
  message: string;
}

const STAGES: Array<{ key: TaskStage; label: string; eta: string }> = [
  { key: "researching", label: "Researching...", eta: "20-40s" },
  { key: "analyzing", label: "Analyzing...", eta: "15-30s" },
  { key: "writing", label: "Writing Report...", eta: "15-25s" },
  { key: "generating_pdf", label: "Generating PDF...", eta: "5-12s" },
];

export function ProgressTracker({ progress, stage, message }: ProgressTrackerProps) {
  const stageIndex = STAGES.findIndex((item) => item.key === stage);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-10 max-w-4xl px-5 md:px-8"
    >
      <div className="rounded-2xl border border-ink-300 bg-ink-50 p-6 shadow-soft md:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-ink-700">Research Progress</p>
            <p className="mt-1 text-lg font-medium text-ink-900">{message}</p>
          </div>
          <p className="text-2xl font-semibold text-brand-600">{progress}%</p>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-ink-300">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", duration: 0.35 }}
            className="h-full bg-brand-600"
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {STAGES.map((item, index) => (
            <StatusCard
              key={item.key}
              label={item.label}
              eta={item.eta}
              active={stageIndex === index}
              done={progress >= 100 || (stageIndex > index && stage !== "failed")}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
