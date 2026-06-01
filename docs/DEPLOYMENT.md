# Deployment Guide

Complete guide to deploy the Inventory & Order Management System for your assignment submission.

**Recommended stack (free tier):**

| Part | Platform |
|------|----------|
| Backend + PostgreSQL | [Render](https://render.com) |
| Frontend | [Vercel](https://vercel.com) |
| Backend Docker image | [Docker Hub](https://hub.docker.com) |

**Source code:** https://github.com/Ishitachauhann/inventary-order_and_managemnet_system-

---

## Overview

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Vercel    │  HTTPS  │   Render    │         │  Render      │
│  (React)    │ ──────► │  (FastAPI)  │ ──────► │  PostgreSQL  │
└─────────────┘         └─────────────┘         └──────────────┘
                              ▲
                              │ pull image
                        ┌─────────────┐
                        │ Docker Hub  │
                        └─────────────┘
```

Deploy in order: **Docker Hub → Render (DB + API) → Vercel (UI)**.

---

## Part 1 — Push backend image to Docker Hub

### 1.1 Create Docker Hub account

- https://hub.docker.com → Sign up
- Remember your **username** (example: `ishitachauhan`)

### 1.2 Login and build

```bash
git clone https://github.com/Ishitachauhann/inventary-order_and_managemnet_system-.git
cd inventary-order_and_managemnet_system-

docker login

docker build -t YOUR_DOCKERHUB_USERNAME/inventory-api:latest ./backend

docker push YOUR_DOCKERHUB_USERNAME/inventory-api:latest
```

### 1.3 Make repository public

1. Open `https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/inventory-api`
2. **Settings** → **Visibility** → **Public**

**Submission link:** https://hub.docker.com/r/ishitamax/inventory-api

```bash
docker pull ishitamax/inventory-api:latest
```

More detail: [DOCKER_HUB.md](./DOCKER_HUB.md)

---

## Part 2 — Deploy backend on Render

### 2.1 Create Render account

- https://render.com → Sign up with GitHub

### 2.2 Create PostgreSQL database

1. Dashboard → **New +** → **PostgreSQL**
2. Name: `inventory-postgres`
3. Plan: **Free**
4. Create database
5. Copy **Internal Database URL** (use this on Render services)

### 2.3 Deploy backend from Docker Hub

1. **New +** → **Web Service**
2. Choose **Deploy an existing image from a registry**
3. Image URL:

   ```
   docker.io/ishitamax/inventory-api:latest
   ```

4. Name: `inventory-api`
5. Region: closest to you
6. Plan: **Free**
7. **Instance type:** Web Service

### 2.4 Configure the service

| Setting | Value |
|---------|-------|
| **Port** | `8000` |
| **Health check path** | `/health` |

**Environment variables:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste **Internal Database URL** from step 2.2 |
| `CORS_ORIGINS` | `https://your-app.vercel.app` (update after Vercel deploy) |

> Render may give `postgres://...` — the app converts it to `postgresql://` automatically.

### 2.5 Deploy and test

1. Click **Create Web Service** / wait for deploy
2. Copy your backend URL, e.g. `https://inventory-api-xxxx.onrender.com`
3. Test in browser:
   - `https://YOUR-BACKEND.onrender.com/health` → `{"status":"ok"}`
   - `https://YOUR-BACKEND.onrender.com/docs` → Swagger UI

**Free tier note:** Render spins down after inactivity. First request may take 30–60 seconds.

### 2.6 Alternative — Deploy from GitHub (no Docker Hub)

1. **New +** → **Web Service** → Connect GitHub repo
2. Root directory: leave empty or project root
3. **Environment:** Docker
4. Dockerfile path: `backend/Dockerfile`
5. Docker context: `backend`
6. Same env vars as above

You can use **either** Docker Hub image **or** GitHub Docker build for the assignment.

---

## Part 3 — Deploy frontend on Vercel

### 3.1 Import project

1. https://vercel.com → Sign up with GitHub
2. **Add New** → **Project**
3. Import: `Ishitachauhann/inventary-order_and_managemnet_system-`

### 3.2 Configure build

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3.3 Environment variable

Add before deploying:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com` |

No trailing slash.

### 3.4 Deploy

1. Click **Deploy**
2. Copy frontend URL, e.g. `https://inventary-order.vercel.app`

### 3.5 Update CORS on Render

Go back to Render → your backend service → **Environment**:

```
CORS_ORIGINS=https://your-app.vercel.app
```

Save → Render will redeploy the backend.

---

## Part 4 — Verify end-to-end

| Check | Expected |
|-------|----------|
| Frontend loads | Dashboard visible |
| Create product | Success message |
| Create customer | Success message |
| Create order | Stock decreases, total shown |
| API docs | Backend `/docs` works |
| Browser console | No CORS errors |

If CORS fails:

- `CORS_ORIGINS` must exactly match frontend URL (include `https://`, no trailing slash)
- Redeploy backend after changing env vars

If API calls fail:

- Confirm `VITE_API_URL` on Vercel matches live backend URL
- **Redeploy Vercel** after changing `VITE_API_URL` (baked in at build time)

---

## Part 4b — Netlify (alternative to Vercel)

1. https://netlify.com → Import from GitHub
2. Base directory: `frontend`
3. Build: `npm run build`
4. Publish: `dist`
5. Env: `VITE_API_URL=https://YOUR-BACKEND.onrender.com`
6. `netlify.toml` is already in `frontend/`

---

## Part 5 — Final submission links

Fill these in your README and assignment form:

```text
GitHub:     https://github.com/Ishitachauhann/inventary-order_and_managemnet_system-
Docker Hub: https://hub.docker.com/r/ishitamax/inventory-api
Frontend:   https://your-project.vercel.app
Backend:    https://your-api.onrender.com
```

---

## Environment variables reference

### Backend (Render)

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` |
| `CORS_ORIGINS` | `https://your-app.vercel.app` |

### Frontend (Vercel / Netlify)

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://your-api.onrender.com` |

---

## Common issues

| Issue | Fix |
|-------|-----|
| Render build fails | Check image name `docker.io/USER/inventory-api:latest` |
| 502 on Render | Wait for cold start; check logs; verify port 8000 |
| CORS error | Update `CORS_ORIGINS`; redeploy backend |
| Frontend shows network error | Wrong `VITE_API_URL`; redeploy Vercel |
| Empty data after deploy | New database — add products/customers again |
| Docker Hub push denied | `docker login` with correct username in image tag |

---

## Quick checklist

- [ ] Image pushed to Docker Hub (public)
- [ ] Render PostgreSQL created
- [ ] Render web service running (`/health` OK)
- [ ] Vercel deployed with `VITE_API_URL`
- [ ] `CORS_ORIGINS` updated on Render
- [ ] Full flow tested (product → customer → order)
- [ ] README updated with live URLs
