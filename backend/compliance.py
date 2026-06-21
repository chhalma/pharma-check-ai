from __future__ import annotations

import os
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import Literal

from rules import SYSTEM_PROMPT

load_dotenv()


class ComplianceIssue(BaseModel):
    rule_violated: str = Field(description="The ABPI rule that is violated (e.g. 'NO EXAGGERATED EFFICACY CLAIMS')")
    abpi_clause: str = Field(description="The specific ABPI Code clause reference (e.g. 'Clause 6.1', 'Clause 7.2')")
    severity: Literal["HIGH", "MEDIUM", "LOW"] = Field(description="HIGH=clear breach likely to mislead, MEDIUM=significant risk, LOW=minor or technical issue")
    excerpt: str = Field(description="The exact problematic text excerpt from the input")
    explanation: str = Field(description="Clear explanation of why this violates the rule")
    suggested_fix: str = Field(description="A corrected version of the excerpt that would be compliant")


class ComplianceResult(BaseModel):
    is_compliant: bool = Field(description="True if no compliance issues were found, False otherwise")
    overall_summary: str = Field(description="A brief overall assessment of the marketing text's compliance status")
    issues: list[ComplianceIssue] = Field(description="List of compliance issues found; empty list if fully compliant")


def build_chain():
    llm = ChatAnthropic(
        model=os.environ.get("MODEL_NAME", "claude-haiku-4-5"),
        api_key=os.environ["ANTHROPIC_API_KEY"],
        temperature=0,
        max_tokens=int(os.environ.get("MAX_TOKENS", "4096")),
    )
    structured_llm = llm.with_structured_output(ComplianceResult)
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "Please analyse the following pharmaceutical marketing text for ABPI compliance:\n\n{text}"),
    ])
    return prompt | structured_llm


_chain = None


def get_chain():
    global _chain
    if _chain is None:
        _chain = build_chain()
    return _chain


def check_compliance(text: str) -> ComplianceResult:
    chain = get_chain()
    return chain.invoke({"text": text})
