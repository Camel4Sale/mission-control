/**
 * Fördermittel-Finder - Automatisierte Förderungssuche
 * © 2026 Celaris
 */

import { ProgramDatabase } from './services/program-database';
import { EligibilityChecker } from './services/eligibility-checker';
import { ApplicationAssistant } from './services/application-assistant';
import { DeadlineTracker } from './services/deadline-tracker';

export interface FoerdermittelConfig {
  region: string; // BW, BY, NRW, etc.
  postalCode: string;
  apiEndpoint?: string;
}

export interface SearchOptions {
  projectType: 'photovoltaik' | 'solarthermie' | 'speicher' | 'kombi';
  investmentAmount: number; // €
  roofArea?: number; // m²
  systemSize?: number; // kWp
  storageSize?: number; // kWh
  buildingType?: 'einfamilienhaus' | 'mehrfamilienhaus' | 'gewerbe';
  constructionYear?: number;
}

export interface Foerderprogramm {
  id: string;
  name: string;
  provider: 'BAFA' | 'KfW' | 'Land' | 'Kommune';
  type: 'grant' | 'loan' | 'tax_credit';
  description: string;
  amount: number; // € oder Prozent
  maxAmount?: number; // €
  interestRate?: number; // % bei Krediten
  conditions: string[];
  eligibility: {
    met: boolean;
    score: number; // 0-100
    missing: string[];
  };
  deadline?: string; // ISO date
  applicationUrl: string;
  documents: string[];
  processingTime: string;
  region?: string[]; // Für regionale Förderungen
}

export interface FoerdermittelResult {
  totalPotential: number; // €
  programs: Foerderprogramm[];
  recommended: Foerderprogramm[];
  applicationDeadline?: string;
  nextSteps: string[];
  summary: {
    grants: number; // €
    loans: number; // €
    taxCredits: number; // €
  };
}

export interface ApplicationData {
  applicant: {
    name: string;
    address: string;
    email: string;
    phone?: string;
  };
  system: {
    kwp?: number;
    storage?: number; // kWh
    type: string;
    manufacturer?: string;
    installationDate?: string;
  };
  documents: Array<{
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}

export class FoerdermittelFinder {
  private programDb: ProgramDatabase;
  private eligibilityChecker: EligibilityChecker;
  private applicationAssistant: ApplicationAssistant;
  private deadlineTracker: DeadlineTracker;
  private region: string;
  private postalCode: string;

  constructor(config: FoerdermittelConfig) {
    this.region = config.region;
    this.postalCode = config.postalCode;
    this.programDb = new ProgramDatabase(config.apiEndpoint);
    this.eligibilityChecker = new EligibilityChecker();
    this.applicationAssistant = new ApplicationAssistant();
    this.deadlineTracker = new DeadlineTracker();
  }

  async find(options: SearchOptions): Promise<FoerdermittelResult> {
    // 1. Alle relevanten Programme laden
    const allPrograms = await this.programDb.search({
      projectType: options.projectType,
      region: this.region,
      postalCode: this.postalCode,
    });

    // 2. Eligibility prüfen
    const programsWithEligibility = allPrograms.map((program) => ({
      ...program,
      eligibility: this.eligibilityChecker.check(program, options),
    }));

    // 3. Nur förderfähige Programme filtern
    const eligiblePrograms = programsWithEligibility.filter((p) => p.eligibility.met);

    // 4. Sortieren nach Score und Frist
    eligiblePrograms.sort((a, b) => {
      if (a.eligibility.score !== b.eligibility.score) {
        return b.eligibility.score - a.eligibility.score;
      }
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return b.amount - a.amount;
    });

    // 5. Gesamtpotenzial berechnen
    const totalPotential = eligiblePrograms.reduce((sum, p) => {
      if (p.type === 'grant') return sum + p.amount;
      return sum;
    }, 0);

    // 6. Empfehlungen identifizieren
    const recommended = this.selectRecommended(eligiblePrograms, options);

    // 7. Nächste Schritte generieren
    const nextSteps = this.generateNextSteps(recommended);

    // 8. Nächste Frist finden
    const applicationDeadline = this.findNearestDeadline(recommended);

    return {
      totalPotential,
      programs: eligiblePrograms,
      recommended,
      applicationDeadline,
      nextSteps,
      summary: {
        grants: eligiblePrograms.filter((p) => p.type === 'grant').reduce((s, p) => s + p.amount, 0),
        loans: eligiblePrograms.filter((p) => p.type === 'loan').length,
        taxCredits: eligiblePrograms.filter((p) => p.type === 'tax_credit').reduce((s, p) => s + p.amount, 0),
      },
    };
  }

  async createApplication(programId: string, data: ApplicationData): Promise<ApplicationAssistant> {
    const program = await this.programDb.getById(programId);
    if (!program) {
      throw new Error(`Programm ${programId} nicht gefunden`);
    }

    return this.applicationAssistant.create(program, data);
  }

  async getProgramDetails(programId: string): Promise<Foerderprogramm> {
    return await this.programDb.getById(programId);
  }

  async checkEligibility(programId: string, options: SearchOptions): Promise<Foerderprogramm['eligibility']> {
    const program = await this.programDb.getById(programId);
    if (!program) {
      throw new Error(`Programm ${programId} nicht gefunden`);
    }
    return this.eligibilityChecker.check(program, options);
  }

  getDeadlines(): Array<{ programId: string; deadline: string; daysLeft: number }> {
    return this.deadlineTracker.getUpcoming(30); // Nächste 30 Tage
  }

  private selectRecommended(programs: Foerderprogramm[], options: SearchOptions): Foerderprogramm[] {
    // Strategie: Beste Kombination finden (nicht doppelte Förderungen)
    const recommended: Foerderprogramm[] = [];
    const usedCategories = new Set<string>();

    for (const program of programs) {
      // Prüfen ob kompatibel mit bereits ausgewählten
      const isCompatible = !program.conditions.some((c) => usedCategories.has(c));

      if (isCompatible) {
        recommended.push(program);
        program.conditions.forEach((c) => usedCategories.add(c));
      }

      if (recommended.length >= 5) break; // Max 5 Empfehlungen
    }

    return recommended;
  }

  private generateNextSteps(programs: Foerderprogramm[]): string[] {
    const steps: string[] = [];

    if (programs.length === 0) {
      return ['Keine Förderungen verfügbar - prüfen Sie alternative Optionen'];
    }

    steps.push(`1. ${programs[0].name} priorisieren (höchste Förderung)`);

    if (programs[0].documents.length > 0) {
      steps.push(`2. Dokumente vorbereiten: ${programs[0].documents.join(', ')}`);
    }

    if (programs[0].deadline) {
      const daysLeft = Math.floor((new Date(programs[0].deadline!).getTime() - Date.now()) / 86400000);
      steps.push(`3. Antrag bis ${programs[0].deadline} einreichen (${daysLeft} Tage verbleibend)`);
    }

    if (programs.length > 1) {
      steps.push(`4. Nach Erstantrag weitere Förderungen prüfen (${programs.length - 1} verfügbar)`);
    }

    return steps;
  }

  private findNearestDeadline(programs: Foerderprogramm[]): string | undefined {
    const deadlines = programs.filter((p) => p.deadline).map((p) => p.deadline!);
    if (deadlines.length === 0) return undefined;

    return deadlines.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
  }
}

export { ProgramDatabase } from './services/program-database';
export { EligibilityChecker } from './services/eligibility-checker';
export { ApplicationAssistant } from './services/application-assistant';
export { DeadlineTracker } from './services/deadline-tracker';
