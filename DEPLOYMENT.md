# CodePilot-AI: Production Deployment Guide

This guide provides end-to-end instructions for deploying **CodePilot-AI** in production:
* **Frontend**: [Vercel](https://vercel.com/) (Single Page React 19 Application)
* **Backend**: [Render](https://render.com/) (FastAPI ASGI Web Service)
* **Database**: [Render](https://render.com/) (Managed PostgreSQL 15+)

---

## 🏗️ Architecture Overview

```mermaid
flowchart LR
    subgraph Client
        Browser["User Browser"]
    end

    subgraph Vercel["Vercel (Frontend)"]
        SPA["React 19 + Vite App<br/>(SPA with /index.html rewrites)"]
    end

    subgraph Render["Render Cloud"]
        ReverseProxy["Render Load Balancer<br/>(X-Forwarded-For)"]
        FastAPI["FastAPI Web Service<br/>(Uvicorn + SlowAPI + Alembic)"]
        Postgres[("Render Managed<br/>PostgreSQL 15+")]
    end

    subgraph External["External APIs"]
        Gemini["Google Gemini AI API"]
    end

    Browser -->|HTTPS| SPA
    SPA -->|HTTPS /api/*| ReverseProxy
    ReverseProxy -->|Proxy Headers| FastAPI
    FastAPI -->|TCP / SSL| Postgres
    FastAPI -->|HTTPS| Gemini
```

---

## Part 1: Database & Backend Deployment (Render)

### Step 1: Create Managed PostgreSQL on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **PostgreSQL**.
3. Configure the database instance:
   * **Name**: `codepilot-db`
   * **Database**: `code_reviewer`
   * **User**: `codepilot_user`
   * **Region**: Choose the region closest to your users (e.g., `Oregon (US West)` or `Frankfurt (EU)`).
   * **PostgreSQL Version**: `15` or `16`.
   * **Plan**: `Free` or `Starter`.
4. Click **Create Database**.
5. Once provisioned, locate the **Connections** panel and copy the **Internal Database URL** (e.g., `postgresql://codepilot_user:password@dpg-...-a:5432/code_reviewer`).
   * *Note*: If deploying the backend on a different provider outside Render's private network, copy the **External Database URL** instead.

---

### Step 2: Deploy Backend Web Service on Render

You can deploy the backend using either **Native Python Runtime** or **Docker**.

#### Deployment Method A: Native Python (Recommended for quick deploys)

1. On the Render Dashboard, click **New +** and select **Web Service**.
2. Connect your GitHub/GitLab repository: `CodePilot-AI`.
3. Configure the service settings:
   * **Name**: `codepilot-backend`
   * **Root Directory**: `backend`
   * **Environment**: `Python 3`
   * **Region**: *Same region as your database* (for zero-latency internal networking).
   * **Branch**: `main`
   * **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   * **Start Command**:
     ```bash
     chmod +x start.sh && ./start.sh
     ```
     *(Or inline: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips='*'`)*

#### Deployment Method B: Docker (Containerized)

1. Select **New +** > **Web Service**.
2. Configure settings:
   * **Name**: `codepilot-backend`
   * **Root Directory**: Leave blank or set to `backend`
   * **Environment**: `Docker`
   * **Dockerfile Path**: `backend/Dockerfile` (or `./Dockerfile` if Root Directory is `backend`)
   * **Docker Context**: `backend`

---

### Step 3: Configure Backend Environment Variables

In your Render Web Service settings, navigate to **Environment** and add the following variables:

| Variable Name | Required | Example / Recommended Value | Description |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://codepilot_user:pass@dpg-xxx:5432/code_reviewer` | Render Internal Database URL |
| `SECRET_KEY` | **Yes** | *(Generate via script below)* | 32+ byte cryptographic secret for JWT signing |
| `ALGORITHM` | No | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `1440` | Token validity (1440 mins = 24 hours) |
| `GEMINI_API_KEY` | **Yes** | `AIzaSyD...` | API key from [Google AI Studio](https://aistudio.google.com/) |
| `GEMINI_MODEL` | No | `gemini-3.8-flash` | Primary Gemini model for code reviews |
| `GEMINI_FALLBACK_MODEL` | No | `gemini-flash-latest` | Fallback model if primary encounters errors |
| `CORS_ORIGINS` | **Yes** | `https://<your-app>.vercel.app,http://localhost:5173` | Comma-separated list of allowed frontend domains |
| `PORT` | No | `10000` | Port listened by the server (Render sets automatically) |
| `ENVIRONMENT` | No | `production` | Deployment environment mode |
| `PROJECT_NAME` | No | `CodePilot-AI` | Project name displayed in API metadata |

> [!TIP]
> Generate a cryptographically secure `SECRET_KEY` locally:
> ```bash
> python -c "import secrets; print(secrets.token_hex(32))"
> ```

---

### Step 4: Verify Backend Health

Once Render displays **Deploy live**, open the health check endpoint in your browser:
```
https://<your-backend-subdomain>.onrender.com/api/health
```
Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Import Project into Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository (`CodePilot-AI`).

---

### Step 2: Configure Project Settings

Configure the project build and output settings in the Vercel dashboard:

* **Framework Preset**: `Vite`
* **Root Directory**: Click *Edit* and select `frontend`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`

---

### Step 3: Configure Frontend Environment Variables

Under **Environment Variables**, add:

| Variable Name | Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://<your-backend-subdomain>.onrender.com/api` | Base URL pointing to the Render backend API |

*Make sure to click **Save**.*

---

### Step 4: Verify Single Page App (SPA) Routing

CodePilot-AI includes [`frontend/vercel.json`](file:///c:/Users/acer/OneDrive/Desktop/CodePilot-AI/frontend/vercel.json):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures direct browser navigation or refreshes on client-side routes (e.g. `/history`, `/reviews/42`, `/settings`, `/profile`) correctly route to the React app without 404 errors.

---

### Step 5: Deploy & Update CORS

1. Click **Deploy**. Vercel will run `npm run build` and publish your app.
2. Copy your assigned production URL (e.g., `https://codepilot-ai.vercel.app`).
3. Return to **Render** > `codepilot-backend` > **Environment**, and ensure `CORS_ORIGINS` contains your exact Vercel URL:
   ```ini
   CORS_ORIGINS=https://codepilot-ai.vercel.app,http://localhost:5173
   ```
4. Render will trigger an automatic zero-downtime redeploy with the updated CORS policy.

---

## Part 3: Reverse Proxy & Rate Limiting Verification

In production behind Render's load balancer:
* Render passes the real visitor IP in the `X-Forwarded-For` HTTP header.
* `CodePilot-AI` extracts the leftmost IP via [`app/core/rate_limit.py`](file:///c:/Users/acer/OneDrive/Desktop/CodePilot-AI/backend/app/core/rate_limit.py).
* Uvicorn runs with flags `--proxy-headers --forwarded-allow-ips='*'`, instructing the ASGI server to trust Render's reverse proxy headers.
* Rate limits (10 requests/minute on review endpoints) are enforced per real visitor IP rather than throttling the entire server.

---

## Part 4: Post-Deployment Smoke Test Checklist

- [ ] **Account Creation**: Register a new user at `https://<your-app>.vercel.app/register`.
- [ ] **Authentication**: Log in and verify that the JWT token is persisted in localStorage.
- [ ] **Code Review**: Paste a Python snippet (e.g., with security issues like `eval()` and style bugs) and trigger **Run AI Code Review**.
- [ ] **Analysis Tabs**: Verify that Pylint, Bandit, Flake8, Radon, and Gemini suggestions populate all 6 tabs.
- [ ] **Improved Code Diff**: Verify the Monaco side-by-side diff editor renders with color highlighting and copy button.
- [ ] **History & Search**: Navigate to `/history` and verify the review is archived.
- [ ] **Report Download**: Click **Download Report** and verify the downloaded JSON file.
- [ ] **User Isolation**: Register a second account and confirm they cannot see or access reviews from the first account.
