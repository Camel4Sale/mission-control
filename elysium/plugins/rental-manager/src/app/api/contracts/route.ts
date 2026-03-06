import { NextRequest, NextResponse } from 'next/server';
import { RentalContract } from '@/types';
import { PdfGenerator } from '@/lib/pdf-generator';

// In-Memory Storage (in Produktion: Datenbank verwenden)
let contracts: RentalContract[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');

    let filtered = contracts;

    if (propertyId) {
      filtered = filtered.filter((c) => c.propertyId === propertyId);
    }

    if (status) {
      filtered = filtered.filter((c) => c.status === status);
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.propertyId || !body.tenantIds || !body.rent) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const contract: RentalContract = {
      id: crypto.randomUUID(),
      propertyId: body.propertyId,
      tenantIds: body.tenantIds,
      type: body.type || 'wohnung',
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      rent: {
        coldRent: body.rent.coldRent,
        warmRent: body.rent.warmRent,
      },
      deposit: body.deposit,
      noticePeriod: body.noticePeriod || 3,
      specialClauses: body.specialClauses || [],
      language: body.language || 'de',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    contracts.push(contract);

    // PDF generieren
    const pdfGenerator = new PdfGenerator();
    // In Produktion: Property und Tenant Daten laden
    // const pdfBytes = await pdfGenerator.generateRentalContract(contract, property, tenants);

    return NextResponse.json({ success: true, data: contract }, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}
