/**
 * Deadline Tracker - Fristen-Überwachung
 */

interface Deadline {
  programId: string;
  programName: string;
  deadline: string;
  daysLeft: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  applicationUrl: string;
}

export class DeadlineTracker {
  private deadlines: Map<string, Deadline> = new Map();

  add(programId: string, programName: string, deadline: string, applicationUrl: string): void {
    const daysLeft = Math.floor((new Date(deadline).getTime() - Date.now()) / 86400000);

    if (daysLeft < 0) {
      this.deadlines.delete(programId); // Abgelaufen entfernen
      return;
    }

    const urgency = this.calculateUrgency(daysLeft);

    this.deadlines.set(programId, {
      programId,
      programName,
      deadline,
      daysLeft,
      urgency,
      applicationUrl,
    });
  }

  getUpcoming(days: number = 30): Deadline[] {
    const upcoming: Deadline[] = [];

    for (const deadline of this.deadlines.values()) {
      if (deadline.daysLeft <= days) {
        upcoming.push(deadline);
      }
    }

    return upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
  }

  getUrgent(): Deadline[] {
    return this.getUpcoming(14).filter((d) => d.urgency === 'high' || d.urgency === 'critical');
  }

  calculateUrgency(daysLeft: number): 'low' | 'medium' | 'high' | 'critical' {
    if (daysLeft <= 3) return 'critical';
    if (daysLeft <= 7) return 'high';
    if (daysLeft <= 14) return 'medium';
    return 'low';
  }

  sendReminders(): Array<{ programId: string; message: string }> {
    const reminders: Array<{ programId: string; message: string }> = [];

    for (const deadline of this.getUrgent()) {
      const message = this.generateReminderMessage(deadline);
      reminders.push({ programId: deadline.programId, message });
    }

    return reminders;
  }

  private generateReminderMessage(deadline: Deadline): string {
    const urgencyEmoji = {
      low: '📅',
      medium: '⚠️',
      high: '🚨',
      critical: '🆘',
    };

    return `${urgencyEmoji[deadline.urgency]} Frist-Alarm: ${deadline.programName} läuft in ${deadline.daysLeft} Tagen ab!
    
Jetzt beantragen: ${deadline.applicationUrl}`;
  }

  exportToCalendar(): string {
    // iCal-Format für Kalender-Export
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Celaris//Fördermittel-Finder//DE\n';

    for (const deadline of this.deadlines.values()) {
      ics += 'BEGIN:VEVENT\n';
      ics += `UID:${deadline.programId}@celaris\n`;
      ics += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
      ics += `DTSTART:${deadline.deadline.replace(/-/g, '')}T090000\n`;
      ics += `SUMMARY:Förderfrist: ${deadline.programName}\n`;
      ics += `DESCRIPTION:Frist läuft ab! Jetzt beantragen: ${deadline.applicationUrl}\n`;
      ics += 'END:VEVENT\n';
    }

    ics += 'END:VCALENDAR';
    return ics;
  }
}
