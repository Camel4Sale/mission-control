"""
Solar Calculator Service - ROI and System Sizing Calculations
"""

from typing import Optional
import structlog
from app.config import settings

logger = structlog.get_logger()


class SolarCalculator:
    """
    Solar system calculator for ROI, sizing, and financial projections
    
    Based on German market conditions (EEG 2024)
    """
    
    # Constants for German market
    SOLAR_IRRADIANCE_DE = 950  # kWh/kWp per year (Germany average)
    EINSPEISEVERGUETUNG = 0.08  # €/kWh (EEG feed-in tariff 2024)
    ANLAGENKOSTEN_PRO_KWP = settings.DEFAULT_ANLAGENKOSTEN_PRO_KWP  # €/kWp
    DEGRADATION_RATE = 0.005  # 0.5% per year
    SYSTEM_LIFETIME = 25  # years
    
    # Typical system sizes
    MIN_SYSTEM_SIZE = 2.0  # kWp (balcony power plant)
    MAX_SYSTEM_SIZE = 30.0  # kWp (residential limit for simplified rules)
    
    def __init__(self):
        self.strompreis = settings.DEFAULT_STROMPREIS
        self.einspeiseverguetung = self.EINSPEISEVERGUETUNG
        self.anlagenkosten_pro_kwp = self.ANLAGENKOSTEN_PRO_KWP
    
    def calculate_recommended_capacity(
        self,
        stromverbrauch: float,
        dachflaeche: Optional[float] = None
    ) -> float:
        """
        Calculate recommended system size based on consumption and roof area
        
        Args:
            stromverbrauch: Annual electricity consumption in kWh
            dachflaeche: Available roof area in m² (optional)
        
        Returns:
            Recommended system size in kWp
        """
        # Rule of thumb: 1 kWp produces ~950 kWh/year in Germany
        # Aim for 30-40% self-consumption without battery
        base_capacity = stromverbrauch / self.SOLAR_IRRADIANCE_DE
        
        # Adjust for typical self-consumption rate (30%)
        # We want the system to cover about 30% of consumption directly
        recommended_capacity = base_capacity * 0.8  # Slightly undersize for better economics
        
        # Check roof area constraint (1 kWp needs ~6-7 m²)
        if dachflaeche:
            max_capacity_from_roof = dachflaeche / 7.0
            recommended_capacity = min(recommended_capacity, max_capacity_from_roof)
        
        # Apply limits
        recommended_capacity = max(self.MIN_SYSTEM_SIZE, recommended_capacity)
        recommended_capacity = min(self.MAX_SYSTEM_SIZE, recommended_capacity)
        
        # Round to nearest 0.5 kWp
        recommended_capacity = round(recommended_capacity * 2) / 2
        
        logger.debug(
            "Calculated recommended capacity",
            consumption=stromverbrauch,
            roof_area=dachflaeche,
            recommended_kwp=recommended_capacity
        )
        
        return recommended_capacity
    
    def calculate_annual_production(self, capacity_kwp: float) -> float:
        """Calculate annual electricity production in kWh"""
        return capacity_kwp * self.SOLAR_IRRADIANCE_DE
    
    def calculate_self_consumption(
        self,
        production: float,
        consumption: float,
        with_battery: bool = False
    ) -> tuple[float, float]:
        """
        Calculate self-consumption and grid feed-in
        
        Returns:
            Tuple of (eigenverbrauch_kwh, einspeisung_kwh)
        """
        # Without battery: ~30% self-consumption
        # With battery: ~60-70% self-consumption
        self_consumption_rate = 0.60 if with_battery else 0.30
        
        # Self-consumption is limited by both production and consumption
        eigenverbrauch = min(
            production * self_consumption_rate,
            consumption
        )
        
        # Rest is fed into grid
        einspeisung = production - eigenverbrauch
        
        return eigenverbrauch, einspeisung
    
    def calculate_financials(
        self,
        eigenverbrauch_kwh: float,
        einspeisung_kwh: float,
        system_cost: float,
        strompreis: Optional[float] = None
    ) -> dict:
        """
        Calculate financial metrics
        
        Returns:
            Dictionary with annual savings, revenue, payback period, etc.
        """
        strompreis = strompreis or self.strompreis
        
        # Annual savings from self-consumption
        annual_savings = eigenverbrauch_kwh * strompreis
        
        # Annual revenue from feed-in tariff (20 years guaranteed)
        annual_feedin_revenue = einspeisung_kwh * self.einspeiseverguetung
        
        # Total annual benefit
        total_annual_benefit = annual_savings + annual_feedin_revenue
        
        # Simple payback period
        payback_years = system_cost / total_annual_benefit if total_annual_benefit > 0 else float('inf')
        
        # ROI over 20 years (feed-in tariff guaranteed for 20 years)
        # Assume 2% annual electricity price increase
        electricity_price_increase = 0.02
        total_savings_20_years = 0
        
        for year in range(1, 21):
            year_savings = annual_savings * ((1 + electricity_price_increase) ** year)
            total_savings_20_years += year_savings
        
        # Feed-in revenue (fixed rate for 20 years)
        total_feedin_20_years = annual_feedin_revenue * 20
        
        # Total benefit over 20 years
        total_benefit_20_years = total_savings_20_years + total_feedin_20_years
        
        # Net ROI
        roi_20_years = total_benefit_20_years - system_cost
        
        return {
            "annual_savings_eur": round(annual_savings, 2),
            "annual_feedin_revenue_eur": round(annual_feedin_revenue, 2),
            "total_annual_benefit_eur": round(total_annual_benefit, 2),
            "payback_period_years": round(payback_years, 1),
            "roi_20_years_eur": round(roi_20_years, 2),
            "total_savings_20_years_eur": round(total_savings_20_years, 2),
            "total_feedin_20_years_eur": round(total_feedin_20_years, 2)
        }
    
    def calculate_environmental_impact(self, production_kwh: float) -> dict:
        """
        Calculate environmental impact (CO2 savings)
        
        German electricity mix: ~400g CO2/kWh (2024)
        Solar: ~40g CO2/kWh (lifecycle)
        Savings: ~360g CO2/kWh
        """
        co2_factor_grid = 0.400  # kg CO2/kWh (German grid mix)
        co2_factor_solar = 0.040  # kg CO2/kWh (solar lifecycle)
        co2_savings = production_kwh * (co2_factor_grid - co2_factor_solar)
        
        return {
            "co2_saved_kg_per_year": round(co2_savings, 1),
            "co2_saved_tons_25_years": round(co2_savings * 25 / 1000, 1),
            "trees_equivalent": round(co2_savings * 25 / 25, 0)  # 1 tree absorbs ~25 kg CO2/year
        }
    
    def calculate_full_analysis(
        self,
        stromverbrauch: float,
        strompreis: float,
        dachflaeche: Optional[float] = None,
        standort: str = "Deutschland"
    ) -> dict:
        """
        Complete solar analysis with all metrics
        
        Args:
            stromverbrauch: Annual consumption in kWh
            strompreis: Current electricity price in €/kWh
            dachflaeche: Available roof area in m² (optional)
            standort: Location (for future solar irradiance adjustments)
        
        Returns:
            Complete analysis dictionary
        """
        logger.info(
            "Performing solar analysis",
            consumption=stromverbrauch,
            price=strompreis,
            location=standort
        )
        
        # Calculate recommended capacity
        capacity_kwp = self.calculate_recommended_capacity(stromverbrauch, dachflaeche)
        
        # Calculate production
        annual_production = self.calculate_annual_production(capacity_kwp)
        
        # Calculate self-consumption
        eigenverbrauch, einspeisung = self.calculate_self_consumption(
            annual_production, stromverbrauch
        )
        
        # Calculate system cost
        system_cost = capacity_kwp * self.anlagenkosten_pro_kwp
        
        # Calculate financials
        financials = self.calculate_financials(
            eigenverbrauch, einspeisung, system_cost, strompreis
        )
        
        # Calculate environmental impact
        environmental = self.calculate_environmental_impact(annual_production)
        
        result = {
            "recommended_capacity_kwp": round(capacity_kwp, 1),
            "annual_production_kwh": round(annual_production, 0),
            "eigenverbrauch_kwh": round(eigenverbrauch, 0),
            "einspeisung_kwh": round(einspeisung, 0),
            "self_consumption_rate": round(eigenverbrauch / annual_production * 100, 1),
            "system_cost_eur": round(system_cost, 0),
            **financials,
            **environmental
        }
        
        logger.info("Solar analysis complete", result=result)
        
        return result


# Singleton instance
calculator = SolarCalculator()
