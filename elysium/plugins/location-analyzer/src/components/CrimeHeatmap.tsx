'use client';

import React, { useMemo } from 'react';
import type { HeatmapPoint, CrimeCategory } from '../../types';

interface CrimeHeatmapProps {
  points: HeatmapPoint[];
  center: { latitude: number; longitude: number };
  radius: number;
  width?: number;
  height?: number;
  selectedCategory?: CrimeCategory | 'all';
  onPointClick?: (point: HeatmapPoint) => void;
}

export function CrimeHeatmap({
  points,
  center,
  radius,
  width = 600,
  height = 400,
  selectedCategory = 'all',
  onPointClick,
}: CrimeHeatmapProps) {
  const filteredPoints = useMemo(() => {
    if (selectedCategory === 'all') return points;
    return points.filter((p) => p.category === selectedCategory);
  }, [points, selectedCategory]);

  const categoryColors: Record<CrimeCategory, string> = {
    violence: 'rgba(220, 38, 38, 0.6)',
    property: 'rgba(245, 158, 11, 0.6)',
    drugs: 'rgba(139, 92, 246, 0.6)',
    other: 'rgba(107, 114, 128, 0.6)',
  };

  const projectPoint = (point: HeatmapPoint) => {
    const latDiff = point.latitude - center.latitude;
    const lonDiff = point.longitude - center.longitude;
    
    const x = width / 2 + (lonDiff * 111000 * Math.cos(center.latitude * Math.PI / 180)) * (width / (radius * 2));
    const y = height / 2 - (latDiff * 111000) * (height / (radius * 2));
    
    return { x, y };
  };

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      <svg width={width} height={height} className="w-full h-auto">
        {/* Background */}
        <rect width={width} height={height} fill="#f3f4f6" />
        
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width={width / 10} height={height / 10} patternUnits="userSpaceOnUse">
            <path d={`M ${width / 10} 0 L 0 0 0 ${height / 10}`} fill="none" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Center marker */}
        <circle cx={width / 2} cy={height / 2} r={8} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
        <circle cx={width / 2} cy={height / 2} r={20} fill="none" stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 4" />
        
        {/* Radius circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={Math.min(width, height) / 2 - 20}
          fill="none"
          stroke="#9ca3af"
          strokeWidth={1}
        />
        
        {/* Heatmap points */}
        {filteredPoints.map((point, index) => {
          const { x, y } = projectPoint(point);
          const r = 10 + point.intensity * 20;
          
          return (
            <g key={index} onClick={() => onPointClick?.(point)} className="cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={categoryColors[point.category]}
                className="transition-all duration-200 hover:opacity-80"
              />
              <circle
                cx={x}
                cy={y}
                r={r * 0.6}
                fill={categoryColors[point.category].replace('0.6', '0.8')}
              />
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
        <p className="text-xs font-semibold text-gray-700 mb-2">Kriminalität</p>
        <div className="space-y-1">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600 capitalize">
                {category === 'violence' ? 'Gewalt' :
                 category === 'property' ? 'Eigentum' :
                 category === 'drugs' ? 'Drogen' : 'Andere'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scale */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-600">
          Radius: {(radius / 1000).toFixed(1)} km
        </p>
      </div>
    </div>
  );
}

export default CrimeHeatmap;
