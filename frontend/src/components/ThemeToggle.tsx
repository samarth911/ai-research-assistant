import { FiMoon, FiSun } from "react-icons/fi";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/70 px-4 py-2 text-sm text-ink-100 transition hover:border-brand-500"
      type="button"
    >
      {darkMode ? <FiSun /> : <FiMoon />}
      {darkMode ? "Light" : "Dark"}
    </button>
  );
}
