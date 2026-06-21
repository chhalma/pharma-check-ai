# Pharma Content Compliance Checker

A web application that analyses pharmaceutical marketing text against the **UK ABPI Code of Practice** and flags compliance issues with specific clause references, severity ratings, and suggested corrections.

Built as a portfolio project to demonstrate production-grade LLM orchestration with LangChain and Claude API.

**Live demo:** https://pharma-check-ai-self.vercel.app
**API:** https://pharma-check-ai.onrender.com

---

## What it does

Paste any pharmaceutical marketing copy into the tool and receive a structured compliance report:

- **Verdict** — Compliant or Non-Compliant
- **Per-issue breakdown** — rule violated, specific ABPI clause (e.g. Clause 7.2), severity (HIGH / MEDIUM / LOW), problematic excerpt, explanation, and a suggested rewrite
- **Three sample texts** — non-compliant, borderline, and compliant — to demonstrate the full range

---

## Tech stack

| Layer | Technology |
|---|---|
| LLM | Claude API (`claude-opus-4-6`) |
| Orchestration | LangChain (LCEL chain + `with_structured_output`) |
| Schema enforcement | Pydantic v2 |
| Backend | FastAPI + Uvicorn |
| Frontend | React + Vite |

---

## Project structure

```
pharma-check-ai/
├── backend/
│   ├── compliance.py      # ABPI rules, Pydantic models, LangChain chain
│   ├── main.py            # FastAPI app with /health and /check-compliance
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main UI component
│   │   ├── App.css        # Styling
│   │   └── main.jsx       # React entry point
│   ├── index.html
│   └── vite.config.js
├── .env.example
└── .gitignore
```

---

## Running locally

### Backend

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r backend/requirements.txt
```

Create a `.env` file in the project root:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Start the server:

```bash
cd backend
uvicorn main:app --reload
```

API available at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`

---

## ABPI rules checked

1. No misleading claims
2. Fair balance (benefits must be accompanied by risk information)
3. No off-label promotion
4. Adverse event reporting
5. No exaggerated efficacy claims
6. Substantiated comparative claims
7. Clear identification of promotional material
8. Respect for healthcare professionals

---

## Disclaimer

This is a portfolio demonstration project for illustrative purposes only. It is **not a substitute for qualified Medical, Legal, and Regulatory (MLR) review**. Do not use for actual compliance decisions.
