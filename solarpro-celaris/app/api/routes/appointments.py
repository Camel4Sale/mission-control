"""
Appointment Booking API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from typing import Optional, List
import structlog

from app.database import get_db
from app.models.appointment import Appointment, AppointmentType, AppointmentStatus
from app.models.lead import Lead
from app.schemas.lead import LeadResponse

logger = structlog.get_logger()
router = APIRouter()


class AppointmentCreate(BaseModel):
    """Request model for creating appointments"""
    lead_id: int = Field(..., description="ID of the lead")
    preferred_date: date = Field(..., description="Preferred appointment date")
    preferred_time: str = Field(..., description="Preferred time (HH:MM)")
    appointment_type: AppointmentType = Field(..., description="Type of appointment")
    notes: Optional[str] = Field(None, description="Additional notes")


class AppointmentResponse(BaseModel):
    """Response model for appointments"""
    id: int
    lead_id: int
    appointment_date: date
    appointment_time: str
    appointment_type: AppointmentType
    status: AppointmentStatus
    location: Optional[str]
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Book a new appointment
    
    Creates an appointment and updates the lead status to APPOINTMENT_BOOKED
    """
    logger.info(
        "Creating appointment",
        lead_id=appointment_data.lead_id,
        date=appointment_data.preferred_date,
        type=appointment_data.appointment_type
    )
    
    # Verify lead exists
    result = await db.execute(
        select(Lead).where(Lead.id == appointment_data.lead_id)
    )
    lead = result.scalar_one_or_none()
    
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check availability (simplified - in production integrate with calendar API)
    appointment_datetime = datetime.combine(
        appointment_data.preferred_date,
        datetime.strptime(appointment_data.preferred_time, "%H:%M").time()
    )
    
    # Check for conflicts
    conflict_query = await db.execute(
        select(Appointment).where(
            Appointment.appointment_date == appointment_data.preferred_date,
            Appointment.appointment_time == appointment_data.preferred_time,
            Appointment.status != AppointmentStatus.CANCELLED
        )
    )
    conflicts = conflict_query.scalars().all()
    
    if conflicts:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Time slot not available. Please choose another time."
        )
    
    # Create appointment
    appointment = Appointment(
        lead_id=appointment_data.lead_id,
        appointment_date=appointment_data.preferred_date,
        appointment_time=appointment_data.preferred_time,
        appointment_type=appointment_data.appointment_type,
        notes=appointment_data.notes,
        status=AppointmentStatus.SCHEDULED
    )
    
    # Update lead status
    lead.status = LeadStatus.APPOINTMENT_BOOKED
    lead.last_contacted_at = datetime.utcnow()
    
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    
    logger.info("Appointment created successfully", appointment_id=appointment.id)
    
    # TODO: Send confirmation email
    # TODO: Add to Google Calendar
    
    return appointment


@router.get("/")
async def list_appointments(
    lead_id: Optional[int] = None,
    status_filter: Optional[AppointmentStatus] = None,
    from_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    """List appointments with optional filtering"""
    query = select(Appointment)
    
    if lead_id:
        query = query.where(Appointment.lead_id == lead_id)
    if status_filter:
        query = query.where(Appointment.status == status_filter)
    if from_date:
        query = query.where(Appointment.appointment_date >= from_date)
    
    query = query.order_by(Appointment.appointment_date.desc())
    result = await db.execute(query)
    appointments = result.scalars().all()
    
    return [
        {
            "id": apt.id,
            "lead_id": apt.lead_id,
            "appointment_date": apt.appointment_date,
            "appointment_time": apt.appointment_time,
            "appointment_type": apt.appointment_type.value,
            "status": apt.status.value,
            "location": apt.location,
            "notes": apt.notes
        }
        for apt in appointments
    ]


@router.get("/{appointment_id}")
async def get_appointment(
    appointment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific appointment"""
    result = await db.execute(
        select(Appointment).where(Appointment.id == appointment_id)
    )
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    return appointment


@router.patch("/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: int,
    new_status: AppointmentStatus,
    db: AsyncSession = Depends(get_db)
):
    """Update appointment status"""
    result = await db.execute(
        select(Appointment).where(Appointment.id == appointment_id)
    )
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    appointment.status = new_status
    appointment.updated_at = datetime.utcnow()
    
    if new_status == AppointmentStatus.CANCELLED:
        # Optionally revert lead status
        pass
    
    await db.commit()
    await db.refresh(appointment)
    
    logger.info("Appointment status updated", appointment_id=appointment_id, status=new_status.value)
    
    return appointment
