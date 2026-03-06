'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Home, Plus, Edit, Trash2, MapPin, TrendingUp, FileText } from 'lucide-react';
import { Property, Document } from '@/types';

interface PropertyManagerProps {
  properties: Property[];
  onAdd: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'valueHistory'>) => Promise<void>;
  onEdit: (id: string, data: Partial<Property>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface FormData {
  name: string;
  type: 'wohnung' | 'haus' | 'gewerbe';
  street: string;
  zip: string;
  city: string;
  country: string;
  sqm: number;
  rooms: number;
  yearBuilt: number;
  floor?: number;
  totalFloors?: number;
  heatingType?: string;
  energyRating?: string;
  purchasePrice?: number;
  currentPrice?: number;
}

export default function PropertyManager({
  properties,
  onAdd,
  onEdit,
  onDelete,
}: PropertyManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'wohnung',
      country: 'Deutschland',
    },
  });

  const onSubmit = async (data: FormData) => {
    const propertyData = {
      name: data.name,
      type: data.type,
      address: {
        street: data.street,
        zip: data.zip,
        city: data.city,
        country: data.country,
      },
      details: {
        sqm: data.sqm,
        rooms: data.rooms,
        yearBuilt: data.yearBuilt,
        floor: data.floor,
        totalFloors: data.totalFloors,
        heatingType: data.heatingType,
        energyRating: data.energyRating,
      },
      documents: [],
      valueHistory: data.purchasePrice ? [{
        date: new Date(),
        value: data.currentPrice || data.purchasePrice,
        source: 'Manuell',
      }] : [],
    };

    if (editingId) {
      await onEdit(editingId, propertyData as any);
      setEditingId(null);
    } else {
      await onAdd(propertyData as any);
    }

    reset();
    setShowAddForm(false);
  };

  const handleEdit = (property: Property) => {
    reset({
      name: property.name,
      type: property.type,
      street: property.address.street,
      zip: property.address.zip,
      city: property.address.city,
      country: property.address.country,
      sqm: property.details.sqm,
      rooms: property.details.rooms,
      yearBuilt: property.details.yearBuilt,
      floor: property.details.floor,
      totalFloors: property.details.totalFloors,
      heatingType: property.details.heatingType,
      energyRating: property.details.energyRating,
    });
    setEditingId(property.id);
    setShowAddForm(true);
  };

  const getLatestValue = (property: Property): number => {
    if (property.valueHistory.length === 0) return 0;
    return property.valueHistory.sort((a, b) => b.date.getTime() - a.date.getTime())[0].value;
  };

  if (selectedProperty) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedProperty(null)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Zurück zur Übersicht
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(selectedProperty)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Edit className="w-4 h-4" />
              <span>Bearbeiten</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hauptinformationen */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedProperty.name}</h1>
                  <div className="flex items-center space-x-2 mt-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {selectedProperty.address.street}, {selectedProperty.address.zip} {selectedProperty.address.city}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                  {selectedProperty.type}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Wohnfläche</p>
                  <p className="text-lg font-semibold">{selectedProperty.details.sqm} m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zimmer</p>
                  <p className="text-lg font-semibold">{selectedProperty.details.rooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Baujahr</p>
                  <p className="text-lg font-semibold">{selectedProperty.details.yearBuilt}</p>
                </div>
                {selectedProperty.details.floor && (
                  <div>
                    <p className="text-sm text-gray-600">Etage</p>
                    <p className="text-lg font-semibold">
                      {selectedProperty.details.floor} von {selectedProperty.details.totalFloors}
                    </p>
                  </div>
                )}
                {selectedProperty.details.heatingType && (
                  <div>
                    <p className="text-sm text-gray-600">Heizung</p>
                    <p className="text-lg font-semibold">{selectedProperty.details.heatingType}</p>
                  </div>
                )}
                {selectedProperty.details.energyRating && (
                  <div>
                    <p className="text-sm text-gray-600">Energieausweis</p>
                    <p className="text-lg font-semibold">{selectedProperty.details.energyRating}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Wertentwicklung */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Wertentwicklung</span>
              </h2>
              {selectedProperty.valueHistory.length > 0 ? (
                <div className="space-y-3">
                  {selectedProperty.valueHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{entry.source}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">€ {entry.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Keine Wertdaten erfasst</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dokumente */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Dokumente</span>
              </h2>
              {selectedProperty.documents.length > 0 ? (
                <div className="space-y-2">
                  {selectedProperty.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{doc.type}</p>
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Öffnen
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Keine Dokumente hochgeladen</p>
              )}
              <button className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-sm">
                Dokument hochladen
              </button>
            </div>

            {/* Aktueller Wert */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Geschätzter Wert</h2>
              <p className="text-3xl font-bold text-gray-900">
                € {getLatestValue(selectedProperty).toLocaleString()}
              </p>
              {selectedProperty.valueHistory.length > 1 && (
                <p className="text-sm text-gray-600 mt-2">
                  Letzte Aktualisierung:{' '}
                  {new Date(selectedProperty.valueHistory[0].date).toLocaleDateString('de-DE')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Objekt-Verwaltung</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {view === 'grid' ? 'Listenansicht' : 'Gridansicht'}
          </button>
          <button
            onClick={() => {
              reset();
              setEditingId(null);
              setShowAddForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Objekt hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Objekt-Übersicht */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => setSelectedProperty(property)}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                  {property.type === 'wohnung' ? 'Wohnung' : property.type === 'haus' ? 'Haus' : 'Gewerbe'}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(property);
                    }}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(property.id);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mb-2">{property.name}</h3>
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {property.address.street}, {property.address.city}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Fläche</p>
                  <p className="font-medium">{property.details.sqm} m²</p>
                </div>
                <div>
                  <p className="text-gray-500">Zimmer</p>
                  <p className="font-medium">{property.details.rooms}</p>
                </div>
                <div>
                  <p className="text-gray-500">Baujahr</p>
                  <p className="font-medium">{property.details.yearBuilt}</p>
                </div>
                <div>
                  <p className="text-gray-500">Wert</p>
                  <p className="font-medium">€ {getLatestValue(property).toLocaleString()}</p>
                </div>
              </div>

              {property.documents.length > 0 && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  {property.documents.length} Dokument{property.documents.length > 1 ? 'e' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fläche</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zimmer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wert</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{property.name}</td>
                  <td className="px-6 py-4 capitalize">{property.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {property.address.city}
                  </td>
                  <td className="px-6 py-4">{property.details.sqm} m²</td>
                  <td className="px-6 py-4">{property.details.rooms}</td>
                  <td className="px-6 py-4 font-medium">€ {getLatestValue(property).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Ansehen
                    </button>
                    <button
                      onClick={() => handleEdit(property)}
                      className="text-gray-600 hover:text-gray-800 mr-3"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => onDelete(property.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {properties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Keine Objekte erfasst
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Objekt bearbeiten' : 'Objekt hinzufügen'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objektname *
                    </label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="z.B. Wohnung Musterstraße 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Typ *
                    </label>
                    <select
                      {...register('type', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="wohnung">Wohnung</option>
                      <option value="haus">Haus</option>
                      <option value="gewerbe">Gewerbe</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Straße *
                    </label>
                    <input
                      {...register('street', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PLZ *
                    </label>
                    <input
                      {...register('zip', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stadt *
                    </label>
                    <input
                      {...register('city', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land
                    </label>
                    <input
                      {...register('country')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fläche (m²) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('sqm', { required: true, min: 0 })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zimmer *
                    </label>
                    <input
                      type="number"
                      {...register('rooms', { required: true, min: 0 })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Baujahr *
                    </label>
                    <input
                      type="number"
                      {...register('yearBuilt', { required: true, min: 1900, max: new Date().getFullYear() + 1 })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etage
                    </label>
                    <input
                      type="number"
                      {...register('floor', { min: 0 })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gesamte Etagen
                    </label>
                    <input
                      type="number"
                      {...register('totalFloors', { min: 1 })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heizungstyp
                    </label>
                    <input
                      {...register('heatingType')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="z.B. Gas, Öl, Fernwärme"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energieausweis
                    </label>
                    <input
                      {...register('energyRating')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="z.B. A+, B, C"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
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
