import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateDistance, formatDistance, calculateWalkingTime, normalizeToScore } from '../utils';
import type { Coordinates } from '../../types';

describe('Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const from: Coordinates = { latitude: 52.5200, longitude: 13.4050 };
      const to: Coordinates = { latitude: 52.5210, longitude: 13.4060 };
      
      const distance = calculateDistance(from, to);
      
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(200); // Should be around 130m
    });

    it('should return 0 for same coordinates', () => {
      const coords: Coordinates = { latitude: 52.5200, longitude: 13.4050 };
      const distance = calculateDistance(coords, coords);
      
      expect(distance).toBe(0);
    });
  });

  describe('formatDistance', () => {
    it('should format distances less than 1000m in meters', () => {
      expect(formatDistance(450)).toBe('450 m');
      expect(formatDistance(999)).toBe('999 m');
    });

    it('should format distances 1000m and above in kilometers', () => {
      expect(formatDistance(1000)).toBe('1.0 km');
      expect(formatDistance(1500)).toBe('1.5 km');
      expect(formatDistance(12345)).toBe('12.3 km');
    });
  });

  describe('calculateWalkingTime', () => {
    it('should calculate walking time at default speed (5 km/h)', () => {
      expect(calculateWalkingTime(500)).toBe(6); // 500m ≈ 6 min
      expect(calculateWalkingTime(1000)).toBe(12); // 1km ≈ 12 min
    });

    it('should calculate walking time at custom speed', () => {
      expect(calculateWalkingTime(1000, 4)).toBe(15); // 1km at 4 km/h
      expect(calculateWalkingTime(1000, 6)).toBe(10); // 1km at 6 km/h
    });
  });

  describe('normalizeToScore', () => {
    it('should normalize value to 0-100 scale', () => {
      expect(normalizeToScore(50, 0, 100)).toBe(50);
      expect(normalizeToScore(75, 0, 100)).toBe(75);
      expect(normalizeToScore(0, 0, 100)).toBe(0);
      expect(normalizeToScore(100, 0, 100)).toBe(100);
    });

    it('should clamp values outside range', () => {
      expect(normalizeToScore(-10, 0, 100)).toBe(0);
      expect(normalizeToScore(150, 0, 100)).toBe(100);
    });

    it('should handle custom ranges', () => {
      expect(normalizeToScore(15, 10, 20)).toBe(50);
      expect(normalizeToScore(12.5, 10, 20)).toBe(25);
    });
  });
});
