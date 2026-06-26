from __future__ import annotations

SECTION_ORDER = [
    "Executive Summary",
    "Key Findings",
    "Detailed Analysis",
    "Future Scope",
    "Conclusion",
    "References",
]


ALIASES = {
    "main findings": "Key Findings",
    "analysis and insights": "Detailed Analysis",
    "conclusions and recommendations": "Conclusion",
    "sources and references": "References",
}


def normalize_heading(raw_heading: str) -> str:
    heading = raw_heading.strip().strip("#").strip()
    lowered = heading.lower()
    if heading in SECTION_ORDER:
        return heading
    if lowered in ALIASES:
        return ALIASES[lowered]
    return heading


def parse_sections(markdown_text: str) -> dict[str, str]:
    sections: dict[str, list[str]] = {}
    current = "Executive Summary"
    sections[current] = []

    for line in markdown_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("##"):
            current = normalize_heading(stripped)
            sections.setdefault(current, [])
            continue
        sections.setdefault(current, []).append(line)

    flattened = {
        name: "\n".join(lines).strip() or "No content available for this section."
        for name, lines in sections.items()
    }

    ordered: dict[str, str] = {}
    for section_name in SECTION_ORDER:
        if section_name in flattened:
            ordered[section_name] = flattened[section_name]
    for section_name, content in flattened.items():
        if section_name not in ordered:
            ordered[section_name] = content

    return ordered
