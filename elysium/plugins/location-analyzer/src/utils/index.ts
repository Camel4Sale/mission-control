/**
 * Utility functions for the Location Analyzer plugin
 */

import type { Coordinates } from '../types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
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

/**
 * Calculate walking time based on distance
 * @param distance Distance in meters
 * @param walkingSpeed Walking speed in km/h (default: 5 km/h)
 * @returns Walking time in minutes
 */
export function calculateWalkingTime(distance: number, walkingSpeed: number = 5): number {
  return Math.round((distance / (walkingSpeed * 1000)) * 60);
}

/**
 * Calculate driving time based on distance
 * @param distance Distance in meters
 * @param avgSpeed Average speed in km/h (default: 30 km/h for city)
 * @returns Driving time in minutes
 */
export function calculateDrivingTime(distance: number, avgSpeed: number = 30): number {
  return Math.round((distance / (avgSpeed * 1000)) * 60);
}

/**
 * Format distance for display
 * @param distance Distance in meters
 * @returns Formatted string (e.g., "1.2 km" or "450 m")
 */
export function formatDistance(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  return `${Math.round(distance)} m`;
}

/**
 * Format currency for display
 * @param amount Amount in EUR
 * @returns Formatted string (e.g., "€1.234")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate score based on multiple factors with weights
 */
export function calculateWeightedScore(
  factors: Record<string, { value: number; weight: number }>
): number {
  const totalWeight = Object.values(factors).reduce((sum, f) => sum + f.weight, 0);
  const weightedSum = Object.values(factors).reduce((sum, f) => sum + f.value * f.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalize a value to a 0-100 scale
 */
export function normalizeToScore(value: number, min: number, max: number): number {
  if (max === min) return 50;
  const normalized = ((value - min) / (max - min)) * 100;
  return clamp(Math.round(normalized), 0, 100);
}

/**
 * Get trend icon and color
 */
export function getTrendIndicator(trend: 'increasing' | 'decreasing' | 'stable') {
  switch (trend) {
    case 'increasing':
      return { icon: '↑', color: 'text-red-600', bg: 'bg-red-50' };
    case 'decreasing':
      return { icon: '↓', color: 'text-green-600', bg: 'bg-green-50' };
    case 'stable':
      return { icon: '→', color: 'text-gray-600', bg: 'bg-gray-50' };
  }
}

/**
 * Get AQI category and color
 */
export function getAirQualityCategory(aqi: number) {
  if (aqi <= 50) {
    return { category: 'good', color: 'text-green-600', bg: 'bg-green-50' };
  } else if (aqi <= 100) {
    return { category: 'moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  } else if (aqi <= 150) {
    return { category: 'unhealthy_sensitive', color: 'text-orange-600', bg: 'bg-orange-50' };
  } else if (aqi <= 200) {
    return { category: 'unhealthy', color: 'text-red-600', bg: 'bg-red-50' };
  } else if (aqi <= 300) {
    return { category: 'very_unhealthy', color: 'text-purple-600', bg: 'bg-purple-50' };
  } else {
    return { category: 'hazardous', color: 'text-maroon-600', bg: 'bg-maroon-50' };
  }
}

/**
 * Get noise level category
 */
export function getNoiseCategory(db: number) {
  if (db < 55) {
    return { category: 'quiet', color: 'text-green-600' };
  } else if (db < 65) {
    return { category: 'moderate', color: 'text-yellow-600' };
  } else if (db < 75) {
    return { category: 'loud', color: 'text-orange-600' };
  } else {
    return { category: 'very_loud', color: 'text-red-600' };
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if coordinates are valid
 */
export function isValidCoordinates(coords: Coordinates): boolean {
  return (
    typeof coords.latitude === 'number' &&
    typeof coords.longitude === 'number' &&
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
}

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate bearing between two points
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

/**
 * Calculate midpoint between two coordinates
 */
export function calculateMidpoint(from: Coordinates, to: Coordinates): Coordinates {
  return {
    latitude: (from.latitude + to.latitude) / 2,
    longitude: (from.longitude + to.longitude) / 2,
  };
}

/**
 * Format date for German locale
 */
export function formatDateGerman(date: Date | string): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number, showSign: boolean = true): string {
  const formatted = value.toFixed(1);
  if (showSign && value > 0) {
    return `+${formatted}%`;
  }
  return `${formatted}%`;
}
