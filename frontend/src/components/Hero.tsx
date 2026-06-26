import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-14 text-center md:px-8 md:pt-20">

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="font-heading text-4xl font-bold leading-tight text-ink-900 md:text-6xl"
      >
        AI Research Assistant
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-5 max-w-2xl text-base text-ink-700 md:text-lg"
      >
        Generate structured, professional research reports using a focused multi-agent workflow.
      </motion.p>
    </section>
  );
}
