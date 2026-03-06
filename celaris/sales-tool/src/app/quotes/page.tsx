'use client';

import { useState } from 'react';
import { Quote } from '@/types';
import { FileText, Download, Plus, Euro, Zap, Battery } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const initialQuotes: Quote[] = [
  {
    id: '1',
    leadId: '1',
    variant: 'pro',
    moduleHersteller: 'Tesla',
    modulLeistung: 10,
    speicherKapazitaet: 13.5,
    montageKosten: 5000,
    gesamtPreis: 28500,
    finanzierung: 'kredit',
    monatlicheRate: 485,
    createdAt: new Date(),
  },
];

export default function QuotesPage() {
  const [quotes] = useState<Quote[]>(initialQuotes);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const variantColors: Record<string, string> = {
    'basic': 'bg-blue-100 text-blue-800',
    'pro': 'bg-purple-100 text-purple-800',
    'premium': 'bg-yellow-100 text-yellow-800',
  };

  const generatePDF = async (quote: Quote) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Header
    page.drawText('Celaris GmbH', { x: 50, y: 800, size: 24, font: boldFont });
    page.drawText('Ihr Solar-Angebot', { x: 50, y: 770, size: 18, font: font });
    page.drawText(`Datum: ${new Date().toLocaleDateString('de-DE')}`, { x: 50, y: 750, size: 12, font: font });
    page.drawText(`Angebot Nr.: ${quote.id}`, { x: 50, y: 735, size: 12, font: font });

    // Package Info
    page.drawText(`Paket: ${quote.variant.toUpperCase()}`, { x: 50, y: 700, size: 16, font: boldFont });
    page.drawText(`Modul-Hersteller: ${quote.moduleHersteller}`, { x: 50, y: 675, size: 12, font: font });
    page.drawText(`Leistung: ${quote.modulLeistung} kWp`, { x: 50, y: 660, size: 12, font: font });
    page.drawText(`Speicher: ${quote.speicherKapazitaet} kWh`, { x: 50, y: 645, size: 12, font: font });

    // Costs
    page.drawText('Kostenaufstellung:', { x: 50, y: 610, size: 16, font: boldFont });
    page.drawText(`Modul-Anlage: €${(quote.gesamtPreis - quote.montageKosten).toLocaleString()}`, { x: 50, y: 585, size: 12, font: font });
    page.drawText(`Montage: €${quote.montageKosten.toLocaleString()}`, { x: 50, y: 570, size: 12, font: font });
    page.drawText('─'.repeat(40), { x: 50, y: 555, size: 12, font: font });
    page.drawText(`Gesamt: €${quote.gesamtPreis.toLocaleString()}`, { x: 50, y: 535, size: 14, font: boldFont });

    // Financing
    page.drawText(`Finanzierung: ${quote.finanzierung.toUpperCase()}`, { x: 50, y: 505, size: 12, font: font });
    if (quote.monatlicheRate) {
      page.drawText(`Monatliche Rate: €${quote.monatlicheRate.toLocaleString()}`, { x: 50, y: 490, size: 12, font: font });
    }

    // Footer
    page.drawText('Vielen Dank für Ihr Vertrauen!', { x: 50, y: 100, size: 12, font: font, color: rgb(0.2, 0.6, 0.2) });
    page.drawText('Celaris GmbH | Musterstraße 1 | 12345 Berlin', { x: 50, y: 50, size: 10, font: font, color: rgb(0.5, 0.5, 0.5) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `angebot-${quote.id}.pdf`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Angebote</h1>
                <p className="text-green-600 text-sm">{quotes.length} Angebote erstellt</p>
              </div>
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Neues Angebot
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${variantColors[quote.variant]}`}>
                    {quote.variant}
                  </span>
                  <span className="text-sm text-gray-500">
                    {quote.createdAt.toLocaleDateString('de-DE')}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>{quote.modulLeistung} kWp</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Battery className="w-4 h-4 text-green-600" />
                    <span>{quote.speicherKapazitaet} kWh Speicher</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Euro className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">€{quote.gesamtPreis.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-1">Modul-Hersteller</div>
                  <div className="font-semibold text-gray-900">{quote.moduleHersteller}</div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex gap-3">
                <button
                  onClick={() => generatePDF(quote)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => setSelectedQuote(quote)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium"
                >
                  Details
                </button>
              </div>
            </div>
          ))}

          {quotes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Angebote</h3>
              <p className="text-gray-500 mb-4">Erstellen Sie Ihr erstes Angebot</p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Neues Angebot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Angebot #{selectedQuote.id}</h2>
                <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Paket</div>
                  <div className="font-semibold text-gray-900 capitalize">{selectedQuote.variant}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Modul-Hersteller</div>
                  <div className="font-semibold text-gray-900">{selectedQuote.moduleHersteller}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Leistung</div>
                  <div className="font-semibold text-gray-900">{selectedQuote.modulLeistung} kWp</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Speicher</div>
                  <div className="font-semibold text-gray-900">{selectedQuote.speicherKapazitaet} kWh</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Montage-Kosten</div>
                  <div className="font-semibold text-gray-900">€{selectedQuote.montageKosten.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Finanzierung</div>
                  <div className="font-semibold text-gray-900 capitalize">{selectedQuote.finanzierung}</div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-sm text-green-700 mb-1">Gesamtpreis</div>
                <div className="text-3xl font-bold text-green-900">€{selectedQuote.gesamtPreis.toLocaleString()}</div>
                {selectedQuote.monatlicheRate && (
                  <div className="text-sm text-green-700 mt-2">
                    Monatliche Rate: €{selectedQuote.monatlicheRate.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => generatePDF(selectedQuote)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                PDF herunterladen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
