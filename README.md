# Audio

curl.exe -X POST http://localhost:3000/audio/transcribe -F "file=audio.m4a"

# Chat

curl.exe -X POST http://localhost:3000/chat/ask

# Database

sudo -u postgres psql
psql -h localhost -p 5432 -U jaume -d brain

CREATE USER jaume WITH PASSWORD '1234';
ALTER USER jaume CREATEDB;
ALTER DATABASE brain OWNER TO jaume;
ALTER TABLE facts OWNER TO jaume;
ALTER INDEX idx_facts OWNER TO jaume;
ALTER TABLE memories OWNER TO jaume;

GRANT ALL PRIVILEGES ON DATABASE brain TO jaume;
GRANT ALL PRIVILEGES ON TABLE facts TO jaume;
GRANT ALL PRIVILEGES ON TABLE memories TO jaume;

TRUNCATE TABLE facts CASCADE;
TRUNCATE TABLE memories CASCADE;
