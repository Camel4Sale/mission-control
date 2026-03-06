/**
 * Eligibility Checker - Förderfähigkeits-Prüfung
 */

import { Foerderprogramm, SearchOptions } from '../index';

export class EligibilityChecker {
  check(program: Foerderprogramm, options: SearchOptions): Foerderprogramm['eligibility'] {
    const missing: string[] = [];
    let score = 100;

    // 1. Projekttyp prüfen
    if (!this.checkProjectType(program, options.projectType)) {
      missing.push('Projekttyp nicht passend');
      score -= 50;
    }

    // 2. Regionale Anforderungen prüfen
    if (program.region && !program.region.includes('ALL')) {
      // Regionale Beschränkung - wird im Kontext geprüft
    }

    // 3. Investitionshöhe prüfen
    if (program.maxAmount && options.investmentAmount < program.maxAmount * 0.5) {
      missing.push('Investition zu niedrig für maximale Förderung');
      score -= 20;
    }

    // 4. Spezifische Bedingungen prüfen
    for (const condition of program.conditions) {
      if (!this.checkCondition(condition, options)) {
        missing.push(condition);
        score -= 15;
      }
    }

    // 5. Frist prüfen
    if (program.deadline) {
      const daysLeft = Math.floor((new Date(program.deadline).getTime() - Date.now()) / 86400000);
      if (daysLeft < 0) {
        missing.push('Frist abgelaufen');
        score = 0;
      } else if (daysLeft < 14) {
        missing.push('Frist läuft bald ab');
        score -= 30;
      }
    }

    return {
      met: score >= 70,
      score: Math.max(0, score),
      missing,
    };
  }

  private checkProjectType(program: Foerderprogramm, projectType: string): boolean {
    const programTypeMapping: Record<string, string[]> = {
      'bafa-pv-speicher': ['photovoltaik', 'speicher', 'kombi'],
      'bafa-solarthermie': ['solarthermie', 'kombi'],
      'kfw-270': ['photovoltaik', 'solarthermie', 'speicher'],
      'bw-solaroffensive': ['photovoltaik'],
      'kommunal-musterstadt': ['photovoltaik'],
    };

    const allowedTypes = programTypeMapping[program.id] || ['all'];
    return allowedTypes.includes('all') || allowedTypes.includes(projectType);
  }

  private checkCondition(condition: string, options: SearchOptions): boolean {
    const conditionLower = condition.toLowerCase();

    // PV-Anlage vorhanden
    if (conditionLower.includes('pv-anlage')) {
      return options.projectType === 'photovoltaik' || options.projectType === 'kombi';
    }

    // Speicher neu installiert
    if (conditionLower.includes('speicher')) {
      return options.storageSize !== undefined && options.storageSize > 0;
    }

    // Mindestkollektorfläche
    if (conditionLower.includes('kollektorfläche')) {
      return (options.roofArea || 0) >= 10;
    }

    // Wohnsitz in Region (wird im Kontext geprüft)
    if (conditionLower.includes('wohnsitz')) {
      return true; // Wird über Region-Parameter validiert
    }

    // Erstinstallation
    if (conditionLower.includes('erstinstallation')) {
      // Annahme: Ja, wenn keine bestehende Anlage
      return true;
    }

    // Bonitätsprüfung
    if (conditionLower.includes('bonität')) {
      return true; // Wird im Antragsprozess geprüft
    }

    // Default: Bedingung als erfüllt annehmen
    return true;
  }

  calculateOptimalCombination(programs: Foerderprogramm[], options: SearchOptions): Foerderprogramm[] {
    // Greedy-Algorithmus für beste Kombination
    const selected: Foerderprogramm[] = [];
    const incompatibleConditions = new Set<string>();

    // Nach Score sortieren
    const sorted = [...programs].sort((a, b) => b.eligibility.score - a.eligibility.score);

    for (const program of sorted) {
      // Prüfen ob kompatibel
      const hasConflict = program.conditions.some((c) => incompatibleConditions.has(c));

      if (!hasConflict && program.eligibility.met) {
        selected.push(program);
        // Inkompatible Bedingungen markieren
        this.getIncompatibleConditions(program).forEach((c) => incompatibleConditions.add(c));
      }
    }

    return selected;
  }

  private getIncompatibleConditions(program: Foerderprogramm): string[] {
    // Bedingungen die andere Förderungen ausschließen
    const incompatibilities: Record<string, string[]> = {
      'Erstinstallation': ['Folgeinstallation'],
      'PV-Anlage vorhanden': [],
      'Speicher neu installiert': [],
    };

    return program.conditions.flatMap((c) => incompatibilities[c] || []);
  }
}
