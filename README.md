# DealFlow AI

**An AI‑powered Enterprise Deal Desk** that automates deal risk scoring, discount‑approval workflows, and revenue‑critical decision auditing for B2B sales organizations.

---

## 📚 Overview

DealFlow AI streamlines the entire deal lifecycle:
- **Data Ingestion** – Sales reps submit deals through a web UI.
- **AI Scoring** – A LangGraph‑orchestrated pipeline evaluates risk, discount compliance, and close probability.
- **Workflow Engine** – Rules route the deal to the appropriate approver (auto‑approve, manager, director).
- **Audit Trail** – Every AI recommendation and human decision is immutably logged for compliance.

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    subgraph Client[Client Tier]
        UI[Client Tier\nNext.js React Dashboard]
    end
    subgraph Gateway[API Gateway Tier]
        GW[API Gateway Tier\nNode.js + Express]
    end
    subgraph AI[AI Service Tier]
        AI[AI Service Tier\nPython FastAPI + LangGraph]
    end
    subgraph Worker[Worker Tier]
        WK[Worker Tier\nNode.js + BullMQ]
    end
    subgraph Data[Data Tier]
        PG[PostgreSQL (pgvector)]
        RD[Redis]
    end
    UI --> GW
    GW --> AI
    AI --> WK
    WK --> PG
    WK --> RD
    GW --> PG
    GW --> RD
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS, WebSocket for real‑time updates
- **API Gateway**: Node.js, Express, Zod validation, JWT authentication, Rate limiting (Redis)
- **AI Service**: Python, FastAPI, LangGraph, OpenAI/Llama APIs, pgvector for embeddings
- **Background Worker**: Node.js, BullMQ, Redis queues
- **Database**: PostgreSQL 15+, pgvector extension, Prisma ORM (optional)
- **Caching / Rate‑limit**: Redis 7+
- **Containerization**: Docker & Docker‑Compose
- **CI/CD**: GitHub Actions (lint, test, build, deploy)

---

## 📂 Folder Structure

```
/dealflow
├─ ai-service/        # Python FastAPI backend & LangGraph agents
│   ├─ app/           # FastAPI routers & services
│   └─ requirements.txt
├─ database/          # SQL schema, migrations, pgvector config
├─ gateway/           # Node.js Express API gateway
│   ├─ src/           # Routes, middleware, validation
│   └─ Dockerfile
├─ public/            # Static assets (images, fonts)
├─ src/               # Next.js React application
│   ├─ components/   # UI components (cards, tables, forms)
│   ├─ pages/        # Next.js pages & API routes
│   └─ styles/       # Tailwind config & globals
├─ tests/             # Jest & Playwright test suites
├─ worker/            # Node.js BullMQ background worker
│   └─ src/
└─ documentation.md   # Architecture & data‑model details
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- Python ≥ 3.11
- Docker & Docker‑Compose (optional but recommended)
- PostgreSQL & Redis (local or via Docker)

### Install dependencies
```bash
# Frontend & gateway
git clone <repo-url> && cd dealflow
npm install                # install Node.js deps
# AI service
tap ai-service && pip install -r requirements.txt
```

### Run locally (Docker Compose)
```bash
docker compose up -d       # starts postgres, redis, gateway, ai-service, worker, and next.js
```
The UI will be available at `http://localhost:3000`.

### Run without Docker
```bash
# Terminal 1 – Frontend
npm run dev               # http://localhost:3000

# Terminal 2 – API Gateway
npm run gateway           # http://localhost:4000

# Terminal 3 – AI Service
uvicorn ai-service.main:app --reload   # http://localhost:8000

# Terminal 4 – Background Worker
npm run worker            # processes async jobs
```

---

## 🧪 Testing

- **Unit / Integration** – Jest (frontend), Vitest (gateway), PyTest (AI service)
- **End‑to‑End** – Playwright scripts located in `tests/e2e/`
```bash
npm run test              # runs all Jest/Vitest tests
npm run test:e2e          # Playwright E2E suite
```

---

## 📦 Deploying

The project ships a ready‑to‑use Docker‑Compose file for local staging. For production, you can deploy each service to Render, Vercel (frontend), or any container orchestrator.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/awesome-feature`)
3. Follow the code style (Prettier, ESLint, Black)
4. Write tests for new functionality
5. Open a Pull Request with a clear description

See `CONTRIBUTING.md` for detailed guidelines.

---

## 📚 References

- Detailed system architecture & data model: [documentation.md](./documentation.md)
- Full product specification: [dealflow.md](./dealflow.md)
- API reference (Swagger UI): `http://localhost:8000/docs`

---

*Happy hacking!*
# dealflow
