import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiRefreshCcw } from "react-icons/fi";

import { DownloadButton } from "../components/DownloadButton";
import { ErrorModal } from "../components/ErrorModal";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { LoadingScreen } from "../components/LoadingScreen";
import { Navbar } from "../components/Navbar";
import { PDFPreview } from "../components/PDFPreview";
import { ProgressTracker } from "../components/ProgressTracker";
import { ReportViewer } from "../components/ReportViewer";
import { ResearchInput } from "../components/ResearchInput";
import { useResearchTask } from "../hooks/useResearchTask";
import { getPdfUrl } from "../services/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function HomePage() {
  const [showPreview, setShowPreview] = useState(false);
  const {
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
  } = useResearchTask();

  const pdfHref = useMemo(() => {
    if (!taskId) {
      return "#";
    }
    return getPdfUrl(taskId);
  }, [taskId]);

  return (
    <div>
      <div className="min-h-screen bg-ink-100 font-body text-ink-900">
        <Navbar />

        <Hero />

        <ResearchInput
          topic={topic}
          onTopicChange={setTopic}
          onSubmit={() => void submitTopic()}
          disabled={isSubmitting || isRunning}
        />

        <AnimatePresence mode="wait">
          {isRunning && status ? (
            <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProgressTracker progress={status.progress} stage={status.stage} message={status.message} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isSubmitting && !status ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingScreen />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {result && taskId ? (
          <>
            <ReportViewer topic={result.topic} sections={result.sections} />

            <section className="mx-auto mt-8 max-w-5xl px-5 md:px-8">
              <div className="rounded-2xl border border-ink-300 bg-ink-50 p-6 shadow-soft md:p-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-heading text-xl text-ink-900">PDF Preview</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPreview((old) => !old)}
                      className="inline-flex items-center gap-2 rounded-xl border border-ink-300 bg-white px-4 py-2 text-sm font-semibold text-ink-800 transition hover:border-brand-500 hover:text-brand-600"
                    >
                      {showPreview ? "Hide Preview" : "Preview PDF"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPreview(false);
                        reset();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-ink-300 bg-white px-4 py-2 text-sm font-semibold text-ink-800 transition hover:border-brand-500 hover:text-brand-600"
                    >
                      <FiRefreshCcw />
                      Regenerate
                    </button>
                    <DownloadButton href={pdfHref} disabled={!taskId} />
                  </div>
                </div>
                {showPreview ? (
                  <PDFPreview taskId={taskId} baseUrl={API_BASE} />
                ) : (
                  <div className="rounded-xl border border-dashed border-ink-300 bg-white p-6 text-sm text-ink-700">
                    Click "Preview PDF" to open the generated report preview.
                  </div>
                )}
              </div>
            </section>
          </>
        ) : null}

        <Footer />

        <ErrorModal message={error} onClose={reset} />
      </div>
    </div>
  );
}
