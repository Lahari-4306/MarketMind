from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import MarketAnalysisCreate, MarketAnalysisResponse
from crud import get_market_analyses, get_market_analysis, create_market_analysis, delete_market_analysis
from routers.auth import get_current_user
from services.groq_service import generate_market_analysis

router = APIRouter(prefix="/market-analyses", tags=["Market Analyses"])

@router.get("/", response_model=List[MarketAnalysisResponse])
def list_market_analyses(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = get_market_analyses(db, current_user.id, skip, limit)
    return [MarketAnalysisResponse.model_validate(a) for a in analyses]

@router.post("/", response_model=MarketAnalysisResponse, status_code=status.HTTP_201_CREATED)
def create_new_market_analysis(
    analysis: MarketAnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    generated_content = generate_market_analysis(analysis.industry)
    new_analysis = create_market_analysis(db, analysis, current_user.id, generated_content)
    return MarketAnalysisResponse.model_validate(new_analysis)

@router.get("/{analysis_id}", response_model=MarketAnalysisResponse)
def get_market_analysis_detail(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = get_market_analysis(db, analysis_id, current_user.id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Market analysis not found"
        )
    return MarketAnalysisResponse.model_validate(analysis)

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_market_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = delete_market_analysis(db, analysis_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Market analysis not found"
        )
    return None
