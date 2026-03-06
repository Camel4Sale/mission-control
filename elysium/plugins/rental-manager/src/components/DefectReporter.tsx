'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { AlertTriangle, Upload, Camera, Wrench, CheckCircle, Clock } from 'lucide-react';
import { DefectReport, Craftsman, Property } from '@/types';

interface DefectReporterProps {
  properties: Property[];
  craftsmen: Craftsman[];
  isTenant?: boolean;
  onSubmit: (report: Omit<DefectReport, 'id' | 'status' | 'reportedAt'>) => Promise<void>;
}

interface FormData {
  propertyId: string;
  category: 'heating' | 'plumbing' | 'electrical' | 'structural' | 'other';
  title: string;
  description: string;
  priority: 'urgent' | 'normal' | 'planned';
  photos: File[];
  assignedCraftsmanId?: string;
}

export default function DefectReporter({
  properties,
  craftsmen,
  isTenant = false,
  onSubmit,
}: DefectReporterProps) {
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<Array<{ file: File; preview: string; description: string }>>([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      priority: 'normal',
      category: 'other',
      photos: [],
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const preview = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, { file, preview, description: '' }]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 10,
  });

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const updatePhotoDescription = (index: number, description: string) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index].description = description;
      return newPhotos;
    });
  };

  const onSubmitForm = async (data: FormData) => {
    setUploading(true);
    try {
      // In Produktion: Fotos hochladen und URLs erhalten
      const report = {
        propertyId: data.propertyId,
        category: data.category,
        title: data.title,
        description: data.description,
        priority: data.priority,
        photos: photos.map((p, i) => ({
          id: crypto.randomUUID(),
          url: `photo-${i}.jpg`, // Placeholder
          description: p.description,
          uploadedAt: new Date(),
        })),
        assignedCraftsman: data.assignedCraftsmanId
          ? craftsmen.find((c) => c.id === data.assignedCraftsmanId)
          : undefined,
        costEstimate: undefined,
      };

      await onSubmit(report);
      setStep('done');
    } finally {
      setUploading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Mangel erfolgreich gemeldet!
          </h2>
          <p className="text-gray-600 mb-6">
            Ihre Meldung wurde erfasst. Wir werden uns zeitnah um die Bearbeitung kümmern.
          </p>
          {isTenant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Sie können den Status Ihrer Meldung im Mieter-Portal verfolgen.
              </p>
            </div>
          )}
          <button
            onClick={() => setStep('form')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Weitere Meldung erstellen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-8 h-8 text-red-600" />
        <h1 className="text-2xl font-bold">
          {isTenant ? 'Mangel melden' : 'Mängelmeldung erfassen'}
        </h1>
      </div>

      <form onSubmit={onSubmitForm} className="space-y-6">
        {/* Objekt */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Objekt</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objekt *
            </label>
            <select
              {...register('propertyId', { required: 'Objekt erforderlich' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Objekt auswählen...</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.address.street}, {p.address.city}
                </option>
              ))}
            </select>
            {errors.propertyId && (
              <p className="mt-1 text-sm text-red-600">{errors.propertyId.message}</p>
            )}
          </div>
        </div>

        {/* Mangel-Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Mangel-Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie *
              </label>
              <select
                {...register('category', { required: 'Kategorie erforderlich' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="heating">Heizung</option>
                <option value="plumbing">Sanitär/Wasser</option>
                <option value="electrical">Elektrik</option>
                <option value="structural">Bausubstanz</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel *
              </label>
              <input
                {...register('title', { required: 'Titel erforderlich' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Heizung im Badezimmer defekt"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung *
              </label>
              <textarea
                {...register('description', { required: 'Beschreibung erforderlich' })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Bitte beschreiben Sie den Mangel so genau wie möglich..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorität *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer ${
                  watch('priority') === 'urgent' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="urgent"
                    {...register('priority')}
                    className="sr-only"
                  />
                  <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                  <span className="text-sm font-medium">Dringend</span>
                  <span className="text-xs text-gray-500 mt-1">Sofortiges Handeln</span>
                </label>

                <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer ${
                  watch('priority') === 'normal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="normal"
                    {...register('priority')}
                    className="sr-only"
                  />
                  <Clock className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Normal</span>
                  <span className="text-xs text-gray-500 mt-1">Innerhalb 7 Tage</span>
                </label>

                <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer ${
                  watch('priority') === 'planned' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="planned"
                    {...register('priority')}
                    className="sr-only"
                  />
                  <Wrench className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium">Geplant</span>
                  <span className="text-xs text-gray-500 mt-1">Kann geplant werden</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Fotos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Fotos</h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {isDragActive ? 'Loslassen zum Hochladen...' : 'Fotos hierher ziehen'}
            </p>
            <p className="text-sm text-gray-500 mb-4">oder klicken zum Auswählen</p>
            <button
              type="button"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-4 h-4" />
              <span>Fotos auswählen</span>
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Maximal 10 Fotos (JPG, PNG, WebP)
            </p>
          </div>

          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Beschreibung..."
                    value={photo.description}
                    onChange={(e) => updatePhotoDescription(index, e.target.value)}
                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-b-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-xs">×</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Handwerker zuweisen (nur für Vermieter) */}
        {!isTenant && craftsmen.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Handwerker zuweisen (optional)</h2>
            <div>
              <select
                {...register('assignedCraftsmanId')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Keinen zuweisen</option>
                {craftsmen.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.trade})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <span>Wird gesendet...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Mangel melden</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
