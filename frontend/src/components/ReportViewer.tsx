import { motion } from "framer-motion";

interface ReportViewerProps {
  topic: string;
  sections: Record<string, string>;
}

export function ReportViewer({ topic, sections }: ReportViewerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-10 max-w-5xl px-5 md:px-8"
    >
      <div className="rounded-2xl border border-ink-300 bg-white p-6 shadow-soft md:p-10">
        <h2 className="font-heading text-2xl text-ink-900 md:text-3xl">Research Report</h2>
        <p className="mt-1 text-sm text-ink-700">Topic: {topic}</p>

        <div className="mt-8 max-h-[640px] space-y-8 overflow-y-auto pr-1">
          {Object.entries(sections).map(([title, content]) => (
            <article key={title} className="border-b border-ink-300 pb-7">
              <h3 className="font-heading text-xl text-ink-900">{title}</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-800">{content}</p>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
