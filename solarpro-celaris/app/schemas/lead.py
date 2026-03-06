"""
Pydantic Schemas for Lead Management
"""

from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class LeadStatusEnum(str, Enum):
    """Lead status enum for schemas"""
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    OFFER_SENT = "offer_sent"
    APPOINTMENT_BOOKED = "appointment_booked"
    CONVERTED = "converted"
    LOST = "lost"


class LeadSourceEnum(str, Enum):
    """Lead source enum for schemas"""
    WEBSITE = "website"
    TELEGRAM = "telegram"
    DISCORD = "discord"
    EMAIL = "email"
    PHONE = "phone"
    REFERRAL = "referral"


class LeadBase(BaseModel):
    """Base schema for lead data"""
    name: str = Field(..., min_length=1, max_length=255, description="Full name")
    email: EmailStr = Field(..., description="Email address")
    phone: Optional[str] = Field(None, max_length=50, description="Phone number")
    address: Optional[str] = Field(None, description="Street address")
    city: Optional[str] = Field(None, max_length=100, description="City")
    postal_code: Optional[str] = Field(None, max_length=20, description="Postal code")
    
    # Solar-specific
    stromverbrauch: Optional[float] = Field(None, gt=0, description="Annual electricity consumption in kWh")
    dachflaeche: Optional[float] = Field(None, gt=0, description="Available roof area in m²")
    dachausrichtung: Optional[str] = Field(None, description="Roof orientation (N, S, E, W, etc.)")
    dachneigung: Optional[float] = Field(None, ge=0, le=90, description="Roof angle in degrees")
    strompreis_aktuell: Optional[float] = Field(None, gt=0, description="Current electricity price in €/kWh")
    
    # Preferences
    interesse: Optional[str] = Field(None, max_length=100, description="Area of interest")
    preferred_contact: Optional[str] = Field(None, description="Preferred contact method")
    
    # Metadata
    notes: Optional[str] = Field(None, description="Additional notes")
    source: LeadSourceEnum = Field(default=LeadSourceEnum.WEBSITE, description="Lead source")


class LeadCreate(LeadBase):
    """Schema for creating a new lead"""
    pass


class LeadUpdate(BaseModel):
    """Schema for updating a lead"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    city: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    
    # Solar-specific
    stromverbrauch: Optional[float] = Field(None, gt=0)
    dachflaeche: Optional[float] = Field(None, gt=0)
    dachausrichtung: Optional[str] = None
    dachneigung: Optional[float] = Field(None, ge=0, le=90)
    strompreis_aktuell: Optional[float] = Field(None, gt=0)
    
    # Preferences
    interesse: Optional[str] = Field(None, max_length=100)
    preferred_contact: Optional[str] = None
    
    # Status
    status: Optional[LeadStatusEnum] = None
    lead_score: Optional[int] = Field(None, ge=0, le=100)
    
    # Metadata
    notes: Optional[str] = None
    is_active: Optional[bool] = None
    is_qualified: Optional[bool] = None


class LeadResponse(LeadBase):
    """Schema for lead response"""
    id: int
    status: LeadStatusEnum
    lead_score: int
    estimated_roi: Optional[float] = None
    recommended_capacity: Optional[float] = None
    estimated_cost: Optional[float] = None
    is_active: bool
    is_qualified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_contacted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class LeadListResponse(BaseModel):
    """Schema for paginated lead list response"""
    leads: List[LeadResponse]
    total: int
    skip: int
    limit: int


class SolarCalculationRequest(BaseModel):
    """Schema for solar ROI calculation request"""
    stromverbrauch: float = Field(..., gt=0, description="Annual electricity consumption in kWh")
    strompreis: float = Field(0.32, gt=0, description="Electricity price in €/kWh")
    dachflaeche: Optional[float] = Field(None, gt=0, description="Available roof area in m²")
    standort: Optional[str] = Field("Deutschland", description="Location for solar irradiance")


class SolarCalculationResponse(BaseModel):
    """Schema for solar ROI calculation response"""
    recommended_capacity_kwp: float = Field(..., description="Recommended system size in kWp")
    annual_production_kwh: float = Field(..., description="Estimated annual production in kWh")
    eigenverbrauch_kwh: float = Field(..., description="Self-consumption in kWh")
    einspeisung_kwh: float = Field(..., description="Grid feed-in in kWh")
    
    # Financials
    annual_savings_eur: float = Field(..., description="Annual savings from self-consumption")
    annual_feedin_revenue_eur: float = Field(..., description="Annual revenue from feed-in tariff")
    total_annual_benefit_eur: float = Field(..., description="Total annual benefit")
    
    # Costs
    estimated_system_cost_eur: float = Field(..., description="Estimated system cost")
    payback_period_years: float = Field(..., description="Payback period in years")
    roi_20_years_eur: float = Field(..., description="ROI over 20 years")
    
    # Environmental
    co2_saved_kg_per_year: float = Field(..., description="CO2 saved per year in kg")
