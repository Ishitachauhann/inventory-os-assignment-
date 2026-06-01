# Docker Hub — Backend Image Guide

Publish the **backend** API image to Docker Hub for your assignment submission.

---

## What you are publishing

| Item | Value |
|------|--------|
| Image contents | FastAPI app (`backend/`) |
| Base image | `python:3.11-slim` |
| Port | `8000` |
| **Not included** | PostgreSQL — use Render/Railway/etc. for the database |

Your submission link will look like:

https://hub.docker.com/r/ishitamax/inventory-api

---

## Step 1 — Create a Docker Hub account

1. Go to [https://hub.docker.com](https://hub.docker.com)
2. Sign up (free)
3. Choose a **username** (e.g. `ishitachauhan`) — you cannot change it easily later
4. Verify your email

---

## Step 2 — Install Docker (if needed)

You already use Docker Compose locally. Confirm the CLI works:

```bash
docker --version
```

---

## Step 3 — Log in to Docker Hub from the terminal

```bash
docker login
```

Enter your Docker Hub **username** and **password** (or access token — see Step 8).

You should see: `Login Succeeded`

---

## Step 4 — Build the backend image

From the **project root** (folder that contains `backend/`):

```bash
cd /path/to/inventary-order_and_managemnet_system-
```

Replace `YOUR_DOCKERHUB_USERNAME` with your real Docker Hub username:

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/inventory-api:latest ./backend
```

**Example:**

```bash
docker build -t ishitachauhan/inventory-api:latest ./backend
```

Wait until the build finishes without errors.

---

## Step 5 — Test the image locally (optional but recommended)

### 5a. Start only the database with Compose

```bash
docker compose up -d db
```

### 5b. Run your backend image

```bash
docker run --rm -p 8000:8000 \
  -e DATABASE_URL=postgresql://inventory:inventory@host.docker.internal:5432/inventory_db \
  -e CORS_ORIGINS=http://localhost,http://localhost:5173 \
  YOUR_DOCKERHUB_USERNAME/inventory-api:latest
```

On **Linux**, use your machine IP instead of `host.docker.internal`, or attach to the Compose network:

```bash
docker run --rm -p 8000:8000 \
  --network inventary-order_and_managemnet_system-_default \
  -e DATABASE_URL=postgresql://inventory:inventory@db:5432/inventory_db \
  -e CORS_ORIGINS=http://localhost \
  YOUR_DOCKERHUB_USERNAME/inventory-api:latest
```

### 5c. Check it works

Open: http://localhost:8000/health  

Expected: `{"status":"ok"}`

Stop with `Ctrl+C`.

---

## Step 6 — Push to Docker Hub

```bash
docker push YOUR_DOCKERHUB_USERNAME/inventory-api:latest
```

First push may take a few minutes.

---

## Step 7 — Get your submission link

1. Open https://hub.docker.com/r/ishitamax/inventory-api
2. Set the repository to **Public** (Settings → visibility)
3. Submit this URL in your assignment

**Pull command** (for reviewers):

```bash
docker pull YOUR_DOCKERHUB_USERNAME/inventory-api:latest
```

---

## Step 8 — Security (recommended)

Do not use your main Docker Hub password in CI. Use an **Access Token**:

1. Docker Hub → Account Settings → **Security** → **New Access Token**
2. Permissions: **Read, Write, Delete**
3. Use the token as the password when running `docker login`

---

## Step 9 — Use the image on Render / Railway / Fly.io

### Render (example)

1. Create a **Web Service**
2. Select **Deploy an existing image from a registry**
3. Image URL: `docker.io/YOUR_DOCKERHUB_USERNAME/inventory-api:latest`
4. Set environment variables:
   - `DATABASE_URL` — from Render PostgreSQL
   - `CORS_ORIGINS` — your Vercel/Netlify frontend URL
5. Port: `8000`

### Railway / Fly.io

Same idea: deploy from Docker image + attach managed Postgres + set `DATABASE_URL` and `CORS_ORIGINS`.

---

## Tagging versions (optional)

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/inventory-api:1.0.0 ./backend
docker push YOUR_DOCKERHUB_USERNAME/inventory-api:1.0.0
docker push YOUR_DOCKERHUB_USERNAME/inventory-api:latest
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `denied: requested access to the resource is denied` | Wrong username in tag, or run `docker login` again |
| `Cannot connect to the Docker daemon` | Start Docker Desktop |
| Build fails on `libpq` | Build from `./backend` (Dockerfile installs `libpq-dev`) |
| API runs but DB errors | Set `DATABASE_URL` to a reachable Postgres (not included in the image) |
| Push is very slow | Normal on first upload; later pushes are smaller |

---

## Quick command cheat sheet

```bash
# 1. Login
docker login

# 2. Build (from project root)
docker build -t YOUR_DOCKERHUB_USERNAME/inventory-api:latest ./backend

# 3. Push
docker push YOUR_DOCKERHUB_USERNAME/inventory-api:latest
```

**Submission:** https://hub.docker.com/r/ishitamax/inventory-api
