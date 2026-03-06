/**
 * Community Stats - Gemeinschafts-Statistiken
 */

interface CommunityStat {
  id: string;
  title: string;
  value: string | number;
  change?: number; // % Veränderung
  icon: string;
  description: string;
}

interface RegionStats {
  region: string;
  totalDächer: number;
  totalKwp: number;
  totalProduction: number; // kWh/Jahr
  totalCo2Savings: number; // kg/Jahr
  averageSelfConsumption: number; // %
  topProducer?: { name: string; production: number };
}

export class CommunityStats {
  private stats: Map<string, any> = new Map();
  private regions: Map<string, RegionStats> = new Map();

  updateStat(key: string, value: any): void {
    this.stats.set(key, value);
  }

  getStats(): CommunityStat[] {
    return [
      {
        id: 'total_solar',
        title: 'Solar-Dächer',
        value: this.stats.get('totalDächer') || 0,
        icon: '🏠',
        description: 'Registrierte Anlagen',
      },
      {
        id: 'total_capacity',
        title: 'Gesamtleistung',
        value: `${Math.round((this.stats.get('totalKwp') || 0) / 1000)} MW`,
        icon: '⚡',
        description: 'Installierte Kapazität',
      },
      {
        id: 'total_production',
        title: 'Strom produziert',
        value: `${Math.round((this.stats.get('totalProduction') || 0) / 1000000)} GWh`,
        icon: '💡',
        description: 'Jährliche Erzeugung',
      },
      {
        id: 'co2_saved',
        title: 'CO₂ gespart',
        value: `${Math.round((this.stats.get('totalCo2Savings') || 0) / 1000000)} kt`,
        change: 15,
        icon: '🌱',
        description: 'Klimaschutzbeitrag',
      },
      {
        id: 'households_powered',
        title: 'Haushalte versorgt',
        value: Math.round((this.stats.get('totalProduction') || 0) / 3500),
        icon: '🏡',
        description: 'Äquivalente Haushalte',
      },
      {
        id: 'trees_planted',
        title: 'Bäume gepflanzt',
        value: Math.round((this.stats.get('totalCo2Savings') || 0) / 10),
        icon: '🌳',
        description: 'Entspricht CO₂-Bindung',
      },
    ];
  }

  addRegion(region: string, stats: RegionStats): void {
    this.regions.set(region, stats);
  }

  getRegionStats(region: string): RegionStats | null {
    return this.regions.get(region) || null;
  }

  getTopRegions(limit: number = 5): Array<{ region: string; stats: RegionStats; rank: number }> {
    const sorted = Array.from(this.regions.entries())
      .sort((a, b) => b[1].totalProduction - a[1].totalProduction)
      .slice(0, limit);

    return sorted.map(([region, stats], index) => ({
      region,
      stats,
      rank: index + 1,
    }));
  }

  calculateImpact(): {
    environmental: Array<{ metric: string; value: string; icon: string }>;
    economic: Array<{ metric: string; value: string; icon: string }>;
    social: Array<{ metric: string; value: string; icon: string }>;
  } {
    const totalCo2 = this.stats.get('totalCo2Savings') || 0;
    const totalProduction = this.stats.get('totalProduction') || 0;
    const totalKwp = this.stats.get('totalKwp') || 0;

    return {
      environmental: [
        { metric: 'CO₂-Einsparung', value: `${Math.round(totalCo2 / 1000)} t`, icon: '🌍' },
        { metric: 'Bäume equivalent', value: `${Math.round(totalCo2 / 10 / 1000)}k`, icon: '🌳' },
        { metric: 'Autokm vermieden', value: `${Math.round(totalCo2 * 1000 / 150 / 1000)}k`, icon: '🚗' },
      ],
      economic: [
        { metric: 'Investitionsvolumen', value: `${Math.round(totalKwp * 1500 / 1000000)}M€`, icon: '💰' },
        { metric: 'Stromwert', value: `${Math.round(totalProduction * 0.35 / 1000000)}M€`, icon: '💶' },
        { metric: 'Arbeitsplätze', value: `${Math.round(totalKwp / 100)}`, icon: '👷' },
      ],
      social: [
        { metric: 'Teilnehmende Haushalte', value: `${this.stats.get('totalDächer') || 0}`, icon: '🏠' },
        { metric: 'Haushalte versorgt', value: `${Math.round(totalProduction / 3500)}`, icon: '⚡' },
        { metric: 'Bildungsprojekte', value: `${Math.round(this.stats.get('totalDächer') / 100)}`, icon: '📚' },
      ],
    };
  }

  generateMilestoneReport(): string {
    const stats = this.getStats();
    const impact = this.calculateImpact();

    return `
🎉 Community Meilenstein-Bericht

📊 Unsere Gemeinschaft:
${stats.map((s) => `${s.icon} ${s.title}: ${s.value}`).join('\n')}

🌍 Umweltauswirkung:
${impact.environmental.map((e) => `${e.icon} ${e.metric}: ${e.value}`).join('\n')}

💰 Wirtschaftlicher Beitrag:
${impact.economic.map((e) => `${e.icon} ${e.metric}: ${e.value}`).join('\n')}

🤝 Sozialer Impact:
${impact.social.map((e) => `${e.icon} ${e.metric}: ${e.value}`).join('\n')}

Vielen Dank an alle Teilnehmer! 🙏
    `.trim();
  }

  getLiveCounter(): {
    currentProduction: number; // kWh (heute)
    currentCo2Savings: number; // kg (heute)
    equivalentCarsOffRoad: number;
  } {
    // In Produktion: Echtzeit-Daten von Smart Metern
    const dailyProduction = (this.stats.get('totalProduction') || 0) / 365;
    const dailyCo2 = (this.stats.get('totalCo2Savings') || 0) / 365;

    return {
      currentProduction: Math.round(dailyProduction * 100) / 100,
      currentCo2Savings: Math.round(dailyCo2),
      equivalentCarsOffRoad: Math.round(dailyCo2 / 150), // 150g CO₂/km
    };
  }
}
