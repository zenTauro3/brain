CREATE TABLE
    memories (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id UUID NOT NULL,
        content TEXT NOT NULL,
        embedding VECTOR (1536),
        importance INTEGER NOT NULL DEFAULT 1, -- 1–5
        confidence FLOAT DEFAULT 1.0, -- 0–1
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

CREATE INDEX idx_memories ON memories USING ivfflat (embedding vector_l2_ops)
WITH
    (lists = 100);