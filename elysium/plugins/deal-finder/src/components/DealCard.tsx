'use client';

import React from 'react';
import { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  onSelect?: (deal: Deal) => void;
  onFavorite?: (deal: Deal) => void;
  compact?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({ 
  deal, 
  onSelect, 
  onFavorite,
  compact = false 
}) => {
  const analysis = deal.analysis;

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRecommendationBadge = () => {
    if (!analysis) return null;
    
    const configs = {
      zu_teuer: { color: 'bg-red-100 text-red-800', text: 'Zu teuer' },
      fair: { color: 'bg-blue-100 text-blue-800', text: 'Fair' },
      schnaeppchen: { color: 'bg-green-100 text-green-800', text: 'Schnäppchen' },
    };
    
    const config = configs[analysis.priceRecommendation];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = () => {
    const configs = {
      neu: 'bg-gray-100 text-gray-800',
      analysiert: 'bg-blue-100 text-blue-800',
      besichtigt: 'bg-purple-100 text-purple-800',
      angebot: 'bg-yellow-100 text-yellow-800',
      kauf: 'bg-green-100 text-green-800',
      abgelehnt: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${configs[deal.status]}`}>
        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
      </span>
    );
  };

  if (compact) {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onSelect?.(deal)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{deal.title}</h3>
            <p className="text-sm text-gray-500">{deal.location.city}, {deal.location.zipCode}</p>
          </div>
          {analysis && (
            <div className={`ml-2 px-2 py-1 rounded-full text-xs font-bold text-white ${getScoreColor(analysis.potentialScore)}`}>
              {analysis.potentialScore}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold text-indigo-600">
            {deal.price.toLocaleString('de-DE')}€
          </div>
          <div className="text-sm text-gray-600">
            {deal.size}m² {deal.rooms && `• ${deal.rooms} Zi.`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
        {deal.images && deal.images.length > 0 ? (
          <img 
            src={deal.images[0]} 
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {getStatusBadge()}
          {getRecommendationBadge()}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(deal);
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <svg 
            className={`w-5 h-5 ${deal.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
            fill={deal.isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{deal.title}</h3>
        <p className="text-sm text-gray-500 mb-4 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {deal.location.city}, {deal.location.zipCode}
        </p>

        {/* Key Details */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-indigo-600">
              {deal.price.toLocaleString('de-DE')}€
            </div>
            <div className="text-xs text-gray-500 mt-1">Preis</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-indigo-600">{deal.size}m²</div>
            <div className="text-xs text-gray-500 mt-1">Fläche</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-indigo-600">{deal.rooms || 'N/A'}</div>
            <div className="text-xs text-gray-500 mt-1">Zimmer</div>
          </div>
        </div>

        {/* AI Analysis */}
        {analysis && (
          <div className="border-t pt-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">📊 AI-Analyse</h4>
            
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Potenzial-Score</span>
                <span className={`text-sm font-bold ${
                  analysis.potentialScore >= 70 ? 'text-green-600' :
                  analysis.potentialScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {analysis.potentialScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getScoreColor(analysis.potentialScore)}`}
                  style={{ width: `${analysis.potentialScore}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Marktwert:</span>
                <span className="ml-2 font-semibold">{analysis.marketValue.toLocaleString('de-DE')}€</span>
              </div>
              <div>
                <span className="text-gray-500">Mietrendite:</span>
                <span className="ml-2 font-semibold">{analysis.rentalYield.gross}%</span>
              </div>
            </div>

            {analysis.opportunities && analysis.opportunities.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-gray-500">💡 Chancen:</span>
                <ul className="mt-1 space-y-1">
                  {analysis.opportunities.slice(0, 2).map((opp, idx) => (
                    <li key={idx} className="text-xs text-green-600 flex items-start">
                      <span className="mr-1">✓</span> {opp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onSelect?.(deal)}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            Details
          </button>
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm text-center"
          >
            Original
          </a>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
