"""
Life OS CRM Integration Service
"""

import httpx
import structlog
from typing import Optional, Dict, Any
from datetime import datetime
from app.config import settings
from app.models.lead import Lead

logger = structlog.get_logger()


class LifeOSService:
    """
    Integration with Life OS CRM
    
    Handles lead synchronization, status updates, and data export
    """
    
    def __init__(self):
        self.api_key = settings.LIFEOS_API_KEY
        self.webhook_url = settings.LIFEOS_WEBHOOK_URL
        self.enabled = bool(self.api_key and self.webhook_url)
    
    async def sync_lead(self, lead: Lead) -> Dict[str, Any]:
        """
        Sync lead to Life OS CRM
        
        Args:
            lead: Lead object to sync
        
        Returns:
            Sync result with CRM record ID
        """
        if not self.enabled:
            logger.warning("Life OS integration not configured, skipping sync")
            return {"success": False, "reason": "not_configured"}
        
        lead_data = {
            "external_id": f"solarpro_{lead.id}",
            "name": lead.name,
            "email": lead.email,
            "phone": lead.phone,
            "address": lead.address,
            "city": lead.city,
            "postal_code": lead.postal_code,
            "custom_fields": {
                "stromverbrauch": lead.stromverbrauch,
                "dachflaeche": lead.dachflaeche,
                "dachausrichtung": lead.dachausrichtung,
                "dachneigung": lead.dachneigung,
                "strompreis_aktuell": lead.strompreis_aktuell,
                "interesse": lead.interesse,
                "preferred_contact": lead.preferred_contact,
                "lead_score": lead.lead_score,
                "estimated_roi": lead.estimated_roi,
                "recommended_capacity": lead.recommended_capacity,
                "estimated_cost": lead.estimated_cost,
                "source": lead.source.value if lead.source else "website",
                "status": lead.status.value if lead.status else "new"
            },
            "tags": ["solar", "celaris", f"score_{lead.lead_score}"],
            "notes": lead.notes
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.webhook_url,
                    json=lead_data,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    }
                )
                
                response.raise_for_status()
                result = response.json()
                
                logger.info(
                    "Lead synced to Life OS",
                    lead_id=lead.id,
                    crm_id=result.get("id")
                )
                
                return {
                    "success": True,
                    "crm_id": result.get("id"),
                    "synced_at": datetime.utcnow()
                }
        
        except httpx.HTTPError as e:
            logger.error("Life OS sync failed", error=str(e), response=getattr(e, 'response', None))
            return {
                "success": False,
                "error": str(e)
            }
        
        except Exception as e:
            logger.error("Life OS sync failed unexpectedly", error=str(e))
            return {
                "success": False,
                "error": str(e)
            }
    
    async def update_lead_status(self, lead_id: int, new_status: str, crm_id: Optional[str] = None):
        """
        Update lead status in Life OS CRM
        
        Args:
            lead_id: Internal lead ID
            new_status: New status value
            crm_id: CRM record ID (if known)
        """
        if not self.enabled:
            return
        
        update_data = {
            "external_id": f"solarpro_{lead_id}",
            "crm_id": crm_id,
            "status": new_status,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.patch(
                    f"{self.webhook_url}/status",
                    json=update_data,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    }
                )
                
                response.raise_for_status()
                
                logger.info(
                    "Lead status updated in Life OS",
                    lead_id=lead_id,
                    new_status=new_status
                )
        
        except Exception as e:
            logger.error("Life OS status update failed", error=str(e))
    
    async def get_lead_from_crm(self, crm_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch lead data from Life OS CRM
        
        Args:
            crm_id: CRM record ID
        
        Returns:
            Lead data or None if not found
        """
        if not self.enabled:
            return None
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.webhook_url}/leads/{crm_id}",
                    headers={
                        "Authorization": f"Bearer {self.api_key}"
                    }
                )
                
                if response.status_code == 404:
                    return None
                
                response.raise_for_status()
                return response.json()
        
        except Exception as e:
            logger.error("Failed to fetch lead from Life OS", error=str(e))
            return None
    
    async def export_leads(
        self,
        date_from: Optional[datetime] = None,
        status_filter: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Export leads to Life OS (bulk operation)
        
        Args:
            date_from: Only export leads created after this date
            status_filter: Only export leads with this status
        
        Returns:
            Export summary
        """
        if not self.enabled:
            return {"success": False, "reason": "not_configured"}
        
        # This would be implemented with database queries
        # For now, return placeholder
        return {
            "success": True,
            "exported_count": 0,
            "exported_at": datetime.utcnow()
        }


# Singleton instance
lifeos_service = LifeOSService()
