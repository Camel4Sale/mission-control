import OpenAI from 'openai';
import { Property, AIAnalysis, Deal } from '../types';

interface AnalyzerConfig {
  openaiApiKey: string;
  model?: string;
  cityData?: Record<string, CityData>;
}

interface CityData {
  averagePricePerSqm: number;
  rentalYieldAverage: number;
  districts: Record<string, DistrictData>;
}

interface DistrictData {
  averagePricePerSqm: number;
  rentalYieldAverage: number;
  demandLevel: 'low' | 'medium' | 'high';
}

class PropertyAnalyzer {
  private openai: OpenAI;
  private cityData: Record<string, CityData>;

  constructor(config: AnalyzerConfig) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
    this.cityData = config.cityData || {};
  }

  async analyzeProperty(property: Property): Promise<AIAnalysis> {
    // Get comparable properties
    const comparables = await this.findComparableProperties(property);
    
    // Calculate market value
    const marketValue = this.calculateMarketValue(property, comparables);
    
    // Determine price recommendation
    const priceRecommendation = this.determinePriceRecommendation(property.price, marketValue);
    
    // Calculate potential score
    const potentialScore = await this.calculatePotentialScore(property, marketValue);
    
    // Estimate rental yield
    const rentalYield = this.calculateRentalYield(property, marketValue);

    // Get AI insights
    const aiInsights = await this.getAIInsights(property, marketValue, comparables);

    return {
      propertyId: property.id,
      marketValue: Math.round(marketValue),
      marketValueRange: {
        min: Math.round(marketValue * 0.9),
        max: Math.round(marketValue * 1.1),
      },
      priceRecommendation,
      potentialScore: Math.round(potentialScore),
      rentalYield,
      comparableProperties: comparables,
      riskFactors: aiInsights.risks,
      opportunities: aiInsights.opportunities,
      analyzedAt: new Date(),
    };
  }

  private async findComparableProperties(property: Property): Promise<Array<{
    id: string;
    price: number;
    size: number;
    distance: number;
  }>> {
    // In production, this would query a database of recent sales/rentals
    // For now, we'll use city/district averages as proxy
    
    const cityData = this.cityData[property.location.city];
    if (!cityData) {
      // Return generic comparables
      return [
        { id: 'comp1', price: property.price * 0.95, size: property.size * 0.9, distance: 0.5 },
        { id: 'comp2', price: property.price * 1.05, size: property.size * 1.1, distance: 1.2 },
        { id: 'comp3', price: property.price, size: property.size, distance: 0.8 },
      ];
    }

    const districtData = property.location.district 
      ? cityData.districts[property.location.district]
      : null;

    const avgPricePerSqm = districtData?.averagePricePerSqm || cityData.averagePricePerSqm;
    const estimatedPrice = avgPricePerSqm * property.size;

    return [
      { id: 'comp1', price: estimatedPrice * 0.9, size: property.size * 0.9, distance: 0.5 },
      { id: 'comp2', price: estimatedPrice * 1.0, size: property.size, distance: 0.8 },
      { id: 'comp3', price: estimatedPrice * 1.1, size: property.size * 1.1, distance: 1.5 },
    ];
  }

  private calculateMarketValue(property: Property, comparables: any[]): number {
    if (comparables.length === 0) {
      return property.price;
    }

    // Weighted average based on similarity
    const weights = comparables.map((comp, idx) => {
      const sizeDiff = Math.abs(comp.size - property.size) / property.size;
      const distanceWeight = 1 / (1 + comp.distance);
      const similarityWeight = 1 / (1 + sizeDiff);
      return distanceWeight * similarityWeight;
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const weightedPrice = comparables.reduce((sum, comp, idx) => {
      return sum + (comp.price * weights[idx]);
    }, 0);

    return weightedPrice / totalWeight;
  }

  private determinePriceRecommendation(listedPrice: number, marketValue: number): 'zu_teuer' | 'fair' | 'schnaeppchen' {
    const diffPercent = ((listedPrice - marketValue) / marketValue) * 100;

    if (diffPercent > 10) {
      return 'zu_teuer';
    } else if (diffPercent < -15) {
      return 'schnaeppchen';
    } else {
      return 'fair';
    }
  }

  private async calculatePotentialScore(property: Property, marketValue: number): Promise<number> {
    // Use AI to calculate a comprehensive potential score
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein Immobilien-Experte. Bewerte das Investitionspotenzial einer Immobilie auf einer Skala von 0-100.',
          },
          {
            role: 'user',
            content: `
            Immobilie:
            - Preis: ${property.price}€
            - Geschätzter Marktwert: ${Math.round(marketValue)}€
            - Größe: ${property.size}m²
            - Zimmer: ${property.rooms || 'N/A'}
            - Ort: ${property.location.city}, ${property.location.zipCode}
            - Baujahr: ${property.yearBuilt || 'N/A'}
            - Quelle: ${property.source}

            Gib NUR eine Zahl von 0-100 zurück. Berücksichtige:
            - Preis-Leistungs-Verhältnis
            - Lage-Qualität
            - Mietrendite-Potenzial
            - Wertsteigerungschancen
            `,
          },
        ],
        temperature: 0.3,
      });

      const score = parseInt(response.choices[0].message.content?.trim() || '50');
      return Math.min(100, Math.max(0, score));
    } catch (error) {
      // Fallback to algorithmic scoring
      return this.algorithmicScore(property, marketValue);
    }
  }

  private algorithmicScore(property: Property, marketValue: number): number {
    let score = 50;

    // Price advantage (0-30 points)
    const priceAdvantage = ((marketValue - property.price) / marketValue) * 100;
    score += Math.min(30, Math.max(-10, priceAdvantage * 0.5));

    // Size efficiency (0-20 points)
    if (property.size >= 40 && property.size <= 100) {
      score += 15;
    } else if (property.size > 100 && property.size <= 150) {
      score += 10;
    }

    // Source reliability (0-10 points)
    if (property.source === 'immoscout24') score += 8;
    else if (property.source === 'immowelt') score += 7;
    else if (property.source === 'kleinanzeigen') score += 5;

    // Rooms factor (0-10 points)
    if (property.rooms && property.rooms >= 2 && property.rooms <= 4) {
      score += 10;
    } else if (property.rooms && property.rooms === 1) {
      score += 5;
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private calculateRentalYield(property: Property, marketValue: number): { gross: number; net: number } {
    // Estimate monthly rent based on size and location
    const cityData = this.cityData[property.location.city];
    const avgRentPerSqm = cityData?.averagePricePerSqm || 12; // Default €12/m²
    
    const estimatedMonthlyRent = avgRentPerSqm * property.size;
    const annualRent = estimatedMonthlyRent * 12;

    // Gross yield
    const grossYield = (annualRent / marketValue) * 100;

    // Net yield (accounting for costs: ~30% for maintenance, taxes, vacancy)
    const netYield = grossYield * 0.7;

    return {
      gross: Math.round(grossYield * 100) / 100,
      net: Math.round(netYield * 100) / 100,
    };
  }

  private async getAIInsights(property: Property, marketValue: number, comparables: any[]): Promise<{
    risks: string[];
    opportunities: string[];
  }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein Immobilien-Investmentberater. Identifiziere Risiken und Chancen für eine Immobilie.',
          },
          {
            role: 'user',
            content: `
            Immobilie:
            - Preis: ${property.price}€
            - Geschätzter Marktwert: ${Math.round(marketValue)}€
            - Größe: ${property.size}m²
            - Ort: ${property.location.city}, ${property.location.zipCode}
            - Quelle: ${property.source}

            Nenne 3-5 Risiken und 3-5 Chancen. Antworte im JSON-Format:
            {
              "risks": ["Risiko 1", "Risiko 2", ...],
              "opportunities": ["Chance 1", "Chance 2", ...]
            }
            `,
          },
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        return {
          risks: parsed.risks || [],
          opportunities: parsed.opportunities || [],
        };
      }
    } catch (error) {
      // Fallback to generic insights
    }

    // Generic fallback
    return {
      risks: [
        'Marktrisiken durch wirtschaftliche Entwicklung',
        'Mögliche Mieterhöhungen nicht durchsetzbar',
        'Instandhaltungskosten könnten steigen',
      ],
      opportunities: [
        'Potenzielle Wertsteigerung der Lage',
        'Mietrendite über Durchschnitt',
        'Nachfrage in der Region stabil',
      ],
    };
  }

  async analyzeDeal(deal: Deal): Promise<Deal> {
    if (!deal.analysis) {
      const analysis = await this.analyzeProperty(deal);
      return {
        ...deal,
        analysis,
      };
    }
    return deal;
  }
}

export default PropertyAnalyzer;
