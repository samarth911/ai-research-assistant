import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 border-b border-ink-300 bg-ink-50/95"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-3 text-ink-900">
          <div className="rounded-lg border border-ink-300 bg-ink-50 p-2 text-brand-600">
            <FiCpu className="text-xl" />
          </div>
          <div>
            <p className="font-heading text-lg tracking-tight">AI Research Assistant</p>
            <p className="text-xs text-ink-700">CrewAI Multi-Agent Pipeline</p>
          </div>
        </div>
        <p className="text-sm text-ink-700">Professional Research Workspace</p>
      </div>
    </motion.nav>
  );
}
