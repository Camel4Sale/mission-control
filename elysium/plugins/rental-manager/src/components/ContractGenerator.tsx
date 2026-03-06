'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Download, Globe, Check } from 'lucide-react';
import { Property, Tenant, RentalContract } from '@/types';

interface ContractGeneratorProps {
  properties: Property[];
  tenants: Tenant[];
  onCreateContract: (contract: RentalContract) => Promise<void>;
}

interface FormData {
  propertyId: string;
  tenantIds: string[];
  type: 'wohnung' | 'haus' | 'gewerbe';
  startDate: string;
  endDate?: string;
  coldRent: number;
  warmRent?: number;
  deposit: number;
  noticePeriod: number;
  specialClauses: string;
  language: 'de' | 'en' | 'tr';
}

export default function ContractGenerator({
  properties,
  tenants,
  onCreateContract,
}: ContractGeneratorProps) {
  const [step, setStep] = useState<'select' | 'configure' | 'preview' | 'done'>('select');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'wohnung',
      language: 'de',
      noticePeriod: 3,
      deposit: 0,
      coldRent: 0,
    },
  });

  const selectedProperty = properties.find(p => p.id === watch('propertyId'));
  const selectedTenants = tenants.filter(t => watch('tenantIds')?.includes(t.id));

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const contract: RentalContract = {
        id: crypto.randomUUID(),
        propertyId: data.propertyId,
        tenantIds: data.tenantIds,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        rent: {
          coldRent: data.coldRent,
          warmRent: data.warmRent,
        },
        deposit: data.deposit,
        noticePeriod: data.noticePeriod,
        specialClauses: data.specialClauses.split('\n').filter(s => s.trim()),
        language: data.language,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await onCreateContract(contract);
      setStep('done');
    } catch (error) {
      console.error('Fehler beim Erstellen:', error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'select') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Mietvertrag erstellen</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Objekt auswählen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => {
                  // Set property selection
                  setStep('configure');
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
                    {property.type === 'wohnung' ? 'Wohnung' : property.type === 'haus' ? 'Haus' : 'Gewerbe'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{property.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {property.address.street}, {property.address.city}
                </p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span>{property.details.sqm} m²</span>
                  <span>•</span>
                  <span>{property.details.rooms} Zimmer</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'configure') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Vertrag konfigurieren</h1>
          </div>
          <button
            onClick={() => setStep('select')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Zurück
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Objekt */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Mietobjekt</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objekt *
                </label>
                <select
                  {...register('propertyId', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Objekt auswählen...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.address.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mieter */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Mieter</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mieter auswählen *
                </label>
                <div className="space-y-2">
                  {tenants.map((tenant) => (
                    <label key={tenant.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        value={tenant.id}
                        {...register('tenantIds', { required: true })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium">{tenant.firstName} {tenant.lastName}</p>
                        <p className="text-sm text-gray-500">{tenant.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vertragsdetails */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Vertragsdetails</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vertragsbeginn *
                </label>
                <input
                  type="date"
                  {...register('startDate', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vertragsende (optional)
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kaltmiete (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('coldRent', { required: true, min: 0 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warmmiete (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('warmRent', { min: 0 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kaution (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('deposit', { required: true, min: 0 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kündigungsfrist (Monate) *
                </label>
                <input
                  type="number"
                  {...register('noticePeriod', { required: true, min: 1 })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sprache
                </label>
                <select
                  {...register('language')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                  <option value="tr">Türkçe</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Besondere Vereinbarungen (eine pro Zeile)
              </label>
              <textarea
                {...register('specialClauses')}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Haustiere erlaubt&#10;Rauchen verboten&#10;Einbauküche vorhanden"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setStep('select')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <span>Erstelle...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Vertrag erstellen</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vertrag erfolgreich erstellt!
          </h2>
          <p className="text-gray-600 mb-6">
            Der Mietvertrag wurde generiert und kann jetzt heruntergeladen werden.
          </p>
          <div className="space-y-3">
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>PDF herunterladen</span>
            </button>
            <button
              onClick={() => setStep('select')}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Weitere Verträge erstellen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
