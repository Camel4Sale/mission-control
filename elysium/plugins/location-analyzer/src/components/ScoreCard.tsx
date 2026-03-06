'use client';

import React from 'react';
import { MapPin, TrendingUp, Shield, GraduationCap, Building, Trees, Users, Home } from 'lucide-react';
import type { LocationAnalysis } from '../../types';

interface ScoreCardProps {
  analysis: LocationAnalysis;
  compact?: boolean;
}

export function ScoreCard({ analysis, compact = false }: ScoreCardProps) {
  const scores = [
    {
      icon: Shield,
      label: 'Sicherheit',
      score: analysis.crime.safetyScore,
      color: 'blue',
    },
    {
      icon: GraduationCap,
      label: 'Bildung',
      score: analysis.education.coverageScore,
      color: 'green',
    },
    {
      icon: Building,
      label: 'Infrastruktur',
      score: analysis.infrastructure.scores.overall,
      color: 'purple',
    },
    {
      icon: Trees,
      label: 'Umwelt',
      score: analysis.environment.environmentScore,
      color: 'emerald',
    },
    {
      icon: Users,
      label: 'Demografie',
      score: analysis.demographics.demographicScore,
      color: 'orange',
    },
    {
      icon: TrendingUp,
      label: 'Entwicklung',
      score: analysis.development.developmentScore,
      color: 'indigo',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      bar: 'bg-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      bar: 'bg-green-600',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      bar: 'bg-purple-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      bar: 'bg-emerald-600',
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      bar: 'bg-orange-600',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      bar: 'bg-indigo-600',
    },
  };

  const recommendationConfig = {
    buy: {
      label: 'KAUFEN',
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
    },
    hold: {
      label: 'HALTEN',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
    },
    avoid: {
      label: 'VERMEIDEN',
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
    },
  };

  const recConfig = recommendationConfig[analysis.investmentRecommendation];

  if (compact) {
    return (
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Standort-Score</h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${recConfig.bg} ${recConfig.text} border ${recConfig.border}`}
          >
            {recConfig.label}
          </span>
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div className="text-5xl font-bold text-gray-900">{analysis.overallScore}</div>
          <div className="text-gray-500 mb-2">/ 100</div>
        </div>

        <div className="space-y-2">
          {scores.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className={`w-4 h-4 ${colorClasses[item.color].text}`} />
              <span className="text-sm text-gray-600 flex-1">{item.label}</span>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colorClasses[item.color].bar}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.score}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Standort-Analyse</h3>
            <p className="text-sm text-gray-600">{analysis.location.district}, {analysis.location.city}</p>
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${recConfig.bg} ${recConfig.text} border ${recConfig.border}`}
        >
          {recConfig.label}
        </span>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-1">Gesamt-Score</p>
            <p className="text-5xl font-bold">{analysis.overallScore}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 mb-2">Bewertung</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(analysis.overallScore / 20)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-blue-300'
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Scores */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {scores.map((item) => {
          const Icon = item.icon;
          const colors = colorClasses[item.color];

          return (
            <div key={item.label} className={`${colors.bg} rounded-lg p-4`}>
              <Icon className={`w-6 h-6 ${colors.text} mb-2`} />
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{item.score}</p>
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${colors.bar}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation Reasons */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-gray-900 mb-3">Empfehlung</h4>
        <ul className="space-y-2">
          {analysis.recommendationReasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ScoreCard;
