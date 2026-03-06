import { NextRequest, NextResponse } from 'next/server';
import { Deal, DealStatus } from '../../../types';

// In-memory store (replace with database in production)
const dealsStore: Map<string, Deal> = new Map();

// GET /api/deals - List all deals with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      status: searchParams.get('status') as DealStatus | null,
      city: searchParams.get('city'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      minScore: searchParams.get('minScore'),
      isFavorite: searchParams.get('favorite') === 'true',
    };

    let deals = Array.from(dealsStore.values());

    // Apply filters
    if (filters.status) {
      deals = deals.filter(d => d.status === filters.status);
    }
    if (filters.city) {
      deals = deals.filter(d => d.location.city.includes(filters.city!));
    }
    if (filters.minPrice) {
      deals = deals.filter(d => d.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      deals = deals.filter(d => d.price <= parseInt(filters.maxPrice));
    }
    if (filters.minScore) {
      deals = deals.filter(d => d.analysis && d.analysis.potentialScore >= parseInt(filters.minScore));
    }
    if (filters.isFavorite) {
      deals = deals.filter(d => d.isFavorite);
    }

    // Sort by created date (newest first)
    deals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: deals,
      count: deals.length,
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

// POST /api/deals - Create a new deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.price || !body.size || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const deal: Deal = {
      ...body,
      id: body.id || crypto.randomUUID(),
      status: body.status || 'neu',
      notes: body.notes || [],
      isFavorite: body.isFavorite || false,
      tags: body.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dealsStore.set(deal.id, deal);

    return NextResponse.json({
      success: true,
      data: deal,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}
