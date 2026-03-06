/**
 * Nachbar-Vergleich - Gamification und Community-Vergleich
 * © 2026 Celaris
 */

import { Leaderboard } from './services/leaderboard';
import { SocialShare } from './services/social-share';
import { CommunityStats } from './services/community-stats';

export interface SolarDach {
  id: string;
  address: string;
  kwp: number;
  annualProduction: number; // kWh
  co2Savings: number; // kg/Jahr
  potentialScore: number; // 0-100
  installedAt?: string;
  owner?: string;
}

export interface LeaderboardEntry {
  rank: number;
  dach: SolarDach;
  score: number;
  badge?: string;
}

export interface ShareContent {
  title: string;
  description: string;
  image?: string;
  url: string;
  hashtags: string[];
}

export interface NachbarVergleichConfig {
  region: string;
  city: string;
  enablePublicLeaderboard?: boolean;
}

export class NachbarVergleich {
  private leaderboard: Leaderboard;
  private socialShare: SocialShare;
  private communityStats: CommunityStats;
  private config: NachbarVergleichConfig;

  constructor(config: NachbarVergleichConfig) {
    this.leaderboard = new Leaderboard();
    this.socialShare = new SocialShare();
    this.communityStats = new CommunityStats();
    this.config = config;
  }

  async registerDach(dach: SolarDach): Promise<{ success: boolean; id: string }> {
    this.leaderboard.addDach(dach);

    // Community-Stats aktualisieren
    const currentStats = this.communityStats.getStats();
    const totalDächer = currentStats.find((s) => s.id === 'total_solar')?.value as number;
    const totalKwp = currentStats.find((s) => s.id === 'total_capacity')?.value as string;
    const totalProduction = currentStats.find((s) => s.id === 'total_production')?.value as string;
    const totalCo2 = currentStats.find((s) => s.id === 'co2_saved')?.value as string;

    this.communityStats.updateStat('totalDächer', (totalDächer || 0) + 1);
    this.communityStats.updateStat('totalKwp', (parseFloat(totalKwp) || 0) * 1000 + dach.kwp);
    this.communityStats.updateStat('totalProduction', (parseFloat(totalProduction) || 0) * 1000000 + dach.annualProduction);
    this.communityStats.updateStat('totalCo2Savings', (parseFloat(totalCo2) || 0) * 1000000 + dach.co2Savings);

    return { success: true, id: dach.id };
  }

  async getLeaderboard(category: 'production' | 'efficiency' | 'climate' | 'potential' | 'size', limit: number = 10): Promise<LeaderboardEntry[]> {
    return this.leaderboard.getLeaderboard(category, limit);
  }

  async getRanking(dachId: string, category: string): Promise<{ rank: number; total: number; percentile: number } | null> {
    return this.leaderboard.getRanking(dachId, category);
  }

  async getUserBadges(dachId: string): Promise<Array<{ id: string; name: string; icon: string }>> {
    return this.leaderboard.getUserBadges(dachId);
  }

  async generateShareUrl(
    platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email',
    content: ShareContent,
  ): Promise<string> {
    return this.socialShare.generateShareUrl(platform, content);
  }

  async generateAchievementMessage(
    achievement: { type: string; value: number; rank?: number },
    userName?: string,
  ): Promise<string> {
    return this.socialShare.generateAchievementMessage(achievement, userName);
  }

  async generateShareImage(stats: { kwp: number; production: number; co2Savings: number; rank?: number }): Promise<string> {
    return this.socialShare.generateShareImage(stats);
  }

  async createViralChallenge(
    type: 'neighbor' | 'street' | 'city',
  ): Promise<{
    title: string;
    description: string;
    shareText: string;
    hashtags: string[];
  }> {
    return this.socialShare.createViralChallenge(type, '');
  }

  async getCommunityStats(): Promise<{
    totalDächer: number;
    totalKwp: number;
    totalProduction: number;
    totalCo2Savings: number;
    averageScore: number;
  }> {
    return this.leaderboard.getStats();
  }

  async getImpactReport(): Promise<string> {
    return this.communityStats.generateMilestoneReport();
  }

  async getLiveCounter(): Promise<{
    currentProduction: number;
    currentCo2Savings: number;
    equivalentCarsOffRoad: number;
  }> {
    return this.communityStats.getLiveCounter();
  }

  async createReferralLink(userId: string): Promise<string> {
    return this.socialShare.generateReferralLink(userId);
  }

  async createLeadGenCampaign(
    campaignName: string,
    incentive: string,
  ): Promise<{
    landingPageUrl: string;
    shareMessage: string;
    trackingCode: string;
  }> {
    return this.socialShare.createLeadGenCampaign(campaignName, incentive);
  }
}

export { Leaderboard } from './services/leaderboard';
export { SocialShare } from './services/social-share';
export { CommunityStats } from './services/community-stats';
