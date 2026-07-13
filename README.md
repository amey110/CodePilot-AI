# AI Code Reviewer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-20232a?style=flat&logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com)

**AI Code Reviewer** is a commercial-grade, production-ready SaaS platform that allows developers to run automated quality audits, complexity checks, linter sweeps, and AI-driven code reviews.

---

## 🚀 Phase 1 Goals Achieved
* **Clean Architecture**: Standardized, decoupled layout matching enterprise guidelines (FastAPI Backend, PostgreSQL DB, React 19 Frontend).
* **Decoupled Database Access**: Implemented generic Repository pattern in SQLAlchemy to decouple DB models from endpoint routes.
* **SaaS Dashboard UI**: Premium glassmorphic dark-theme design containing dynamic statistics cards, mobile responsiveness, search parameters, and custom notifications.
* **Authentication Flow**: Secure password hashing (bcrypt) and access token issuance (JWT) with persistent login sessions via Context API.
* **Containerized Deployment**: Pre-configured multi-service Docker configuration ready to be executed with a single shell command.

---

## 🛠️ Tech Stack

### Frontend
* **React 19** (Scaffolded with **Vite**)
* **Tailwind CSS v4** (CSS-first, `@tailwindcss/vite` native engine)
* **React Router DOM** (Single Page App routing)
* **Axios** (API requests with automatic token headers)
* **React Hook Form** (Clean, performant input validation)
* **Framer Motion** (Smooth view and layout transitions)
* **Lucide React** (Modern, clean icon pack)
* **React Hot Toast** (Reactive success/error notifications)

### Backend
* **Python 3.12+**
* **FastAPI** (High performance ASGI framework)
* **SQLAlchemy ORM** (Database relation mappings)
* **PostgreSQL 15** (Robust relational database)
* **Alembic** (Database schema migrations)
* **Pydantic v2** (Strict request/response validation)
* **JWT (JSON Web Tokens)** (Session authentication)
* **bcrypt** (Secure one-way password hashing)
* **Uvicorn** (Lightning-fast server host)

### Containerization
* **Docker**
* **Docker Compose**

---

## 📂 Folder Structure

```
ai-code-reviewer/
├── backend/
│   ├── alembic/              # Database migration version scripts
│   ├── app/
│   │   ├── auth/             # Authentication definitions
│   │   ├── config/           # Pydantic Settings loaders
│   │   ├── core/             # Encryption & JWT token generation
│   │   ├── database/         # Session generators & repositories
│   │   ├── dependencies/     # Request context dependency injections
│   │   ├── exceptions/       # Custom application exceptions
│   │   ├── middleware/       # Custom request logging and timings
│   │   ├── models/           # SQLAlchemy DB models
│   │   ├── routers/          # FastAPI API route endpoints
│   │   ├── schemas/          # Pydantic request validation schemas
│   │   ├── services/         # Core business logic helpers
│   │   ├── utils/            # Helper utilities
│   │   └── main.py           # Application entrypoint & middleware mounting
│   ├── tests/                # Pytest unit and integration test scripts
│   ├── Dockerfile            # Backend container instructions
│   ├── requirements.txt      # Backend Python dependencies list
│   └── .env.example          # Template environment configurations
├── frontend/
│   ├── src/
│   │   ├── assets/           # Media files & global assets
│   │   ├── components/       # Layout parts (Navbar, Sidebar) & generic UI elements
│   │   ├── context/          # Global React AuthContext state provider
│   │   ├── hooks/            # useAuth hook wrappers
│   │   ├── layouts/          # Auth and Dashboard wrapper frames
│   │   ├── pages/            # View pages (Landing, Login, Dashboard, Profile, 404)
│   │   ├── routes/           # Router mapping & Protected Route guards
│   │   ├── services/         # Axios instance and API call configs
│   │   ├── styles/           # Custom animations, fonts, and Tailwind v4 imports
│   │   ├── utils/            # Utility helpers
│   │   └── App.jsx           # Routing assembly and state context providers
│   ├── index.html            # Main HTML document index
│   ├── vite.config.js        # Vite compiler configurations
│   ├── package.json          # Frontend packages list
│   └── Dockerfile            # Frontend container instructions
├── docker-compose.yml        # Service orchestration file
├── LICENSE                   # MIT License
└── README.md                 # Project documentation (this file)
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory using the variables below. Default configurations are provided inside `backend/.env.example` so the app is runnable out-of-the-box.

```ini
# Project Configuration
PROJECT_NAME="AI Code Reviewer"
ENVIRONMENT=development
PORT=8000

# Database Configuration
# In docker-compose, this targets the container named "db"
DATABASE_URL=postgresql://postgres:postgres@db:5432/code_reviewer

# Authentication Secrets
# Can generate a random 32-byte hex key using: openssl rand -hex 32
SECRET_KEY=3dbefc9769da8d15a5bbd6f90ff8efce1b7470fcfd58434cd6d72986cd0575d1
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

## 🐳 Quick Start Guide

Verify that you have [Docker](https://docs.docker.com/get-docker/) installed. Launch the complete PostgreSQL, FastAPI, and React development stack with a single command from the project root directory:

```bash
docker compose up --build
```

Once container building finishes successfully, open your browser to the following URLs:

* **Frontend Web Application**: [http://localhost:5173](http://localhost:5173)
* **FastAPI Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend Root Endpoint**: [http://localhost:8000/](http://localhost:8000/)
* **Backend Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 📋 Running Tests

To run the backend integration tests, you can execute `pytest` inside the backend container:

```bash
docker compose exec backend pytest
```

---

## 🗺️ Roadmap (Future Phases)

* **AI Review Integration**: Connect the backend to the Google Gemini API to analyze files for bugs, security risks, complexity issues, and readability.
* **Code Editor Workspace**: Render Monaco Editor directly inside the browser for pasting code blocks.
* **Linter Integrations**: Install and run Pylint, Flake8, Bandit, and Radon on code inputs, returning structural errors in the review panel.
* **PDF Report Compilation**: Generate beautiful, print-ready PDF summaries of code review outputs.
* **Review History**: Browse previous reviews with full search capabilities.
