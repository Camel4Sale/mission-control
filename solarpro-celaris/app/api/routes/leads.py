"""
Lead Management Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime
import structlog

from app.database import get_db
from app.models.lead import Lead, LeadStatus, LeadSource
from app.schemas.lead import LeadCreate, LeadResponse, LeadUpdate, LeadListResponse

logger = structlog.get_logger()
router = APIRouter()


@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_data: LeadCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new lead
    
    This endpoint is called when a potential customer submits their information
    via the website, Telegram bot, or other channels.
    """
    logger.info("Creating new lead", email=lead_data.email)
    
    # Check for duplicate email
    result = await db.execute(
        select(Lead).where(Lead.email == lead_data.email)
    )
    existing_lead = result.scalar_one_or_none()
    
    if existing_lead:
        logger.warning("Duplicate lead attempt", email=lead_data.email)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A lead with this email already exists"
        )
    
    # Create new lead
    lead = Lead(**lead_data.model_dump())
    lead.calculate_lead_score()
    
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    
    logger.info("Lead created successfully", lead_id=lead.id)
    
    # TODO: Trigger follow-up email automation
    # TODO: Sync to Life OS CRM
    
    return lead


@router.get("/", response_model=LeadListResponse)
async def list_leads(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: Optional[LeadStatus] = Query(None, alias="status"),
    source: Optional[LeadSource] = None,
    min_score: Optional[int] = Query(None, ge=0, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    List leads with optional filtering
    
    Supports pagination and filtering by status, source, and lead score.
    """
    query = select(Lead)
    
    # Apply filters
    if status_filter:
        query = query.where(Lead.status == status_filter)
    if source:
        query = query.where(Lead.source == source)
    if min_score is not None:
        query = query.where(Lead.lead_score >= min_score)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    query = query.offset(skip).limit(limit).order_by(Lead.created_at.desc())
    result = await db.execute(query)
    leads = result.scalars().all()
    
    return LeadListResponse(
        leads=[LeadResponse.model_validate(lead) for lead in leads],
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific lead by ID"""
    result = await db.execute(
        select(Lead).where(Lead.id == lead_id)
    )
    lead = result.scalar_one_or_none()
    
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    return lead


@router.patch("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    lead_data: LeadUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a lead's information"""
    result = await db.execute(
        select(Lead).where(Lead.id == lead_id)
    )
    lead = result.scalar_one_or_none()
    
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Update fields
    update_data = lead_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lead, field, value)
    
    # Recalculate lead score if relevant fields changed
    lead.calculate_lead_score()
    
    lead.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(lead)
    
    logger.info("Lead updated", lead_id=lead.id)
    
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a lead"""
    result = await db.execute(
        select(Lead).where(Lead.id == lead_id)
    )
    lead = result.scalar_one_or_none()
    
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    await db.delete(lead)
    await db.commit()
    
    logger.info("Lead deleted", lead_id=lead_id)


@router.post("/{lead_id}/qualify", response_model=LeadResponse)
async def qualify_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Mark a lead as qualified"""
    result = await db.execute(
        select(Lead).where(Lead.id == lead_id)
    )
    lead = result.scalar_one_or_none()
    
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    lead.status = LeadStatus.QUALIFIED
    lead.is_qualified = True
    lead.last_contacted_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(lead)
    
    logger.info("Lead qualified", lead_id=lead.id)
    
    # TODO: Trigger qualification email
    
    return lead
