"""
Email Log Model - Track Email Communications
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class EmailLog(Base):
    """Email log model for tracking all email communications"""
    
    __tablename__ = "email_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False, index=True)
    
    # Email Details
    email_type = Column(String(100))  # e.g., "welcome", "follow_up", "offer"
    template_name = Column(String(100))
    subject = Column(String(500), nullable=False)
    
    # Recipients
    recipient_email = Column(String(255), nullable=False)
    recipient_name = Column(String(255))
    cc_emails = Column(Text)  # Comma-separated
    bcc_emails = Column(Text)  # Comma-separated
    
    # Content
    body_html = Column(Text)
    body_text = Column(Text)
    
    # Status
    status = Column(String(50), default="pending")  # pending, sent, delivered, failed, opened, clicked
    sent_at = Column(DateTime(timezone=True))
    delivered_at = Column(DateTime(timezone=True))
    opened_at = Column(DateTime(timezone=True))
    clicked_at = Column(DateTime(timezone=True))
    
    # Error Handling
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # Metadata
    metadata = Column(JSON, default=dict)
    tracking_id = Column(String(100), index=True)  # For email service tracking
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    lead = relationship("Lead", back_populates="emails")
    
    def __repr__(self):
        return f"<EmailLog(id={self.id}, lead_id={self.lead_id}, type='{self.email_type}', status='{self.status}')>"
    
    def can_retry(self) -> bool:
        """Check if email can be retried"""
        return self.retry_count < self.max_retries and self.status == "failed"
