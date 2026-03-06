'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Users, CheckCircle, XCircle, AlertTriangle, FileText, Mail, TrendingUp } from 'lucide-react';
import { Tenant, TenantScreening, RiskFactor } from '@/types';

interface TenantScreeningProps {
  tenant: Tenant;
  screening?: TenantScreening;
  onPerformScreening: (tenantId: string, consent: boolean) => Promise<TenantScreening>;
  onContactPreviousLandlord: (tenantId: string) => Promise<void>;
  onUploadIncomeDocument: (tenantId: string, file: File) => Promise<void>;
}

interface FormData {
  monthlyIncome: number;
  occupation: string;
  previousLandlordName: string;
  previousLandlordContact: string;
  rentalPeriodStart: string;
  rentalPeriodEnd: string;
  consentGiven: boolean;
}

export default function TenantScreeningComponent({
  tenant,
  screening,
  onPerformScreening,
  onContactPreviousLandlord,
  onUploadIncomeDocument,
}: TenantScreeningProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'results' | 'done'>('form');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      consentGiven: false,
      monthlyIncome: tenant.monthlyIncome || 0,
      occupation: tenant.occupation || '',
      previousLandlordName: tenant.previousLandlord?.name || '',
      previousLandlordContact: tenant.previousLandlord?.contact || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await onPerformScreening(tenant.id, data.consentGiven);
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  const handleContactLandlord = async () => {
    setLoading(true);
    try {
      await onContactPreviousLandlord(tenant.id);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await onUploadIncomeDocument(tenant.id, file);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'green':
        return 'text-green-600 bg-green-100';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-100';
      case 'red':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'green':
        return <CheckCircle className="w-5 h-5" />;
      case 'yellow':
        return <AlertTriangle className="w-5 h-5" />;
      case 'red':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (step === 'results' && screening) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Screening-Ergebnis</h1>
          </div>
          <button
            onClick={() => setStep('form')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Zurück
          </button>
        </div>

        {/* Risikobewertung */}
        <div className={`rounded-lg p-6 ${getRiskColor(screening.riskAssessment.level)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getRiskIcon(screening.riskAssessment.level)}
              <div>
                <h2 className="text-2xl font-bold">
                  Risikostufe: {screening.riskAssessment.level === 'green' ? 'Niedrig' : screening.riskAssessment.level === 'yellow' ? 'Mittel' : 'Hoch'}
                </h2>
                <p className="text-sm opacity-80">
                  {screening.riskAssessment.factors.length} Risikofaktoren identifiziert
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SCHUFA Score */}
        {screening.schufaScore && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>SCHUFA-Auskunft</span>
            </h2>
            <div className="flex items-center space-x-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={screening.schufaScore >= 85 ? '#22c55e' : screening.schufaScore >= 70 ? '#eab308' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${screening.schufaScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{screening.schufaScore}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Stand: {screening.schufaDetails?.scoreDate}
                </p>
                {screening.schufaDetails && (
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Negative Einträge: {screening.schufaDetails.negativeEntries}</p>
                    <p>Kreditkarten: {screening.schufaDetails.creditCards}</p>
                    <p>Kredite: {screening.schufaDetails.loans}</p>
                    <p>Umzüge: {screening.schufaDetails.addressChanges}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Risikofaktoren */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Risikofaktoren</h2>
          <div className="space-y-3">
            {screening.riskAssessment.factors.map((factor, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  factor.severity === 'high' ? 'bg-red-50 border border-red-200' :
                  factor.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-green-50 border border-green-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{factor.description}</p>
                    <p className="text-sm text-gray-600 mt-1">Typ: {factor.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    factor.severity === 'high' ? 'bg-red-200 text-red-800' :
                    factor.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {factor.severity === 'high' ? 'Hoch' : factor.severity === 'medium' ? 'Mittel' : 'Niedrig'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Einkommen */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Einkommensnachweis</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Status</p>
              <p className={`font-medium ${screening.incomeVerified ? 'text-green-600' : 'text-red-600'}`}>
                {screening.incomeVerified ? 'Verifiziert' : 'Nicht verifiziert'}
              </p>
            </div>
            <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
              <FileText className="w-4 h-4" />
              <span>Dokument hochladen</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Vorvermieter */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Vorvermieter-Referenz</h2>
          {tenant.previousLandlord ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{tenant.previousLandlord.name}</p>
                  <p className="text-sm text-gray-600">{tenant.previousLandlord.contact}</p>
                </div>
                <button
                  onClick={handleContactLandlord}
                  disabled={loading || screening.previousLandlordContacted}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>
                    {screening.previousLandlordContacted ? 'Kontaktiert' : 'Kontaktieren'}
                  </span>
                </button>
              </div>
              {screening.previousLandlordResponse && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{screening.previousLandlordResponse}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Keine Vorvermieter-Informationen vorhanden</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setStep('done')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Abschließen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Mieter-Screening</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Mieter-Informationen</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{tenant.firstName} {tenant.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">E-Mail</p>
            <p className="font-medium">{tenant.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Telefon</p>
            <p className="font-medium">{tenant.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Geburtsdatum</p>
            <p className="font-medium">{tenant.dateOfBirth || 'Nicht angegeben'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monatliches Einkommen (€)
              </label>
              <input
                type="number"
                {...register('monthlyIncome', { min: 0 })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beruf
              </label>
              <input
                {...register('occupation')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Vorvermieter-Informationen</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  {...register('previousLandlordName')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kontakt
                </label>
                <input
                  {...register('previousLandlordContact')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="E-Mail oder Telefon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mietbeginn
                </label>
                <input
                  type="date"
                  {...register('rentalPeriodStart')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mietende
                </label>
                <input
                  type="date"
                  {...register('rentalPeriodEnd')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('consentGiven', { required: true })}
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Ich habe die Einwilligung des Mieters zur Bonitätsprüfung (SCHUFA) eingeholt und bestätigt, dass alle Angaben wahrheitsgemäß sind.
              </span>
            </label>
            {errors.consentGiven && (
              <p className="mt-1 text-sm text-red-600">Einwilligung erforderlich</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Prüfung läuft...' : 'Screening durchführen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
