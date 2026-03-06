/**
 * Mock data for development and testing
 */

import type {
  LocationAnalysis,
  CrimeData,
  EducationData,
  InfrastructureData,
  EnvironmentData,
  DemographicData,
  DevelopmentData,
  Coordinates,
} from '../types';

export const mockCoordinates: Coordinates = {
  latitude: 52.5200,
  longitude: 13.4050,
};

export function generateMockAnalysis(overrides?: Partial<LocationAnalysis>): LocationAnalysis {
  return {
    location: {
      address: 'Alexanderplatz 1, 10178 Berlin',
      city: 'Berlin',
      district: 'Mitte',
      postalCode: '10178',
      coordinates: mockCoordinates,
    },
    radius: 1000,
    timestamp: new Date().toISOString(),
    crime: generateMockCrimeData(),
    education: generateMockEducationData(),
    infrastructure: generateMockInfrastructureData(),
    environment: generateMockEnvironmentData(),
    demographics: generateMockDemographicData(),
    development: generateMockDevelopmentData(),
    overallScore: 78,
    investmentRecommendation: 'buy',
    recommendationReasons: [
      'Hoher Gesamt-Score',
      'Exzellente Infrastruktur',
      'Positive Wertentwicklung erwartet',
      'Gute Bildungseinrichtungen',
    ],
    ...overrides,
  };
}

function generateMockCrimeData(): CrimeData {
  return {
    district: [
      { category: 'violence', count: 45, rate: 3.2, trend: 'decreasing', trendPercentage: -5.2, year: 2024 },
      { category: 'property', count: 234, rate: 16.8, trend: 'stable', trendPercentage: 0.5, year: 2024 },
      { category: 'drugs', count: 67, rate: 4.8, trend: 'increasing', trendPercentage: 12.3, year: 2024 },
      { category: 'other', count: 89, rate: 6.4, trend: 'stable', trendPercentage: -1.1, year: 2024 },
    ],
    city: [
      { category: 'violence', count: 1250, rate: 2.8, trend: 'decreasing', trendPercentage: -3.1, year: 2024 },
      { category: 'property', count: 6780, rate: 15.2, trend: 'stable', trendPercentage: 1.2, year: 2024 },
      { category: 'drugs', count: 1890, rate: 4.2, trend: 'increasing', trendPercentage: 8.7, year: 2024 },
      { category: 'other', count: 2340, rate: 5.3, trend: 'stable', trendPercentage: 0.3, year: 2024 },
    ],
    national: [
      { category: 'violence', count: 45000, rate: 2.5, trend: 'decreasing', trendPercentage: -4.5, year: 2024 },
      { category: 'property', count: 234000, rate: 13.8, trend: 'decreasing', trendPercentage: -2.1, year: 2024 },
      { category: 'drugs', count: 67000, rate: 3.9, trend: 'stable', trendPercentage: 1.2, year: 2024 },
      { category: 'other', count: 89000, rate: 5.2, trend: 'stable', trendPercentage: 0.1, year: 2024 },
    ],
    heatmapPoints: Array.from({ length: 50 }, (_, i) => ({
      latitude: 52.52 + (Math.random() - 0.5) * 0.02,
      longitude: 13.405 + (Math.random() - 0.5) * 0.02,
      intensity: Math.random(),
      category: ['violence', 'property', 'drugs', 'other'][Math.floor(Math.random() * 4)] as any,
    })),
    safetyScore: 75,
  };
}

function generateMockEducationData(): EducationData {
  return {
    schools: [
      {
        id: 'school_1',
        name: 'Heinrich-von-Kleist Gymnasium',
        type: 'gymnasium',
        address: 'Kleiststraße 15, 10178 Berlin',
        coordinates: { latitude: 52.521, longitude: 13.406 },
        distance: 450,
        walkingTime: 6,
        drivingTime: 2,
        rating: 4.5,
        capacity: 800,
        qualityScore: 88,
      },
      {
        id: 'school_2',
        name: 'Grundschule Am Alexanderplatz',
        type: 'grundschule',
        address: 'Alexanderstraße 22, 10178 Berlin',
        coordinates: { latitude: 52.519, longitude: 13.404 },
        distance: 280,
        walkingTime: 4,
        drivingTime: 1,
        rating: 4.2,
        capacity: 400,
        qualityScore: 82,
      },
      {
        id: 'school_3',
        name: 'Berlin International School',
        type: 'gesamtschule',
        address: 'Karl-Liebknecht-Straße 30, 10178 Berlin',
        coordinates: { latitude: 52.523, longitude: 13.408 },
        distance: 620,
        walkingTime: 8,
        drivingTime: 3,
        rating: 4.7,
        capacity: 600,
        qualityScore: 92,
      },
    ],
    kitas: [
      {
        id: 'kita_1',
        name: 'Kita Sonnenschein',
        type: 'kita',
        address: 'Rosa-Luxemburg-Straße 10, 10178 Berlin',
        coordinates: { latitude: 52.522, longitude: 13.403 },
        distance: 320,
        walkingTime: 4,
        drivingTime: 2,
        rating: 4.3,
        capacity: 80,
        availableSlots: 5,
        costs: 250,
      },
      {
        id: 'kita_2',
        name: 'Kinderladen Mitte',
        type: 'kita',
        address: 'Torstraße 45, 10178 Berlin',
        coordinates: { latitude: 52.525, longitude: 13.402 },
        distance: 580,
        walkingTime: 7,
        drivingTime: 3,
        rating: 4.6,
        capacity: 50,
        availableSlots: 2,
        costs: 320,
      },
    ],
    averageRating: 4.46,
    coverageScore: 92,
    plannedProjects: [
      {
        name: 'Neue Grundschule Nord',
        type: 'grundschule',
        status: 'planned',
        expectedCompletion: '2026-09-01',
        capacity: 400,
        location: { latitude: 52.530, longitude: 13.410 },
      },
    ],
  };
}

function generateMockInfrastructureData(): InfrastructureData {
  return {
    transport: {
      stops: [
        {
          id: 'stop_1',
          name: 'S+U Alexanderplatz',
          type: 'train',
          lines: ['S3', 'S5', 'S7', 'S9', 'U2', 'U5', 'U8'],
          coordinates: { latitude: 52.5219, longitude: 13.4132 },
          distance: 650,
          walkingTime: 8,
          frequency: { peak: 5, offPeak: 10 },
        },
        {
          id: 'stop_2',
          name: 'U Rosa-Luxemburg-Platz',
          type: 'ubahn',
          lines: ['U2'],
          coordinates: { latitude: 52.5235, longitude: 13.4015 },
          distance: 420,
          walkingTime: 5,
          frequency: { peak: 5, offPeak: 10 },
        },
        {
          id: 'stop_3',
          name: 'Bus M48',
          type: 'bus',
          lines: ['M48', '100', '200'],
          coordinates: { latitude: 52.5195, longitude: 13.4070 },
          distance: 180,
          walkingTime: 2,
          frequency: { peak: 10, offPeak: 20 },
        },
      ],
      nearestStop: {
        id: 'stop_3',
        name: 'Bus M48',
        type: 'bus',
        lines: ['M48', '100', '200'],
        coordinates: { latitude: 52.5195, longitude: 13.4070 },
        distance: 180,
        walkingTime: 2,
        frequency: { peak: 10, offPeak: 20 },
      },
      connectivityScore: 95,
    },
    shopping: {
      facilities: [
        { type: 'supermarket', name: 'REWE City', address: 'Alexanderstraße 5', coordinates: { latitude: 52.520, longitude: 13.406 }, distance: 120, walkingTime: 2 },
        { type: 'bakery', name: 'Kamps Bäckerei', address: 'Karl-Liebknecht-Straße 12', coordinates: { latitude: 52.521, longitude: 13.407 }, distance: 200, walkingTime: 3 },
        { type: 'pharmacy', name: 'Alexander Apotheke', address: 'Alexanderplatz 7', coordinates: { latitude: 52.522, longitude: 13.411 }, distance: 350, walkingTime: 4 },
        { type: 'drugstore', name: 'dm-drogerie', address: 'Galeria Kaufhof', coordinates: { latitude: 52.5215, longitude: 13.4125 }, distance: 400, walkingTime: 5 },
        { type: 'shopping_center', name: 'Alexa', address: 'Grunerstraße 20', coordinates: { latitude: 52.5195, longitude: 13.4150 }, distance: 550, walkingTime: 7 },
      ],
      nearest: {
        supermarket: { type: 'supermarket', name: 'REWE City', address: 'Alexanderstraße 5', coordinates: { latitude: 52.520, longitude: 13.406 }, distance: 120, walkingTime: 2 },
        bakery: { type: 'bakery', name: 'Kamps Bäckerei', address: 'Karl-Liebknecht-Straße 12', coordinates: { latitude: 52.521, longitude: 13.407 }, distance: 200, walkingTime: 3 },
        pharmacy: { type: 'pharmacy', name: 'Alexander Apotheke', address: 'Alexanderplatz 7', coordinates: { latitude: 52.522, longitude: 13.411 }, distance: 350, walkingTime: 4 },
      },
    },
    health: {
      facilities: [
        { type: 'doctor', name: 'Dr. Müller Allgemeinmedizin', address: 'Alexanderstraße 10', coordinates: { latitude: 52.5205, longitude: 13.4065 }, distance: 150, walkingTime: 2 },
        { type: 'dentist', name: 'Zahnarztpraxis Mitte', address: 'Karl-Liebknecht-Straße 15', coordinates: { latitude: 52.5215, longitude: 13.4080 }, distance: 280, walkingTime: 4 },
        { type: 'hospital', name: 'Charité Campus Mitte', address: 'Charitéplatz 1', coordinates: { latitude: 52.5255, longitude: 13.3765 }, distance: 2100, walkingTime: 25 },
      ],
      nearest: {
        doctor: { type: 'doctor', name: 'Dr. Müller Allgemeinmedizin', address: 'Alexanderstraße 10', coordinates: { latitude: 52.5205, longitude: 13.4065 }, distance: 150, walkingTime: 2 },
        dentist: { type: 'dentist', name: 'Zahnarztpraxis Mitte', address: 'Karl-Liebknecht-Straße 15', coordinates: { latitude: 52.5215, longitude: 13.4080 }, distance: 280, walkingTime: 4 },
        hospital: { type: 'hospital', name: 'Charité Campus Mitte', address: 'Charitéplatz 1', coordinates: { latitude: 52.5255, longitude: 13.3765 }, distance: 2100, walkingTime: 25 },
      },
    },
    leisure: {
      facilities: [
        { type: 'park', name: 'Monbijoupark', address: 'Monbijoustraße', coordinates: { latitude: 52.5240, longitude: 13.3980 }, distance: 520, walkingTime: 7 },
        { type: 'restaurant', name: 'Restaurant Volt', address: 'Littenstraße 5', coordinates: { latitude: 52.5180, longitude: 13.4090 }, distance: 380, walkingTime: 5 },
        { type: 'cinema', name: 'CinemaxX', address: 'Alexanderplatz 5', coordinates: { latitude: 52.5215, longitude: 13.4120 }, distance: 420, walkingTime: 5 },
        { type: 'gym', name: 'Fitness First', address: 'Alexanderplatz 3', coordinates: { latitude: 52.5210, longitude: 13.4115 }, distance: 400, walkingTime: 5 },
        { type: 'library', name: 'Stadtbibliothek Mitte', address: 'Breite Straße 36', coordinates: { latitude: 52.5175, longitude: 13.4050 }, distance: 450, walkingTime: 6 },
      ],
      nearest: {
        park: { type: 'park', name: 'Monbijoupark', address: 'Monbijoustraße', coordinates: { latitude: 52.5240, longitude: 13.3980 }, distance: 520, walkingTime: 7 },
        restaurant: { type: 'restaurant', name: 'Restaurant Volt', address: 'Littenstraße 5', coordinates: { latitude: 52.5180, longitude: 13.4090 }, distance: 380, walkingTime: 5 },
        cinema: { type: 'cinema', name: 'CinemaxX', address: 'Alexanderplatz 5', coordinates: { latitude: 52.5215, longitude: 13.4120 }, distance: 420, walkingTime: 5 },
        gym: { type: 'gym', name: 'Fitness First', address: 'Alexanderplatz 3', coordinates: { latitude: 52.5210, longitude: 13.4115 }, distance: 400, walkingTime: 5 },
      },
    },
    scores: {
      transport: 95,
      shopping: 98,
      health: 85,
      leisure: 92,
      overall: 93,
    },
  };
}

function generateMockEnvironmentData(): EnvironmentData {
  return {
    airQuality: {
      pm25: 12.5,
      pm10: 23.8,
      no2: 28.4,
      o3: 45.2,
      aqi: 52,
      category: 'moderate',
      lastUpdated: new Date().toISOString(),
    },
    noise: {
      traffic: 65,
      aircraft: 45,
      railway: 50,
      industrial: 40,
      overall: 65,
      category: 'moderate',
    },
    greenSpaces: [
      { type: 'park', name: 'Monbijoupark', area: 25000, distance: 520, walkingTime: 7, coordinates: { latitude: 52.5240, longitude: 13.3980 } },
      { type: 'park', name: 'James-Simon-Park', area: 12000, distance: 680, walkingTime: 9, coordinates: { latitude: 52.5210, longitude: 13.3950 } },
      { type: 'water', name: 'Spree', area: 500000, distance: 450, walkingTime: 6, coordinates: { latitude: 52.5190, longitude: 13.3980 } },
      { type: 'garden', name: 'Lustgarten', area: 18000, distance: 750, walkingTime: 10, coordinates: { latitude: 52.5195, longitude: 13.3970 } },
    ],
    climate: {
      avgTemperature: 10.5,
      avgPrecipitation: 650,
      sunnyDays: 180,
      heatingDegreeDays: 3200,
      coolingDegreeDays: 150,
    },
    environmentScore: 72,
  };
}

function generateMockDemographicData(): DemographicData {
  return {
    population: 15420,
    density: 4850,
    ageDistribution: {
      '0-17': 15,
      '18-29': 28,
      '30-49': 32,
      '50-64': 16,
      '65+': 9,
      medianAge: 35,
    },
    genderRatio: {
      male: 51,
      female: 49,
    },
    nationality: {
      german: 68,
      eu: 18,
      nonEu: 14,
    },
    income: {
      averageHousehold: 58000,
      medianHousehold: 48000,
      perCapita: 32000,
    },
    employment: {
      employmentRate: 75,
      unemploymentRate: 4.8,
      trend: 'stable',
    },
    education: {
      noDegree: 8,
      vocational: 42,
      bachelors: 28,
      masters: 17,
      doctoral: 5,
    },
    demographicScore: 76,
  };
}

function generateMockDevelopmentData(): DevelopmentData {
  return {
    projects: [
      {
        name: 'Wohnquartier Am Park',
        type: 'residential',
        status: 'in_construction',
        expectedCompletion: '2025-12-01',
        investment: 45000000,
        description: 'Neues Wohnviertel mit 200 Wohnungen und Grünflächen',
        coordinates: { latitude: 52.5250, longitude: 13.4100 },
        impact: 'positive',
      },
      {
        name: 'Bürokomplex Alexanderplatz',
        type: 'commercial',
        status: 'approved',
        expectedCompletion: '2026-06-01',
        investment: 120000000,
        description: 'Modernes Bürogebäude mit 15.000 m² Fläche',
        coordinates: { latitude: 52.5210, longitude: 13.4140 },
        impact: 'positive',
      },
    ],
    plans: [
      {
        name: 'Stadtentwicklungskonzept Berlin 2030',
        type: 'masterplan',
        description: 'Nachhaltige Stadtentwicklung mit Fokus auf bezahlbaren Wohnraum, Grünflächen und verbesserten ÖPNV',
        timeframe: {
          start: '2024-01-01',
          end: '2030-12-31',
        },
        budget: 500000000,
        area: 25,
        goals: ['Klimaneutralität bis 2030', '50.000 neue Wohnungen', 'Ausbau U-Bahn Netz'],
      },
    ],
    publicInvestment: 125000000,
    valueForecast: {
      current: 5200,
      oneYear: 5460,
      threeYears: 6000,
      fiveYears: 6700,
      growthRate: 5.2,
      confidence: 'high',
      factors: ['Zentrale Lage', 'Exzellente Infrastruktur', 'Starke Nachfrage', 'Stadtentwicklungsprojekte'],
    },
    developmentScore: 85,
  };
}
