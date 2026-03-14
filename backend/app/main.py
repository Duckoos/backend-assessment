from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.database import init_db
from app.routers.v1 import auth, tasks

# App initialization
app = FastAPI(
    title="Backend Developer Assessment API",
    description="REST API with JWT Auth, RBAC, and CRUD Operations",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def on_startup():
    await init_db()

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Backend Assessment API. Visit /docs for Swagger documentation."}
