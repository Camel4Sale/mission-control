import { z } from 'zod';

// Property Data Schema
export const PropertySchema = z.object({
  id: z.string().uuid(),
  source: z.enum(['immoscout24', 'immowelt', 'kleinanzeigen']),
  url: z.string().url(),
  title: z.string(),
  price: z.number().positive(),
  size: z.number().positive(),
  rooms: z.number().positive().optional(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
    district: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  yearBuilt: z.number().optional(),
  propertyType: z.enum(['apartment', 'house', 'commercial', 'land']).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  features: z.array(z.string()).optional(),
  energyClass: z.string().optional(),
  availableFrom: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Property = z.infer<typeof PropertySchema>;

// AI Analysis Schema
export const AIAnalysisSchema = z.object({
  propertyId: z.string().uuid(),
  marketValue: z.number().positive(),
  marketValueRange: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }),
  priceRecommendation: z.enum(['zu_teuer', 'fair', 'schnaeppchen']),
  potentialScore: z.number().min(0).max(100),
  rentalYield: z.object({
    gross: z.number().positive(),
    net: z.number().positive(),
  }),
  comparableProperties: z.array(z.object({
    id: z.string(),
    price: z.number(),
    size: z.number(),
    distance: z.number(),
  })),
  riskFactors: z.array(z.string()).optional(),
  opportunities: z.array(z.string()).optional(),
  analyzedAt: z.date(),
});

export type AIAnalysis = z.infer<typeof AIAnalysisSchema>;

// Deal Status
export const DealStatusSchema = z.enum(['neu', 'analysiert', 'besichtigt', 'angebot', 'kauf', 'abgelehnt']);
export type DealStatus = z.infer<typeof DealStatusSchema>;

// Deal Pipeline Item
export const DealSchema = PropertySchema.extend({
  status: DealStatusSchema,
  analysis: AIAnalysisSchema.optional(),
  notes: z.array(z.object({
    id: z.string().uuid(),
    content: z.string(),
    createdAt: z.date(),
  })).default([]),
  isFavorite: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type Deal = z.infer<typeof DealSchema>;

// Alert Configuration
export const AlertConfigSchema = z.object({
  userId: z.string().uuid(),
  enabled: z.boolean().default(true),
  pushEnabled: z.boolean().default(true),
  emailEnabled: z.boolean().default(false),
  smsEnabled: z.boolean().default(false),
  filters: z.object({
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    minSize: z.number().optional(),
    maxSize: z.number().optional(),
    cities: z.array(z.string()).optional(),
    zipCodes: z.array(z.string()).optional(),
    minRentalYield: z.number().optional(),
    minPotentialScore: z.number().optional(),
  }),
  emailSchedule: z.enum(['daily', 'weekly', 'instant']).default('daily'),
  smsThreshold: z.number().default(30), // % unter Marktwert
});

export type AlertConfig = z.infer<typeof AlertConfigSchema>;

// Market Analysis
export const MarketAnalysisSchema = z.object({
  city: z.string(),
  district: z.string().optional(),
  timeRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  averagePrice: z.number(),
  pricePerSqm: z.number(),
  priceDevelopment: z.array(z.object({
    date: z.date(),
    averagePrice: z.number(),
    listings: z.number(),
  })),
  supplyDemandRatio: z.number(),
  totalListings: z.number(),
  averageDaysOnMarket: z.number(),
  rentalYieldAverage: z.number(),
  comparableCities: z.array(z.object({
    name: z.string(),
    pricePerSqm: z.number(),
    difference: z.number(),
  })),
});

export type MarketAnalysis = z.infer<typeof MarketAnalysisSchema>;

// Scraper Result
export interface ScraperResult {
  properties: Property[];
  errors: string[];
  timestamp: Date;
}

// Alert
export interface Alert {
  id: string;
  userId: string;
  type: 'push' | 'email' | 'sms';
  deal: Deal;
  message: string;
  sentAt: Date;
  delivered: boolean;
}
