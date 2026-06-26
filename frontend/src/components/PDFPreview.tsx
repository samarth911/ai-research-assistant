interface PDFPreviewProps {
  taskId: string;
  baseUrl: string;
}

export function PDFPreview({ taskId, baseUrl }: PDFPreviewProps) {
  const src = `${baseUrl}/pdf/${taskId}`;

  return (
    <div className="overflow-hidden rounded-xl border border-ink-300 bg-white shadow-soft">
      <iframe
        title="PDF Preview"
        src={src}
        className="h-[540px] w-full"
      />
    </div>
  );
}
