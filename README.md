curl.exe -X POST http://localhost:3000/audio/transcribe -F "file=audio.m4a"
curl.exe -X POST http://localhost:3000/chat/ask

# Database

sudo apt update
sudo apt install postgresql
sudo apt install postgresql-client
sudo apt install postgresql-16-pgvector
sudo systemctl status postgresql

sudo -u postgres psql
psql -h localhost -p 5432 -U jaume -d brain

`
CREATE DATABASE brain;

CREATE USER jaume WITH PASSWORD '1234';
ALTER USER jaume CREATEDB;

GRANT ALL PRIVILEGES ON DATABASE brain TO jaume;
GRANT ALL PRIVILEGES ON TABLE memories TO jaume;

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE memories (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id UUID NOT NULL,
content TEXT NOT NULL,
embedding VECTOR(1536),
type TEXT,
importance INTEGER NOT NULL DEFAULT 1,
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_memories
ON memories
USING ivfflat (embedding vector_l2_ops)
WITH (lists = 100);
`
