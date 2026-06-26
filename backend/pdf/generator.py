from __future__ import annotations

from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def _footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.grey)
    footer = f"AI Research Assistant | Page {doc.page}"
    canvas.drawString(20 * mm, 10 * mm, footer)
    canvas.restoreState()


def generate_report_pdf(
    topic: str,
    sections: dict[str, str],
    output_path: Path,
) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#111827"),
        spaceAfter=10,
    )
    section_style = ParagraphStyle(
        "SectionTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=4,
        spaceBefore=12,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor("#374151"),
    )

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title=f"Research Report - {topic}",
        author="AI Research Assistant",
    )

    elements = []
    now_label = datetime.now().strftime("%Y-%m-%d")

    elements.append(Paragraph("AI Research Report", title_style))
    elements.append(Paragraph(f"<b>Topic:</b> {topic}", body_style))
    elements.append(Paragraph(f"<b>Date:</b> {now_label}", body_style))
    elements.append(Spacer(1, 8))

    toc_data = [["Table of Contents"]] + [[name] for name in sections.keys()]
    toc = Table(toc_data, colWidths=[170 * mm])
    toc.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111827")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("TEXTCOLOR", (0, 1), (-1, -1), colors.HexColor("#374151")),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#d1d5db")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#9ca3af")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    elements.append(toc)
    elements.append(Spacer(1, 12))

    for section_name, section_body in sections.items():
        elements.append(Paragraph(section_name, section_style))
        for paragraph in section_body.split("\n\n"):
            cleaned = paragraph.strip().replace("\n", "<br/>")
            if cleaned:
                elements.append(Paragraph(cleaned, body_style))
                elements.append(Spacer(1, 6))

    doc.build(elements, onFirstPage=_footer, onLaterPages=_footer)
    return output_path
