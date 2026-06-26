import textwrap

from crewai import Task
from agents.data_analyst import data_analyst_agent
from tasks.research_task import research_task


analysis_task = Task(
    agent=data_analyst_agent,
    description=textwrap.dedent("""
                Analyze the research findings for: {topic}

                Focus on the most important patterns and implications.
                Provide a concise analysis with:
                - Key insights
                - Trend or pattern summary
                - Implications
                - Actionable conclusions
                """),
    expected_output="A concise analysis report with insights, implications, and conclusions",
    context=[research_task],
    output_file="analysis_report.md"
    )