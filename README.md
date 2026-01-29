curl.exe -X POST http://localhost:3000/audio/transcribe -F "file=audio.m4a"

`
CREATE TABLE user_facts (
id SERIAL PRIMARY KEY,
user_id UUID NOT NULL,
key TEXT NOT NULL,
value TEXT NOT NULL,
confidence FLOAT DEFAULT 1.0,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE memory_entries (
id SERIAL PRIMARY KEY,
user_id UUID NOT NULL,
content TEXT NOT NULL,
embedding VECTOR(1536),
type TEXT,
importance INTEGER DEFAULT 1,
created_at TIMESTAMP DEFAULT NOW()
);
`

# AI message ask

Extract entities and topics from the question.
Return JSON only.

Question:
"How should I contact Juan?"

# Search facts

SELECT key, value
FROM user_facts
WHERE user_id = :userId
AND (
key ILIKE '%juan%'
OR value ILIKE '%juan%'
);

# Search memories

SELECT content, importance
FROM memory_entries
WHERE user_id = :userId
ORDER BY embedding <-> :question_embedding
LIMIT 10;

# Filter

const filtered = memories.filter(m =>
m.importance >= 3
);

# AI message response

SYSTEM:
You are a personal AI assistant with long-term memory.
You must rely ONLY on the provided context.
If information is missing, say so clearly.
Prefer concise, actionable answers.

USER PROFILE:

- Language: Spanish
- Role: Software developer
- Communication style: Direct, practical

LONG-TERM FACTS (high confidence):

- Juan prefers to be contacted via WhatsApp.
- Juan dislikes long emails.

RELEVANT MEMORIES (summarized):

- In past conversations, Juan responded faster on WhatsApp than email.

CURRENT GOAL:

- Help the user choose the best way to contact Juan.

USER QUESTION:
How should I contact Juan?
