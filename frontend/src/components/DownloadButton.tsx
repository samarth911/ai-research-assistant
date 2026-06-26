import { FiDownload } from "react-icons/fi";

interface DownloadButtonProps {
  href: string;
  disabled: boolean;
}

export function DownloadButton({ href, disabled }: DownloadButtonProps) {
  return (
    <a
      href={disabled ? "#" : href}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
        disabled
          ? "cursor-not-allowed border border-ink-300 bg-ink-100 text-ink-600"
          : "bg-brand-600 text-white hover:bg-brand-700"
      }`}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
        }
      }}
    >
      <FiDownload />
      Download PDF
    </a>
  );
}
