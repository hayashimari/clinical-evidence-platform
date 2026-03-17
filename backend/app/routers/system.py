from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.db.session import check_db_connection

router = APIRouter(prefix="/api/v1", tags=["system"])


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "backend",
    }


@router.get("/health/db")
def health_check_db():
    db_status = check_db_connection()
    status_code = (
        status.HTTP_200_OK
        if db_status["database"] == "connected"
        else status.HTTP_503_SERVICE_UNAVAILABLE
    )
    return JSONResponse(status_code=status_code, content=db_status)
