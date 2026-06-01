# Technical Assessment — Requirements Checklist

## 1. Objective & Stack

| Requirement | Status | Notes |
|-------------|--------|-------|
| React frontend | ✅ Met | `frontend/` — React 18 + Vite |
| Python backend API | ✅ Met | `backend/` — FastAPI |
| PostgreSQL database | ✅ Met | `docker-compose.yml` → `db` service |
| Docker containerization | ✅ Met | Dockerfiles for backend & frontend |
| Docker Compose orchestration | ✅ Met | `docker-compose.yml` (db, backend, frontend) |
| Git version control | ✅ Met | Repo initialized; commit on `master` |

## 2. Product APIs (`/products`)

| Endpoint | Status |
|----------|--------|
| POST /products | ✅ |
| GET /products | ✅ |
| GET /products/{id} | ✅ |
| PUT /products/{id} | ✅ |
| DELETE /products/{id} | ✅ |

**Fields:** name, SKU, price, quantity_in_stock — ✅

## 3. Customer APIs (`/customers`)

| Endpoint | Status |
|----------|--------|
| POST /customers | ✅ |
| GET /customers | ✅ |
| GET /customers/{id} | ✅ |
| DELETE /customers/{id} | ✅ |

**Fields:** full_name, email, phone — ✅

## 4. Order APIs (`/orders`)

| Endpoint | Status |
|----------|--------|
| POST /orders | ✅ |
| GET /orders | ✅ |
| GET /orders/{id} | ✅ |
| DELETE /orders/{id} | ✅ |

**Includes:** customer ref, product ref(s), quantity, total amount — ✅

## 5. Business Logic

| Rule | Status | Implementation |
|------|--------|----------------|
| Unique product SKU | ✅ | DB unique constraint + 409 on conflict |
| Unique customer email | ✅ | DB unique constraint + 409 on conflict |
| Quantity cannot be negative | ✅ | Pydantic `ge=0` on product schemas |
| No order if insufficient stock | ✅ | `orders.py` — 400 with message |
| Order reduces stock | ✅ | On POST /orders |
| Total calculated by backend | ✅ | Sum of `price × quantity` per line |
| Error handling & HTTP codes | ✅ | 400, 404, 409, 422, 500 as appropriate |
| Request validation | ✅ | Pydantic models on all inputs |

## 6. Frontend Features

| Feature | Status |
|---------|--------|
| Add / list / update / delete products | ✅ |
| Add / list / delete customers | ✅ |
| Create / list / view order details / delete orders | ✅ |
| Dashboard: totals + low stock | ✅ `GET /dashboard/summary` |

## 7. UI/UX

| Requirement | Status |
|-------------|--------|
| Responsive (desktop + mobile) | ✅ |
| Clean, professional UI | ✅ Minimal light theme |
| Form validation | ✅ Client + server |
| Error & success messages | ✅ AppContext flash toasts |
| Organized components | ✅ `components/`, `pages/`, `context/` |
| State management | ✅ React Context for global alerts |

## 8. Docker (Mandatory)

| Item | Status |
|------|--------|
| Production backend Dockerfile | ✅ `backend/Dockerfile` (python:3.11-slim) |
| Frontend Dockerfile | ✅ `frontend/Dockerfile` (node alpine + nginx alpine) |
| `.dockerignore` files | ✅ Both services |
| Environment variables | ✅ `.env.example`, compose env |
| `docker-compose.yml` | ✅ |
| Services: frontend, backend, PostgreSQL | ✅ |
| Slim base images | ✅ |
| No hardcoded credentials | ✅ Env vars / defaults in example only |
| Named volume for Postgres | ✅ `postgres_data` |

## 9. Deployment (Submission)

| Deliverable | Status | Action |
|-------------|--------|--------|
| GitHub repository link | ⚠️ Partial | Code committed locally; **push to GitHub** and add remote |
| Docker Hub backend image | ❌ Pending | `docker build` + `docker push` (see README) |
| Live frontend URL (Vercel/Netlify) | ❌ Pending | Deploy `frontend/` with `VITE_API_URL` |
| Live backend URL (Render/Railway/Fly.io) | ❌ Pending | Deploy with `DATABASE_URL` + `CORS_ORIGINS` |

Deployment configs included: `render.yaml`, `frontend/vercel.json`, `frontend/netlify.toml`.

## 10. Quick Verification (Local)

```bash
docker compose up --build
# Frontend: http://localhost
# API docs:  http://localhost:8000/docs
curl http://localhost:8000/health
```

---

**Summary:** All application, API, business-logic, Docker, and frontend requirements are **implemented in code**. Submission deliverables that require **your accounts** (GitHub push, Docker Hub, live deploy URLs) still need to be completed before final hand-in.
