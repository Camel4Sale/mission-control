'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FileText, Upload, Plus, Trash2, Download } from 'lucide-react';
import { UtilityBill, Property, Receipt, UtilityCost } from '@/types';

interface UtilityBillCreatorProps {
  properties: Property[];
  onCreateBill: (bill: UtilityBill) => Promise<void>;
}

interface FormData {
  propertyId: string;
  year: number;
  periodStart: string;
  periodEnd: string;
  distributionKey: 'sqm' | 'persons' | 'consumption' | 'mixed';
  costs: Array<{
    category: string;
    amount: number;
    description: string;
  }>;
  tenants: Array<{
    tenantId: string;
    sqm: number;
    persons?: number;
    consumption?: number;
  }>;
}

export default function UtilityBillCreator({
  properties,
  onCreateBill,
}: UtilityBillCreatorProps) {
  const [step, setStep] = useState<'select' | 'costs' | 'tenants' | 'review' | 'done'>('select');
  const [uploadedReceipts, setUploadedReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      year: new Date().getFullYear() - 1,
      distributionKey: 'sqm',
      costs: [],
      tenants: [],
    },
  });

  const { fields: costFields, append: appendCost, remove: removeCost } = useFieldArray({
    control,
    name: 'costs',
  });

  const { fields: tenantFields, append: appendTenant, remove: removeTenant } = useFieldArray({
    control,
    name: 'tenants',
  });

  const totalCosts = watch('costs')?.reduce((sum, cost) => sum + (cost?.amount || 0), 0) || 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // In Produktion: Dateien hochladen und Receipts erstellen
    Array.from(files).forEach((file) => {
      const receipt: Receipt = {
        id: crypto.randomUUID(),
        category: 'Sonstige',
        amount: 0,
        date: new Date(),
        vendor: file.name,
        description: '',
        imageUrl: URL.createObjectURL(file),
      };
      setUploadedReceipts((prev) => [...prev, receipt]);
    });
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const bill: UtilityBill = {
        id: crypto.randomUUID(),
        propertyId: data.propertyId,
        year: data.year,
        period: {
          start: new Date(data.periodStart),
          end: new Date(data.periodEnd),
        },
        totalCosts,
        costs: data.costs as UtilityCost[],
        distributionKey: data.distributionKey,
        tenantAllocations: data.tenants.map((t) => ({
          tenantId: t.tenantId,
          sqm: t.sqm,
          persons: t.persons,
          consumption: t.consumption,
          totalAmount: 0, // Wird berechnet
          breakdown: [],
        })),
        documents: uploadedReceipts,
        status: 'draft',
        createdAt: new Date(),
      };

      await onCreateBill(bill);
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
          <h1 className="text-2xl font-bold">Nebenkostenabrechnung erstellen</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Grunddaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objekt *
              </label>
              <select
                {...register('propertyId', { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.value) setStep('costs');
                }}
              >
                <option value="">Objekt auswählen...</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.address.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abrechnungsjahr *
              </label>
              <input
                type="number"
                {...register('year', { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zeitraum von *
              </label>
              <input
                type="date"
                {...register('periodStart', { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zeitraum bis *
              </label>
              <input
                type="date"
                {...register('periodEnd', { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verteilerschlüssel *
              </label>
              <select
                {...register('distributionKey', { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="sqm">Nach Wohnfläche (m²)</option>
                <option value="persons">Nach Personenanzahl</option>
                <option value="consumption">Nach Verbrauch</option>
                <option value="mixed">Kombiniert</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'costs') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Kosten erfassen</h1>
          </div>
          <button
            onClick={() => setStep('select')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Zurück
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Kostenpositionen</h2>
            <button
              onClick={() => appendCost({ category: '', amount: 0, description: '' })}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Hinzufügen</span>
            </button>
          </div>

          <div className="space-y-4">
            {costFields.map((field, index) => (
              <div key={field.id} className="flex items-end space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategorie
                  </label>
                  <input
                    {...register(`costs.${index}.category` as const)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="z.B. Wasser, Heizung, Müll"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Betrag (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`costs.${index}.amount` as const, { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beschreibung
                  </label>
                  <input
                    {...register(`costs.${index}.description` as const)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Details..."
                  />
                </div>
                <button
                  onClick={() => removeCost(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {costFields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Keine Kostenpositionen erfasst. Klicken Sie auf "Hinzufügen".
            </div>
          )}

          {costFields.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Gesamtkosten:</span>
                <span className="text-2xl font-bold text-gray-900">
                  € {totalCosts.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Belege hochladen</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">PDF, JPG oder PNG hierher ziehen</p>
            <p className="text-sm text-gray-500 mb-4">oder klicken zum Auswählen</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Dateien auswählen
            </label>
          </div>

          {uploadedReceipts.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedReceipts.map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">{receipt.vendor}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(receipt.date).toLocaleDateString('de-DE')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setStep('select')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Zurück
          </button>
          <button
            onClick={() => setStep('tenants')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Weiter zu Mieter
          </button>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Abrechnung erfolgreich erstellt!
          </h2>
          <p className="text-gray-600 mb-6">
            Die Nebenkostenabrechnung wurde generiert.
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
              Weitere Abrechnung erstellen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <p>Weitere Schritte folgen...</p>
    </div>
  );
}
