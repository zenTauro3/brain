curl.exe -X POST http://localhost:3000/audio/transcribe -F "file=audio.m4a"
curl.exe -X POST http://localhost:3000/chat/ask

# Database

`
CREATE TABLE user_facts (
id SERIAL PRIMARY KEY,
user_id UUID NOT NULL,
key TEXT NOT NULL,
value TEXT NOT NULL,
confidence FLOAT DEFAULT 1.0,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_facts_user_key_value ON user_facts(user_id, key, value);

CREATE TABLE memory_entries (
id SERIAL PRIMARY KEY,
user_id UUID NOT NULL,
content TEXT NOT NULL,
embedding VECTOR(1536),
type TEXT,
importance INTEGER DEFAULT 1,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_memory_entries_embedding ON memory_entries USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

`