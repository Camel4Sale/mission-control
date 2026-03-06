import { NextRequest, NextResponse } from 'next/server';
import { Property } from '@/types';

// In-Memory Storage
let properties: Property[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const city = searchParams.get('city');

    let filtered = properties;

    if (type) {
      filtered = filtered.filter((p) => p.type === type);
    }

    if (city) {
      filtered = filtered.filter(
        (p) => p.address.city.toLowerCase() === city.toLowerCase()
      );
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name || !body.address || !body.details) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const property: Property = {
      id: crypto.randomUUID(),
      name: body.name,
      type: body.type,
      address: body.address,
      details: body.details,
      documents: body.documents || [],
      valueHistory: body.valueHistory || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    properties.push(property);

    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
