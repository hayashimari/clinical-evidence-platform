from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.system import router as system_router
from app.routers.search import router as search_router

app = FastAPI(
    title="Clinical Evidence Platform API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "message": "Clinical Evidence Platform API",
        "status": "ok",
    }


app.include_router(system_router)
app.include_router(search_router, prefix="/api/v1")
