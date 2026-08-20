CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('sales_rep', 'manager', 'admin'))
);

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    deal_size DECIMAL(15, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    industry VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending_ai',
    close_probability INTEGER,
    risk_score INTEGER,
    risk_level VARCHAR(20),
    ai_reasoning TEXT,
    embedding vector(1536)
);
