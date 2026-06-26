import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ErrorModalProps {
  message: string | null;
  onClose: () => void;
}

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4"
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="w-full max-w-md rounded-xl border border-red-200 bg-white p-5 shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <FiAlertTriangle />
                <p className="font-medium">Something went wrong</p>
              </div>
              <button onClick={onClose} type="button" className="text-ink-600 hover:text-ink-900">
                <FiX />
              </button>
            </div>
            <p className="mt-3 text-sm text-ink-800">{message}</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
