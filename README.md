# CodePilot-AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.12%20%7C%203.14-blue?style=flat&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-20232a?style=flat&logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker)](https://www.docker.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75C4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)

**CodePilot-AI** is a full-stack, enterprise-grade automated code review platform for Python. It pairs four industry-standard static analysis engines (**Pylint**, **Bandit**, **Flake8**, and **Radon**) with an **AST structural parser** and **Google Gemini AI** to produce instant, actionable code reviews with automated refactoring diffs.

---

## 🌟 Key Features

### 🔍 Multi-Engine Static Analysis
* **Pylint**: Evaluates code quality, conventions, and Pythonic idioms.
* **Bandit**: Conducts AST-based security vulnerability audits (identifies `eval()`, hardcoded secrets, shell injections, unsafe deserialization).
* **Flake8**: Enforces PEP 8 style guidelines, whitespace formatting, and syntax anomalies.
* **Radon**: Computes Cyclomatic Complexity (CC) per function and Maintainability Index (MI: 0–100) ranked from A to F.
* **AST Parser**: Extracts function prototypes, class hierarchies, imports, docstrings, argument counts, and logical line distributions.

### 🛡️ Resilient Composite Scoring
* Computes a unified **0–100 overall score** and qualitative rating (**Excellent**, **Good**, **Average**, **Needs Improvement**, **Poor**).
* **Fault-tolerant pipeline**: Each engine runs independently in an isolated try-catch block. If one analyzer fails or times out, the remaining analyzers and the overall report proceed uninterrupted.

### 🤖 Gemini AI Code Review & Refactoring
* Sends sanitized code snapshots and static analyzer findings to Google Gemini.
* Enforces strict JSON output: `summary`, `bugs[]`, `security_risks[]`, `performance_tips[]`, `readability_tips[]`, and `improved_code`.
* **Graceful fallback chain**: If Gemini encounters rate limits or quota errors, the application seamlessly returns the complete static analysis results with `ai_review: null` and an informative status message.

### 💻 Monaco Editor & Side-by-Side Diff View
* In-browser VS Code experience powered by **Monaco Editor** with dark glassmorphic themes.
* Features font-size controls, read-only locking, quick copy-to-clipboard, clear, and paste actions.
* Side-by-side **Monaco DiffEditor** compares the submitted code directly against the AI-improved refactored version.

### 📊 Comprehensive 6-Tab Analysis Panel
1. **Summary**: Score gauge, qualitative rating badge, and individual engine scorecards.
2. **Issues**: Filterable list of all static issues with line numbers, error codes, and source engine tags.
3. **Security**: Dedicated Bandit vulnerability audit and Gemini AI security risk flags.
4. **Complexity**: Radon Maintainability Index, average Cyclomatic Complexity, and per-function complexity blocks.
5. **AI Suggestions**: Categorized actionable tips for bug fixes, performance gains, and readability improvements.
6. **Improved Code**: AI-refactored Python code with syntax highlighting, inline diff, and single-click copy.

### 📈 History, Archive & Report Downloads
* **Paginated History (`/history`)**: Searchable archive of all past code reviews with status badges and deletion capabilities.
* **Detail Inspection (`/reviews/:id`)**: Revisit any previous inspection with original code and complete analyzer tab breakdown.
* **Exportable Reports**: One-click download of audit reports in JSON format (`/api/review/{id}/report`).
* **Real-Time Analytics Dashboard**: Real-time KPI statistics (Total Reviews, Average Score, Total Issues Found) and recent activity timelines.

### 🔐 Security & User Isolation
* JWT-based authentication (Bearer tokens) using `bcrypt` password hashing.
* Multi-user isolation enforced across all database queries (`Review.user_id == current_user.id`).
* Rate limiting implemented on review endpoints via **SlowAPI** (10 requests/minute per client).

---

## 🛠️ Tech Stack

### Frontend
* **React 19** & **Vite**
* **Tailwind CSS v4** (CSS-first engine)
* **@monaco-editor/react** (Monaco Editor & Monaco DiffEditor)
* **@tanstack/react-query v5** (Server state synchronization & caching)
* **React Router DOM v7** (Single Page App routing)
* **Axios** (Configured with request/response JWT interceptors)
* **Framer Motion** (Glassmorphic animations & transitions)
* **Lucide React** (Icons)
* **React Hot Toast** (Toast notifications)
* **Oxlint** (High-speed linting)

### Backend
* **FastAPI** (Python ASGI web framework)
* **SQLAlchemy 2.0** (ORM) & **PostgreSQL 15**
* **Alembic** (Database migrations)
* **Pydantic v2** & **pydantic-settings**
* **SlowAPI** (Rate limiting)
* **Google Generative AI** (Gemini API integration)
* **Static Analyzers**: `pylint`, `bandit`, `flake8`, `radon`, Python `ast`
* **Security**: `bcrypt`, `python-jose`, `python-multipart`
* **Testing**: `pytest`, `httpx`

### Infrastructure
* **Docker** & **Docker Compose**

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and update the placeholders:

```ini
# Project Configuration
PROJECT_NAME="CodePilot-AI"
ENVIRONMENT=development
PORT=8000

# Database Configuration (In docker-compose, hostname is "db")
DATABASE_URL=postgresql://postgres:postgres@db:5432/code_reviewer

# Authentication Secrets
# Generate a secure key using: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Configuration (Google Gemini API)
# Obtain an API key from: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# CORS — comma-separated list of allowed frontend origins
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://code-pilot-ai-beta.vercel.app
```

> [!WARNING]
> Never commit `.env` files or API keys to version control. The `.gitignore` file is configured to exclude all `.env` files.

### Frontend Configuration (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```ini
# API Backend URL
VITE_API_URL=http://localhost:8000/api
```

---

## 🚀 Getting Started

### Option 1: Docker Compose (Recommended)

Run the entire stack (PostgreSQL database, FastAPI backend, and React frontend) with a single command:

```bash
docker compose up --build
```

Services will be accessible at:
* **Frontend Web Application**: [http://localhost:5173](http://localhost:5173)
* **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### Option 2: Local Development Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env

# Run database migrations (or let FastAPI auto-create tables on startup)
alembic upgrade head

# Start FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Configure environment variables
copy .env.example .env

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Tests & Quality Checks

### Backend Test Suite (Pytest)

The test suite covers static analyzers, parser, composite scoring, Gemini fallback mocking, auth-protected review APIs, rate limiting, and user isolation.

```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Linting & Production Build

```bash
cd frontend

# High-speed Oxlint check
npm run lint

# Production Vite build
npm run build
```

---

## 📡 API Reference

All `/api/review/*` and `/api/users/*` endpoints require authentication via Bearer token:
`Authorization: Bearer <your_access_token>`

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT access token | No |
| `GET` | `/api/auth/me` | Retrieve currently authenticated user profile | Yes |

### Code Reviews (`/api/review`)
| Method | Endpoint | Description | Auth Required | Rate Limited |
|---|---|---|---|---|
| `POST` | `/api/review/analyze` | Submit raw Python code string for full review | Yes | 10 / min |
| `POST` | `/api/review/upload` | Upload `.py` file for full review | Yes | 10 / min |
| `GET` | `/api/review/history` | Get paginated list of current user's reviews | Yes | No |
| `GET` | `/api/review/stats` | Get KPI metrics (total reviews, avg score, issues) | Yes | No |
| `GET` | `/api/review/{id}` | Retrieve single review details and full analysis | Yes | No |
| `DELETE` | `/api/review/{id}` | Delete a review belonging to current user | Yes | No |
| `GET` | `/api/review/{id}/report` | Download inspection report JSON attachment | Yes | No |

### User Management (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `PUT` | `/api/users/profile` | Update user profile full name | Yes |
| `POST` | `/api/users/change-password` | Change user password (validates current password) | Yes |

### System & Health
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | API status message | No |
| `GET` | `/api/health` | Service health status | No |

---

## 🖼️ Application Preview

### 1. Developer Dashboard
Real-time KPI metrics (Average Quality Score, Total Reviews, Security Issues Detected), quick-start review submission, and recent review activity stream.

### 2. Code Review Workspace & Monaco Editor
Full-screen capable code editor with custom dark themes, line counter, syntax highlighting, and paste detection.

### 3. Multi-Tab Quality & Security Breakdown
* **Summary Scorecard**: Composite score (0–100) and qualitative rating badge with breakdown across all static analyzers.
* **Security & Vulnerabilities**: Bandit AST audit flags security vulnerabilities with exact line numbers and severity levels.
* **Complexity Insights**: Radon Cyclomatic Complexity blocks and Maintainability Index ratings.
* **AI Suggestions**: Gemini AI actionable recommendations for performance, readability, and bug fixes.
* **Improved Code Diff**: Side-by-side Monaco DiffEditor showing the original code alongside the refactored code.

### 4. Review History Archive
Searchable, paginated audit history table with quick actions to inspect code, download inspection reports, or delete archives.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
