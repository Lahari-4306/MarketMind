from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import CampaignCreate, CampaignUpdate, CampaignResponse
from crud import get_campaigns, get_campaign, create_campaign, update_campaign, delete_campaign
from routers.auth import get_current_user
from services.groq_service import generate_campaign

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

@router.get("/", response_model=List[CampaignResponse])
def list_campaigns(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    campaigns = get_campaigns(db, current_user.id, skip, limit)
    return [CampaignResponse.model_validate(c) for c in campaigns]

@router.post("/", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_new_campaign(
    campaign: CampaignCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    generated_content = generate_campaign(
        campaign.product_name,
        campaign.industry,
        campaign.target_audience,
        campaign.campaign_goal
    )
    new_campaign = create_campaign(db, campaign, current_user.id, generated_content)
    return CampaignResponse.model_validate(new_campaign)

@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign_detail(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    campaign = get_campaign(db, campaign_id, current_user.id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    return CampaignResponse.model_validate(campaign)

@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_existing_campaign(
    campaign_id: int,
    campaign: CampaignUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_campaign = update_campaign(db, campaign_id, current_user.id, campaign)
    if not updated_campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    return CampaignResponse.model_validate(updated_campaign)

@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = delete_campaign(db, campaign_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    return None
