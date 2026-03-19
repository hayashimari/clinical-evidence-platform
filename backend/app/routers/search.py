from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.search import SearchResponse
from app.services.search_service import search

router = APIRouter(tags=["search"])


@router.get("/search", response_model=SearchResponse)
def search_endpoint(
    query: str,
    user_id: int,
    db: Session = Depends(get_db),
):
    return search(db=db, query=query, user_id=user_id)
