"""
Email Automation API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import Optional, List
import structlog

from app.database import get_db
from app.models.lead import Lead
from app.models.email_log import EmailLog
from app.services.email_service import EmailService

logger = structlog.get_logger()
router = APIRouter()

email_service = EmailService()


class EmailSendRequest(BaseModel):
    """Request model for sending emails"""
    lead_id: int = Field(..., description="ID of the lead")
    template: str = Field(..., description="Email template name")
    custom_data: Optional[dict] = Field(None, description="Custom data for template")
    force_send: bool = Field(False, description="Force send even if already sent")


class EmailResponse(BaseModel):
    """Response model for email operations"""
    success: bool
    message: str
    email_log_id: Optional[int]
    sent_at: Optional[datetime]


@router.post("/send", response_model=EmailResponse)
async def send_email(
    request: EmailSendRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Send automated email to a lead
    
    Templates available:
    - welcome: Initial welcome email after lead submission
    - roi_analysis: Solar ROI analysis results
    - appointment_confirmation: Confirmation for booked appointments
    - follow_up: General follow-up email
    - offer_sent: Email when offer has been sent
    """
    logger.info(
        "Email send request",
        lead_id=request.lead_id,
        template=request.template
    )
    
    # Verify lead exists
    result = await db.execute(
        select(Lead).where(Lead.id == request.lead_id)
    )
    lead = result.scalar_one_or_none()
    
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check if already sent (unless force_send)
    if not request.force_send:
        existing_query = await db.execute(
            select(EmailLog).where(
                EmailLog.lead_id == request.lead_id,
                EmailLog.template == request.template,
                EmailLog.status == "sent"
            )
        )
        existing = existing_query.scalars().first()
        
        if existing:
            logger.warning("Duplicate email attempt", lead_id=request.lead_id, template=request.template)
            return EmailResponse(
                success=False,
                message="Email with this template already sent to this lead",
                email_log_id=existing.id,
                sent_at=existing.sent_at
            )
    
    # Send email
    try:
        email_result = await email_service.send_template_email(
            lead=lead,
            template=request.template,
            custom_data=request.custom_data
        )
        
        # Log email
        email_log = EmailLog(
            lead_id=request.lead_id,
            recipient=lead.email,
            template=request.template,
            subject=email_result["subject"],
            status="sent",
            sent_at=datetime.utcnow(),
            metadata=email_result.get("metadata", {})
        )
        
        db.add(email_log)
        await db.commit()
        await db.refresh(email_log)
        
        logger.info("Email sent successfully", lead_id=request.lead_id, template=request.template)
        
        return EmailResponse(
            success=True,
            message="Email sent successfully",
            email_log_id=email_log.id,
            sent_at=email_log.sent_at
        )
    
    except Exception as e:
        logger.error("Email send failed", error=str(e))
        
        # Log failure
        email_log = EmailLog(
            lead_id=request.lead_id,
            recipient=lead.email,
            template=request.template,
            subject="",
            status="failed",
            error_message=str(e),
            sent_at=datetime.utcnow()
        )
        
        db.add(email_log)
        await db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )


@router.get("/logs")
async def list_email_logs(
    lead_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    template: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List email logs with optional filtering"""
    query = select(EmailLog)
    
    if lead_id:
        query = query.where(EmailLog.lead_id == lead_id)
    if status_filter:
        query = query.where(EmailLog.status == status_filter)
    if template:
        query = query.where(EmailLog.template == template)
    
    query = query.order_by(EmailLog.sent_at.desc())
    result = await db.execute(query)
    logs = result.scalars().all()
    
    return [
        {
            "id": log.id,
            "lead_id": log.lead_id,
            "recipient": log.recipient,
            "template": log.template,
            "subject": log.subject,
            "status": log.status,
            "sent_at": log.sent_at.isoformat() if log.sent_at else None
        }
        for log in logs
    ]


@router.get("/templates")
async def list_templates():
    """List available email templates"""
    return {
        "templates": [
            {
                "name": "welcome",
                "description": "Willkommens-E-Mail nach Lead-Einreichung",
                "subject": "Vielen Dank für Ihre Anfrage - SolarProCelaris"
            },
            {
                "name": "roi_analysis",
                "description": "Solar ROI Analyse Ergebnisse",
                "subject": "Ihre persönliche Solar-Analyse"
            },
            {
                "name": "appointment_confirmation",
                "description": "Terminbestätigung",
                "subject": "Ihr Termin mit Celaris Solar"
            },
            {
                "name": "follow_up",
                "description": "Allgemeine Follow-up E-Mail",
                "subject": "Kurze Nachfrage von Celaris Solar"
            },
            {
                "name": "offer_sent",
                "description": "E-Mail bei Angebotsversand",
                "subject": "Ihr persönliches Solar-Angebot"
            }
        ]
    }
