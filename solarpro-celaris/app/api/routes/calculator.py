"""
Solar Calculator API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
import structlog

from app.services.solar_calculator import calculator

logger = structlog.get_logger()
router = APIRouter()


class CalculateRequest(BaseModel):
    """Request model for solar calculation"""
    stromverbrauch: float = Field(..., description="Annual electricity consumption in kWh", ge=500, le=50000)
    strompreis: float = Field(0.32, description="Current electricity price in €/kWh", ge=0.1, le=1.0)
    dachflaeche: Optional[float] = Field(None, description="Available roof area in m²", ge=0, le=1000)
    standort: str = Field("Deutschland", description="Location for solar irradiance adjustment")


class CalculateResponse(BaseModel):
    """Response model for solar calculation"""
    recommended_capacity_kwp: float
    annual_production_kwh: float
    eigenverbrauch_kwh: float
    einspeisung_kwh: float
    self_consumption_rate: float
    system_cost_eur: float
    annual_savings_eur: float
    annual_feedin_revenue_eur: float
    total_annual_benefit_eur: float
    payback_period_years: float
    roi_20_years_eur: float
    co2_saved_kg_per_year: float
    co2_saved_tons_25_years: float


@router.post("/calculate", response_model=CalculateResponse)
async def calculate_solar(request: CalculateRequest):
    """
    Calculate solar system recommendations and ROI
    
    Returns comprehensive analysis including:
    - Recommended system size
    - Annual production estimates
    - Financial projections (savings, revenue, payback)
    - Environmental impact (CO2 savings)
    """
    logger.info(
        "Solar calculation request",
        consumption=request.stromverbrauch,
        price=request.strompreis,
        location=request.standort
    )
    
    try:
        result = calculator.calculate_full_analysis(
            stromverbrauch=request.stromverbrauch,
            strompreis=request.strompreis,
            dachflaeche=request.dachflaeche,
            standort=request.standort
        )
        
        logger.info("Solar calculation completed", result=result)
        
        return CalculateResponse(**result)
    
    except Exception as e:
        logger.error("Solar calculation failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Calculation failed: {str(e)}"
        )


@router.get("/quick-calc")
async def quick_calculate(
    stromverbrauch: float = Query(..., description="Annual consumption in kWh"),
    strompreis: float = Query(0.32, description="Electricity price in €/kWh")
):
    """Quick calculation with minimal parameters"""
    result = calculator.calculate_full_analysis(
        stromverbrauch=stromverbrauch,
        strompreis=strompreis
    )
    
    return {
        "capacity_kwp": result["recommended_capacity_kwp"],
        "annual_savings": result["annual_savings_eur"],
        "payback_years": result["payback_period_years"],
        "roi_20_years": result["roi_20_years_eur"]
    }
