'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LocationAnalysis, Coordinates } from '../../types';
import { analyzeLocation } from '../../services';

interface UseLocationAnalyzerOptions {
  radius?: number;
  autoAnalyze?: boolean;
  debounceMs?: number;
}

interface UseLocationAnalyzerReturn {
  analysis: LocationAnalysis | null;
  loading: boolean;
  error: string | null;
  runAnalysis: () => Promise<void>;
  clearAnalysis: () => void;
}

/**
 * React hook for location analysis
 */
export function useLocationAnalyzer(
  coordinates: Coordinates,
  options: UseLocationAnalyzerOptions = {}
): UseLocationAnalyzerReturn {
  const {
    radius = 1000,
    autoAnalyze = true,
    debounceMs = 500,
  } = options;

  const [analysis, setAnalysis] = useState<LocationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeLocation(coordinates, radius);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analyse fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }, [coordinates, radius]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoAnalyze) {
      const timeoutId = setTimeout(runAnalysis, debounceMs);
      return () => clearTimeout(timeoutId);
    }
  }, [autoAnalyze, debounceMs, runAnalysis]);

  return {
    analysis,
    loading,
    error,
    runAnalysis,
    clearAnalysis,
  };
}

/**
 * React hook for comparing multiple locations
 */
interface LocationComparison {
  id: string;
  name: string;
  coordinates: Coordinates;
}

interface UseLocationComparisonReturn {
  locations: LocationComparison[];
  analyses: Record<string, LocationAnalysis>;
  loading: boolean;
  error: string | null;
  addLocation: (location: LocationComparison) => void;
  removeLocation: (id: string) => void;
  compare: () => Promise<void>;
  clearComparison: () => void;
  winner: string | null;
}

export function useLocationComparison(
  radius: number = 1000
): UseLocationComparisonReturn {
  const [locations, setLocations] = useState<LocationComparison[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, LocationAnalysis>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const addLocation = useCallback((location: LocationComparison) => {
    setLocations((prev) => [...prev, location]);
  }, []);

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
    setAnalyses((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const compare = useCallback(async () => {
    if (locations.length === 0) {
      setError('Keine Standorte zum Vergleichen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        locations.map(async (loc) => {
          const analysis = await analyzeLocation(loc.coordinates, radius);
          return { id: loc.id, analysis };
        })
      );

      const newAnalyses: Record<string, LocationAnalysis> = {};
      results.forEach(({ id, analysis }) => {
        newAnalyses[id] = analysis;
      });

      setAnalyses(newAnalyses);

      // Find winner based on overall score
      let bestScore = -1;
      let bestId: string | null = null;

      locations.forEach((loc) => {
        const analysis = newAnalyses[loc.id];
        if (analysis && analysis.overallScore > bestScore) {
          bestScore = analysis.overallScore;
          bestId = loc.id;
        }
      });

      setWinner(bestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vergleich fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }, [locations, radius]);

  const clearComparison = useCallback(() => {
    setLocations([]);
    setAnalyses({});
    setError(null);
    setWinner(null);
  }, []);

  return {
    locations,
    analyses,
    loading,
    error,
    addLocation,
    removeLocation,
    compare,
    clearComparison,
    winner,
  };
}

/**
 * React hook for fetching specific analysis category
 */
type AnalysisCategory = 'crime' | 'education' | 'infrastructure' | 'environment' | 'demographics' | 'development';

interface UseAnalysisCategoryReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAnalysisCategory<T>(
  coordinates: Coordinates,
  category: AnalysisCategory,
  radius: number = 1000
): UseAnalysisCategoryReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const analysis = await analyzeLocation(coordinates, radius);
      const categoryData = (analysis as any)[category] as T;
      setData(categoryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Daten konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  }, [coordinates, category, radius]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}

/**
 * React hook for real-time location tracking and analysis
 */
interface UseGeolocationAnalysisOptions {
  radius?: number;
  watchPosition?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface UseGeolocationAnalysisReturn extends UseLocationAnalyzerReturn {
  currentCoordinates: Coordinates | null;
  permission: 'granted' | 'denied' | 'prompt';
}

export function useGeolocationAnalysis(
  options: UseGeolocationAnalysisOptions = {}
): UseGeolocationAnalysisReturn {
  const {
    radius = 1000,
    watchPosition = false,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
  } = options;

  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [analysis, setAnalysis] = useState<LocationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (!currentCoordinates) {
      setError('Keine Koordinaten verfügbar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeLocation(currentCoordinates, radius);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analyse fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }, [currentCoordinates, radius]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check permission
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        setPermission(result.state as 'granted' | 'denied' | 'prompt');
      });
    }

    const successCallback = (position: GeolocationPosition) => {
      const coords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setCurrentCoordinates(coords);
    };

    const errorCallback = (err: GeolocationPositionError) => {
      setError(`Geolocation Error: ${err.message}`);
      setPermission('denied');
    };

    const options: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    let watchId: number | undefined;

    if (watchPosition) {
      watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    } else {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchPosition, enableHighAccuracy, timeout, maximumAge]);

  useEffect(() => {
    if (currentCoordinates) {
      runAnalysis();
    }
  }, [currentCoordinates, runAnalysis]);

  return {
    currentCoordinates,
    permission,
    analysis,
    loading,
    error,
    runAnalysis,
    clearAnalysis,
  };
}

export default useLocationAnalyzer;
