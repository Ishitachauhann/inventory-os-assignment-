# Inventory & Order Management System

Full-stack application for managing **products**, **customers**, **orders**, and **inventory** — built with React, FastAPI, PostgreSQL, and Docker Compose.

---

## Live links

| Resource | URL |
|----------|-----|
| **Frontend** | _Add your Vercel / Netlify URL_ |
| **Backend API** | _Add your Render / Railway / Fly.io URL_ |
| **API docs** | `{BACKEND_URL}/docs` |
| **Docker Hub (backend)** | _Add your image link_ |

**Repository:** https://github.com/Ishitachauhann/inventary-order_and_managemnet_system-

---

## Features

- **Products** — Full CRUD (name, SKU, price, stock)
- **Customers** — Create, list, view, delete (unique email)
- **Orders** — Multi-item orders with automatic totals and stock updates
- **Dashboard** — Summary counts and low-stock alerts (≤ 10 units)
- **Docker** — One-command local setup (frontend + backend + database)
- **Validation** — Server-side rules, proper HTTP status codes, OpenAPI docs

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, Vite 6, React Router |
| Backend | Python 3.11, FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 |
| DevOps | Docker, Docker Compose, Nginx (production frontend) |

---

## Getting started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

That is all you need to run the **entire** application. Node.js and Python are only required for optional local development (see below).

### Run with Docker (recommended)

```bash
git clone https://github.com/Ishitachauhann/inventary-order_and_managemnet_system-.git
cd inventary-order_and_managemnet_system-

cp .env.example .env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web application | http://localhost |
| REST API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| Health check | http://localhost:8000/health |

**Stop the stack**

```bash
docker compose down
```

**Reset database (removes all data)**

```bash
docker compose down -v
```

### Do I need `npm run dev`?

**No.** Cloning and running `docker compose up --build` is enough.

| Goal | What to run |
|------|-------------|
| Run the full app (grading / demo) | `docker compose up --build` |
| Edit UI with hot reload (optional) | `cd frontend && npm install && npm run dev` → http://localhost:5173 |

With Docker, the frontend image runs `npm run build` (Vite) and serves the result with **Nginx**. You never start the Vite dev server unless you choose to develop the UI locally.

**After changing frontend files while using Docker:**

```bash
docker compose build frontend && docker compose up -d frontend
```

Hard-refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`).

---

## Architecture

```
┌─────────────┐     :80      ┌──────────────┐
│   Browser   │ ───────────► │   Frontend   │  Nginx + React (Vite build)
└──────┬──────┘              └──────────────┘
       │
       │ :8000
       ▼
┌──────────────┐              ┌──────────────┐
│   Backend    │ ───────────► │  PostgreSQL  │
│   FastAPI    │              │   (volume)   │
└──────────────┘              └──────────────┘
```

| Compose service | Container | Default port |
|-----------------|-------------|--------------|
| `frontend` | Nginx + static React app | 80 |
| `backend` | FastAPI (Uvicorn) | 8000 |
| `db` | PostgreSQL 16 | 5432 |

Persistent data is stored in the Docker volume `postgres_data`.

---

## API overview

Base URL (local): `http://localhost:8000`

<details>
<summary><strong>Products</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create product |
| `GET` | `/products` | List all |
| `GET` | `/products/{id}` | Get by ID |
| `PUT` | `/products/{id}` | Update |
| `DELETE` | `/products/{id}` | Delete |

Fields: `name`, `sku`, `price`, `quantity_in_stock`

</details>

<details>
<summary><strong>Customers</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/customers` | Create customer |
| `GET` | `/customers` | List all |
| `GET` | `/customers/{id}` | Get by ID |
| `DELETE` | `/customers/{id}` | Delete |

Fields: `full_name`, `email`, `phone`

</details>

<details>
<summary><strong>Orders</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orders` | Create order |
| `GET` | `/orders` | List all |
| `GET` | `/orders/{id}` | Get by ID |
| `DELETE` | `/orders/{id}` | Cancel / delete (restores stock) |

Create body: `{ "customer_id": 1, "items": [{ "product_id": 1, "quantity": 2 }] }`

</details>

<details>
<summary><strong>Dashboard</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/summary` | Totals + low-stock products |

</details>

Interactive documentation: **http://localhost:8000/docs**

---

## Business rules

| Rule | Behavior |
|------|----------|
| Unique SKU | Duplicate SKU returns `409 Conflict` |
| Unique email | Duplicate customer email returns `409 Conflict` |
| Stock ≥ 0 | Validated on product create/update |
| Insufficient stock | Order rejected with `400 Bad Request` |
| Stock on order | Decreased on create, restored on delete |
| Order total | Calculated by backend from product prices |

---

## Configuration

Copy the example environment file before running Docker:

```bash
cp .env.example .env
```

| Variable | Service | Description |
|----------|---------|-------------|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Database | Postgres credentials |
| `DATABASE_URL` | Backend | Connection string |
| `CORS_ORIGINS` | Backend | Allowed frontend URLs (comma-separated) |
| `VITE_API_URL` | Frontend build | Backend URL (set before `vite build`) |
| `BACKEND_PORT` / `FRONTEND_PORT` | Compose | Host port mappings |

Do not commit `.env` with production secrets.

---

## Local development (optional)

Use this workflow only if you want hot reload while editing code.

**1. Start database (and optionally backend) with Docker**

```bash
docker compose up -d db backend
```

**2. Backend (without Docker)**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://inventory:inventory@localhost:5432/inventory_db
export CORS_ORIGINS=http://localhost:5173
uvicorn app.main:app --reload --port 8000
```

**3. Frontend (Vite dev server)**

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

Open http://localhost:5173

---

## Deployment

### Backend — Render / Railway / Fly.io

1. Connect this GitHub repository.
2. Provision **PostgreSQL**.
3. Deploy the `backend/` Docker image (or use [`render.yaml`](render.yaml)).
4. Set environment variables:
   - `DATABASE_URL` — from your provider
   - `CORS_ORIGINS` — your deployed frontend URL

### Frontend — Vercel / Netlify

| Setting | Value |
|---------|-------|
| Root directory | `frontend` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `VITE_API_URL` = your live backend URL |

Redeploy the frontend after changing `VITE_API_URL` (baked in at build time).

### Docker Hub (backend image)

Step-by-step guide: **[docs/DOCKER_HUB.md](docs/DOCKER_HUB.md)**

```bash
docker login
docker build -t YOUR_DOCKERHUB_USERNAME/inventory-api:latest ./backend
docker push YOUR_DOCKERHUB_USERNAME/inventory-api:latest
```

Submission link: `https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/inventory-api`

---

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Request/response validation
│   │   └── routers/             # products, customers, orders, dashboard
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                 # HTTP client
│   │   ├── components/          # Layout, UI
│   │   ├── context/             # Global state (notifications)
│   │   └── pages/               # Dashboard, Products, Customers, Orders
│   ├── Dockerfile               # Vite build + Nginx
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── render.yaml
├── .env.example
└── ASSESSMENT_CHECKLIST.md      # Requirement coverage
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| UI not updating after code changes | `docker compose build frontend && docker compose up -d frontend`, then hard-refresh |
| API unreachable from browser | Confirm backend is on `:8000`; check `VITE_API_URL` and rebuild frontend |
| CORS error | Add frontend URL to `CORS_ORIGINS` on backend |
| Database connection failed | Wait for healthy `db` service; verify `DATABASE_URL` host (`db` in Compose, `localhost` when API runs locally) |
| Port in use | Change ports in `.env` |

---

## Submission checklist

| Deliverable | Status |
|-------------|--------|
| GitHub repository | https://github.com/Ishitachauhann/inventary-order_and_managemnet_system- |
| Docker Hub backend image | _Pending_ |
| Live frontend URL | _Pending_ |
| Live backend API URL | _Pending_ |

Detailed requirement mapping: [ASSESSMENT_CHECKLIST.md](ASSESSMENT_CHECKLIST.md)

---

## License

MIT
