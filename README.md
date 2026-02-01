curl.exe -X POST http://localhost:3000/audio/transcribe -F "file=audio.m4a"
curl.exe -X POST http://localhost:3000/chat/ask

# Database

sudo apt update
sudo apt install postgresql
sudo apt install postgresql-client
sudo apt install postgresql-16-pgvector
sudo systemctl status postgresql

psql -h localhost -p 5432 -U jaume -d brain

`
CREATE DATABASE brain;

CREATE USER jaume WITH PASSWORD 'password_segura';
ALTER USER jaume CREATEDB;

GRANT ALL PRIVILEGES ON DATABASE brain TO jaume;

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE user_facts (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id UUID NOT NULL,
fact_key TEXT NOT NULL,
value TEXT NOT NULL,
confidence REAL NOT NULL DEFAULT 1.0,
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_facts_user_key_value
ON user_facts (user_id, fact_key, value);

CREATE TABLE memory_entries (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id UUID NOT NULL,
content TEXT NOT NULL,
embedding VECTOR(1536),
type TEXT,
importance INTEGER NOT NULL DEFAULT 1,
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_memory_entries_embedding
ON memory_entries
USING ivfflat (embedding vector_l2_ops)
WITH (lists = 100);
`
