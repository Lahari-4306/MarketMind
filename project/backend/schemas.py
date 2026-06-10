from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Campaign Schemas
class CampaignBase(BaseModel):
    product_name: str
    industry: str
    target_audience: str
    campaign_goal: str

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    product_name: Optional[str] = None
    industry: Optional[str] = None
    target_audience: Optional[str] = None
    campaign_goal: Optional[str] = None

class CampaignResponse(CampaignBase):
    id: int
    user_id: int
    generated_content: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Sales Pitch Schemas
class SalesPitchBase(BaseModel):
    product: str
    customer_type: str

class SalesPitchCreate(SalesPitchBase):
    pass

class SalesPitchUpdate(BaseModel):
    product: Optional[str] = None
    customer_type: Optional[str] = None

class SalesPitchResponse(SalesPitchBase):
    id: int
    user_id: int
    generated_content: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Lead Score Schemas
class LeadScoreBase(BaseModel):
    company_size: str
    industry: str
    budget: str
    engagement_level: str

class LeadScoreCreate(LeadScoreBase):
    pass

class LeadScoreUpdate(BaseModel):
    company_size: Optional[str] = None
    industry: Optional[str] = None
    budget: Optional[str] = None
    engagement_level: Optional[str] = None

class LeadScoreResponse(LeadScoreBase):
    id: int
    user_id: int
    score: Optional[float] = None
    priority: Optional[str] = None
    generated_content: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Market Analysis Schemas
class MarketAnalysisBase(BaseModel):
    industry: str

class MarketAnalysisCreate(MarketAnalysisBase):
    pass

class MarketAnalysisUpdate(BaseModel):
    industry: Optional[str] = None

class MarketAnalysisResponse(MarketAnalysisBase):
    id: int
    user_id: int
    generated_content: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Business Insight Schemas
class BusinessInsightBase(BaseModel):
    business_description: str

class BusinessInsightCreate(BusinessInsightBase):
    pass

class BusinessInsightUpdate(BaseModel):
    business_description: Optional[str] = None

class BusinessInsightResponse(BusinessInsightBase):
    id: int
    user_id: int
    generated_content: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Dashboard Stats
class DashboardStats(BaseModel):
    total_campaigns: int
    total_pitches: int
    total_leads: int
    total_insights: int
    leads_by_priority: dict
    campaigns_by_industry: dict
    recent_activity: list
