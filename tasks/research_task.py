import textwrap

from crewai import Task
from agents.research_specialist import research_specialist_agent


research_task = Task(
    agent=research_specialist_agent,
    description=textwrap.dedent("""
                Research the topic: {topic}

                Use a small set of reliable sources and return a concise summary.
                Include:
                - Key findings
                - 2 to 4 important statistics or facts
                - Expert opinions or credible viewpoints
                - Recent developments
                - Source links

                Keep the result structured and avoid long quotations.
                """),
    expected_output="A concise research summary with key findings, statistics, expert opinions, recent developments, and source links",
    output_file="research_findings.md"
    )