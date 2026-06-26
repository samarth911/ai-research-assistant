import textwrap

from crewai import Task
from agents.content_writer import content_writer_agent
from tasks.analysis_task import analysis_task
from tasks.research_task import research_task


writing_task = Task(
    agent=content_writer_agent,
    description=textwrap.dedent("""
                Draft the final report for: {topic}

                Use the research and analysis context to write a clean, concise report.
                Include these sections:
                - Executive Summary
                - Introduction
                - Main Findings
                - Analysis and Insights
                - Conclusions and Recommendations
                - Sources and References

                Keep the wording professional, readable, and non-repetitive.
                """),
    expected_output="A concise, well-structured report with the requested sections",
    context=[research_task, analysis_task],
    output_file="final_report.md"
    )