"""
Appointment Model - Customer Appointment Scheduling
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.database import Base


class AppointmentType(enum.Enum):
    """Appointment type enumeration"""
    PHONE_CALL = "phone_call"
    VIDEO_CALL = "video_call"
    BESICHTIGUNG = "besichtigung"  # On-site visit
    CONSULTATION = "consultation"


class AppointmentStatus(enum.Enum):
    """Appointment status enumeration"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class Appointment(Base):
    """Appointment model for scheduling customer meetings"""
    
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False, index=True)
    
    # Appointment Details
    appointment_type = Column(Enum(AppointmentType), nullable=False)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.PENDING)
    
    # Scheduling
    scheduled_date = Column(DateTime(timezone=True), nullable=False, index=True)
    duration_minutes = Column(Integer, default=60)
    timezone = Column(String(50), default="Europe/Berlin")
    
    # Location
    location_type = Column(String(50))  # "on-site", "video", "phone"
    location_address = Column(Text)  # For on-site visits
    meeting_link = Column(String(500))  # For video calls
    
    # Notes
    notes = Column(Text)
    internal_notes = Column(Text)
    
    # Reminders
    reminder_sent = Column(Boolean, default=False)
    reminder_sent_at = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    confirmed_at = Column(DateTime(timezone=True))
    cancelled_at = Column(DateTime(timezone=True))
    
    # Relationships
    lead = relationship("Lead", back_populates="appointments")
    
    def __repr__(self):
        return f"<Appointment(id={self.id}, lead_id={self.lead_id}, date={self.scheduled_date}, type={self.appointment_type.value})>"
    
    def is_upcoming(self) -> bool:
        """Check if appointment is in the future"""
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        return self.scheduled_date > now
    
    def is_today(self) -> bool:
        """Check if appointment is today"""
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        return self.scheduled_date.date() == now.date()
