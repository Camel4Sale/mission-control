/**
 * Application Assistant - Antrags-Assistent
 */

import { Foerderprogramm, ApplicationData } from '../index';

interface ApplicationState {
  program: Foerderprogramm;
  data: ApplicationData;
  status: 'draft' | 'in_progress' | 'ready' | 'submitted';
  completedSteps: string[];
  missingDocuments: string[];
  createdAt: string;
  updatedAt: string;
}

export class ApplicationAssistant {
  private applications: Map<string, ApplicationState> = new Map();

  create(program: Foerderprogramm, data: ApplicationData): ApplicationAssistant {
    const appId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const state: ApplicationState = {
      program,
      data,
      status: 'draft',
      completedSteps: [],
      missingDocuments: [...program.documents],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.applications.set(appId, state);
    return this;
  }

  getSteps(program: Foerderprogramm): Array<{
    id: string;
    title: string;
    description: string;
    required: boolean;
    completed: boolean;
  }> {
    return [
      {
        id: 'documents',
        title: 'Dokumente vorbereiten',
        description: `Benötigt: ${program.documents.join(', ')}`,
        required: true,
        completed: false,
      },
      {
        id: 'form',
        title: 'Antragsformular ausfüllen',
        description: 'Online-Formular auf der Förderportal-Website',
        required: true,
        completed: false,
      },
      {
        id: 'upload',
        title: 'Dokumente hochladen',
        description: 'Alle erforderlichen Unterlagen digital einreichen',
        required: true,
        completed: false,
      },
      {
        id: 'review',
        title: 'Antrag prüfen',
        description: 'Alle Angaben vor Absendung kontrollieren',
        required: true,
        completed: false,
      },
      {
        id: 'submit',
        title: 'Antrag einreichen',
        description: 'Absenden und Bestätigung speichern',
        required: true,
        completed: false,
      },
    ];
  }

  generateForm(program: Foerderprogramm, data: ApplicationData): Record<string, any> {
    // Antragsformular generieren
    return {
      applicant: {
        name: data.applicant.name,
        address: data.applicant.address,
        email: data.applicant.email,
        phone: data.applicant.phone,
      },
      project: {
        type: data.system.type,
        size: data.system.kwp,
        storage: data.system.storage,
        manufacturer: data.system.manufacturer,
        installationDate: data.system.installationDate,
      },
      funding: {
        programId: program.id,
        requestedAmount: program.amount,
        investmentTotal: 0, // Müsste berechnet werden
      },
      declarations: {
        accuracy: false, // Muss vom Nutzer bestätigt werden
        dataProtection: false,
      },
    };
  }

  validateApplication(data: ApplicationData): Array<{ field: string; error: string }> {
    const errors: Array<{ field: string; error: string }> = [];

    if (!data.applicant.name) {
      errors.push({ field: 'applicant.name', error: 'Name ist erforderlich' });
    }

    if (!data.applicant.email || !data.applicant.email.includes('@')) {
      errors.push({ field: 'applicant.email', error: 'Gültige E-Mail erforderlich' });
    }

    if (!data.system.type) {
      errors.push({ field: 'system.type', error: 'Anlagentyp ist erforderlich' });
    }

    return errors;
  }

  async submit(applicationId: string): Promise<{ success: boolean; confirmationId?: string }> {
    const app = this.applications.get(applicationId);
    if (!app) {
      return { success: false };
    }

    // Validierung
    const errors = this.validateApplication(app.data);
    if (errors.length > 0) {
      return { success: false };
    }

    // In Produktion: API Call an Förderportal
    // Hier: Simulation
    const confirmationId = `CONF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    app.status = 'submitted';
    app.updatedAt = new Date().toISOString();

    return {
      success: true,
      confirmationId,
    };
  }

  getStatus(applicationId: string): ApplicationState | null {
    return this.applications.get(applicationId) || null;
  }

  getChecklist(program: Foerderprogramm): Array<{
    item: string;
    category: 'document' | 'info' | 'declaration';
    completed: boolean;
  }> {
    return [
      ...program.documents.map((doc) => ({
        item: doc,
        category: 'document' as const,
        completed: false,
      })),
      {
        item: 'Personalausweis/Reisepass',
        category: 'document' as const,
        completed: false,
      },
      {
        item: 'Grundbuchauszug oder Eigentumsnachweis',
        category: 'document' as const,
        completed: false,
      },
      {
        item: 'Anlagen- und Speichertechnische Daten',
        category: 'info' as const,
        completed: false,
      },
      {
        item: 'Inbetriebnahmeprotokoll',
        category: 'document' as const,
        completed: false,
      },
      {
        item: 'Richtigkeit der Angaben bestätigen',
        category: 'declaration' as const,
        completed: false,
      },
      {
        item: 'Datenschutzbestimmungen akzeptieren',
        category: 'declaration' as const,
        completed: false,
      },
    ];
  }
}
