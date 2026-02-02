CREATE TABLE
    facts (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id UUID NOT NULL,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        confidence FLOAT DEFAULT 1.0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        UNIQUE (user_id, type)
    );

CREATE INDEX idx_facts ON facts (user_id, type, value);