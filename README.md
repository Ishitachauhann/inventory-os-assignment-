# Inventory & Order Management System

A full-stack Inventory & Order Management System built to help businesses manage products, customers, orders, and stock levels from a single platform. The application combines a React frontend, FastAPI backend, and PostgreSQL database, with Docker used for containerized development and deployment.

## Live Application

| Service           | URL                                                                      |
| ----------------- | ------------------------------------------------------------------------ |
| Web Application   | https://inventory-os-assignment.vercel.app                               |
| REST API          | https://inventory-api-latest-v171.onrender.com                           |
| API Documentation | https://inventory-api-latest-v171.onrender.com/docs                      |
| Docker Image      | https://hub.docker.com/r/ishitamax/inventory-api                         |
| GitHub Repository | https://github.com/Ishitachauhann/inventary-order_and_managemnet_system- |

## Overview

This system provides a simple yet complete workflow for inventory and order management. Users can manage products, maintain customer records, create orders, and track inventory updates in real time. The backend enforces business rules such as unique SKUs, unique customer emails, stock validation, and automatic inventory adjustments whenever orders are placed or cancelled.

## Features

### Product Management

Create, update, view, and delete products while maintaining unique product SKUs, pricing information, and available stock quantities.

### Customer Management

Manage customer records with email validation to ensure every customer account remains unique.

### Order Processing

Create orders containing multiple products, automatically calculate totals, validate inventory availability, and update stock levels after successful order placement.

### Inventory Tracking

Monitor available stock across all products and prevent orders from being placed when inventory is insufficient.

### Dashboard & Analytics

View business insights including total products, customers, orders, and low-stock items that require attention.

### REST API

A fully documented API built with FastAPI, featuring request validation, error handling, and interactive OpenAPI documentation.

## Tech Stack

| Layer            | Technologies                          |
| ---------------- | ------------------------------------- |
| Frontend         | React, Vite, React Router             |
| Backend          | FastAPI, Python, SQLAlchemy, Pydantic |
| Database         | PostgreSQL                            |
| Containerization | Docker, Docker Compose                |
| Web Server       | Nginx                                 |
| Deployment       | Vercel, Render                        |

## System Architecture

```text
┌──────────┐     HTTPS      ┌─────────────┐
│  Client  │ ─────────────► │   Vercel    │
└────┬─────┘                └─────────────┘
     │
     │ REST API
     ▼
┌─────────────┐              ┌──────────────┐
│   FastAPI   │ ───────────► │ PostgreSQL   │
│   (Render)  │              │  (Render)    │
└─────────────┘              └──────────────┘
```

For local development, Docker Compose orchestrates the frontend, backend, and database services, allowing the entire application to run with a single command.

## Getting Started

### Prerequisites

* Docker Desktop
* Docker Compose v2

### Run Locally

```bash
git clone https://github.com/Ishitachauhann/inventary-order_and_managemnet_system-.git

cd inventary-order_and_managemnet_system-

cp .env.example .env

docker compose up --build
```

### Local Endpoints

| Service           | URL                        |
| ----------------- | -------------------------- |
| Frontend          | http://localhost           |
| Backend API       | http://localhost:8000      |
| API Documentation | http://localhost:8000/docs |

### Stop Services

```bash
docker compose down
```

Remove containers and database volumes:

```bash
docker compose down -v
```

## Environment Variables

| Variable          | Purpose                       |
| ----------------- | ----------------------------- |
| DATABASE_URL      | PostgreSQL connection string  |
| CORS_ORIGINS      | Allowed frontend origins      |
| VITE_API_URL      | Backend API URL used by React |
| POSTGRES_USER     | Database username             |
| POSTGRES_PASSWORD | Database password             |
| POSTGRES_DB       | Database name                 |

Refer to `.env.example` for sample values.

## API Endpoints

| Resource  | Operations                   |
| --------- | ---------------------------- |
| Products  | Create, Read, Update, Delete |
| Customers | Create, Read, Delete         |
| Orders    | Create, Read, Delete         |
| Dashboard | Summary Metrics              |
| Health    | Service Health Check         |

Interactive API documentation is available at:

```text
/docs
```

## Business Rules

* Product SKUs must be unique.
* Customer emails must be unique.
* Stock quantities cannot be negative.
* Orders are rejected when stock is insufficient.
* Stock is automatically reduced when an order is placed.
* Stock is automatically restored when an order is cancelled.
* Order totals are calculated on the server using current product prices.

## Deployment

| Component          | Platform          |
| ------------------ | ----------------- |
| Frontend           | Vercel            |
| Backend            | Render            |
| Database           | Render PostgreSQL |
| Container Registry | Docker Hub        |

### Production Configuration

* `VITE_API_URL` → Public Render API URL
* `DATABASE_URL` → Render PostgreSQL connection string
* `CORS_ORIGINS` → Vercel frontend domain

### Docker Image

```bash
docker build --platform linux/amd64 -t ishitamax/inventory-api:latest ./backend

docker push ishitamax/inventory-api:latest
```

## Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── render.yaml
└── .env.example
```

## License

This project is released under the MIT License.
