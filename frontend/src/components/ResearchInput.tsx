import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";

interface ResearchInputProps {
  topic: string;
  onTopicChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

const EXAMPLES = [
  "Artificial Intelligence",
  "Climate Change",
  "Quantum Computing",
  "Blockchain",
  "Healthcare AI",
];

export function ResearchInput({
  topic,
  onTopicChange,
  onSubmit,
  disabled,
}: ResearchInputProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="mx-auto mt-12 max-w-4xl px-5 md:px-8"
    >
      <div className="rounded-2xl border border-ink-300 bg-ink-50 p-6 shadow-soft md:p-8">
        <label className="mb-3 block text-sm font-medium uppercase tracking-[0.14em] text-ink-700">
          Research Input
        </label>
        <textarea
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Enter any research topic..."
          className="h-40 w-full resize-none rounded-xl border border-ink-300 bg-white px-5 py-4 text-base text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onTopicChange(example)}
              className="rounded-full border border-ink-300 bg-white px-3 py-1 text-xs text-ink-700 transition hover:border-brand-500 hover:text-brand-600"
            >
              {example}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiSend />
          Generate Research
        </button>
      </div>
    </motion.section>
  );
}
