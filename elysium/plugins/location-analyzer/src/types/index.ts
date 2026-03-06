/**
 * Core types for the Location Analyzer plugin
 */

// Coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: string;
  city: string;
  district: string;
  postalCode: string;
  coordinates: Coordinates;
}

// ==================== CRIME DATA ====================

export type CrimeCategory = 'violence' | 'property' | 'drugs' | 'other';

export interface CrimeStatistic {
  category: CrimeCategory;
  count: number;
  rate: number; // per 1000 residents
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  year: number;
}

export interface CrimeData {
  district: CrimeStatistic[];
  city: CrimeStatistic[];
  national: CrimeStatistic[];
  heatmapPoints: HeatmapPoint[];
  safetyScore: number; // 0-100
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
  category: CrimeCategory;
}

// ==================== EDUCATION DATA ====================

export type SchoolType = 'grundschule' | 'realschule' | 'gymnasium' | 'gesamtschule' | 'berufsschule';
export type FacilityType = 'kita' | 'hort' | 'tagesmutter';

export interface EducationFacility {
  id: string;
  name: string;
  type: SchoolType | FacilityType;
  address: string;
  coordinates: Coordinates;
  distance: number; // meters
  walkingTime: number; // minutes
  drivingTime: number; // minutes
  rating?: number; // 1-5
  capacity?: number;
  availableSlots?: number;
  costs?: number; // monthly
  qualityScore?: number; // 0-100
}

export interface EducationRating {
  teachers: number; // 1-5
  equipment: number; // 1-5
  grades: number; // 1-5
  overall: number; // 1-5
}

export interface EducationData {
  schools: EducationFacility[];
  kitas: EducationFacility[];
  averageRating: number;
  coverageScore: number; // 0-100
  plannedProjects: PlannedEducationProject[];
}

export interface PlannedEducationProject {
  name: string;
  type: SchoolType | FacilityType;
  status: 'planned' | 'in_construction' | 'approved';
  expectedCompletion: string; // ISO date
  capacity: number;
  location: Coordinates;
}

// ==================== INFRASTRUCTURE DATA ====================

export interface TransportStop {
  id: string;
  name: string;
  type: 'bus' | 'tram' | 'ubahn' | 'sbahn' | 'train';
  lines: string[];
  coordinates: Coordinates;
  distance: number;
  walkingTime: number;
  frequency: {
    peak: number; // minutes
    offPeak: number; // minutes
  };
}

export interface ShoppingFacility {
  type: 'supermarket' | 'bakery' | 'pharmacy' | 'drugstore' | 'shopping_center';
  name: string;
  address: string;
  coordinates: Coordinates;
  distance: number;
  walkingTime: number;
  openingHours?: string;
}

export interface HealthFacility {
  type: 'doctor' | 'dentist' | 'hospital' | 'emergency' | 'specialist';
  name: string;
  specialty?: string;
  address: string;
  coordinates: Coordinates;
  distance: number;
  walkingTime: number;
  rating?: number;
}

export interface LeisureFacility {
  type: 'park' | 'restaurant' | 'cinema' | 'gym' | 'library' | 'pool';
  name: string;
  address: string;
  coordinates: Coordinates;
  distance: number;
  walkingTime: number;
  rating?: number;
  priceLevel?: number; // 1-4
}

export interface InfrastructureScore {
  transport: number; // 0-100
  shopping: number; // 0-100
  health: number; // 0-100
  leisure: number; // 0-100
  overall: number; // 0-100
}

export interface InfrastructureData {
  transport: {
    stops: TransportStop[];
    nearestStop: TransportStop;
    connectivityScore: number;
  };
  shopping: {
    facilities: ShoppingFacility[];
    nearest: Record<string, ShoppingFacility>;
  };
  health: {
    facilities: HealthFacility[];
    nearest: Record<string, HealthFacility>;
  };
  leisure: {
    facilities: LeisureFacility[];
    nearest: Record<string, LeisureFacility>;
  };
  scores: InfrastructureScore;
}

// ==================== ENVIRONMENT DATA ====================

export interface AirQuality {
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number; // µg/m³
  o3: number; // µg/m³
  aqi: number; // Air Quality Index 0-500
  category: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  lastUpdated: string;
}

export interface NoiseLevel {
  traffic: number; // dB
  aircraft: number; // dB
  railway: number; // dB
  industrial: number; // dB
  overall: number; // dB
  category: 'quiet' | 'moderate' | 'loud' | 'very_loud';
}

export interface GreenSpace {
  type: 'park' | 'forest' | 'water' | 'garden' | 'playground';
  name: string;
  area: number; // m²
  distance: number;
  walkingTime: number;
  coordinates: Coordinates;
}

export interface ClimateData {
  avgTemperature: number; // °C yearly
  avgPrecipitation: number; // mm yearly
  sunnyDays: number; // per year
  heatingDegreeDays: number;
  coolingDegreeDays: number;
}

export interface EnvironmentData {
  airQuality: AirQuality;
  noise: NoiseLevel;
  greenSpaces: GreenSpace[];
  climate: ClimateData;
  environmentScore: number; // 0-100
}

// ==================== DEMOGRAPHIC DATA ====================

export interface AgeDistribution {
  '0-17': number; // percentage
  '18-29': number;
  '30-49': number;
  '50-64': number;
  '65+': number;
  medianAge: number;
}

export interface DemographicData {
  population: number;
  density: number; // per km²
  ageDistribution: AgeDistribution;
  genderRatio: {
    male: number; // percentage
    female: number;
  };
  nationality: {
    german: number; // percentage
    eu: number;
    nonEu: number;
  };
  income: {
    averageHousehold: number; // EUR yearly
    medianHousehold: number;
    perCapita: number;
  };
  employment: {
    employmentRate: number; // percentage
    unemploymentRate: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  education: {
    noDegree: number; // percentage
    vocational: number;
    bachelors: number;
    masters: number;
    doctoral: number;
  };
  demographicScore: number; // 0-100
}

// ==================== DEVELOPMENT DATA ====================

export interface ConstructionProject {
  name: string;
  type: 'residential' | 'commercial' | 'mixed' | 'infrastructure' | 'public';
  status: 'planned' | 'approved' | 'in_construction' | 'completed';
  expectedCompletion?: string;
  investment: number; // EUR
  description: string;
  coordinates: Coordinates;
  impact: 'positive' | 'neutral' | 'negative';
}

export interface DevelopmentPlan {
  name: string;
  type: 'masterplan' | 'zoning' | 'renewal' | 'expansion';
  description: string;
  timeframe: {
    start: string;
    end: string;
  };
  budget: number; // EUR
  area: number; // km²
  goals: string[];
}

export interface ValueForecast {
  current: number; // EUR/m²
  oneYear: number;
  threeYears: number;
  fiveYears: number;
  growthRate: number; // yearly percentage
  confidence: 'low' | 'medium' | 'high';
  factors: string[];
}

export interface DevelopmentData {
  projects: ConstructionProject[];
  plans: DevelopmentPlan[];
  publicInvestment: number; // EUR total
  valueForecast: ValueForecast;
  developmentScore: number; // 0-100
}

// ==================== ANALYSIS RESULT ====================

export interface LocationAnalysis {
  location: Location;
  radius: number; // meters
  timestamp: string;
  
  crime: CrimeData;
  education: EducationData;
  infrastructure: InfrastructureData;
  environment: EnvironmentData;
  demographics: DemographicData;
  development: DevelopmentData;
  
  // Overall scores
  overallScore: number; // 0-100
  investmentRecommendation: 'buy' | 'hold' | 'avoid';
  recommendationReasons: string[];
  
  // Comparison data
  cityAverage?: Partial<LocationAnalysis>;
  nationalAverage?: Partial<LocationAnalysis>;
}

export interface ComparisonResult {
  locations: LocationAnalysis[];
  winner: string;
  scores: {
    [locationAddress: string]: {
      overall: number;
      crime: number;
      education: number;
      infrastructure: number;
      environment: number;
      demographics: number;
      development: number;
    };
  };
}

// ==================== API RESPONSES ====================

export interface ApiError {
  error: string;
  message: string;
  code: string;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
