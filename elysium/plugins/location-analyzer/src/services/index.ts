/**
 * Location Analyzer Services
 * Data fetching and processing for all analysis categories
 */

import type {
  Coordinates,
  Location,
  CrimeData,
  EducationData,
  InfrastructureData,
  EnvironmentData,
  DemographicData,
  DevelopmentData,
  LocationAnalysis,
} from '../types';

// ==================== CONFIGURATION ====================

const API_ENDPOINTS = {
  // OpenStreetMap Overpass API
  overpass: 'https://overpass-api.de/api/interpreter',
  
  // OpenRouteService (routing, isochrones)
  ors: 'https://api.openrouteservice.org/v2',
  
  // Umweltbundesamt (German Environment Agency)
  uba: 'https://www.umweltbundesamt.de/api',
  
  // Destatis (Federal Statistical Office)
  destatis: 'https://www.destatis.de/api',
} as const;

// ==================== GEOCODING SERVICE ====================

export async function geocodeAddress(address: string): Promise<Coordinates> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  
  if (!response.ok) {
    throw new Error('Geocoding failed');
  }
  
  const data = await response.json();
  
  if (!data || data.length === 0) {
    throw new Error('Address not found');
  }
  
  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<Location> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );
  
  if (!response.ok) {
    throw new Error('Reverse geocoding failed');
  }
  
  const data = await response.json();
  
  return {
    address: data.display_name,
    city: data.address?.city || data.address?.town || data.address?.village || '',
    district: data.address?.suburb || data.address?.neighbourhood || '',
    postalCode: data.address?.postcode || '',
    coordinates: { latitude: lat, longitude: lon },
  };
}

// ==================== CRIME DATA SERVICE ====================

export async function fetchCrimeData(
  coordinates: Coordinates,
  radius: number = 1000
): Promise<CrimeData> {
  // Mock data for demonstration - in production, integrate with BKA API
  // This would fetch from Polizeiliche Kriminalstatistik
  
  const mockCrimeData: CrimeData = {
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
    heatmapPoints: generateHeatmapPoints(coordinates, radius),
    safetyScore: calculateSafetyScore(coordinates),
  };
  
  return mockCrimeData;
}

function generateHeatmapPoints(center: Coordinates, radius: number) {
  const points = [];
  const count = 50;
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;
    
    points.push({
      latitude: center.latitude + (distance * Math.cos(angle)) / 111000,
      longitude: center.longitude + (distance * Math.sin(angle)) / (111000 * Math.cos(center.latitude * Math.PI / 180)),
      intensity: Math.random(),
      category: ['violence', 'property', 'drugs', 'other'][Math.floor(Math.random() * 4)] as any,
    });
  }
  
  return points;
}

function calculateSafetyScore(coordinates: Coordinates): number {
  // Mock calculation - would be based on actual crime statistics
  const baseScore = 75;
  const variation = (Math.sin(coordinates.latitude) + Math.cos(coordinates.longitude)) * 10;
  return Math.max(0, Math.min(100, baseScore + variation));
}

// ==================== EDUCATION DATA SERVICE ====================

export async function fetchEducationData(
  coordinates: Coordinates,
  radius: number = 1000
): Promise<EducationData> {
  // Fetch schools and kindergartens from OpenStreetMap
  const schools = await fetchSchoolsFromOSM(coordinates, radius);
  const kitas = await fetchKitasFromOSM(coordinates, radius);
  
  const allFacilities = [...schools, ...kitas];
  const averageRating = allFacilities.reduce((sum, f) => sum + (f.rating || 0), 0) / allFacilities.length || 0;
  
  return {
    schools,
    kitas,
    averageRating: Math.round(averageRating * 10) / 10,
    coverageScore: calculateEducationCoverage(schools, kitas, radius),
    plannedProjects: await fetchPlannedEducationProjects(coordinates),
  };
}

async function fetchSchoolsFromOSM(coordinates: Coordinates, radius: number) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="school"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      way["amenity"="school"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      relation["amenity"="school"](around:${radius},${coordinates.latitude},${coordinates.longitude});
    );
    out center;
  `;
  
  try {
    const response = await fetch(API_ENDPOINTS.overpass, {
      method: 'POST',
      body: query,
    });
    
    if (!response.ok) {
      throw new Error('OSM query failed');
    }
    
    const data = await response.json();
    
    return data.elements.map((element: any) => ({
      id: `school_${element.id}`,
      name: element.tags.name || 'Unbekannte Schule',
      type: (element.tags.school || 'grundschule') as any,
      address: element.tags.addr?.full || '',
      coordinates: {
        latitude: element.lat || element.center?.lat || 0,
        longitude: element.lon || element.center?.lon || 0,
      },
      distance: calculateDistance(coordinates, {
        latitude: element.lat || element.center?.lat || 0,
        longitude: element.lon || element.center?.lon || 0,
      }),
      walkingTime: 0,
      drivingTime: 0,
      rating: Math.random() * 2 + 3, // Mock rating 3-5
    }));
  } catch (error) {
    console.error('Failed to fetch schools:', error);
    return [];
  }
}

async function fetchKitasFromOSM(coordinates: Coordinates, radius: number) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="kindergarten"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      way["amenity"="kindergarten"](around:${radius},${coordinates.latitude},${coordinates.longitude});
    );
    out center;
  `;
  
  try {
    const response = await fetch(API_ENDPOINTS.overpass, {
      method: 'POST',
      body: query,
    });
    
    const data = await response.json();
    
    return data.elements.map((element: any) => ({
      id: `kita_${element.id}`,
      name: element.tags.name || 'Unbekannte Kita',
      type: 'kita' as const,
      address: element.tags.addr?.full || '',
      coordinates: {
        latitude: element.lat || element.center?.lat || 0,
        longitude: element.lon || element.center?.lon || 0,
      },
      distance: calculateDistance(coordinates, {
        latitude: element.lat || element.center?.lat || 0,
        longitude: element.lon || element.center?.lon || 0,
      }),
      walkingTime: 0,
      drivingTime: 0,
      rating: Math.random() * 2 + 3,
      costs: Math.random() * 300 + 100,
    }));
  } catch (error) {
    console.error('Failed to fetch kitas:', error);
    return [];
  }
}

async function fetchPlannedEducationProjects(coordinates: Coordinates) {
  // Mock data - would integrate with city planning APIs
  return [
    {
      name: 'Neue Grundschule Nord',
      type: 'grundschule' as const,
      status: 'planned' as const,
      expectedCompletion: '2026-09-01',
      capacity: 400,
      location: {
        latitude: coordinates.latitude + 0.01,
        longitude: coordinates.longitude + 0.01,
      },
    },
  ];
}

function calculateEducationCoverage(schools: any[], kitas: any[], radius: number): number {
  const idealRatio = 0.5; // 1 school per 500 residents (mock)
  const actualRatio = (schools.length + kitas.length) / (radius * radius * Math.PI / 1000000);
  
  if (actualRatio >= idealRatio) {
    return 100;
  }
  
  return Math.round((actualRatio / idealRatio) * 100);
}

// ==================== INFRASTRUCTURE DATA SERVICE ====================

export async function fetchInfrastructureData(
  coordinates: Coordinates,
  radius: number = 1000
): Promise<InfrastructureData> {
  const transport = await fetchTransportData(coordinates, radius);
  const shopping = await fetchShoppingData(coordinates, radius);
  const health = await fetchHealthData(coordinates, radius);
  const leisure = await fetchLeisureData(coordinates, radius);
  
  const scores = calculateInfrastructureScores(transport, shopping, health, leisure);
  
  return {
    transport,
    shopping,
    health,
    leisure,
    scores,
  };
}

async function fetchTransportData(coordinates: Coordinates, radius: number) {
  const query = `
    [out:json][timeout:25];
    (
      node["public_transport"="stop_position"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["highway"="bus_stop"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["railway"="station"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["railway"="tram_stop"](around:${radius},${coordinates.latitude},${coordinates.longitude});
    );
    out center;
  `;
  
  try {
    const response = await fetch(API_ENDPOINTS.overpass, {
      method: 'POST',
      body: query,
    });
    
    const data = await response.json();
    
    const stops = data.elements.map((element: any) => {
      const type = element.tags.railway 
        ? (element.tags.railway === 'station' ? 'train' : 'tram')
        : 'bus';
      
      return {
        id: `stop_${element.id}`,
        name: element.tags.name || 'Haltestelle',
        type: type as any,
        lines: element.tags.ref ? [element.tags.ref] : [],
        coordinates: {
          latitude: element.lat || 0,
          longitude: element.lon || 0,
        },
        distance: calculateDistance(coordinates, {
          latitude: element.lat || 0,
          longitude: element.lon || 0,
        }),
        walkingTime: 0,
        frequency: {
          peak: 10,
          offPeak: 20,
        },
      };
    });
    
    const nearestStop = stops.sort((a, b) => a.distance - b.distance)[0];
    
    return {
      stops,
      nearestStop: nearestStop || null,
      connectivityScore: stops.length > 5 ? 90 : stops.length > 2 ? 70 : 50,
    };
  } catch (error) {
    console.error('Failed to fetch transport:', error);
    return { stops: [], nearestStop: null, connectivityScore: 0 };
  }
}

async function fetchShoppingData(coordinates: Coordinates, radius: number) {
  const query = `
    [out:json][timeout:25];
    (
      node["shop"="supermarket"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["shop"="bakery"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["amenity"="pharmacy"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["shop"="mall"](around:${radius},${coordinates.latitude},${coordinates.longitude});
    );
    out center;
  `;
  
  try {
    const response = await fetch(API_ENDPOINTS.overpass, {
      method: 'POST',
      body: query,
    });
    
    const data = await response.json();
    
    const facilities = data.elements.map((element: any) => ({
      type: (element.tags.shop === 'mall' ? 'shopping_center' : 
             element.tags.shop === 'bakery' ? 'bakery' :
             element.tags.amenity === 'pharmacy' ? 'pharmacy' : 'supermarket') as any,
      name: element.tags.name || 'Geschäft',
      address: element.tags.addr?.full || '',
      coordinates: {
        latitude: element.lat || 0,
        longitude: element.lon || 0,
      },
      distance: calculateDistance(coordinates, {
        latitude: element.lat || 0,
        longitude: element.lon || 0,
      }),
      walkingTime: 0,
    }));
    
    const nearest = facilities.reduce((acc, f) => {
      acc[f.type] = !acc[f.type] || f.distance < acc[f.type].distance ? f : acc[f.type];
      return acc;
    }, {} as Record<string, any>);
    
    return { facilities, nearest };
  } catch (error) {
    console.error('Failed to fetch shopping:', error);
    return { facilities: [], nearest: {} };
  }
}

async function fetchHealthData(coordinates: Coordinates, radius: number) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="doctors"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["amenity"="dentist"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["amenity"="hospital"](around:${radius},${coordinates.latitude},${coordinates.longitude});
    );
    out center;
  `;
  
  try {
    const response = await fetch(API_ENDPOINTS.overpass, {
      method: 'POST',
      body: query,
    });
    
    const data = await response.json();
    
    const facilities = data.elements.map((element: any) => ({
      type: (element.tags.amenity === 'hospital' ? 'hospital' :
             element.tags.amenity === 'dentist' ? 'dentist' : 'doctor') as any,
      name: element.tags.name || 'Praxis',
      specialty: element.tags.healthcare?.speciality,
      address: element.tags.addr?.full || '',
      coordinates: {
        latitude: element.lat || 0,
        longitude: element.lon || 0,
      },
      distance: calculateDistance(coordinates, {
        latitude: element.lat || 0,
        longitude: element.lon || 0,
      }),
      walkingTime: 0,
    }));
    
    const nearest = facilities.reduce((acc, f) => {
      acc[f.type] = !acc[f.type] || f.distance < acc[f.type].distance ? f : acc[f.type];
      return acc;
    }, {} as Record<string, any>);
    
    return { facilities, nearest };
  } catch (error) {
    console.error('Failed to fetch health:', error);
    return { facilities: [], nearest: {} };
  }
}

async function fetchLeisureData(coordinates: Coordinates, radius: number) {
  const query = `
    [out:json][timeout:25];
    (
      node["leisure"="park"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["amenity"="restaurant"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["amenity"="cinema"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      node["leisure"="fitness_centre"](around:${radius},${coordinates.latitude},${coordinates.longitude});
    );
    out center;
  `;
  
  try {
    const response = await fetch(API_ENDPOINTS.overpass, {
      method: 'POST',
      body: query,
    });
    
    const data = await response.json();
    
    const facilities = data.elements.map((element: any) => ({
      type: (element.tags.leisure === 'park' ? 'park' :
             element.tags.amenity === 'restaurant' ? 'restaurant' :
             element.tags.amenity === 'cinema' ? 'cinema' : 'gym') as any,
      name: element.tags.name || 'Einrichtung',
      address: element.tags.addr?.full || '',
      coordinates: {
        latitude: element.lat || 0,
        longitude: element.lon || 0,
      },
      distance: calculateDistance(coordinates, {
        latitude: element.lat || 0,
        longitude: element.lon || 0,
      }),
      walkingTime: 0,
    }));
    
    const nearest = facilities.reduce((acc, f) => {
      acc[f.type] = !acc[f.type] || f.distance < acc[f.type].distance ? f : acc[f.type];
      return acc;
    }, {} as Record<string, any>);
    
    return { facilities, nearest };
  } catch (error) {
    console.error('Failed to fetch leisure:', error);
    return { facilities: [], nearest: {} };
  }
}

function calculateInfrastructureScores(transport: any, shopping: any, health: any, leisure: any) {
  const transportScore = transport.connectivityScore;
  const shoppingScore = Math.min(100, shopping.facilities.length * 20);
  const healthScore = Math.min(100, health.facilities.length * 25);
  const leisureScore = Math.min(100, leisure.facilities.length * 15);
  
  const overall = Math.round(
    (transportScore * 0.3 + shoppingScore * 0.25 + healthScore * 0.25 + leisureScore * 0.2)
  );
  
  return {
    transport: transportScore,
    shopping: shoppingScore,
    health: healthScore,
    leisure: leisureScore,
    overall,
  };
}

// ==================== ENVIRONMENT DATA SERVICE ====================

export async function fetchEnvironmentData(
  coordinates: Coordinates,
  radius: number = 1000
): Promise<EnvironmentData> {
  const airQuality = await fetchAirQuality(coordinates);
  const noise = await fetchNoiseData(coordinates);
  const greenSpaces = await fetchGreenSpaces(coordinates, radius);
  const climate = await fetchClimateData(coordinates);
  
  const environmentScore = calculateEnvironmentScore(airQuality, noise, greenSpaces);
  
  return {
    airQuality,
    noise,
    greenSpaces,
    climate,
    environmentScore,
  };
}

async function fetchAirQuality(coordinates: Coordinates) {
  // Mock data - would integrate with UBA API
  return {
    pm25: 12.5,
    pm10: 23.8,
    no2: 28.4,
    o3: 45.2,
    aqi: 52,
    category: 'moderate' as const,
    lastUpdated: new Date().toISOString(),
  };
}

async function fetchNoiseData(coordinates: Coordinates) {
  // Mock data - would integrate with noise mapping services
  return {
    traffic: 65,
    aircraft: 45,
    railway: 50,
    industrial: 40,
    overall: 65,
    category: 'moderate' as const,
  };
}

async function fetchGreenSpaces(coordinates: Coordinates, radius: number) {
  const query = `
    [out:json][timeout:25];
    (
      node["leisure"="park"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      way["leisure"="park"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      way["landuse"="forest"](around:${radius},${coordinates.latitude},${coordinates.longitude});
      way["natural"="water"](around:${radius},${coordinates.latitude},${coordinates.longitude});
    );
    out center;
  `;
  
  try {
    const response = await fetch(API_ENDPOINTS.overpass, {
      method: 'POST',
      body: query,
    });
    
    const data = await response.json();
    
    return data.elements.map((element: any) => ({
      type: (element.tags.leisure === 'park' ? 'park' :
             element.tags.landuse === 'forest' ? 'forest' :
             element.tags.natural === 'water' ? 'water' : 'park') as any,
      name: element.tags.name || 'Grünfläche',
      area: element.tags.area || Math.random() * 10000 + 1000,
      distance: calculateDistance(coordinates, {
        latitude: element.lat || element.center?.lat || 0,
        longitude: element.lon || element.center?.lon || 0,
      }),
      walkingTime: 0,
      coordinates: {
        latitude: element.lat || element.center?.lat || 0,
        longitude: element.lon || element.center?.lon || 0,
      },
    }));
  } catch (error) {
    console.error('Failed to fetch green spaces:', error);
    return [];
  }
}

async function fetchClimateData(coordinates: Coordinates) {
  // Mock data - would integrate with weather APIs
  return {
    avgTemperature: 10.5,
    avgPrecipitation: 650,
    sunnyDays: 180,
    heatingDegreeDays: 3200,
    coolingDegreeDays: 150,
  };
}

function calculateEnvironmentScore(airQuality: any, noise: any, greenSpaces: any[]) {
  const airScore = airQuality.aqi < 50 ? 100 : airQuality.aqi < 100 ? 70 : 40;
  const noiseScore = noise.overall < 55 ? 100 : noise.overall < 65 ? 70 : 40;
  const greenScore = Math.min(100, greenSpaces.length * 20);
  
  return Math.round((airScore * 0.4 + noiseScore * 0.3 + greenScore * 0.3));
}

// ==================== DEMOGRAPHIC DATA SERVICE ====================

export async function fetchDemographicData(
  coordinates: Coordinates,
  radius: number = 1000
): Promise<DemographicData> {
  // Mock data - would integrate with Destatis API
  return {
    population: 15000,
    density: 4500,
    ageDistribution: {
      '0-17': 18,
      '18-29': 22,
      '30-49': 30,
      '50-64': 18,
      '65+': 12,
      medianAge: 38,
    },
    genderRatio: {
      male: 49,
      female: 51,
    },
    nationality: {
      german: 75,
      eu: 15,
      nonEu: 10,
    },
    income: {
      averageHousehold: 52000,
      medianHousehold: 45000,
      perCapita: 28000,
    },
    employment: {
      employmentRate: 72,
      unemploymentRate: 5.2,
      trend: 'stable' as const,
    },
    education: {
      noDegree: 10,
      vocational: 45,
      bachelors: 25,
      masters: 15,
      doctoral: 5,
    },
    demographicScore: 72,
  };
}

// ==================== DEVELOPMENT DATA SERVICE ====================

export async function fetchDevelopmentData(
  coordinates: Coordinates,
  radius: number = 1000
): Promise<DevelopmentData> {
  // Mock data - would integrate with city planning APIs
  const projects: any[] = [
    {
      name: 'Wohnquartier Am Park',
      type: 'residential' as const,
      status: 'in_construction' as const,
      expectedCompletion: '2025-12-01',
      investment: 45000000,
      description: 'Neues Wohnviertel mit 200 Wohnungen',
      coordinates: {
        latitude: coordinates.latitude + 0.005,
        longitude: coordinates.longitude + 0.005,
      },
      impact: 'positive' as const,
    },
  ];
  
  const plans: any[] = [
    {
      name: 'Stadtentwicklungskonzept 2030',
      type: 'masterplan' as const,
      description: 'Nachhaltige Stadtentwicklung mit Fokus auf Grünflächen und ÖPNV',
      timeframe: {
        start: '2024-01-01',
        end: '2030-12-31',
      },
      budget: 500000000,
      area: 25,
      goals: ['Klimaneutralität', 'Bezahlbarer Wohnraum', 'Verbesserter ÖPNV'],
    },
  ];
  
  return {
    projects,
    plans,
    publicInvestment: 125000000,
    valueForecast: {
      current: 4500,
      oneYear: 4680,
      threeYears: 5100,
      fiveYears: 5600,
      growthRate: 4.2,
      confidence: 'medium' as const,
      factors: ['Gute Infrastruktur', 'Stadtnähe', 'Nachfrage steigt'],
    },
    developmentScore: 78,
  };
}

// ==================== MAIN ANALYSIS FUNCTION ====================

export async function analyzeLocation(
  coordinates: Coordinates,
  radius: number = 1000
): Promise<LocationAnalysis> {
  const location = await reverseGeocode(coordinates.latitude, coordinates.longitude);
  
  const [crime, education, infrastructure, environment, demographics, development] = await Promise.all([
    fetchCrimeData(coordinates, radius),
    fetchEducationData(coordinates, radius),
    fetchInfrastructureData(coordinates, radius),
    fetchEnvironmentData(coordinates, radius),
    fetchDemographicData(coordinates, radius),
    fetchDevelopmentData(coordinates, radius),
  ]);
  
  const overallScore = calculateOverallScore({
    crime: crime.safetyScore,
    education: education.coverageScore,
    infrastructure: infrastructure.scores.overall,
    environment: environment.environmentScore,
    demographics: demographics.demographicScore,
    development: development.developmentScore,
  });
  
  const recommendation = generateRecommendation(overallScore, development.valueForecast);
  
  return {
    location,
    radius,
    timestamp: new Date().toISOString(),
    crime,
    education,
    infrastructure,
    environment,
    demographics,
    development,
    overallScore,
    investmentRecommendation: recommendation.type,
    recommendationReasons: recommendation.reasons,
  };
}

function calculateOverallScore(scores: {
  crime: number;
  education: number;
  infrastructure: number;
  environment: number;
  demographics: number;
  development: number;
}): number {
  const weights = {
    crime: 0.2,
    education: 0.15,
    infrastructure: 0.25,
    environment: 0.15,
    demographics: 0.1,
    development: 0.15,
  };
  
  return Math.round(
    scores.crime * weights.crime +
    scores.education * weights.education +
    scores.infrastructure * weights.infrastructure +
    scores.environment * weights.environment +
    scores.demographics * weights.demographics +
    scores.development * weights.development
  );
}

function generateRecommendation(overallScore: number, forecast: any) {
  if (overallScore >= 75 && forecast.growthRate > 3) {
    return {
      type: 'buy' as const,
      reasons: [
        'Hoher Gesamt-Score',
        'Positive Wertentwicklung erwartet',
        'Gute Infrastruktur',
      ],
    };
  } else if (overallScore >= 60) {
    return {
      type: 'hold' as const,
      reasons: [
        'Durchschnittlicher Score',
        'Stabile Entwicklung',
        'Abwarten weiterer Entwicklungen',
      ],
    };
  } else {
    return {
      type: 'avoid' as const,
      reasons: [
        'Niedriger Gesamt-Score',
        'Infrastruktur verbesserungswürdig',
        'Bessere Alternativen verfügbar',
      ],
    };
  }
}

// ==================== UTILITY FUNCTIONS ====================

function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
