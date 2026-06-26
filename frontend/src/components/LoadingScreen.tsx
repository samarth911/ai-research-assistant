import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto mt-10 max-w-4xl px-5 md:px-8"
    >
      <div className="animate-pulse rounded-2xl border border-ink-300 bg-ink-50 p-8 shadow-soft">
        <div className="h-7 w-56 rounded bg-ink-300" />
        <div className="mt-5 h-2 w-full rounded bg-ink-300" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-ink-300" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
