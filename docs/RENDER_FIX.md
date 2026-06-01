# Render deployment — fix “An error occurred”

Your Docker image is valid (`linux/amd64` on Docker Hub). Errors on Render are usually **configuration**, not the image itself.

---

## 1. Check the image URL (no typo)

Use **exactly**:

```text
docker.io/ishitamax/inventory-api:latest
```

Common mistakes:

| Wrong | Right |
|-------|--------|
| `.../latest-` (extra dash) | `.../latest` |
| `ishitamax/inventory-api` (no tag) | `ishitamax/inventory-api:latest` |
| Private image without credentials | Make repo **Public** on Docker Hub |

**Credential:** leave as **No credential** (public image).

---

## 2. Create PostgreSQL first (required)

The API **cannot start** without a database.

1. Render Dashboard → **New +** → **PostgreSQL**
2. Name: e.g. `inventory-postgres`
3. Plan: **Free**
4. **Create**

After it is **Available**, open the database → copy:

- **Internal Database URL** (for Render services)
- NOT the External URL for the web service

Example shape:

```text
postgresql://inventory_xxxx:password@dpg-xxxxx-a/inventory_db
```

---

## 3. Create Web Service from image

1. **New +** → **Web Service**
2. **Deploy an existing image from a registry**
3. Image URL: `docker.io/ishitamax/inventory-api:latest`
4. Name: `inventory-api`
5. Region: same as your database
6. Plan: **Free**

### Service settings

| Setting | Value |
|---------|--------|
| **Language / Runtime** | Docker |
| **Port** | `8000` |
| **Health Check Path** | `/health` |

### Environment variables (required)

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Paste **Internal Database URL** from step 2 |
| `CORS_ORIGINS` | `https://placeholder.vercel.app` (change after Vercel deploy) |

Click **Create Web Service**.

---

## 4. Read the real error in Render logs

If deploy still fails:

1. Open your **Web Service** on Render
2. **Logs** tab
3. Look for red errors

| Log message | Fix |
|-------------|-----|
| `could not translate host name "db"` | `DATABASE_URL` not set — add Internal DB URL |
| `Connection refused` | Wrong `DATABASE_URL` or DB not in same region |
| `invalid platform` | Rebuild image: `docker build --platform linux/amd64 ...` |
| `Application startup failed` | Database URL wrong or Postgres not ready |
| `failed to pull image` | Typo in image URL or private repo |

---

## 5. Verify deploy

When logs show `Uvicorn running on http://0.0.0.0:8000`:

- `https://YOUR-SERVICE.onrender.com/health` → `{"status":"ok"}`
- `https://YOUR-SERVICE.onrender.com/docs` → Swagger UI

**Free tier:** first request after idle can take **30–60 seconds**.

---

## 6. Easier alternative — deploy from GitHub (no Docker Hub on Render)

If the image path keeps failing:

1. **New +** → **Web Service** → **Build and deploy from a Git repo**
2. Connect: `Ishitachauhann/inventary-order_and_managemnet_system-`
3. **Root Directory:** leave blank
4. **Language:** Docker
5. **Dockerfile Path:** `backend/Dockerfile`
6. **Docker Context:** `backend`
7. Same env vars: `DATABASE_URL`, `CORS_ORIGINS`
8. Port `8000`, health check `/health`

You can still submit Docker Hub link separately; Render builds `amd64` in the cloud.

---

## Quick checklist

- [ ] Postgres created and **Available**
- [ ] `DATABASE_URL` = **Internal** URL (not External)
- [ ] Image URL = `docker.io/ishitamax/inventory-api:latest` (no trailing `-`)
- [ ] Port = `8000`
- [ ] Health check = `/health`
- [ ] Docker Hub repo is **Public**
- [ ] `/health` works in browser after deploy
