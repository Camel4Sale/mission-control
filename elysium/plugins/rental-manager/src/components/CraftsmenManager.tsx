'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Wrench, Star, Phone, Mail, MapPin, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Craftsman, Rating } from '@/types';

interface CraftsmenManagerProps {
  craftsmen: Craftsman[];
  onAdd: (craftsman: Omit<Craftsman, 'id' | 'ratings' | 'workHistory' | 'costTracking'>) => Promise<void>;
  onEdit: (id: string, data: Partial<Craftsman>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface FormData {
  name: string;
  company: string;
  trade: string;
  phone: string;
  email: string;
  street: string;
  zip: string;
  city: string;
}

export default function CraftsmenManager({
  craftsmen,
  onAdd,
  onEdit,
  onDelete,
}: CraftsmenManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      trade: '',
    },
  });

  const filteredCraftsmen = filter === 'all'
    ? craftsmen
    : craftsmen.filter((c) => c.trade === filter);

  const trades = Array.from(new Set(craftsmen.map((c) => c.trade)));

  const calculateAvgRating = (ratings: Rating[]): number => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.price + r.quality + r.punctuality, 0);
    return sum / (ratings.length * 3);
  };

  const getTotalCost = (craftsman: Craftsman): number => {
    return craftsmen.find((c) => c.id === craftsman.id)?.costTracking.reduce((sum, c) => sum + c.totalCost, 0) || 0;
  };

  const onSubmit = async (data: FormData) => {
    const craftsmanData = {
      name: data.name,
      company: data.company,
      trade: data.trade,
      phone: data.phone,
      email: data.email,
      address: {
        street: data.street,
        zip: data.zip,
        city: data.city,
      },
      ratings: [],
      workHistory: [],
      costTracking: [],
    };

    if (editingId) {
      await onEdit(editingId, craftsmanData);
      setEditingId(null);
    } else {
      await onAdd(craftsmanData as any);
    }

    reset();
    setShowAddForm(false);
  };

  const handleEdit = (craftsman: Craftsman) => {
    reset({
      name: craftsman.name,
      company: craftsman.company,
      trade: craftsman.trade,
      phone: craftsman.phone,
      email: craftsman.email,
      street: craftsman.address.street,
      zip: craftsman.address.zip,
      city: craftsman.address.city,
    });
    setEditingId(craftsman.id);
    setShowAddForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Wrench className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Handwerker-Verwaltung</h1>
        </div>
        <button
          onClick={() => {
            reset();
            setEditingId(null);
            setShowAddForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Handwerker hinzufügen</span>
        </button>
      </div>

      {/* Filter */}
      {trades.length > 0 && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Alle ({craftsmen.length})
          </button>
          {trades.map((trade) => (
            <button
              key={trade}
              onClick={() => setFilter(trade)}
              className={`px-4 py-2 rounded-lg ${filter === trade ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {trade}
            </button>
          ))}
        </div>
      )}

      {/* Handwerker Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCraftsmen.map((craftsman) => {
          const avgRating = calculateAvgRating(craftsman.ratings);
          const totalCost = getTotalCost(craftsman);

          return (
            <div key={craftsman.id} className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{craftsman.name}</h3>
                  <p className="text-sm text-gray-600">{craftsman.company}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {craftsman.trade}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(craftsman)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(craftsman.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bewertung */}
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  ({craftsman.ratings.length} Bewertungen)
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{craftsman.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{craftsman.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{craftsman.address.city}</span>
                </div>
              </div>

              {/* Statistiken */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Einsätze:</span>
                  <span className="font-medium">{craftsman.workHistory.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Gesamtkosten:</span>
                  <span className="font-medium">€ {totalCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Bewertungen im Detail */}
              {craftsman.ratings.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Letzte Bewertungen</h4>
                  <div className="space-y-2">
                    {craftsman.ratings.slice(-3).map((rating) => (
                      <div key={rating.id} className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            {new Date(rating.date).toLocaleDateString('de-DE')}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">Preis:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${s <= rating.price ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="text-gray-600 mt-1">{rating.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCraftsmen.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Keine Handwerker gefunden
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Handwerker bearbeiten' : 'Handwerker hinzufügen'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firma
                    </label>
                    <input
                      {...register('company')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gewerk *
                  </label>
                  <input
                    {...register('trade', { required: true })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. Klempner, Elektriker, Maler"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      {...register('phone', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Straße
                  </label>
                  <input
                    {...register('street')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PLZ
                    </label>
                    <input
                      {...register('zip')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stadt
                    </label>
                    <input
                      {...register('city')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      reset();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingId ? 'Speichern' : 'Hinzufügen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
