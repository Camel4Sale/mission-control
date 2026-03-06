'use client';

import React, { useState, useEffect } from 'react';
import DealCard from '../components/DealCard';
import DealPipeline from '../components/DealPipeline';
import MarketChart from '../components/MarketChart';
import { Deal, DealStatus, MarketAnalysis } from '../types';

// Mock data for demonstration
const mockDeals: Deal[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    source: 'immoscout24',
    url: 'https://example.com/property1',
    title: 'Moderne 2-Zimmer-Wohnung in Mitte',
    price: 450000,
    size: 65,
    rooms: 2,
    location: {
      address: 'Musterstraße 123',
      city: 'Berlin',
      zipCode: '10115',
      district: 'Mitte',
    },
    yearBuilt: 2018,
    propertyType: 'apartment',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'neu',
    notes: [],
    isFavorite: false,
    tags: [],
    analysis: {
      propertyId: '550e8400-e29b-41d4-a716-446655440001',
      marketValue: 520000,
      marketValueRange: { min: 468000, max: 572000 },
      priceRecommendation: 'schnaeppchen',
      potentialScore: 85,
      rentalYield: { gross: 4.2, net: 2.94 },
      comparableProperties: [],
      analyzedAt: new Date(),
      opportunities: ['Gute Lage', 'Unter Marktwert', 'Hohe Nachfrage'],
      risks: ['Renovierungsbedarf'],
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    source: 'immowelt',
    url: 'https://example.com/property2',
    title: 'Altbauwohnung mit Balkon',
    price: 380000,
    size: 75,
    rooms: 3,
    location: {
      address: 'Beispielweg 45',
      city: 'Berlin',
      zipCode: '10117',
      district: 'Mitte',
    },
    yearBuilt: 1995,
    propertyType: 'apartment',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'analysiert',
    notes: [],
    isFavorite: true,
    tags: ['balkon', 'altbau'],
    analysis: {
      propertyId: '550e8400-e29b-41d4-a716-446655440002',
      marketValue: 390000,
      marketValueRange: { min: 351000, max: 429000 },
      priceRecommendation: 'fair',
      potentialScore: 68,
      rentalYield: { gross: 3.8, net: 2.66 },
      comparableProperties: [],
      analyzedAt: new Date(),
      opportunities: ['Guter Zustand', 'Beliebte Lage'],
      risks: ['Hohe Hausgeld'],
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    source: 'kleinanzeigen',
    url: 'https://example.com/property3',
    title: 'Investment-Objekt mit Mieter',
    price: 290000,
    size: 52,
    rooms: 2,
    location: {
      address: 'Teststraße 78',
      city: 'Berlin',
      zipCode: '10119',
      district: 'Mitte',
    },
    yearBuilt: 1985,
    propertyType: 'apartment',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'besichtigt',
    notes: [],
    isFavorite: false,
    tags: ['investment', 'vermietet'],
    analysis: {
      propertyId: '550e8400-e29b-41d4-a716-446655440003',
      marketValue: 310000,
      marketValueRange: { min: 279000, max: 341000 },
      priceRecommendation: 'fair',
      potentialScore: 72,
      rentalYield: { gross: 5.1, net: 3.57 },
      comparableProperties: [],
      analyzedAt: new Date(),
      opportunities: ['Vermietet', 'Gute Rendite'],
      risks: ['Älteres Gebäude'],
    },
  },
];

const mockMarketAnalysis: MarketAnalysis = {
  city: 'Berlin',
  timeRange: {
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    to: new Date(),
  },
  averagePrice: 420000,
  pricePerSqm: 6200,
  priceDevelopment: [
    { date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), averagePrice: 400000, listings: 150 },
    { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), averagePrice: 410000, listings: 165 },
    { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), averagePrice: 415000, listings: 180 },
    { date: new Date(), averagePrice: 420000, listings: 195 },
  ],
  supplyDemandRatio: 0.75,
  totalListings: 195,
  averageDaysOnMarket: 45,
  rentalYieldAverage: 3.9,
  comparableCities: [
    { name: 'München', pricePerSqm: 8500, difference: 37 },
    { name: 'Hamburg', pricePerSqm: 5800, difference: -6.5 },
    { name: 'Frankfurt', pricePerSqm: 6100, difference: -1.6 },
  ],
};

export default function DealFinderPage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [view, setView] = useState<'grid' | 'pipeline' | 'market'>('grid');
  const [filter, setFilter] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    minScore: '',
  });
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const filteredDeals = deals.filter(deal => {
    if (filter.city && !deal.location.city.includes(filter.city)) return false;
    if (filter.minPrice && deal.price < parseInt(filter.minPrice)) return false;
    if (filter.maxPrice && deal.price > parseInt(filter.maxPrice)) return false;
    if (filter.minScore && deal.analysis && deal.analysis.potentialScore < parseInt(filter.minScore)) return false;
    return true;
  });

  const handleStatusChange = (dealId: string, newStatus: DealStatus) => {
    setDeals(prev => prev.map(deal => 
      deal.id === dealId ? { ...deal, status: newStatus } : deal
    ));
  };

  const handleFavorite = (deal: Deal) => {
    setDeals(prev => prev.map(d => 
      d.id === deal.id ? { ...d, isFavorite: !d.isFavorite } : d
    ));
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting ${filteredDeals.length} deals as ${format}...`);
    // Implementation would go here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Deal-Finder Pro</h1>
                <p className="text-xs text-gray-500">Elysium Plugin</p>
              </div>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('pipeline')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'pipeline' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pipeline
              </button>
              <button
                onClick={() => setView('market')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'market' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Markt
              </button>
            </div>

            {/* Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stadt</label>
              <input
                type="text"
                value={filter.city}
                onChange={(e) => setFilter({ ...filter, city: e.target.value })}
                placeholder="z.B. Berlin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. Preis</label>
              <input
                type="number"
                value={filter.minPrice}
                onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
                placeholder="€"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max. Preis</label>
              <input
                type="number"
                value={filter.maxPrice}
                onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                placeholder="€"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. Score</label>
              <input
                type="number"
                value={filter.minScore}
                onChange={(e) => setFilter({ ...filter, minScore: e.target.value })}
                placeholder="0-100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredDeals.length}</span> Deals gefunden
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">Schnäppchen: {deals.filter(d => d.analysis?.priceRecommendation === 'schnaeppchen').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-600">Analysiert: {deals.filter(d => d.status === 'analysiert').length}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {view === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onSelect={setSelectedDeal}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        )}

        {view === 'pipeline' && (
          <DealPipeline
            deals={filteredDeals}
            onStatusChange={handleStatusChange}
            onDealSelect={setSelectedDeal}
          />
        )}

        {view === 'market' && (
          <MarketChart analysis={mockMarketAnalysis} />
        )}
      </div>

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDeal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Deal Details</h2>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <DealCard deal={selectedDeal} compact={false} />
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Notizen</h3>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  placeholder="Füge Notizen hinzu..."
                />
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={selectedDeal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center"
                >
                  Zum Originalangebot
                </a>
                <button
                  onClick={() => handleFavorite(selectedDeal)}
                  className={`px-4 py-3 rounded-lg font-medium border-2 transition-colors ${
                    selectedDeal.isFavorite
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {selectedDeal.isFavorite ? '♥ Favorit' : '♡ Merken'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
