# Inventory & Order Management System

A full-stack **Inventory & Order Management** application for businesses to manage products, customers, orders, and stock levels.

Built with **React**, **FastAPI**, **PostgreSQL**, and **Docker** — aligned with a production-ready, containerized architecture.

---

## Links

| Resource | URL |
|----------|-----|
| **GitHub repository** | https://github.com/Ishitachauhann/inventary-order_and_managemnet_system- |
| **Docker Hub (backend image)** | https://hub.docker.com/r/ishitamax/inventory-api |
| **Live frontend** | _Deploy on Vercel / Netlify — add URL here_ |
| **Live backend API** | _Deploy on Render / Railway / Fly.io — add URL here_ |
| **API documentation** | `{BACKEND_URL}/docs` |

> **Note:** GitHub hosts your **source code**. Docker Hub hosts your **backend Docker image** (`hub.docker.com/r/...`). They are different services. See [docs/DOCKER_HUB.md](docs/DOCKER_HUB.md) to publish the image.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start (Docker)](#quick-start-docker)
- [How to run the app](#how-to-run-the-app)
- [Architecture](#architecture)
- [API overview](#api-overview)
- [Business rules](#business-rules)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

| Module | Capabilities |
|--------|----------------|
| **Products** | Create, read, update, delete — name, SKU, price, stock |
| **Customers** | Create, list, view, delete — unique email validation |
| **Orders** | Multi-product orders, auto total, stock deduction & restore |
| **Dashboard** | Total products, customers, orders, low-stock alerts (≤ 10) |
| **API** | REST endpoints, Swagger UI, validation & error handling |
| **DevOps** | Docker Compose for local full-stack; deployment guides included |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 6, React Router |
| Backend | Python 3.11, FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 |
| Containers | Docker, Docker Compose |
| Production UI | Nginx (serves Vite build in Docker) |

---

## Quick start (Docker)

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) only.

```bash
git clone https://github.com/Ishitachauhann/inventary-order_and_managemnet_system-.git
cd inventary-order_and_managemnet_system-

cp .env.example .env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web app | http://localhost |
| API | http://localhost:8000 |
| Swagger | http://localhost:8000/docs |

```bash
# Stop
docker compose down

# Stop and delete database volume
docker compose down -v
```

---

## How to run the app

### Option A — Docker (recommended for reviewers)

One command runs **frontend + backend + database**. No `npm run dev` required.

The frontend container runs `vite build` and serves static files with Nginx.

### Option B — Frontend dev server (optional)

For UI development with hot reload:

```bash
docker compose up -d db backend   # API + DB
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev                         # http://localhost:5173
```

After UI changes in Docker-only mode:

```bash
docker compose build frontend && docker compose up -d frontend
```

---

## Architecture

```
 Browser
    │
    ├──► :80   Frontend (Nginx + React/Vite build)
    │
    └──► :8000 Backend (FastAPI)
              │
              └──► PostgreSQL (Docker volume: postgres_data)
```

| Docker Compose service | Port | Description |
|------------------------|------|-------------|
| `frontend` | 80 | React app (production build) |
| `backend` | 8000 | REST API |
| `db` | 5432 | PostgreSQL |

---

## API overview

Base URL (local): `http://localhost:8000`

| Group | Endpoints |
|-------|-----------|
| **Products** | `POST/GET /products`, `GET/PUT/DELETE /products/{id}` |
| **Customers** | `POST/GET /customers`, `GET/DELETE /customers/{id}` |
| **Orders** | `POST/GET /orders`, `GET/DELETE /orders/{id}` |
| **Dashboard** | `GET /dashboard/summary` |
| **Health** | `GET /health` |

Full interactive docs: `/docs`

---

## Business rules

- Product **SKU** must be unique
- Customer **email** must be unique
- Stock quantity cannot be negative
- Orders blocked when inventory is insufficient
- Order creation **reduces** stock; deletion **restores** stock
- Order **total** calculated on the server

---

## Configuration

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection (backend) |
| `CORS_ORIGINS` | Allowed frontend URLs (backend) |
| `VITE_API_URL` | Backend URL at frontend **build** time |
| `POSTGRES_*` | Database credentials (Compose) |

Never commit `.env` with production secrets.

---

## Deployment

Deploy in this order:

1. **Docker Hub** — Push backend image  
2. **Render** (or Railway / Fly.io) — Backend + PostgreSQL  
3. **Vercel** (or Netlify) — Frontend  

**Full step-by-step guide:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

| Step | Guide |
|------|-------|
| Publish backend image | [docs/DOCKER_HUB.md](docs/DOCKER_HUB.md) |
| Render + Vercel walkthrough | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Assignment requirements | [ASSESSMENT_CHECKLIST.md](ASSESSMENT_CHECKLIST.md) |

### Submission checklist

| Deliverable | Link |
|-------------|------|
| GitHub | https://github.com/Ishitachauhann/inventary-order_and_managemnet_system- |
| Docker Hub | https://hub.docker.com/r/ishitamax/inventory-api |
| Live frontend | _Vercel / Netlify URL_ |
| Live backend | _Render / Railway / Fly.io URL_ |

---

## Project structure

```
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── Dockerfile
│   └── package.json
├── docs/
│   ├── DEPLOYMENT.md        # Render + Vercel guide
│   └── DOCKER_HUB.md        # Image publish guide
├── docker-compose.yml
├── render.yaml
└── .env.example
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deploy backend + frontend (free tier) |
| [docs/DOCKER_HUB.md](docs/DOCKER_HUB.md) | Build and push backend image |
| [ASSESSMENT_CHECKLIST.md](ASSESSMENT_CHECKLIST.md) | Requirement coverage |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| UI not updating | Rebuild frontend container + hard refresh browser |
| CORS errors | Add frontend URL to `CORS_ORIGINS` on backend |
| API not reachable | Check `VITE_API_URL`; redeploy frontend after changes |
| DB connection failed | Wait for `db` healthcheck; verify `DATABASE_URL` |

---

## License

MIT
