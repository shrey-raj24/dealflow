# DealFlow AI — Documentation

## Project Overview
DealFlow AI is an AI-powered Enterprise Deal Desk that automates deal risk scoring, discount approval workflows, and revenue-critical decision auditing for B2B sales organizations.

## System Architecture
The application follows a microservices architecture:
- **Client Tier**: Next.js React Dashboard
- **API Gateway Tier**: Node.js + Express
- **AI Service**: Python FastAPI with LangGraph Orchestration
- **Async Worker**: Node.js + BullMQ
- **Data Tier**: PostgreSQL (with pgvector) and Redis

### Service Boundaries
- `frontend` (Port 3000): UI rendering, user interaction (Next.js)
- `gateway` (Port 4000): API routing, auth, validation (Node.js + Express)
- `ai-service` (Port 8000): AI inference, agent orchestration (Python + FastAPI)
- `worker` (Port 5000): Async jobs, notifications, analytics (Node.js + BullMQ)
- `postgres` (Port 5432): Persistent storage (PostgreSQL + pgvector)
- `redis` (Port 6379): Cache, queue, rate limit

## Folder Structure
- `ai-service/`: Python FastAPI backend for AI inference and LangGraph orchestration.
- `database/`: Database schema, migrations, and PostgreSQL configurations.
- `gateway/`: Node.js Express API gateway handling authentication and request routing.
- `public/`: Static assets for the frontend.
- `src/`: Next.js React frontend source code.
- `tests/`: Automated test suites.
- `worker/`: Node.js BullMQ worker for async background jobs.

## Data Model
Key entities include:
- `users`: Stores user credentials, roles (sales_rep, manager, admin), and hierarchy.
- `deals`: Stores deal information, AI risk scores, and workflow statuses.
- `policies`: Configurable rules for discount thresholds and required approvals.
- `audit_log`: Immutable trail of all AI recommendations and state changes.

For further details, refer to `dealflow.md` which contains comprehensive product specifications.
