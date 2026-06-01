import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import Base, engine
from app.routers import customers, dashboard, orders, products

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    last_error = None
    for attempt in range(1, 11):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database connected and tables ready")
            break
        except Exception as exc:
            last_error = exc
            logger.warning("Database not ready (attempt %s/10): %s", attempt, exc)
            time.sleep(3)
    else:
        raise RuntimeError(
            "Could not connect to PostgreSQL. Set DATABASE_URL to your Render "
            "Postgres **Internal** connection string."
        ) from last_error
    yield


app = FastAPI(
    title="Inventory & Order Management API",
    description="Production-ready API for products, customers, orders, and inventory.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "service": "Inventory & Order Management API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(_, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=500,
        content={"detail": "Database error occurred", "error": str(exc.__class__.__name__)},
    )
