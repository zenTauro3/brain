# 🧠 Second Brain AI - Backend

A RESTful API built with **NestJS**, **PostgreSQL (pgvector)**, and **OpenAI** to power a conversational assistant with long-term episodic memory (Retrieval-Augmented Generation / RAG).

## 🏗️ Architecture & Modules

The dependency flow follows a strict Clean Architecture pattern to avoid circular dependencies:

\`\`\`mermaid
graph TD
    %% Module Definitions
    App[AppModule <br> Root & Config]
    Auth[AuthModule <br> JWT & Security]
    Users[UsersModule <br> Profile Management]
    Chat[ChatModule <br> AI Endpoint]
    Brain[BrainModule <br> OpenAI & Vectors]

    %% Dependencies
    App --> Auth
    App --> Chat
    App --> Users
    
    Auth --> Users
    Chat --> Brain
    
    classDef root fill:#f9f,stroke:#333,stroke-width:2px;
    classDef feature fill:#bbf,stroke:#333,stroke-width:2px;
    classDef core fill:#dfd,stroke:#333,stroke-width:2px;
    
    class App root;
    class Auth,Chat,Users feature;
    class Brain core;
\`\`\`

## 🚀 Core Endpoints

- **`POST /auth/register`**: Registers a new user (Email, Password, Username).
- **`POST /auth/login`**: Authenticates a user and returns an `access_token` (1h) and a `refresh_token` (7d).
- **`POST /auth/refresh`**: Renews the current session using a valid `refresh_token`.
- **`GET /users/me`**: Retrieves the logged-in user's profile data (Requires `access_token`).
- **`POST /chat`**: Processes a message with the AI and updates the vector memory (Requires `access_token`, Rate Limited to 10 req/min).

## 🛠️ Infrastructure & Setup (Docker)

The database schema, including `pgvector` extensions and indexing, is automatically initialized via the `init.sql` file when starting the Docker containers for the first time.

### Quick Start Commands

The project is fully containerized to ensure the API and the Database run smoothly in any environment. 

- **Start the infrastructure (API + DB in background):**
  \`\`\`bash
  npm run docker:up
  \`\`\`
- **View API logs in real-time:**
  \`\`\`bash
  npm run docker:logs
  \`\`\`
- **Stop and tear down the infrastructure:**
  \`\`\`bash
  npm run docker:down
  \`\`\`