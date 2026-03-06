import { NextRequest, NextResponse } from 'next/server';
import { Deal, DealStatus } from '../../../../types';

// In-memory store (replace with database in production)
const dealsStore: Map<string, Deal> = new Map();

// GET /api/deals/[id] - Get a specific deal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = dealsStore.get(params.id);
    
    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deal,
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}

// PUT /api/deals/[id] - Update a deal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingDeal = dealsStore.get(params.id);
    
    if (!existingDeal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    const updatedDeal: Deal = {
      ...existingDeal,
      ...body,
      id: existingDeal.id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    dealsStore.set(params.id, updatedDeal);

    return NextResponse.json({
      success: true,
      data: updatedDeal,
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

// DELETE /api/deals/[id] - Delete a deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = dealsStore.delete(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}

// PATCH /api/deals/[id]/status - Update deal status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingDeal = dealsStore.get(params.id);
    
    if (!existingDeal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    if (!body.status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updatedDeal: Deal = {
      ...existingDeal,
      status: body.status as DealStatus,
      updatedAt: new Date(),
    };

    dealsStore.set(params.id, updatedDeal);

    return NextResponse.json({
      success: true,
      data: updatedDeal,
    });
  } catch (error) {
    console.error('Error updating deal status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update deal status' },
      { status: 500 }
    );
  }
}
