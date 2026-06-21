from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from compliance import check_compliance, ComplianceResult

app = FastAPI(
    title="Pharma Compliance Checker API",
    description="Checks pharmaceutical marketing text against ABPI Code of Practice guidelines.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://pharma-check-ai-self.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CheckRequest(BaseModel):
    text: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/check-compliance", response_model=ComplianceResult)
def check_compliance_endpoint(request: CheckRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="Text must not be empty.")
    if len(text) > 10_000:
        raise HTTPException(status_code=422, detail="Text must not exceed 10,000 characters.")
    return check_compliance(text)
