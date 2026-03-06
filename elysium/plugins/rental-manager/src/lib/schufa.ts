import { TenantScreening, SchufaDetails, RiskFactor } from '@/types';

export interface SchufaApiConfig {
  apiKey: string;
  baseUrl: string;
}

export class SchufaService {
  private config: SchufaApiConfig | null = null;

  constructor(config?: SchufaApiConfig) {
    if (config) {
      this.config = config;
    }
  }

  /**
   * SCHUFA Bonitätsprüfung durchführen
   * Hinweis: Dies ist eine Mock-Implementierung. In Produktion muss die echte SCHUFA API verwendet werden.
   */
  async checkCreditScore(
    tenantId: string,
    consent: boolean
  ): Promise<{ score: number; details: SchufaDetails } | null> {
    if (!consent) {
      throw new Error('Einwilligung des Mieters erforderlich');
    }

    if (!this.config) {
      // Mock-Daten für Entwicklung
      return this.getMockSchufaData();
    }

    try {
      // Echte SCHUFA API Anfrage
      // const response = await fetch(`${this.config.baseUrl}/bonitaetscheck`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.config.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ tenantId }),
      // });
      // return await response.json();

      return this.getMockSchufaData();
    } catch (error) {
      console.error('SCHUFA API Fehler:', error);
      return null;
    }
  }

  private getMockSchufaData(): { score: number; details: SchufaDetails } {
    // Zufällige aber realistische SCHUFA Daten für Tests
    const score = Math.floor(Math.random() * 40) + 60; // 60-99

    return {
      score,
      scoreDate: new Date().toISOString().split('T')[0],
      negativeEntries: Math.floor(Math.random() * 3),
      creditCards: Math.floor(Math.random() * 5),
      loans: Math.floor(Math.random() * 3),
      mobileContracts: Math.floor(Math.random() * 3),
      addressChanges: Math.floor(Math.random() * 5),
    };
  }

  /**
   * Risikobewertung erstellen
   */
  assessRisk(
    schufaScore: number | undefined,
    monthlyIncome: number | undefined,
    rentAmount: number
  ): {
    level: 'green' | 'yellow' | 'red';
    factors: RiskFactor[];
  } {
    const factors: RiskFactor[] = [];
    let riskScore = 0;

    // SCHUFA Score bewerten
    if (schufaScore !== undefined) {
      if (schufaScore < 70) {
        factors.push({
          type: 'schufa',
          severity: 'high',
          description: `Niedriger SCHUFA-Score (${schufaScore})`,
        });
        riskScore += 3;
      } else if (schufaScore < 85) {
        factors.push({
          type: 'schufa',
          severity: 'medium',
          description: `Mittlerer SCHUFA-Score (${schufaScore})`,
        });
        riskScore += 1;
      } else {
        factors.push({
          type: 'schufa',
          severity: 'low',
          description: `Guter SCHUFA-Score (${schufaScore})`,
        });
      }
    } else {
      factors.push({
        type: 'schufa',
        severity: 'medium',
        description: 'Keine SCHUFA-Auskunft verfügbar',
      });
      riskScore += 2;
    }

    // Einkommen bewerten
    if (monthlyIncome !== undefined) {
      const rentToIncomeRatio = rentAmount / monthlyIncome;

      if (rentToIncomeRatio > 0.5) {
        factors.push({
          type: 'income',
          severity: 'high',
          description: `Miete beträgt ${Math.round(rentToIncomeRatio * 100)}% des Einkommens`,
        });
        riskScore += 3;
      } else if (rentToIncomeRatio > 0.35) {
        factors.push({
          type: 'income',
          severity: 'medium',
          description: `Miete beträgt ${Math.round(rentToIncomeRatio * 100)}% des Einkommens`,
        });
        riskScore += 1;
      } else {
        factors.push({
          type: 'income',
          severity: 'low',
          description: `Miete beträgt ${Math.round(rentToIncomeRatio * 100)}% des Einkommens (akzeptabel)`,
        });
      }
    } else {
      factors.push({
        type: 'income',
        severity: 'medium',
        description: 'Keine Einkommensnachweise verfügbar',
      });
      riskScore += 2;
    }

    // Gesamtrisikobewertung
    let level: 'green' | 'yellow' | 'red' = 'green';
    if (riskScore >= 5) {
      level = 'red';
    } else if (riskScore >= 2) {
      level = 'yellow';
    }

    return { level, factors };
  }

  /**
   * Vorvermieter-Kontakt Template erstellen
   */
  generatePreviousLandlordEmail(
    tenantName: string,
    rentalPeriod: { start: string; end: string }
  ): string {
    return `Sehr geehrte Damen und Herren,

wir prüfen derzeit die Mietbewerbung von ${tenantName}, die/der von ${rentalPeriod.start} bis ${rentalPeriod.end} bei Ihnen zur Miete gewohnt hat.

Würden Sie uns bitte folgende Fragen beantworten:

1. Wie war das Zahlungsverhalten (pünktlich, gelegentliche Verzögerungen, häufige Mahnungen)?
2. Wie war der Zustand der Wohnung bei Auszug?
3. Gab es Beschwerden von Nachbarn?
4. Würden Sie den/die Mieter(in) erneut aufnehmen?
5. Gibt es noch offene Forderungen?

Ihre Auskunft hilft uns bei der Entscheidungsfindung. Selbstverständlich behandeln wir Ihre Angaben vertraulich.

Für Rückfragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,
Ihre Hausverwaltung`;
  }

  /**
   * Einkommensnachweis prüfen
   */
  verifyIncome(
    documents: Array<{ type: string; amount: number }>,
    requiredIncome: number
  ): {
    verified: boolean;
    monthlyIncome: number;
    confidence: 'high' | 'medium' | 'low';
  } {
    if (!documents || documents.length === 0) {
      return {
        verified: false,
        monthlyIncome: 0,
        confidence: 'low',
      };
    }

    // Durchschnittliches monatliches Einkommen berechnen
    const totalIncome = documents.reduce((sum, doc) => sum + doc.amount, 0);
    const avgMonthlyIncome = totalIncome / documents.length;

    // Confidence basierend auf Dokumententypen
    const hasSalaryStatements = documents.some(
      (d) => d.type === 'gehaltsabrechnung'
    );
    const hasTaxReturn = documents.some((d) => d.type === 'steuerbescheid');
    const hasEmploymentContract = documents.some(
      (d) => d.type === 'arbeitsvertrag'
    );

    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (hasSalaryStatements && hasEmploymentContract) {
      confidence = 'high';
    } else if (hasSalaryStatements || hasTaxReturn) {
      confidence = 'medium';
    }

    return {
      verified: avgMonthlyIncome >= requiredIncome,
      monthlyIncome: avgMonthlyIncome,
      confidence,
    };
  }

  /**
   * Komplettes Screening durchführen
   */
  async performFullScreening(
    tenantId: string,
    tenantData: {
      name: string;
      monthlyIncome?: number;
      rentAmount: number;
      previousLandlord?: { name: string; contact: string };
      incomeDocuments?: Array<{ type: string; amount: number }>;
    },
    consentGiven: boolean
  ): Promise<TenantScreening> {
    // SCHUFA Check
    const schufaResult = await this.checkCreditScore(tenantId, consentGiven);

    // Einkommen prüfen
    const incomeVerification = tenantData.incomeDocuments
      ? this.verifyIncome(
          tenantData.incomeDocuments,
          tenantData.rentAmount * 3 // 3x Miete als Richtwert
        )
      : { verified: false, monthlyIncome: 0, confidence: 'low' as const };

    // Risikobewertung
    const riskAssessment = this.assessRisk(
      schufaResult?.score,
      incomeVerification.monthlyIncome,
      tenantData.rentAmount
    );

    return {
      id: crypto.randomUUID(),
      tenantId,
      schufaScore: schufaResult?.score,
      schufaDetails: schufaResult?.details,
      incomeVerified: incomeVerification.verified,
      incomeDocuments: [],
      previousLandlordContacted: !!tenantData.previousLandlord,
      previousLandlordResponse: undefined,
      riskAssessment,
      consentGiven,
      consentDate: consentGiven ? new Date() : undefined,
      createdAt: new Date(),
    };
  }
}
