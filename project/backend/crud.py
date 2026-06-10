from sqlalchemy.orm import Session
from models import User, Campaign, SalesPitch, LeadScore, MarketAnalysis, BusinessInsight
from schemas import UserCreate, CampaignCreate, CampaignUpdate, SalesPitchCreate, SalesPitchUpdate, LeadScoreCreate, LeadScoreUpdate, MarketAnalysisCreate, MarketAnalysisUpdate, BusinessInsightCreate, BusinessInsightUpdate
from passlib.context import CryptContext
from datetime import datetime
from typing import List, Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User CRUD
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role="user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Campaign CRUD
def get_campaigns(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Campaign]:
    return db.query(Campaign).filter(Campaign.user_id == user_id).offset(skip).limit(limit).all()

def get_campaign(db: Session, campaign_id: int, user_id: int) -> Optional[Campaign]:
    return db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.user_id == user_id).first()

def create_campaign(db: Session, campaign: CampaignCreate, user_id: int, generated_content: str = None) -> Campaign:
    db_campaign = Campaign(
        **campaign.model_dump(),
        user_id=user_id,
        generated_content=generated_content
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def update_campaign(db: Session, campaign_id: int, user_id: int, campaign: CampaignUpdate) -> Optional[Campaign]:
    db_campaign = get_campaign(db, campaign_id, user_id)
    if not db_campaign:
        return None
    for key, value in campaign.model_dump(exclude_unset=True).items():
        setattr(db_campaign, key, value)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def delete_campaign(db: Session, campaign_id: int, user_id: int) -> bool:
    db_campaign = get_campaign(db, campaign_id, user_id)
    if not db_campaign:
        return False
    db.delete(db_campaign)
    db.commit()
    return True

# Sales Pitch CRUD
def get_sales_pitches(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[SalesPitch]:
    return db.query(SalesPitch).filter(SalesPitch.user_id == user_id).offset(skip).limit(limit).all()

def get_sales_pitch(db: Session, pitch_id: int, user_id: int) -> Optional[SalesPitch]:
    return db.query(SalesPitch).filter(SalesPitch.id == pitch_id, SalesPitch.user_id == user_id).first()

def create_sales_pitch(db: Session, pitch: SalesPitchCreate, user_id: int, generated_content: str = None) -> SalesPitch:
    db_pitch = SalesPitch(
        **pitch.model_dump(),
        user_id=user_id,
        generated_content=generated_content
    )
    db.add(db_pitch)
    db.commit()
    db.refresh(db_pitch)
    return db_pitch

def update_sales_pitch(db: Session, pitch_id: int, user_id: int, pitch: SalesPitchUpdate) -> Optional[SalesPitch]:
    db_pitch = get_sales_pitch(db, pitch_id, user_id)
    if not db_pitch:
        return None
    for key, value in pitch.model_dump(exclude_unset=True).items():
        setattr(db_pitch, key, value)
    db.commit()
    db.refresh(db_pitch)
    return db_pitch

def delete_sales_pitch(db: Session, pitch_id: int, user_id: int) -> bool:
    db_pitch = get_sales_pitch(db, pitch_id, user_id)
    if not db_pitch:
        return False
    db.delete(db_pitch)
    db.commit()
    return True

# Lead Score CRUD
def get_lead_scores(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[LeadScore]:
    return db.query(LeadScore).filter(LeadScore.user_id == user_id).offset(skip).limit(limit).all()

def get_lead_score(db: Session, lead_id: int, user_id: int) -> Optional[LeadScore]:
    return db.query(LeadScore).filter(LeadScore.id == lead_id, LeadScore.user_id == user_id).first()

def create_lead_score(db: Session, lead: LeadScoreCreate, user_id: int, score: float, priority: str, generated_content: str = None) -> LeadScore:
    db_lead = LeadScore(
        **lead.model_dump(),
        user_id=user_id,
        score=score,
        priority=priority,
        generated_content=generated_content
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

def update_lead_score(db: Session, lead_id: int, user_id: int, lead: LeadScoreUpdate) -> Optional[LeadScore]:
    db_lead = get_lead_score(db, lead_id, user_id)
    if not db_lead:
        return None
    for key, value in lead.model_dump(exclude_unset=True).items():
        setattr(db_lead, key, value)
    db.commit()
    db.refresh(db_lead)
    return db_lead

def delete_lead_score(db: Session, lead_id: int, user_id: int) -> bool:
    db_lead = get_lead_score(db, lead_id, user_id)
    if not db_lead:
        return False
    db.delete(db_lead)
    db.commit()
    return True

# Market Analysis CRUD
def get_market_analyses(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[MarketAnalysis]:
    return db.query(MarketAnalysis).filter(MarketAnalysis.user_id == user_id).offset(skip).limit(limit).all()

def get_market_analysis(db: Session, analysis_id: int, user_id: int) -> Optional[MarketAnalysis]:
    return db.query(MarketAnalysis).filter(MarketAnalysis.id == analysis_id, MarketAnalysis.user_id == user_id).first()

def create_market_analysis(db: Session, analysis: MarketAnalysisCreate, user_id: int, generated_content: str = None) -> MarketAnalysis:
    db_analysis = MarketAnalysis(
        **analysis.model_dump(),
        user_id=user_id,
        generated_content=generated_content
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

def delete_market_analysis(db: Session, analysis_id: int, user_id: int) -> bool:
    db_analysis = get_market_analysis(db, analysis_id, user_id)
    if not db_analysis:
        return False
    db.delete(db_analysis)
    db.commit()
    return True

# Business Insight CRUD
def get_business_insights(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[BusinessInsight]:
    return db.query(BusinessInsight).filter(BusinessInsight.user_id == user_id).offset(skip).limit(limit).all()

def get_business_insight(db: Session, insight_id: int, user_id: int) -> Optional[BusinessInsight]:
    return db.query(BusinessInsight).filter(BusinessInsight.id == insight_id, BusinessInsight.user_id == user_id).first()

def create_business_insight(db: Session, insight: BusinessInsightCreate, user_id: int, generated_content: str = None) -> BusinessInsight:
    db_insight = BusinessInsight(
        **insight.model_dump(),
        user_id=user_id,
        generated_content=generated_content
    )
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)
    return db_insight

def delete_business_insight(db: Session, insight_id: int, user_id: int) -> bool:
    db_insight = get_business_insight(db, insight_id, user_id)
    if not db_insight:
        return False
    db.delete(db_insight)
    db.commit()
    return True

# Dashboard Stats
def get_dashboard_stats(db: Session, user_id: int) -> dict:
    campaigns = db.query(Campaign).filter(Campaign.user_id == user_id).all()
    pitches = db.query(SalesPitch).filter(SalesPitch.user_id == user_id).all()
    leads = db.query(LeadScore).filter(LeadScore.user_id == user_id).all()
    insights = db.query(BusinessInsight).filter(BusinessInsight.user_id == user_id).all()

    leads_by_priority = {"high": 0, "medium": 0, "low": 0}
    for lead in leads:
        if lead.priority:
            leads_by_priority[lead.priority.lower()] = leads_by_priority.get(lead.priority.lower(), 0) + 1

    campaigns_by_industry = {}
    for campaign in campaigns:
        if campaign.industry:
            campaigns_by_industry[campaign.industry] = campaigns_by_industry.get(campaign.industry, 0) + 1

    recent_items = []
    for item in sorted(campaigns, key=lambda x: x.created_at, reverse=True)[:3]:
        recent_items.append({"type": "campaign", "name": item.product_name, "date": item.created_at})
    for item in sorted(pitches, key=lambda x: x.created_at, reverse=True)[:2]:
        recent_items.append({"type": "pitch", "name": item.product, "date": item.created_at})
    recent_items.sort(key=lambda x: x["date"], reverse=True)
    recent_activity = recent_items[:5]

    return {
        "total_campaigns": len(campaigns),
        "total_pitches": len(pitches),
        "total_leads": len(leads),
        "total_insights": len(insights),
        "leads_by_priority": leads_by_priority,
        "campaigns_by_industry": campaigns_by_industry,
        "recent_activity": [{"type": r["type"], "name": r["name"], "date": r["date"].isoformat()} for r in recent_activity]
    }
