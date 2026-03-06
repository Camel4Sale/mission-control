"""
Lead Model - Customer Lead Management
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.database import Base


class LeadStatus(enum.Enum):
    """Lead status enumeration"""
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    OFFER_SENT = "offer_sent"
    APPOINTMENT_BOOKED = "appointment_booked"
    CONVERTED = "converted"
    LOST = "lost"


class LeadSource(enum.Enum):
    """Lead source enumeration"""
    WEBSITE = "website"
    TELEGRAM = "telegram"
    DISCORD = "discord"
    EMAIL = "email"
    PHONE = "phone"
    REFERRAL = "referral"


class Lead(Base):
    """Lead model for tracking potential customers"""
    
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Personal Information
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50))
    address = Column(Text)
    city = Column(String(100))
    postal_code = Column(String(20))
    
    # Solar-specific Information
    stromverbrauch = Column(Float)  # Annual consumption in kWh
    dachflaeche = Column(Float)  # Available roof area in m²
    dachausrichtung = Column(String(50))  # N, S, E, W, etc.
    dachneigung = Column(Float)  # Roof angle in degrees
    strompreis_aktuell = Column(Float)  # Current electricity price in €/kWh
    
    # Interest & Preferences
    interesse = Column(String(100))  # e.g., "Komplettanlage", "Balkonkraftwerk"
    preferred_contact = Column(String(50))  # "email", "phone", "telegram"
    
    # Status & Tracking
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW, index=True)
    source = Column(Enum(LeadSource), default=LeadSource.WEBSITE)
    lead_score = Column(Integer, default=0)  # 0-100, calculated score
    
    # Calculated Values
    estimated_roi = Column(Float)  # Estimated ROI in years
    recommended_capacity = Column(Float)  # Recommended system size in kWp
    estimated_cost = Column(Float)  # Estimated system cost in €
    
    # Metadata
    notes = Column(Text)
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_contacted_at = Column(DateTime(timezone=True))
    
    # Flags
    is_active = Column(Boolean, default=True)
    is_qualified = Column(Boolean, default=False)
    
    # Relationships
    appointments = relationship("Appointment", back_populates="lead", cascade="all, delete-orphan")
    emails = relationship("EmailLog", back_populates="lead", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Lead(id={self.id}, name='{self.name}', email='{self.email}', status={self.status.value})>"
    
    def calculate_lead_score(self):
        """Calculate lead score based on completeness and engagement"""
        score = 0
        
        # Basic info (30 points)
        if self.name: score += 10
        if self.email: score += 10
        if self.phone: score += 10
        
        # Solar info (40 points)
        if self.stromverbrauch: score += 20
        if self.dachflaeche: score += 20
        
        # Engagement (30 points)
        if self.status == LeadStatus.APPOINTMENT_BOOKED: score += 30
        elif self.status == LeadStatus.OFFER_SENT: score += 20
        elif self.status == LeadStatus.QUALIFIED: score += 10
        
        self.lead_score = min(score, 100)
        return self.lead_score
