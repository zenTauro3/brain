# Database

sudo -u postgres psql
psql -h localhost -p 5432 -U jaume -d brain

ALTER USER postgres WITH PASSWORD '1234';

TRUNCATE TABLE memories CASCADE;

----

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  
CREATE EXTENSION IF NOT EXISTS "vector"; 

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ
);

CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category TEXT CHECK (category IN ('PREFERENCE', 'FACT', 'GOAL', 'RELATIONSHIP', 'OTHER')),
    key TEXT NOT NULL, 
    value JSONB NOT NULL,
    importance_score FLOAT CHECK (importance_score >= 0 AND importance_score <= 1) DEFAULT 0.5,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(), 
    UNIQUE (user_id, key) 
);

CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    memory_id UUID UNIQUE REFERENCES memories(id) ON DELETE CASCADE,
    vector VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_embeddings_user_id ON embeddings(user_id);
CREATE INDEX idx_users_username_trgm ON users USING GIN (username gin_trgm_ops);
CREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
CREATE INDEX idx_memories_key_trgm ON memories USING GIN (key gin_trgm_ops);
CREATE INDEX idx_memories_value_jsonb ON memories USING GIN (value jsonb_path_ops);
CREATE INDEX idx_embeddings_vector ON embeddings USING hnsw (vector vector_cosine_ops);


----

 INSERT INTO users (id, username, name, email) 
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'maria_dev', 'Maria', 'maria@test.com'),
  ('b1fcbd11-9c0b-4ef8-bb6d-6bb9bd380a22', 'alex_dev', 'Alex', 'alex@test.com');