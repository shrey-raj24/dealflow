DealFlow AI — Product Documentation
Version: 1.0
Date: June 2026
Status: Approved for Development
Owner: Mahi Jadeja
Document Type: Product Requirements & Engineering Specification

Table of Contents
Executive Summary
Problem Statement
Solution Overview
Target Users
Product Scope
System Architecture
Data Model
API Specification
AI Architecture
Security Model
Engineering Decisions
Technology Stack
Non-Functional Requirements
Testing Strategy
Deployment Plan
Success Metrics
Development Roadmap
Risk Register
Glossary
1. Executive Summary
1.1 Product Name
DealFlow AI

1.2 One-Line Description
An AI-powered Enterprise Deal Desk that automates deal risk scoring, discount approval workflows, and revenue-critical decision auditing for B2B sales organizations.

1.3 Mission
Eliminate revenue leakage from unchecked discounts, slow approval cycles, and untracked sales decisions by providing an AI-assisted deal intelligence platform with enterprise-grade security, audit trails, and human-in-the-loop governance.

1.4 Why This Project
This product is built to demonstrate production-grade AI engineering capability. It targets the fastest-growing segment of the B2B SaaS market: revenue intelligence tools powered by AI agents.

The project serves three purposes:

Technical demonstration — Show ability to ship production AI systems with proper backend rigor.
Market positioning — Match the vocabulary and architecture patterns recruiters search for in 2026.
Interview material — Provide deep, defensible discussion points for system design and AI engineering interviews.
1.5 Strategic Context
The project is developed as a portfolio piece for placement applications. Every technical decision is optimized for one outcome: maximum interview callback rate from AI startups, product companies, and platform engineering teams.

2. Problem Statement
2.1 Business Context
Enterprise B2B sales organizations manage hundreds to thousands of deals simultaneously. Each deal requires:

Risk assessment
Discount approval
Policy compliance check
Manager sign-off
Audit trail for compliance
2.2 Current Pain Points
Pain Point	Impact
Manual deal review takes 2-4 hours per deal	Sales velocity loss, deal slippage
30% of risky discounts are approved incorrectly	Direct revenue loss, margin erosion
No standardized AI scoring methodology	Inconsistent deal evaluation across teams
Approval workflows run on email and Slack	Lost approvals, no audit trail
Compliance teams cannot reconstruct decision history	Failed audits, regulatory risk
AI tools lack explainability	Sales reps don't trust AI recommendations
2.3 Why Existing Solutions Fail
Existing Solution	Limitation
Salesforce Einstein	Expensive, requires Salesforce ecosystem, not customizable
Custom internal scripts	Brittle, unmaintained, no AI
Spreadsheet-based approvals	No automation, no audit, no AI
Generic LLM prompts	No structure, no validation, no audit
2.4 The Gap
There is no mid-market solution that provides:

AI-driven deal risk scoring with explainable reasoning
Automated approval routing with policy enforcement
Immutable audit trails for every AI recommendation
Human-in-the-loop governance with override capability
Production-grade backend rigor (RBAC, idempotency, observability)
DealFlow AI fills this gap.

3. Solution Overview
3.1 What DealFlow AI Does
DealFlow AI ingests deal data, applies AI-powered risk scoring, detects policy violations, routes approvals through a configurable workflow engine, and logs every decision to an immutable audit trail.

3.2 The Core Loop
text

Sales rep submits deal
        ↓
AI Scorer predicts close probability + flags risks
        ↓
AI Auditor checks against company policy
        ↓
Workflow Engine determines approval path
        ↓
If auto-approvable → proceed
If requires manager → queue for manager review
If requires director → escalate
        ↓
Decision is logged with full reasoning
        ↓
Notification sent to relevant parties
        ↓
Deal moves forward or returns to rep for revision
3.3 Key Capabilities
Capability	Description
AI Deal Scoring	Predicts close probability (0-100) using ML + LLM contextual reasoning
AI Risk Detection	Identifies discount violations, customer risk patterns, policy breaches
Explainable AI	Every recommendation includes human-readable reasoning
Configurable Approval Workflows	Rule-based routing (auto-approve, manager, director) based on risk + size
Human-in-the-Loop	Managers can approve, reject, or override AI recommendations
Immutable Audit Trail	Every AI decision, override, and approval is permanently logged
Role-Based Access Control	Sales reps, managers, and admins see different views
Real-Time Dashboard	React-based UI with live deal pipeline, approval queue, and analytics
Idempotent Processing	Duplicate deal submissions are detected and deduplicated
Graceful LLM Failure Handling	Circuit breaker falls back to deterministic rules when LLM is unavailable
3.4 What DealFlow AI Is NOT
To keep scope realistic and buildable in 4 weeks:

Not a full CRM (no lead management, contact storage, email integration)
Not a forecasting tool (no quarterly revenue predictions)
Not a contract management system
Not a multi-tenant SaaS platform (single-tenant deployment only)
Not a mobile app (web responsive only)
4. Target Users
4.1 Primary Users
Sales Representative
Goal: Submit deals quickly and track approval status
Permissions: Create deals, view own deals, submit for approval, see own history
Pain Solved: Knows approval status without chasing managers
Sales Manager
Goal: Review flagged deals, approve/reject, track team performance
Permissions: View all team deals, approve/reject flagged deals, override AI recommendations, view team analytics
Pain Solved: Faster approvals, AI pre-screening, full audit trail
Sales Operations Admin
Goal: Configure policies, view analytics, audit decisions
Permissions: View all deals, edit policies, view audit logs, view cost analytics, manage users
Pain Solved: Centralized policy enforcement, compliance reporting
4.2 Secondary Users (Out of Scope for v1)
Finance team (would view margin impact — future version)
Legal/Compliance (would view audit reports — future version)
Executives (would view revenue forecasts — future version)
5. Product Scope
5.1 In Scope (v1.0)
Backend Services
Node.js API gateway with JWT auth
Python FastAPI AI service with LangGraph orchestration
BullMQ-based async job processing
PostgreSQL with pgvector extension
Redis for caching and rate limiting
AI Capabilities
Deal scoring agent (LangGraph node)
Risk auditor agent (LangGraph node)
Policy violation detector (rule-based + LLM)
Confidence scoring for all AI outputs
Fallback to deterministic rules when LLM fails
Frontend
React dashboard (Next.js)
Deal submission form
Deal pipeline view (Kanban)
Approval queue (manager view)
Analytics dashboard (admin view)
Audit log viewer (admin view)
Real-time updates via WebSocket
Infrastructure
Docker containerization
Docker Compose for local dev
GitHub Actions CI/CD
Render deployment (free tier)
Swagger API documentation
Quality
65+ automated tests
Architecture diagrams
Live demo deployment
Demo video
Comprehensive README
5.2 Out of Scope (v1.0)
Feature	Reason for Exclusion
Multi-tenancy	Single-org deployment sufficient for portfolio
Email/Slack notifications	Time constraint; in-app notifications only
Mobile app	Not needed for demo
Webhook integrations	Not needed for core flow
PDF export	Not needed for demo
Advanced ML model training	Use OpenAI API for v1
Multi-language support	English only
SSO/SAML	JWT only for v1
Real-time collaboration	Single-user editing only
6. System Architecture
6.1 High-Level Architecture
text

┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT TIER                                   │
│  Next.js React Dashboard (Vercel/Static)                        │
│  • Deal submission form                                         │
│  • Pipeline view (Kanban)                                       │
│  • Approval queue                                               │
│  • Analytics dashboard                                          │
│  • Audit log viewer                                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS / JWT
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY TIER                               │
│  Node.js + Express (Render)                                       │
│  • JWT authentication                                            │
│  • RBAC enforcement (3 roles)                                    │
│  • Request validation (Zod)                                      │
│  • Rate limiting (Redis)                                         │
│  • Request routing                                               │
│  • Swagger documentation                                         │
└──────┬──────────────────────┬─────────────────────────────────────┘
       │                      │
       │ REST                │ Enqueue
       ▼                      ▼
┌─────────────────┐  ┌──────────────────────────────────────┐
│   AI SERVICE    │  │       ASYNC WORKER                   │
│   Python        │  │       Node.js + BullMQ               │
│   FastAPI       │  │       • Notification dispatcher      │
│                 │  │       • Audit log writer             │
│   LangGraph     │  │       • Analytics aggregator         │
│   Orchestration │  └──────────────────┬───────────────────┘
│                 │                     │
│   ┌─────────┐   │                     │
│   │Scorer   │   │                     │
│   │Agent    │   │                     │
│   └────┬────┘   │                     │
│        │        │                     │
│   ┌────┴────┐   │                     │
│   │Risk     │   │                     │
│   │Auditor  │   │                     │
│   │Agent    │   │                     │
│   └────┬────┘   │                     │
│        │        │                     │
│   ┌────┴────┐   │                     │
│   │Policy   │   │                     │
│   │Enforcer │   │                     │
│   │Agent    │   │                     │
│   └─────────┘   │                     │
└────────┬────────┘                     │
         │                              │
         ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA TIER                                      │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  PostgreSQL 15+  │  │  Redis 7+        │  │  pgvector    │ │
│  │  • deals         │  │  • Cache         │  │  (extension) │ │
│  │  • users         │  │  • Rate limits   │  │  • Deal      │ │
│  │  • policies      │  │  • Sessions      │  │    embeddings│ │
│  │  • audit_log     │  │  • BullMQ queue  │  │  • Similar   │ │
│  │  • metrics       │  │                  │  │    deal lookup│ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
6.2 Service Boundaries
Service	Responsibility	Tech	Port
frontend	UI rendering, user interaction	Next.js	3000
gateway	API routing, auth, validation	Node.js + Express	4000
ai-service	AI inference, agent orchestration	Python + FastAPI	8000
worker	Async jobs, notifications, analytics	Node.js + BullMQ	5000
postgres	Persistent storage	PostgreSQL + pgvector	5432
redis	Cache, queue, rate limit	Redis	6379
6.3 Request Flow Example
Scenario: Sales rep submits a new deal worth $50,000 with a 30% discount.

text

[1] Frontend (Next.js)
    User fills form → POST /api/deals
    ↓
[2] Gateway (Node.js)
    • Validates JWT
    • Checks role (sales_rep)
    • Validates payload with Zod
    • Rate limit check (Redis)
    • Deduplication check (Redis SETNX)
    • Inserts deal to PostgreSQL (status: PENDING_AI)
    • Enqueues "analyze-deal" job to BullMQ
    • Returns 202 Accepted with deal ID
    ↓
[3] AI Service (Python + FastAPI)
    • Worker picks up job
    • Fetches deal from DB
    • LangGraph pipeline executes:
        - Scorer Agent: predicts close probability
        - Risk Auditor: checks discount policy
        - Policy Enforcer: validates against rules
    • Returns structured JSON with risk + recommendation
    ↓
[4] Gateway (Node.js)
    • Receives AI result via internal endpoint
    • Updates deal in DB (status, risk_score, recommendation)
    • Writes to audit_log
    • Triggers workflow routing:
        - If auto-approve: status → APPROVED
        - If manager review: status → PENDING_MANAGER
        - If escalate: status → PENDING_DIRECTOR
    • Enqueues notification job
    ↓
[5] Worker (Node.js)
    • Picks up notification job
    • Sends WebSocket event to relevant users
    • Logs notification to audit_log
    ↓
[6] Frontend (Next.js)
    • Receives WebSocket event
    • Updates UI in real-time
    • Sales rep sees "Deal approved" or "Pending manager review"
7. Data Model
7.1 Entity Relationship Overview
text

┌──────────┐       ┌──────────┐       ┌──────────┐
│  users   │1─────*│  deals   │*─────1│ policies │
└──────────┘       └────┬─────┘       └──────────┘
                        │
                        │ 1
                        │
                        ▼ *
                  ┌──────────┐
                  │audit_log │
                  └──────────┘
7.2 Table Schemas
users
SQL

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    role            VARCHAR(50) NOT NULL CHECK (role IN ('sales_rep', 'manager', 'admin')),
    manager_id      UUID REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_manager_id ON users(manager_id);
CREATE INDEX idx_users_role ON users(role);
deals
SQL

CREATE TABLE deals (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name         VARCHAR(255) NOT NULL,
    deal_size            DECIMAL(15, 2) NOT NULL,
    discount_percentage  DECIMAL(5, 2) NOT NULL,
    industry             VARCHAR(100),
    products             TEXT[],
    customer_history     TEXT,
    stage                VARCHAR(50) NOT NULL DEFAULT 'submitted',
    status               VARCHAR(50) NOT NULL DEFAULT 'pending_ai',
    submitted_by         UUID NOT NULL REFERENCES users(id),
    
    -- AI outputs
    close_probability    INTEGER CHECK (close_probability BETWEEN 0 AND 100),
    risk_score           INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    risk_level           VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    ai_reasoning         TEXT,
    ai_confidence        DECIMAL(3, 2) CHECK (ai_confidence BETWEEN 0 AND 1),
    
    -- Workflow
    approval_required    VARCHAR(50),
    approved_by          UUID REFERENCES users(id),
    approved_at          TIMESTAMP WITH TIME ZONE,
    rejected_by          UUID REFERENCES users(id),
    rejected_at          TIMESTAMP WITH TIME ZONE,
    rejection_reason     TEXT,
    
    -- Metadata
    idempotency_key      VARCHAR(255) UNIQUE,
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_deals_submitted_by ON deals(submitted_by);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX idx_deals_idempotency_key ON deals(idempotency_key);
policies
SQL

CREATE TABLE policies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    rule_type           VARCHAR(50) NOT NULL CHECK (rule_type IN ('max_discount', 'min_margin', 'requires_approval', 'blocklist_industry')),
    rule_config         JSONB NOT NULL,
    severity            VARCHAR(20) NOT NULL CHECK (severity IN ('warning', 'block')),
    active              BOOLEAN DEFAULT TRUE,
    created_by          UUID REFERENCES users(id),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_policies_active ON policies(active);
audit_log
SQL

CREATE TABLE audit_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id         UUID REFERENCES deals(id),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    actor_type      VARCHAR(50) NOT NULL CHECK (actor_type IN ('user', 'ai', 'system')),
    decision        TEXT,
    reasoning       TEXT,
    metadata        JSONB,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log is append-only. No updates or deletes.
CREATE INDEX idx_audit_log_deal_id ON audit_log(deal_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
metrics
SQL

CREATE TABLE metrics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name     VARCHAR(100) NOT NULL,
    metric_value    DECIMAL(15, 4) NOT NULL,
    tags            JSONB,
    recorded_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_metrics_name ON metrics(metric_name);
CREATE INDEX idx_metrics_recorded_at ON metrics(recorded_at DESC);
7.3 Embedding Storage (pgvector)
SQL

-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to deals
ALTER TABLE deals ADD COLUMN embedding vector(1536);

-- Create index for similarity search
CREATE INDEX idx_deals_embedding ON deals USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
7.4 Sample Data (Seed)
The database will be seeded with 200 realistic deal records for evaluation purposes:

50 deals labeled "high risk" (large discount, low close probability)
100 deals labeled "medium risk" (moderate parameters)
50 deals labeled "low risk" (small discount, high close probability)
These are used to:

Demonstrate the AI accuracy metric
Provide historical context for RAG retrieval
Generate demo analytics
8. API Specification
8.1 Authentication Endpoints
POST /api/auth/register
Create a new user account.

Request:

JSON

{
  "email": "rep@company.com",
  "password": "securePassword123",
  "name": "John Smith",
  "role": "sales_rep",
  "managerId": "uuid-optional"
}
Response (201):

JSON

{
  "user": {
    "id": "uuid",
    "email": "rep@company.com",
    "name": "John Smith",
    "role": "sales_rep"
  },
  "token": "jwt-token-here"
}
POST /api/auth/login
Authenticate and receive JWT.

Request:

JSON

{
  "email": "rep@company.com",
  "password": "securePassword123"
}
Response (200):

JSON

{
  "user": { /* user object */ },
  "token": "jwt-token-here",
  "expiresIn": 86400
}
8.2 Deal Endpoints
POST /api/deals
Submit a new deal for AI analysis.

Headers: Authorization: Bearer <jwt>

Request:

JSON

{
  "companyName": "Acme Corporation",
  "dealSize": 50000,
  "discountPercentage": 30,
  "industry": "SaaS",
  "products": ["Enterprise Plan", "Add-on: Analytics"],
  "customerHistory": "Existing customer, 2-year relationship, never defaulted",
  "idempotencyKey": "client-generated-uuid"
}
Response (202 Accepted):

JSON

{
  "dealId": "uuid",
  "status": "pending_ai",
  "message": "Deal submitted for AI analysis. You will be notified when ready."
}
RBAC: sales_rep, manager, admin can all create deals.

GET /api/deals
List deals (filtered by role).

Query Parameters:

status (optional): Filter by status
stage (optional): Filter by stage
page (default: 1)
limit (default: 20)
RBAC:

sales_rep: Only sees own deals
manager: Sees all team deals
admin: Sees all deals
Response (200):

JSON

{
  "deals": [ /* array of deal objects */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
GET /api/deals/:id
Get a single deal with full details.

Response (200):

JSON

{
  "id": "uuid",
  "companyName": "Acme Corporation",
  "dealSize": 50000,
  "discountPercentage": 30,
  "status": "pending_manager",
  "aiAnalysis": {
    "closeProbability": 72,
    "riskScore": 65,
    "riskLevel": "high",
    "reasoning": "30% discount exceeds company policy of 20% for deals above $25K. Customer has positive history but discount margin is concerning.",
    "confidence": 0.87,
    "recommendation": "manager_review"
  },
  "approvalChain": [
    {
      "step": "ai_analysis",
      "actor": "ai",
      "actorType": "ai",
      "decision": "flag_for_review",
      "reasoning": "Discount exceeds threshold",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "submittedBy": { /* user object */ },
  "createdAt": "2026-01-15T10:25:00Z"
}
POST /api/deals/:id/approve
Manager approves a flagged deal.

RBAC: manager, admin only

Request:

JSON

{
  "decision": "approve",
  "notes": "Customer is strategic. Override approved."
}
Response (200):

JSON

{
  "dealId": "uuid",
  "status": "approved",
  "approvedBy": "uuid",
  "approvedAt": "2026-01-15T11:00:00Z"
}
POST /api/deals/:id/reject
Manager rejects a flagged deal.

RBAC: manager, admin only

Request:

JSON

{
  "reason": "Discount too aggressive. Rep to renegotiate to max 20%."
}
Response (200):

JSON

{
  "dealId": "uuid",
  "status": "rejected",
  "rejectedBy": "uuid",
  "rejectionReason": "Discount too aggressive. Rep to renegotiate to max 20%."
}
8.3 Policy Endpoints
GET /api/policies
List all active policies.

RBAC: manager, admin

POST /api/policies
Create a new policy.

RBAC: admin only

Request:

JSON

{
  "name": "Max 20% discount for deals > $25K",
  "ruleType": "max_discount",
  "ruleConfig": {
    "threshold": 25,
    "maxDiscount": 20
  },
  "severity": "block"
}
8.4 Analytics Endpoints
GET /api/analytics/dashboard
Get dashboard metrics.

RBAC: manager, admin

Response (200):

JSON

{
  "totalDeals": 156,
  "pendingApproval": 23,
  "approvedThisWeek": 42,
  "rejectedThisWeek": 8,
  "averageRiskScore": 45,
  "averageCloseProbability": 68,
  "aiAccuracyLast30Days": 0.87,
  "dealsByRiskLevel": {
    "low": 45,
    "medium": 78,
    "high": 28,
    "critical": 5
  }
}
GET /api/audit-log
Query the audit log.

Query Parameters:

dealId (optional)
userId (optional)
action (optional)
from (optional, ISO date)
to (optional, ISO date)
page, limit
RBAC: admin only

8.5 Internal API (Gateway ↔ AI Service)
POST /internal/analyze-deal
Called by the gateway to trigger AI analysis.

Request:

JSON

{
  "dealId": "uuid",
  "companyName": "Acme Corporation",
  "dealSize": 50000,
  "discountPercentage": 30,
  "industry": "SaaS",
  "products": ["Enterprise Plan"],
  "customerHistory": "..."
}
Response (200):

JSON

{
  "closeProbability": 72,
  "riskScore": 65,
  "riskLevel": "high",
  "reasoning": "...",
  "confidence": 0.87,
  "recommendation": "manager_review",
  "violatedPolicies": ["uuid-of-policy"],
  "processingTimeMs": 2340,
  "tokensUsed": 450,
  "costUsd": 0.0023
}
9. AI Architecture
9.1 LangGraph Workflow
DealFlow uses LangGraph to orchestrate a 3-agent pipeline. Each agent has a specific responsibility and passes structured output to the next.

text

┌─────────────────────────────────────────────────────────────┐
│                  LangGraph State Machine                     │
│                                                              │
│  START                                                       │
│    │                                                         │
│    ▼                                                         │
│  ┌─────────────────┐                                         │
│  │ Scorer Agent    │ Input: deal data                       │
│  │                 │ Output: closeProbability (0-100)        │
│  │ Uses:           │         + confidence (0-1)             │
│  │ • OpenAI GPT-4o │                                         │
│  │ • RAG retrieval │                                         │
│  │ • Historical    │                                         │
│  │   pattern match │                                         │
│  └────────┬────────┘                                         │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                         │
│  │ Risk Auditor    │ Input: deal + score                    │
│  │ Agent           │ Output: riskScore, riskLevel           │
│  │                 │         + flagReason                    │
│  │ Uses:           │                                         │
│  │ • OpenAI GPT-4o │                                         │
│  │ • Policy rules  │                                         │
│  │ • Confidence    │                                         │
│  │   aggregation   │                                         │
│  └────────┬────────┘                                         │
│           │                                                  │
│           ▼                                                  │
│  ┌─────────────────┐                                         │
│  │ Policy          │ Input: deal + score + risk              │
│  │ Enforcer Agent  │ Output: recommendation                 │
│  │                 │         (auto_approve / manager /       │
│  │ Uses:           │          director / block)              │
│  │ • Rule engine   │                                         │
│  │ • LLM reasoning │                                         │
│  │ • Fallback      │                                         │
│  │   logic         │                                         │
│  └────────┬────────┘                                         │
│           │                                                  │
│           ▼                                                  │
│         END                                                  │
└─────────────────────────────────────────────────────────────┘
9.2 Agent Specifications
Scorer Agent
Purpose: Predict the probability that a deal will close successfully.

Input:

Deal data (company, size, discount, industry, products, history)
Top-5 similar historical deals (from pgvector)
Prompt Template (abbreviated):

text

You are a sales forecasting expert. Analyze this deal and predict 
the close probability (0-100).

Deal Information:
- Company: {companyName}
- Deal Size: ${dealSize}
- Discount: {discountPercentage}%
- Industry: {industry}
- Products: {products}
- Customer History: {customerHistory}

Similar Past Deals (for context):
{retrieved_similar_deals}

Consider:
1. Deal size relative to typical industry deals
2. Discount level vs. company policy
3. Customer relationship history
4. Industry market conditions
5. Product fit

Return your prediction as JSON:
{
  "closeProbability": <0-100>,
  "confidence": <0.0-1.0>,
  "keyFactors": ["factor1", "factor2", ...]
}
Output Schema (Pydantic):

Python

class ScorerOutput(BaseModel):
    close_probability: int = Field(ge=0, le=100)
    confidence: float = Field(ge=0.0, le=1.0)
    key_factors: List[str]
Risk Auditor Agent
Purpose: Calculate a risk score and risk level for the deal.

Input:

Deal data
Scorer output (close probability, confidence)
Active company policies
Output Schema:

Python

class RiskAuditorOutput(BaseModel):
    risk_score: int = Field(ge=0, le=100)
    risk_level: Literal["low", "medium", "high", "critical"]
    flag_reason: str
    violated_policies: List[str]  # policy IDs
Logic:

High discount (>20%) → +30 to risk
Low close probability (<50) → +25 to risk
New customer → +15 to risk
Large deal (>$50K) with high discount → +20 to risk
Any policy violation → +50 to risk
Policy Enforcer Agent
Purpose: Decide the final workflow routing.

Logic:

text

if risk_score >= 80 or discount > 35%:
    recommendation = "director_review"
elif risk_score >= 50 or discount > 20%:
    recommendation = "manager_review"
elif close_probability < 30:
    recommendation = "block"
else:
    recommendation = "auto_approve"
Output Schema:

Python

class PolicyEnforcerOutput(BaseModel):
    recommendation: Literal["auto_approve", "manager_review", "director_review", "block"]
    reasoning: str
    final_decision: str
9.3 RAG Implementation
Indexing Phase (one-time, at seed):

Python

def index_historical_deals(deals: List[Deal]):
    for deal in deals:
        embedding = openai.embeddings.create(
            model="text-embedding-3-small",
            input=deal_to_text(deal)
        )
        deal.embedding = embedding.data[0].embedding
        db.commit()
Retrieval Phase (per AI request):

Python

def retrieve_similar_deals(deal_data: dict, k: int = 5) -> List[Deal]:
    query_embedding = openai.embeddings.create(
        model="text-embedding-3-small",
        input=deal_to_text(deal_data)
    ).data[0].embedding
    
    similar_deals = db.execute(
        "SELECT * FROM deals ORDER BY embedding <=> %s LIMIT %s",
        (query_embedding, k)
    ).fetchall()
    
    return similar_deals
9.4 Fallback Strategy (Circuit Breaker)
When the OpenAI API is unavailable or returns errors:

text

TRY:
    result = langgraph_pipeline.invoke(deal_data)
EXCEPT OpenAIError:
    log_error("LLM failure, using fallback")
    result = deterministic_fallback(deal_data)
    
def deterministic_fallback(deal_data):
    """
    Rule-based scoring when LLM is unavailable.
    Guarantees the system never fails completely.
    """
    risk_score = 0
    
    if deal_data.discount > 20:
        risk_score += 40
    if deal_data.deal_size > 50000:
        risk_score += 20
    if "new customer" in deal_data.customer_history.lower():
        risk_score += 20
    
    return {
        "close_probability": 50,  # conservative default
        "risk_score": min(risk_score, 100),
        "risk_level": get_risk_level(risk_score),
        "reasoning": "AI unavailable. Score based on rule engine.",
        "confidence": 0.3  # low confidence, flagged for human review
    }
10. Security Model
10.1 Authentication
JWT (JSON Web Tokens) with 24-hour expiry
Passwords hashed with bcrypt (10 rounds)
Tokens signed with HS256, secret stored in environment variable
10.2 Authorization (RBAC)
Role	Create Deal	View Own Deals	View Team Deals	View All Deals	Approve	Configure Policies	View Audit Log
sales_rep	✅	✅	❌	❌	❌	❌	❌
manager	✅	✅	✅	❌	✅	❌	❌
admin	✅	✅	✅	✅	✅	✅	✅
Enforcement happens in middleware before every request:

TypeScript

const requireRole = (roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
10.3 Input Validation
All request bodies validated using Zod schemas. Invalid requests rejected with 400 error.

TypeScript

const dealSchema = z.object({
  companyName: z.string().min(1).max(255),
  dealSize: z.number().positive().max(10_000_000),
  discountPercentage: z.number().min(0).max(100),
  industry: z.string().max(100).optional(),
  products: z.array(z.string()).min(1),
  customerHistory: z.string().max(5000).optional(),
  idempotencyKey: z.string().uuid()
});
10.4 Rate Limiting
100 requests per minute per user (general API)
10 deal submissions per hour per user (prevent spam)
Implemented via Redis sliding window
10.5 Audit Trail
Every significant action is logged:

AI analysis performed
Manager approval/rejection
Policy creation
User login
Audit logs are append-only (no UPDATE or DELETE permissions for the application user).

10.6 Data Protection
All API traffic over HTTPS in production
Database credentials in environment variables (never in code)
OpenAI API key in environment variable
No PII shared with OpenAI (deal descriptions are sanitized)
11. Engineering Decisions
This section documents the why behind every major technical choice. These decisions are made based on production-readiness, buildability in 4 weeks, and demonstrability in interviews.

11.1 Why a Monorepo with Multiple Services (Not a Monolith)?
Decision: Split into gateway, ai-service, and worker as separate services.

Reasoning:

Mirrors how real AI startups structure their codebases
Allows independent scaling (AI service is the bottleneck, not the gateway)
Demonstrates microservices knowledge in interviews
Docker Compose makes local development simple
Trade-off: More complex than a monolith. Accepted because the interview value is high.

11.2 Why Node.js for the Gateway (Not Python)?
Decision: Node.js + Express for the API gateway.

Reasoning:

Mahi already has deep Node.js expertise (IntelliHostel)
Fastest to build and most familiar
Better for I/O-bound API work than Python
Matches her resume narrative
11.3 Why Python for the AI Service (Not Node.js)?
Decision: Python + FastAPI for the AI service.

Reasoning:

LangGraph, OpenAI SDK, and pgvector all have first-class Python support
Standard choice in AI startups (interviewers expect this)
FastAPI auto-generates OpenAPI docs
Async support is critical for LLM-bound work
11.4 Why LangGraph (Not Just OpenAI API Calls)?
Decision: Use LangGraph for multi-agent orchestration.

Reasoning:

Shows stateful AI orchestration (not just one-shot prompts)
Recruiters in 2026 specifically search for "LangGraph" experience
Allows clear separation of concerns (3 agents, each with one job)
Easy to explain in interviews ("I have a state machine with 3 nodes")
11.5 Why BullMQ (Not Kafka)?
Decision: Use BullMQ (Redis-backed) for async jobs.

Reasoning:

Kafka requires significant DevOps (Zookeeper, brokers, monitoring)
BullMQ is a single Redis dependency Mahi already knows
Provides the same recruiter value ("event-driven async processing")
Fits in 4-week build window
Trade-off: Less "real" than Kafka. Accepted because the practical value is identical for the use case.

11.6 Why PostgreSQL with pgvector (Not Pinecone)?
Decision: Use PostgreSQL with pgvector extension for vector storage.

Reasoning:

One database to manage (PostgreSQL already needed for relational data)
ACID guarantees on vector operations
No additional cost (Pinecone is paid)
Shows ability to use built-in tools vs. always reaching for managed services
Trade-off: Slower than Pinecone at scale. Accepted because scale is not the goal.

11.7 Why OpenAI GPT-4o-mini (Not GPT-4)?
Decision: Use gpt-4o-mini for AI inference.

Reasoning:

30x cheaper than GPT-4 (sufficient for this use case)
Fast response times (good for demo)
Free $5 credit covers 200+ demo runs
Production cost is sustainable
11.8 Why Next.js (Not Plain React)?
Decision: Use Next.js for the frontend.

Reasoning:

File-based routing reduces boilerplate
Built-in API routes (useful for health checks)
Server-side rendering improves Lighthouse score
Industry standard for React apps in 2026
11.9 Why No Real-Time LLM Streaming?
Decision: Use standard request-response, not SSE/WebSocket for LLM responses.

Reasoning:

Deal analysis takes 2-3 seconds total (acceptable to wait)
WebSocket is used only for notification of job completion
Streaming adds complexity without user value here
Simpler to test and debug
11.10 Why No Multi-Tenancy?
Decision: Single-tenant deployment only.

Reasoning:

Multi-tenant adds 2x complexity (row-level security, tenant isolation)
Not required for portfolio/resume purposes
Faster to ship
Real startups do this after PMF, not before
12. Technology Stack
12.1 Complete Stack Summary
Layer	Technology	Version	Purpose
Frontend Framework	Next.js	14+	React framework
UI Library	React	18+	Component library
Styling	Tailwind CSS	3+	Utility-first CSS
Charts	Recharts	2+	Analytics visualizations
UI Components	shadcn/ui	Latest	Pre-built components
API Client	Axios	Latest	HTTP requests
State Management	React Query	5+	Server state caching
WebSocket Client	socket.io-client	4+	Real-time updates
Layer	Technology	Version	Purpose
Runtime	Node.js	20+	JavaScript runtime
Framework	Express	4+	HTTP server
Language	TypeScript	5+	Type safety
Validation	Zod	3+	Schema validation
Auth	jsonwebtoken	9+	JWT signing
Hashing	bcrypt	5+	Password hashing
Queue Client	bullmq	5+	Job queue
API Docs	swagger-jsdoc	6+	Swagger generation
Testing	Jest + Supertest	Latest	API testing
Testing	Vitest	1+	Unit testing
Layer	Technology	Version	Purpose
Runtime	Python	3.11+	Language
Framework	FastAPI	0.100+	API framework
AI Orchestration	LangGraph	0.1+	Agent workflows
LLM SDK	openai	1+	OpenAI integration
Validation	Pydantic	2+	Data validation
Vector Search	pgvector	0.5+	PostgreSQL extension
Testing	pytest	8+	Python testing
LLM Eval	deepeval	Latest	LLM quality metrics
HTTP Client	httpx	Latest	Async HTTP
Layer	Technology	Version	Purpose
Database	PostgreSQL	15+	Primary data store
Vector Extension	pgvector	0.5+	Embedding storage
Cache/Queue	Redis	7+	Caching and queue
Containerization	Docker	24+	Container runtime
Orchestration	Docker Compose	2+	Multi-container dev
CI/CD	GitHub Actions	N/A	Automation
Deployment	Render	N/A	Hosting
Monitoring	Structured JSON logs	N/A	Logging
13. Non-Functional Requirements
13.1 Performance
Metric	Target
API response time (p95)	< 200ms (excluding AI)
AI analysis time (p95)	< 5 seconds
Dashboard load time	< 2 seconds
Lighthouse score	> 90
13.2 Reliability
Metric	Target
Uptime	99% (acceptable for portfolio)
LLM fallback success rate	100% (deterministic rules always work)
Data durability	PostgreSQL persistence + daily backup
13.3 Scalability
Metric	Target
Concurrent users	50 (sufficient for demo)
Deals processed per day	1,000 (cached responses)
Database size	10,000 deals
13.4 Security
Metric	Target
Authentication required for all endpoints	100%
Authorization checks on protected routes	100%
Password hashing	bcrypt
HTTPS in production	Yes
13.5 Maintainability
Metric	Target
Test coverage	> 70%
Code style consistency	ESLint + Prettier enforced
Documentation	README + inline comments
API documentation	Swagger UI live
14. Testing Strategy
14.1 Test Pyramid
text

         ┌─────────────┐
         │  E2E Tests  │  (5-10 tests, full flow)
         │             │
         ├─────────────┤
         │ Integration │  (20-30 tests, API + DB)
         │   Tests     │
         ├─────────────┤
         │  Unit Tests │  (30-40 tests, pure functions)
         │             │
         └─────────────┘
14.2 Test Categories
Unit Tests (35 tests)
Risk score calculation logic
Policy rule evaluation
Idempotency key generation
JWT token validation
Zod schema validation
Workflow routing rules
Fallback rule engine
Utility functions
Integration Tests (20 tests)
Auth endpoints (register, login, token expiry)
Deal CRUD operations
Approval workflow
Policy CRUD
Audit log creation
Rate limiting behavior
RBAC enforcement
AI Evaluation Tests (10 tests)
Scorer agent accuracy on 100 labeled deals
Risk auditor accuracy on policy violations
Policy enforcer correct routing
Fallback behavior when LLM fails
Confidence score calibration
End-to-End Tests (5 tests)
Full deal submission → AI analysis → approval flow
Sales rep cannot approve own deal
Manager can view team deals but not other teams
Audit log captures all actions
Real-time notification fires on deal status change
14.3 Evaluation Framework (AI Quality)
The AI service includes a dedicated evaluation script:

Bash

python -m pytest tests/evaluation/ -v
This runs the AI pipeline against 100 pre-labeled deals and reports:

Overall accuracy
Precision/recall per risk level
Confidence calibration
Average latency
Cost per analysis
Target Metrics:

Risk level classification accuracy: ≥ 85%
Close probability within ±15 of actual: ≥ 80% of cases
Average latency: < 4 seconds
Cost per analysis: < $0.01
14.4 CI/CD Pipeline
Every push to GitHub triggers:

Lint check (ESLint + Prettier)
Unit tests
Integration tests (with test database)
Docker build verification
Deploy to staging (on main branch)
15. Deployment Plan
15.1 Local Development
Bash

# Clone repo
git clone https://github.com/mahijadeja/dealflow-ai.git
cd dealflow-ai

# Copy env file
cp .env.example .env
# Add OpenAI API key

# Start all services
docker compose up -d

# Run database migrations
docker compose exec gateway npm run migrate

# Seed database
docker compose exec gateway npm run seed

# Access:
# - Frontend: http://localhost:3000
# - Gateway API: http://localhost:4000
# - AI Service: http://localhost:8000
# - Swagger UI: http://localhost:4000/docs
15.2 Production Deployment (Render Free Tier)
Service	Platform	URL Pattern
Frontend	Vercel	dealflow-ai.vercel.app
Gateway	Render	dealflow-gateway.onrender.com
AI Service	Render	dealflow-ai.onrender.com
PostgreSQL	Render	Internal
Redis	Render	Internal
Cost: $0/month (all free tiers)

15.3 Environment Variables
Bash

# Gateway
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<random-32-chars>
AI_SERVICE_URL=https://dealflow-ai.onrender.com
CORS_ORIGIN=https://dealflow-ai.vercel.app

# AI Service
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
GATEWAY_URL=https://dealflow-gateway.onrender.com
15.4 Monitoring
For v1, monitoring is minimal:

Structured JSON logs to stdout
Render provides basic metrics (CPU, memory, requests)
Manual log review via Render dashboard
Future: Add Prometheus + Grafana when budget allows.

16. Success Metrics
16.1 Project Success (Resume Impact)
The project is successful if Mahi's resume achieves:

Metric	Target
Shortlist rate for backend roles	50%+ (up from ~20%)
Shortlist rate for AI/backend roles	40%+
Interview conversion from shortlist	60%+
Recruiter feedback mentions AI	70%+ of responses
16.2 Technical Success (Project Quality)
The project is technically successful if:

Metric	Target
All 4 core features working end-to-end	✅ Yes
Live demo URL accessible	✅ Yes
65+ tests passing	✅ Yes
AI accuracy on eval set	≥ 85%
p95 API latency	< 200ms
Lighthouse score	> 90
README with architecture diagram	✅ Yes
Demo video recorded	✅ Yes
16.3 Business Impact Metrics (Shown in Resume)
Metric	Target	How Measured
Deal risk classification accuracy	87%	100 labeled deals eval
Time saved per deal review	70%	Compared to manual review (estimated)
Approval cycle time reduction	60%	Simulated workflow timing
API endpoints	18+	Code count
Test coverage	65+ tests	Test count
User roles supported	3	RBAC implementation
17. Development Roadmap
17.1 Week 1: Foundation (Days 1-7)
Day	Tasks	Deliverable
1	Repo setup, Docker Compose, CI/CD skeleton	All services boot locally
2	Database schema + migrations + seed data	PostgreSQL tables created, 200 deals seeded
3	Auth endpoints (register, login, JWT)	Auth works end-to-end
4	Gateway skeleton + Zod validation + error handling	Boilerplate solid
5	Deals CRUD (create, list, get)	Deals can be created/read
6	BullMQ setup + worker skeleton	Job queue works
7	Swagger docs + basic tests	API documented
End of Week 1: ✅ Can register, login, create deals via API. Swagger live.

17.2 Week 2: AI Pipeline (Days 8-14)
Day	Tasks	Deliverable
8	FastAPI setup + OpenAI integration	Can call GPT-4o-mini
9	LangGraph state machine (3 nodes)	Pipeline structure ready
10	Scorer agent with RAG	Closes probability predicted
11	Risk auditor + policy enforcer	Risk + recommendation generated
12	Fallback logic (circuit breaker)	System never fails completely
13	Gateway ↔ AI Service integration	End-to-end AI flow works
14	Eval script + 100 labeled deals test	Accuracy measured
End of Week 2: ✅ Submit deal → AI returns risk score + recommendation.

17.3 Week 3: Frontend + Workflow (Days 15-21)
Day	Tasks	Deliverable
15	Next.js setup + auth flow	Login page works
16	Deal submission form	Can submit deals from UI
17	Deal pipeline view (Kanban)	Pipeline displays
18	Approval queue + WebSocket notifications	Managers see real-time updates
19	Analytics dashboard (Recharts)	Charts render
20	Audit log viewer (admin)	Audit trail visible
21	Polish UI + responsive design	Looks production-ready
End of Week 3: ✅ Full UI works. End-to-end flow testable in browser.

17.4 Week 4: Deploy + Polish (Days 22-28)
Day	Tasks	Deliverable
22	Write remaining tests (target: 65)	Test suite green
23	Architecture diagrams (draw.io)	Diagrams in /docs
24	README + setup instructions	README complete
25	Deploy to Render + Vercel	Live URLs working
26	Record demo video (90 seconds)	Video uploaded
27	Update Mahi's resume with new bullets	Resume updated
28	Apply to 20 target roles	Applications sent
End of Week 4: ✅ Project live, resume updated, applications submitted.

18. Risk Register
Risk	Likelihood	Impact	Mitigation
OpenAI API rate limits hit during demo	Medium	High	Use deterministic fallback; have local Ollama backup
pgvector setup issues	Low	Medium	Follow official docs; use Qdrant as backup
LangGraph learning curve	Medium	Medium	Start with simple 2-node graph; add 3rd node only if time allows
Time overrun on frontend	High	High	Cut Kanban view to simple table if needed
Deployment issues on Render	Medium	Medium	Deploy early (Day 22), not Day 28
AI accuracy below 80%	Low	High	Iterate on prompts; use few-shot examples from seed data
Free tier services sleep	Medium	Low	Add note in resume "may take 30s to wake on first load"
GitHub repo looks messy	Low	Medium	Pin repo, clean README, squash commits before public
19. Glossary
Term	Definition
Deal	A potential sales transaction submitted for AI analysis
Risk Score	0-100 score indicating likelihood of deal failure or revenue loss
Close Probability	0-100 prediction that the deal will close successfully
Risk Level	Categorical label (low, medium, high, critical) derived from risk score
RBAC	Role-Based Access Control — restricting access based on user role
JWT	JSON Web Token — stateless authentication token
Idempotency Key	Unique client-generated string to prevent duplicate submissions
Audit Log	Immutable record of all significant system actions
RAG	Retrieval-Augmented Generation — using retrieved context to improve LLM outputs
LangGraph	Framework for building stateful, multi-agent LLM applications
Circuit Breaker	Pattern that stops calling a failing service to prevent cascading failures
pgvector	PostgreSQL extension for storing and searching vector embeddings
BullMQ	Redis-backed job queue for Node.js
HITL	Human-in-the-Loop — requiring human approval for AI decisions
p95 Latency	95th percentile response time (95% of requests are faster)
Document Control
Version	Date	Author	Changes
1.0	June 2026	Mahi Jadeja	Initial approved specification
End of Document

This document is the single source of truth for DealFlow AI development. Any deviation from this spec requires an updated version of this document.

