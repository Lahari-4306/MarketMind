from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import LeadScoreCreate, LeadScoreUpdate, LeadScoreResponse
from crud import get_lead_scores, get_lead_score, create_lead_score, update_lead_score, delete_lead_score
from routers.auth import get_current_user
from services.groq_service import generate_lead_score

router = APIRouter(prefix="/lead-scores", tags=["Lead Scores"])

@router.get("/", response_model=List[LeadScoreResponse])
def list_lead_scores(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    leads = get_lead_scores(db, current_user.id, skip, limit)
    return [LeadScoreResponse.model_validate(l) for l in leads]

@router.post("/", response_model=LeadScoreResponse, status_code=status.HTTP_201_CREATED)
def create_new_lead_score(
    lead: LeadScoreCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    score, priority, generated_content = generate_lead_score(
        lead.company_size,
        lead.industry,
        lead.budget,
        lead.engagement_level
    )
    new_lead = create_lead_score(db, lead, current_user.id, score, priority, generated_content)
    return LeadScoreResponse.model_validate(new_lead)

@router.get("/{lead_id}", response_model=LeadScoreResponse)
def get_lead_score_detail(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lead = get_lead_score(db, lead_id, current_user.id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead score not found"
        )
    return LeadScoreResponse.model_validate(lead)

@router.put("/{lead_id}", response_model=LeadScoreResponse)
def update_existing_lead_score(
    lead_id: int,
    lead: LeadScoreUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_lead = update_lead_score(db, lead_id, current_user.id, lead)
    if not updated_lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead score not found"
        )
    return LeadScoreResponse.model_validate(updated_lead)

@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_lead_score(
    lead_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = delete_lead_score(db, lead_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead score not found"
        )
    return None
