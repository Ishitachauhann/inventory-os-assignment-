# Inventory & Order Management System

A full-stack application for managing products, customers, orders, and inventory. Built with React, FastAPI, and PostgreSQL, packaged with Docker for local development and deployed on managed cloud services.

## Live application

| Service | URL |
|---------|-----|
| Web application | https://inventory-os-assignment.vercel.app |
| REST API | https://inventory-api-latest-v171.onrender.com |
| API documentation | https://inventory-api-latest-v171.onrender.com/docs |
| Container registry | https://hub.docker.com/r/ishitamax/inventory-api |
| Source repository | https://github.com/Ishitachauhann/inventory-os-assignment- |

## Features

- **Products** — CRUD operations with SKU, pricing, and stock tracking
- **Customers** — Registration and management with unique email validation
- **Orders** — Multi-line orders with automatic total calculation and inventory updates
- **Dashboard** — Aggregate metrics and low-stock monitoring (threshold: 10 units)
- **API** — RESTful endpoints with request validation, structured errors, and OpenAPI documentation

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, Vite, React Router |
| Backend | Python 3.11, FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 |
| Infrastructure | Docker, Docker Compose, Nginx |
| Hosting | Vercel (frontend), Render (API and database) |

## Architecture

```
┌──────────┐     HTTPS      ┌─────────────┐
│  Client  │ ─────────────► │   Vercel    │  React (static)
└────┬─────┘                └─────────────┘
     │
     │  HTTPS / REST
     ▼
┌─────────────┐              ┌──────────────┐
│   Render    │ ───────────► │  PostgreSQL  │
│   FastAPI   │              │   (Render)   │
└─────────────┘              └──────────────┘
```

Local development uses Docker Compose to run the frontend, API, and database as a single stack.

## Getting started

### Prerequisites

- Docker Desktop with Docker Compose v2

### Run locally

```bash
git clone https://github.com/Ishitachauhann/inventory-os-assignment-.git
cd inventary-order_and_managemnet_system-

cp .env.example .env
docker compose up --build
```

| Endpoint | URL |
|----------|-----|
| Application | http://localhost |
| API | http://localhost:8000 |
| OpenAPI | http://localhost:8000/docs |

```bash
docker compose down      # stop services
docker compose down -v   # stop and remove database volume
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (backend) |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `VITE_API_URL` | Backend base URL used at frontend build time |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Database credentials for Compose |

See [`.env.example`](.env.example) for defaults. Do not commit production secrets.

## API reference

Base path: `/`

| Resource | Methods |
|----------|---------|
| Products | `POST`, `GET`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}` |
| Customers | `POST`, `GET`, `GET /{id}`, `DELETE /{id}` |
| Orders | `POST`, `GET`, `GET /{id}`, `DELETE /{id}` |
| Dashboard | `GET /dashboard/summary` |
| Health | `GET /health` |

Interactive schema and testing: `/docs`.

### Business rules

- Product SKU and customer email must be unique
- Stock quantity cannot be negative
- Orders are rejected when inventory is insufficient
- Order placement reduces stock; cancellation restores stock
- Order totals are computed server-side from current product prices

## Deployment

| Component | Platform | Configuration |
|-----------|----------|---------------|
| Frontend | Vercel | Root directory: `frontend`; build: `npm run build`; output: `dist` |
| Backend | Render | Image: `docker.io/ishitamax/inventory-api:latest`; port: `8000` |
| Database | Render | Managed PostgreSQL; `DATABASE_URL` via internal connection string |

Production environment:

- `VITE_API_URL` — Render API URL (Vercel)
- `DATABASE_URL` — Render PostgreSQL internal URL (API service)
- `CORS_ORIGINS` — Vercel application URL (API service)

### Container image

```bash
docker build --platform linux/amd64 -t ishitamax/inventory-api:latest ./backend
docker push ishitamax/inventory-api:latest
```

Additional deployment notes: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Project structure

```
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── render.yaml
└── .env.example
```

## License

MIT
