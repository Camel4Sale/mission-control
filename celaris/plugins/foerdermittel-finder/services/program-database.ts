/**
 * Program Database - Förderprogramme-Datenbank
 */

import { Foerderprogramm } from '../index';

interface SearchCriteria {
  projectType: string;
  region?: string;
  postalCode?: string;
}

export class ProgramDatabase {
  private apiEndpoint?: string;
  private cache: Map<string, { programs: Foerderprogramm[]; expires: number }> = new Map();

  constructor(apiEndpoint?: string) {
    this.apiEndpoint = apiEndpoint;
  }

  async search(criteria: SearchCriteria): Promise<Foerderprogramm[]> {
    const cacheKey = JSON.stringify(criteria);
    const cached = this.get_cached(cacheKey);
    if (cached) return cached;

    let programs: Foerderprogramm[];

    if (this.apiEndpoint) {
      // Externe API verwenden
      programs = await this.fetchFromApi(criteria);
    } else {
      // Lokale Datenbank (Hardcoded für Demo)
      programs = this.getLocalPrograms(criteria);
    }

    this.setCached(cacheKey, programs);
    return programs;
  }

  async getById(programId: string): Promise<Foerderprogramm | null> {
    // Erst im Cache suchen
    for (const [, cached] of this.cache) {
      const found = cached.programs.find((p) => p.id === programId);
      if (found) return found;
    }

    // Von API laden
    if (this.apiEndpoint) {
      const response = await fetch(`${this.apiEndpoint}/programs/${programId}`);
      if (response.ok) {
        return await response.json();
      }
    }

    // Lokal suchen
    return this.getLocalPrograms({ projectType: 'all' }).find((p) => p.id === programId) || null;
  }

  private async fetchFromApi(criteria: SearchCriteria): Promise<Foerderprogramm[]> {
    const response = await fetch(`${this.apiEndpoint}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  }

  private getLocalPrograms(criteria: SearchCriteria): Foerderprogramm[] {
    // Hardcoded Förderprogramme für Demo
    const allPrograms: Foerderprogramm[] = [
      // BAFA
      {
        id: 'bafa-pv-speicher',
        name: 'BAFA PV-Speicher',
        provider: 'BAFA',
        type: 'grant',
        description: 'Förderung von Batteriespeichern für PV-Anlagen',
        amount: 1500,
        conditions: ['PV-Anlage vorhanden', 'Speicher neu installiert'],
        eligibility: { met: true, score: 100, missing: [] },
        deadline: '2026-12-31',
        applicationUrl: 'https://www.bafa.de/pv-speicher',
        documents: ['Angebot', 'Technische Daten', 'Inbetriebnahmeprotokoll'],
        processingTime: '4-6 Wochen',
      },
      {
        id: 'bafa-solarthermie',
        name: 'BAFA Solarthermie',
        provider: 'BAFA',
        type: 'grant',
        description: 'Förderung von Solarthermie-Anlagen',
        amount: 2500,
        conditions: ['Warmwasser oder Heizung', 'Mindestkollektorfläche'],
        eligibility: { met: true, score: 95, missing: [] },
        deadline: '2026-12-31',
        applicationUrl: 'https://www.bafa.de/solarthermie',
        documents: ['Angebot', 'Fachunternehmererklärung'],
        processingTime: '6-8 Wochen',
      },
      // KfW
      {
        id: 'kfw-270',
        name: 'KfW 270 - Erneuerbare Energien',
        provider: 'KfW',
        type: 'loan',
        description: 'Günstiger Kredit für PV-Anlagen',
        amount: 100, // Prozent der Finanzierung
        interestRate: 1.5,
        conditions: ['Investition in EE', 'Bonitätsprüfung'],
        eligibility: { met: true, score: 90, missing: [] },
        applicationUrl: 'https://www.kfw.de/270',
        documents: ['Finanzierungsplan', 'Angebote', 'Bonitätsunterlagen'],
        processingTime: '2-4 Wochen',
      },
      // Landesförderungen (Beispiel BW)
      {
        id: 'bw-solaroffensive',
        name: 'Solaroffensive Baden-Württemberg',
        provider: 'Land',
        type: 'grant',
        description: 'Landesförderung für PV-Anlagen in BW',
        amount: 500,
        region: ['BW'],
        conditions: ['Wohnsitz in BW', 'Erstinstallation'],
        eligibility: { met: criteria.region === 'BW', score: criteria.region === 'BW' ? 100 : 0, missing: [] },
        deadline: '2026-06-30',
        applicationUrl: 'https://www.bw-solaroffensive.de',
        documents: ['Meldebescheinigung', 'Angebot'],
        processingTime: '3-5 Wochen',
      },
      // Kommunale Förderung (Beispiel)
      {
        id: 'kommunal-musterstadt',
        name: 'Klimaschutz-Förderung Musterstadt',
        provider: 'Kommune',
        type: 'grant',
        description: 'Kommunale Förderung für Klimaschutzmaßnahmen',
        amount: 300,
        conditions: ['Wohnsitz in Musterstadt', 'PV-Anlage < 10 kWp'],
        eligibility: { met: criteria.postalCode === '70173', score: criteria.postalCode === '70173' ? 100 : 0, missing: [] },
        deadline: '2026-09-30',
        applicationUrl: 'https://www.musterstadt.de/klima',
        documents: ['Meldebescheinigung', 'Angebot', 'Foto Anlage'],
        processingTime: '2-3 Wochen',
      },
    ];

    // Nach Projekttyp filtern
    if (criteria.projectType !== 'all') {
      const typeMapping: Record<string, string[]> = {
        photovoltaik: ['bafa-pv-speicher', 'kfw-270', 'bw-solaroffensive'],
        solarthermie: ['bafa-solarthermie'],
        speicher: ['bafa-pv-speicher'],
        kombi: ['bafa-pv-speicher', 'bafa-solarthermie', 'kfw-270'],
      };

      const allowedIds = typeMapping[criteria.projectType] || [];
      allPrograms.filter((p) => allowedIds.includes(p.id));
    }

    // Nach Region filtern
    if (criteria.region) {
      allPrograms.filter((p) => !p.region || p.region.includes(criteria.region!));
    }

    return allPrograms;
  }

  private get_cached(key: string): Foerderprogramm[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }
    return cached.programs;
  }

  private setCached(key: string, programs: Foerderprogramm[]): void {
    this.cache.set(key, {
      programs,
      expires: Date.now() + 3600000, // 1 Stunde
    });
  }
}
