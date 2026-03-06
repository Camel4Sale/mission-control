/**
 * Location Analyzer API Routes
 * Server-side endpoints for data fetching
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  analyzeLocation,
  fetchCrimeData,
  fetchEducationData,
  fetchInfrastructureData,
  fetchEnvironmentData,
  fetchDemographicData,
  fetchDevelopmentData,
} from '../services';
import type { LocationAnalysis, ApiError, Coordinates } from '../types';

interface AnalyzeRequest {
  latitude: number;
  longitude: number;
  radius?: number;
}

interface CompareRequest {
  locations: Array<{
    id: string;
    latitude: number;
    longitude: number;
    radius?: number;
  }>;
}

/**
 * POST /api/location-analyzer/analyze
 * Analyze a single location
 */
export async function analyzeHandler(
  req: NextApiRequest,
  res: NextApiResponse<LocationAnalysis | ApiError>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only POST is allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { latitude, longitude, radius = 1000 }: AnalyzeRequest = req.body;

    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'latitude and longitude must be numbers',
        code: 'INVALID_COORDINATES',
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: 'Coordinates out of range',
        message: 'latitude must be -90 to 90, longitude must be -180 to 180',
        code: 'COORDINATES_OUT_OF_RANGE',
      });
    }

    // Validate radius
    if (radius < 100 || radius > 50000) {
      return res.status(400).json({
        error: 'Invalid radius',
        message: 'radius must be between 100 and 50000 meters',
        code: 'INVALID_RADIUS',
      });
    }

    const coordinates: Coordinates = { latitude, longitude };
    const analysis = await analyzeLocation(coordinates, radius);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Location analysis error:', error);
    return res.status(500).json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'ANALYSIS_FAILED',
    });
  }
}

/**
 * POST /api/location-analyzer/compare
 * Compare multiple locations
 */
export async function compareHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only POST is allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { locations }: CompareRequest = req.body;

    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        error: 'Invalid locations',
        message: 'locations must be a non-empty array',
        code: 'INVALID_LOCATIONS',
      });
    }

    if (locations.length > 5) {
      return res.status(400).json({
        error: 'Too many locations',
        message: 'Maximum 5 locations can be compared at once',
        code: 'TOO_MANY_LOCATIONS',
      });
    }

    const analyses = await Promise.all(
      locations.map(async (loc) => {
        const coordinates: Coordinates = {
          latitude: loc.latitude,
          longitude: loc.longitude,
        };
        const analysis = await analyzeLocation(coordinates, loc.radius || 1000);
        return {
          id: loc.id,
          analysis,
        };
      })
    );

    // Find winner
    let bestScore = -1;
    let winner: string | null = null;

    analyses.forEach(({ id, analysis }) => {
      if (analysis.overallScore > bestScore) {
        bestScore = analysis.overallScore;
        winner = id;
      }
    });

    return res.status(200).json({
      locations: analyses.map(({ id, analysis }) => ({ id, ...analysis })),
      winner,
      scores: analyses.reduce((acc, { id, analysis }) => {
        acc[id] = {
          overall: analysis.overallScore,
          crime: analysis.crime.safetyScore,
          education: analysis.education.coverageScore,
          infrastructure: analysis.infrastructure.scores.overall,
          environment: analysis.environment.environmentScore,
          demographics: analysis.demographics.demographicScore,
          development: analysis.development.developmentScore,
        };
        return acc;
      }, {} as Record<string, any>),
    });
  } catch (error) {
    console.error('Location comparison error:', error);
    return res.status(500).json({
      error: 'Comparison failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'COMPARISON_FAILED',
    });
  }
}

/**
 * GET /api/location-analyzer/crime
 * Get crime data for a location
 */
export async function crimeHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only GET is allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { lat, lon, radius = '1000' } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const radiusNum = parseInt(radius as string, 10);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'lat and lon must be valid numbers',
        code: 'INVALID_COORDINATES',
      });
    }

    const coordinates: Coordinates = { latitude, longitude };
    const crimeData = await fetchCrimeData(coordinates, radiusNum);

    return res.status(200).json(crimeData);
  } catch (error) {
    console.error('Crime data error:', error);
    return res.status(500).json({
      error: 'Failed to fetch crime data',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'CRIME_DATA_FAILED',
    });
  }
}

/**
 * GET /api/location-analyzer/education
 * Get education data for a location
 */
export async function educationHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only GET is allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { lat, lon, radius = '1000' } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const radiusNum = parseInt(radius as string, 10);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'lat and lon must be valid numbers',
        code: 'INVALID_COORDINATES',
      });
    }

    const coordinates: Coordinates = { latitude, longitude };
    const educationData = await fetchEducationData(coordinates, radiusNum);

    return res.status(200).json(educationData);
  } catch (error) {
    console.error('Education data error:', error);
    return res.status(500).json({
      error: 'Failed to fetch education data',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'EDUCATION_DATA_FAILED',
    });
  }
}

/**
 * GET /api/location-analyzer/infrastructure
 * Get infrastructure data for a location
 */
export async function infrastructureHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only GET is allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { lat, lon, radius = '1000' } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const radiusNum = parseInt(radius as string, 10);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'lat and lon must be valid numbers',
        code: 'INVALID_COORDINATES',
      });
    }

    const coordinates: Coordinates = { latitude, longitude };
    const infrastructureData = await fetchInfrastructureData(coordinates, radiusNum);

    return res.status(200).json(infrastructureData);
  } catch (error) {
    console.error('Infrastructure data error:', error);
    return res.status(500).json({
      error: 'Failed to fetch infrastructure data',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'INFRASTRUCTURE_DATA_FAILED',
    });
  }
}

/**
 * GET /api/location-analyzer/environment
 * Get environment data for a location
 */
export async function environmentHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only GET is allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { lat, lon, radius = '1000' } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const radiusNum = parseInt(radius as string, 10);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'lat and lon must be valid numbers',
        code: 'INVALID_COORDINATES',
      });
    }

    const coordinates: Coordinates = { latitude, longitude };
    const environmentData = await fetchEnvironmentData(coordinates, radiusNum);

    return res.status(200).json(environmentData);
  } catch (error) {
    console.error('Environment data error:', error);
    return res.status(500).json({
      error: 'Failed to fetch environment data',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'ENVIRONMENT_DATA_FAILED',
    });
  }
}

/**
 * GET /api/location-analyzer/demographics
 * Get demographic data for a location
 */
export async function demographicsHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only GET is allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { lat, lon, radius = '1000' } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const radiusNum = parseInt(radius as string, 10);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'lat and lon must be valid numbers',
        code: 'INVALID_COORDINATES',
      });
    }

    const coordinates: Coordinates = { latitude, longitude };
    const demographicData = await fetchDemographicData(coordinates, radiusNum);

    return res.status(200).json(demographicData);
  } catch (error) {
    console.error('Demographic data error:', error);
    return res.status(500).json({
      error: 'Failed to fetch demographic data',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'DEMOGRAPHIC_DATA_FAILED',
    });
  }
}

/**
 * GET /api/location-analyzer/development
 * Get development data for a location
 */
export async function developmentHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only GET is allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { lat, lon, radius = '1000' } = req.query;
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const radiusNum = parseInt(radius as string, 10);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'lat and lon must be valid numbers',
        code: 'INVALID_COORDINATES',
      });
    }

    const coordinates: Coordinates = { latitude, longitude };
    const developmentData = await fetchDevelopmentData(coordinates, radiusNum);

    return res.status(200).json(developmentData);
  } catch (error) {
    console.error('Development data error:', error);
    return res.status(500).json({
      error: 'Failed to fetch development data',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'DEVELOPMENT_DATA_FAILED',
    });
  }
}

// Export handlers for Next.js API routes
export {
  analyzeHandler as POST,
  crimeHandler as GET,
};
