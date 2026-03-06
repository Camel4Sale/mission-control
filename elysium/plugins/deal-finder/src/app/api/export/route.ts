import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import PDFDocument from 'pdfkit';
import { Deal } from '../../../types';

// In-memory store (replace with database in production)
const dealsStore: Map<string, Deal> = new Map();

// GET /api/export?format=csv|pdf - Export deals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv';
    const status = searchParams.get('status');

    let deals = Array.from(dealsStore.values());

    // Filter by status if provided
    if (status) {
      deals = deals.filter(d => d.status === status);
    }

    // Sort by created date
    deals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (format === 'csv') {
      return exportCSV(deals);
    } else if (format === 'pdf') {
      return exportPDF(deals);
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported format. Use csv or pdf.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error exporting deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export deals' },
      { status: 500 }
    );
  }
}

function exportCSV(deals: Deal[]): NextResponse {
  const csvData = deals.map(deal => ({
    ID: deal.id,
    Titel: deal.title,
    Preis: deal.price,
    Größe_m²: deal.size,
    Zimmer: deal.rooms || 'N/A',
    Stadt: deal.location.city,
    PLZ: deal.location.zipCode,
    Status: deal.status,
    Quelle: deal.source,
    Marktwert: deal.analysis?.marketValue || 'N/A',
    Potenzial_Score: deal.analysis?.potentialScore || 'N/A',
    Mietrendite_brutto: deal.analysis?.rentalYield.gross || 'N/A',
    Empfehlung: deal.analysis?.priceRecommendation || 'N/A',
    URL: deal.url,
    Erstellt: deal.createdAt.toISOString(),
  }));

  const csv = Papa.unparse(csvData, {
    delimiter: ';',
    header: true,
  });

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="deals.csv"',
    },
  });
}

async function exportPDF(deals: Deal[]): Promise<NextResponse> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margins: { top: 50, bottom: 50, left: 50, right: 50 } 
    });

    const chunks: Buffer[] = [];
    
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      
      resolve(new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="deals.pdf"',
        },
      }));
    });

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('Deal-Finder Pro - Export', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, { align: 'center' });
    doc.moveDown(1);

    // Summary
    doc.fontSize(14).font('Helvetica-Bold').text('Zusammenfassung', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text(`Anzahl Deals: ${deals.length}`);
    doc.text(`Gesamtwert: ${deals.reduce((sum, d) => sum + d.price, 0).toLocaleString('de-DE')}€`);
    doc.text(`Durchschnittspreis: ${Math.round(deals.reduce((sum, d) => sum + d.price, 0) / deals.length).toLocaleString('de-DE')}€`);
    
    const avgScore = deals.filter(d => d.analysis).reduce((sum, d) => sum + (d.analysis?.potentialScore || 0), 0) / deals.filter(d => d.analysis).length || 0;
    doc.text(`Ø Potenzial-Score: ${Math.round(avgScore)}/100`);
    doc.moveDown(1);

    // Deals Table
    doc.fontSize(14).font('Helvetica-Bold').text('Deal-Übersicht', { underline: true });
    doc.moveDown(0.5);

    deals.forEach((deal, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      doc.fontSize(12).font('Helvetica-Bold').text(`${index + 1}. ${deal.title}`, { continued: true });
      doc.font('Helvetica').text(` - ${deal.price.toLocaleString('de-DE')}€`);
      
      doc.fontSize(10).font('Helvetica').text(`📍 ${deal.location.city}, ${deal.location.zipCode}`);
      doc.text(`📐 ${deal.size}m² | 🚪 ${deal.rooms || 'N/A'} Zimmer | 🏷️ ${deal.status}`);
      
      if (deal.analysis) {
        doc.text(`💰 Marktwert: ${deal.analysis.marketValue.toLocaleString('de-DE')}€ | ⭐ Score: ${deal.analysis.potentialScore}/100`);
        doc.text(`📈 Rendite: ${deal.analysis.rentalYield.gross}% | 💡 ${deal.analysis.priceRecommendation}`);
      }
      
      doc.text(`🔗 ${deal.url}`, { link: deal.url, underline: true, color: '#667eea' });
      
      doc.moveDown(0.8);
    });

    // Footer
    doc.fontSize(10).font('Helvetica-Oblique').text(
      'Exportiert mit Deal-Finder Pro für Elysium',
      { align: 'center', valign: 'bottom' }
    );

    doc.end();
  });
}
