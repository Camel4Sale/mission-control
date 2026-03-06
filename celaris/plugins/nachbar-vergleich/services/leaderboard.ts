/**
 * Leaderboard Service - Ranglisten und Gamification
 */

interface SolarDach {
  id: string;
  address: string;
  kwp: number;
  annualProduction: number; // kWh
  co2Savings: number; // kg/Jahr
  potentialScore: number; // 0-100
  installedAt?: string;
  owner?: string; // Anonymisiert
}

interface LeaderboardEntry {
  rank: number;
  dach: SolarDach;
  score: number;
  badge?: string;
}

interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  calculateScore: (dach: SolarDach) => number;
}

export class Leaderboard {
  private dächer: Map<string, SolarDach> = new Map();
  private categories: LeaderboardCategory[] = [
    {
      id: 'production',
      name: 'Stromproduzent',
      description: 'Meiste produzierte kWh',
      icon: '⚡',
      calculateScore: (dach) => dach.annualProduction,
    },
    {
      id: 'efficiency',
      name: 'Effizienz-Champion',
      description: 'Bester Ertrag pro kWp',
      icon: '🎯',
      calculateScore: (dach) => dach.annualProduction / dach.kwp,
    },
    {
      id: 'climate',
      name: 'Klimaretter',
      description: 'Meiste CO₂-Einsparung',
      icon: '🌱',
      calculateScore: (dach) => dach.co2Savings,
    },
    {
      id: 'potential',
      name: 'Potenzial-König',
      description: 'Höchster Potenzial-Score',
      icon: '👑',
      calculateScore: (dach) => dach.potentialScore,
    },
    {
      id: 'size',
      name: 'Kraftwerk',
      description: 'Größte Anlage (kWp)',
      icon: '🏭',
      calculateScore: (dach) => dach.kwp,
    },
  ];

  addDach(dach: SolarDach): void {
    this.dächer.set(dach.id, dach);
  }

  getLeaderboard(categoryId: string, limit: number = 10): LeaderboardEntry[] {
    const category = this.categories.find((c) => c.id === categoryId);
    if (!category) {
      throw new Error(`Kategorie ${categoryId} nicht gefunden`);
    }

    const sorted = Array.from(this.dächer.values())
      .map((dach) => ({
        dach,
        score: category.calculateScore(dach),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return sorted.map((entry, index) => ({
      rank: index + 1,
      dach: entry.dach,
      score: Math.round(entry.score),
      badge: this.getBadge(index + 1, entry.score),
    }));
  }

  getRanking(dachId: string, categoryId: string): { rank: number; total: number; percentile: number } | null {
    const category = this.categories.find((c) => c.id === categoryId);
    if (!category) return null;

    const targetDach = this.dächer.get(dachId);
    if (!targetDach) return null;

    const targetScore = category.calculateScore(targetDach);

    const sorted = Array.from(this.dächer.values())
      .map((dach) => category.calculateScore(dach))
      .sort((a, b) => b - a);

    const rank = sorted.findIndex((score) => score <= targetScore) + 1;
    const percentile = ((sorted.length - rank) / sorted.length) * 100;

    return {
      rank,
      total: sorted.length,
      percentile: Math.round(percentile),
    };
  }

  getBadges(): Array<{ id: string; name: string; description: string; icon: string; requirement: string }> {
    return [
      { id: 'pioneer', name: 'Pionier', description: 'Erste Solaranlage in der Straße', icon: '🚀', requirement: 'Erster Eintrag' },
      { id: 'champion', name: 'Champion', description: 'Platz 1 in einer Kategorie', icon: '🏆', requirement: 'Rank 1' },
      { id: 'top10', name: 'Top 10', description: 'Unter den besten 10', icon: '⭐', requirement: 'Rank ≤ 10' },
      { id: 'climate', name: 'Klimaretter', description: '10+ Tonnen CO₂ gespart', icon: '🌍', requirement: '10.000 kg CO₂' },
      { id: 'producer', name: 'Stromproduzent', description: '10.000+ kWh produziert', icon: '⚡', requirement: '10.000 kWh' },
      { id: 'efficient', name: 'Effizient', description: '1000+ kWh/kWp', icon: '💎', requirement: '1000 kWh/kWp' },
    ];
  }

  getUserBadges(dachId: string): Array<{ id: string; name: string; icon: string }> {
    const dach = this.dächer.get(dachId);
    if (!dach) return [];

    const badges: Array<{ id: string; name: string; icon: string }> = [];

    // Platz 1 Badges
    for (const category of this.categories) {
      const ranking = this.getRanking(dachId, category.id);
      if (ranking && ranking.rank === 1) {
        badges.push({ id: 'champion', name: 'Champion', icon: '🏆' });
      }
    }

    // CO₂ Badge
    if (dach.co2Savings >= 10000) {
      badges.push({ id: 'climate', name: 'Klimaretter', icon: '🌍' });
    }

    // Produktion Badge
    if (dach.annualProduction >= 10000) {
      badges.push({ id: 'producer', name: 'Stromproduzent', icon: '⚡' });
    }

    // Effizienz Badge
    if (dach.annualProduction / dach.kwp >= 1000) {
      badges.push({ id: 'efficient', name: 'Effizient', icon: '💎' });
    }

    return badges;
  }

  private getBadge(rank: number, score: number): string | undefined {
    if (rank === 1) return '🏆';
    if (rank <= 3) return '🥈';
    if (rank <= 10) return '⭐';
    return undefined;
  }

  getStats(): {
    totalDächer: number;
    totalKwp: number;
    totalProduction: number;
    totalCo2Savings: number;
    averageScore: number;
  } {
    const dächer = Array.from(this.dächer.values());
    const totalKwp = dächer.reduce((sum, d) => sum + d.kwp, 0);
    const totalProduction = dächer.reduce((sum, d) => sum + d.annualProduction, 0);
    const totalCo2Savings = dächer.reduce((sum, d) => sum + d.co2Savings, 0);
    const averageScore = dächer.reduce((sum, d) => sum + d.potentialScore, 0) / dächer.length;

    return {
      totalDächer: dächer.length,
      totalKwp: Math.round(totalKwp * 10) / 10,
      totalProduction: Math.round(totalProduction),
      totalCo2Savings: Math.round(totalCo2Savings),
      averageScore: Math.round(averageScore),
    };
  }
}
