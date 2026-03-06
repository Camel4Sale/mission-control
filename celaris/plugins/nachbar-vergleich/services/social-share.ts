/**
 * Social Share Service - Viral-Mechanik und Sharing
 */

interface ShareConfig {
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email';
  includeImage: boolean;
  includeStats: boolean;
  customMessage?: string;
}

interface ShareContent {
  title: string;
  description: string;
  image?: string; // URL oder Base64
  url: string;
  hashtags: string[];
}

export class SocialShare {
  generateShareUrl(
    platform: string,
    content: ShareContent,
  ): string {
    const encodedText = encodeURIComponent(`${content.title}\n\n${content.description}\n\n${content.hashtags.join(' ')}`);
    const encodedUrl = encodeURIComponent(content.url);

    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return `https://wa.me/?text=${encodedText} ${encodedUrl}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      case 'email':
        return `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodedText} ${encodedUrl}`;
      default:
        throw new Error(`Platform ${platform} not supported`);
    }
  }

  generateAchievementMessage(
    achievement: { type: string; value: number; rank?: number },
    userName: string = 'Ich',
  ): string {
    const messages: Record<string, (value: number, rank?: number) => string> = {
      rank1: (v, r) => `🏆 Platz 1! ${userName} hat die beste Solaranlage in der Nachbarschaft!`,
      top10: (v, r) => `⭐ Top 10! ${userName} ist unter den besten Solar-Produzenten!`,
      co2_savings: (v) => `🌱 ${userName} hat ${Math.round(v / 1000)} Tonnen CO₂ gespart!`,
      production: (v) => `⚡ ${userName} produziert ${Math.round(v)} kWh Solarstrom pro Jahr!`,
      efficiency: (v) => `💎 ${userName} erreicht ${Math.round(v)} kWh/kWp - super effizient!`,
    };

    const messageFn = messages[achievement.type] || ((v) => `🎉 ${userName} hat eine tolle Leistung erzielt!`);
    return messageFn(achievement.value, achievement.rank);
  }

  generateShareImage(stats: {
    kwp: number;
    production: number;
    co2Savings: number;
    rank?: number;
  }): string {
    // In Produktion: Canvas-basierte Image-Generierung
    // Hier: Placeholder für Share-Image
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
        <rect width="1200" height="630" fill="#10b981"/>
        <text x="600" y="200" font-size="72" fill="white" text-anchor="middle" font-family="Arial">
          Meine Solar-Anlage
        </text>
        <text x="600" y="300" font-size="48" fill="white" text-anchor="middle">
          ${stats.kwp} kWp | ${stats.production} kWh/Jahr
        </text>
        <text x="600" y="380" font-size="48" fill="white" text-anchor="middle">
          🌱 ${Math.round(stats.co2Savings / 1000)}t CO₂ gespart
        </text>
        ${stats.rank ? `<text x="600" y="480" font-size="96" fill="#fbbf24" text-anchor="middle">🏆 Platz ${stats.rank}</text>` : ''}
        <text x="600" y="580" font-size="32" fill="white" text-anchor="middle">
          #SolarPower #CleanEnergy
        </text>
      </svg>
    `).toString('base64')}`;
  }

  createViralChallenge(
    challengeType: 'neighbor' | 'street' | 'city',
    goal: string,
  ): {
    title: string;
    description: string;
    shareText: string;
    hashtags: string[];
  } {
    const challenges = {
      neighbor: {
        title: 'Nachbar-Challenge',
        description: 'Wer hat das bessere Solar-Dach?',
        shareText: 'Ich fordere meine Nachbarn heraus: Wer hat die bessere Solaranlage? 🏡☀️',
        hashtags: ['#SolarChallenge', '#NachbarDuell', '#CleanEnergy'],
      },
      street: {
        title: 'Straßen-Ranking',
        description: 'Die solaraktivste Straße gewinnen!',
        shareText: 'Unsere Straße wird zur Solar-Street! Mach mit! 🌞',
        hashtags: ['#SolarStreet', '#CommunityPower', '#EnergyTransition'],
      },
      city: {
        title: 'Stadt-Challenge',
        description: 'Welche Stadt wird solar Nummer 1?',
        shareText: 'Unsere Stadt wird solar! Bist du dabei? 🏙️⚡',
        hashtags: ['#SolarCity', '#RenewableEnergy', '#ClimateAction'],
      },
    };

    return challenges[challengeType];
  }

  generateReferralLink(userId: string, baseUrl: string = 'https://celaris.com'): string {
    return `${baseUrl}/ref/${userId}`;
  }

  createLeadGenCampaign(
    campaignName: string,
    incentive: string,
  ): {
    landingPageUrl: string;
    shareMessage: string;
    trackingCode: string;
  } {
    const trackingCode = `camp_${campaignName}_${Date.now()}`;

    return {
      landingPageUrl: `https://celaris.com/campaign/${campaignName}?ref=${trackingCode}`,
      shareMessage: `🎁 ${incentive} - Jetzt kostenloses Solar-Potenzial prüfen!`,
      trackingCode,
    };
  }
}
