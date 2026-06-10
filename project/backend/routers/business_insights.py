from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import BusinessInsightCreate, BusinessInsightResponse
from crud import get_business_insights, get_business_insight, create_business_insight, delete_business_insight
from routers.auth import get_current_user
from services.groq_service import generate_business_insights

router = APIRouter(prefix="/business-insights", tags=["Business Insights"])

@router.get("/", response_model=List[BusinessInsightResponse])
def list_business_insights(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    insights = get_business_insights(db, current_user.id, skip, limit)
    return [BusinessInsightResponse.model_validate(i) for i in insights]

@router.post("/", response_model=BusinessInsightResponse, status_code=status.HTTP_201_CREATED)
def create_new_business_insight(
    insight: BusinessInsightCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    generated_content = generate_business_insights(insight.business_description)
    new_insight = create_business_insight(db, insight, current_user.id, generated_content)
    return BusinessInsightResponse.model_validate(new_insight)

@router.get("/{insight_id}", response_model=BusinessInsightResponse)
def get_business_insight_detail(
    insight_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    insight = get_business_insight(db, insight_id, current_user.id)
    if not insight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business insight not found"
        )
    return BusinessInsightResponse.model_validate(insight)

@router.delete("/{insight_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_business_insight(
    insight_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = delete_business_insight(db, insight_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business insight not found"
        )
    return None
