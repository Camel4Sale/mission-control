/**
 * Location Analyzer Plugin - Main Entry Point
 */

export { LocationAnalyzer } from './components/LocationAnalyzer';
export {
  analyzeLocation,
  fetchCrimeData,
  fetchEducationData,
  fetchInfrastructureData,
  fetchEnvironmentData,
  fetchDemographicData,
  fetchDevelopmentData,
  geocodeAddress,
  reverseGeocode,
} from './services';

export type {
  // Main types
  LocationAnalysis,
  ComparisonResult,
  Coordinates,
  Location,
  
  // Crime
  CrimeData,
  CrimeStatistic,
  CrimeCategory,
  HeatmapPoint,
  
  // Education
  EducationData,
  EducationFacility,
  EducationRating,
  SchoolType,
  FacilityType,
  PlannedEducationProject,
  
  // Infrastructure
  InfrastructureData,
  InfrastructureScore,
  TransportStop,
  ShoppingFacility,
  HealthFacility,
  LeisureFacility,
  
  // Environment
  EnvironmentData,
  AirQuality,
  NoiseLevel,
  GreenSpace,
  ClimateData,
  
  // Demographics
  DemographicData,
  AgeDistribution,
  
  // Development
  DevelopmentData,
  ConstructionProject,
  DevelopmentPlan,
  ValueForecast,
} from './types';
