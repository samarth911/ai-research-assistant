import { motion } from "framer-motion";
import { FiCheckCircle, FiClock, FiLoader } from "react-icons/fi";

interface StatusCardProps {
  label: string;
  active: boolean;
  done: boolean;
  eta: string;
}

export function StatusCard({ label, active, done, eta }: StatusCardProps) {
  return (
    <motion.div
      layout
      className={`rounded-xl border p-4 transition ${
        active
          ? "border-brand-500 bg-blue-50"
          : done
            ? "border-ink-300 bg-white"
            : "border-ink-300 bg-ink-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-900">{label}</p>
        {done ? (
          <FiCheckCircle className="text-brand-600" />
        ) : active ? (
          <FiLoader className="animate-spin text-brand-600" />
        ) : (
          <FiClock className="text-ink-600" />
        )}
      </div>
      <p className="mt-2 text-xs text-ink-700">{done ? "Completed" : `ETA: ${eta}`}</p>
    </motion.div>
  );
}
