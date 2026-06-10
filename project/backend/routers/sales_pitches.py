from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import SalesPitchCreate, SalesPitchUpdate, SalesPitchResponse
from crud import get_sales_pitches, get_sales_pitch, create_sales_pitch, update_sales_pitch, delete_sales_pitch
from routers.auth import get_current_user
from services.groq_service import generate_sales_pitch

router = APIRouter(prefix="/sales-pitches", tags=["Sales Pitches"])

@router.get("/", response_model=List[SalesPitchResponse])
def list_sales_pitches(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pitches = get_sales_pitches(db, current_user.id, skip, limit)
    return [SalesPitchResponse.model_validate(p) for p in pitches]

@router.post("/", response_model=SalesPitchResponse, status_code=status.HTTP_201_CREATED)
def create_new_sales_pitch(
    pitch: SalesPitchCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    generated_content = generate_sales_pitch(pitch.product, pitch.customer_type)
    new_pitch = create_sales_pitch(db, pitch, current_user.id, generated_content)
    return SalesPitchResponse.model_validate(new_pitch)

@router.get("/{pitch_id}", response_model=SalesPitchResponse)
def get_sales_pitch_detail(
    pitch_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pitch = get_sales_pitch(db, pitch_id, current_user.id)
    if not pitch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales pitch not found"
        )
    return SalesPitchResponse.model_validate(pitch)

@router.put("/{pitch_id}", response_model=SalesPitchResponse)
def update_existing_sales_pitch(
    pitch_id: int,
    pitch: SalesPitchUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_pitch = update_sales_pitch(db, pitch_id, current_user.id, pitch)
    if not updated_pitch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales pitch not found"
        )
    return SalesPitchResponse.model_validate(updated_pitch)

@router.delete("/{pitch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_sales_pitch(
    pitch_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = delete_sales_pitch(db, pitch_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales pitch not found"
        )
    return None
