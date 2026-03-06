'use client';

import React, { useState } from 'react';
import { Deal, DealStatus } from '../types';

interface DealPipelineProps {
  deals: Deal[];
  onStatusChange?: (dealId: string, status: DealStatus) => void;
  onDealSelect?: (deal: Deal) => void;
}

const DealPipeline: React.FC<DealPipelineProps> = ({ 
  deals, 
  onStatusChange,
  onDealSelect 
}) => {
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);

  const statusColumns: { status: DealStatus; label: string; color: string }[] = [
    { status: 'neu', label: 'Neu', color: 'bg-gray-500' },
    { status: 'analysiert', label: 'Analysiert', color: 'bg-blue-500' },
    { status: 'besichtigt', label: 'Besichtigt', color: 'bg-purple-500' },
    { status: 'angebot', label: 'Angebot', color: 'bg-yellow-500' },
    { status: 'kauf', label: 'Kauf', color: 'bg-green-500' },
    { status: 'abgelehnt', label: 'Abgelehnt', color: 'bg-red-500' },
  ];

  const getDealsByStatus = (status: DealStatus): Deal[] => {
    return deals.filter(deal => deal.status === status);
  };

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: DealStatus) => {
    if (draggedDeal && onStatusChange) {
      onStatusChange(draggedDeal, status);
    }
    setDraggedDeal(null);
  };

  const getStatusCount = (status: DealStatus): number => {
    return getDealsByStatus(status).length;
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statusColumns.map((column) => {
        const columnDeals = getDealsByStatus(column.status);
        
        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-80 bg-gray-100 rounded-xl p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.status)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-gray-700">{column.label}</h3>
              </div>
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                {getStatusCount(column.status)}
              </span>
            </div>

            {/* Deals List */}
            <div className="space-y-3 min-h-[200px]">
              {columnDeals.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Keine Deals
                </div>
              ) : (
                columnDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal.id)}
                    onClick={() => onDealSelect?.(deal)}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm truncate flex-1">
                        {deal.title}
                      </h4>
                      {deal.isFavorite && (
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      {deal.location.city}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-indigo-600">
                        {deal.price.toLocaleString('de-DE')}€
                      </div>
                      <div className="text-xs text-gray-500">
                        {deal.size}m²
                      </div>
                    </div>

                    {deal.analysis && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Score</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            deal.analysis!.potentialScore >= 70 ? 'bg-green-100 text-green-700' :
                            deal.analysis!.potentialScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {deal.analysis.potentialScore}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealPipeline;
