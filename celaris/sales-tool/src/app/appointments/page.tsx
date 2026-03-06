'use client';

import { useState } from 'react';
import { Calendar, Clock, Check } from 'lucide-react';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const appointmentTypes = [
  { value: 'beratung', label: 'Erstberatung', duration: 30 },
  { value: 'besichtigung', label: 'Vor-Ort-Besichtigung', duration: 60 },
  { value: 'montage', label: 'Montage-Termin', duration: 480 },
];

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('beratung');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to backend
    setSubmitted(true);
  };

  // Generate next 14 days
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const selectedAppointmentType = appointmentTypes.find(t => t.value === selectedType);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Termin buchen</h1>
              <p className="text-green-600 text-sm">Wählen Sie einen passenden Termin</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {submitted ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Termin erfolgreich gebucht!
            </h2>
            <p className="text-gray-600 mb-6">
              Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-gray-500">Datum</div>
                  <div className="font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Uhrzeit</div>
                  <div className="font-semibold text-gray-900">{selectedTime} Uhr</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Termin-Typ</div>
                  <div className="font-semibold text-gray-900">
                    {selectedAppointmentType?.label}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Dauer</div>
                  <div className="font-semibold text-gray-900">
                    {selectedAppointmentType?.duration} Minuten
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedDate('');
                setSelectedTime('');
                setCustomerName('');
                setCustomerEmail('');
                setCustomerPhone('');
                setNotes('');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Weitere Termin buchen
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Termin-Typ */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                1. Art des Termins
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {appointmentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedType === type.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{type.duration} Minuten</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Datum */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                2. Datum wählen
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {getNextDays().map((date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        isSelected
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="text-xs font-medium">
                        {formatDate(date)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Uhrzeit */}
            {selectedDate && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  3. Uhrzeit wählen
                </h2>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Kundendaten */}
            {(selectedDate && selectedTime) && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  4. Ihre Daten
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Max Mustermann"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="max@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+49 123 456789"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notizen (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Besondere Wünsche oder Hinweise..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Zusammenfassung & Submit */}
            {(selectedDate && selectedTime && customerName) && (
              <div className="bg-green-600 rounded-xl shadow-lg p-6 text-white">
                <h2 className="text-lg font-semibold mb-4">Zusammenfassung</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <div className="text-green-100 text-sm">Datum</div>
                      <div className="font-semibold">
                        {new Date(selectedDate).toLocaleDateString('de-DE', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    <div>
                      <div className="text-green-100 text-sm">Uhrzeit</div>
                      <div className="font-semibold">{selectedTime} Uhr</div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-green-700 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors"
                >
                  Termin verbindlich buchen
                </button>
                <p className="text-green-100 text-sm text-center mt-4">
                  Mit dem Buchen stimmen Sie unserer Datenschutzerklärung zu.
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
