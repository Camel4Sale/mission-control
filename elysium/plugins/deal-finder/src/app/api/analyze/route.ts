import { NextRequest, NextResponse } from 'next/server';
import PropertyAnalyzer from '../../../services/analyzer';
import { Property } from '../../../types';

const analyzer = new PropertyAnalyzer({
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  cityData: {
    // Example city data - would be populated from database in production
    'Berlin': {
      averagePricePerSqm: 6200,
      rentalYieldAverage: 3.9,
      districts: {
        'Mitte': {
          averagePricePerSqm: 7500,
          rentalYieldAverage: 3.5,
          demandLevel: 'high',
        },
        'Kreuzberg': {
          averagePricePerSqm: 6800,
          rentalYieldAverage: 3.8,
          demandLevel: 'high',
        },
        'Prenzlauer Berg': {
          averagePricePerSqm: 7200,
          rentalYieldAverage: 3.6,
          demandLevel: 'high',
        },
      },
    },
    'München': {
      averagePricePerSqm: 8500,
      rentalYieldAverage: 3.2,
      districts: {},
    },
    'Hamburg': {
      averagePricePerSqm: 5800,
      rentalYieldAverage: 4.1,
      districts: {},
    },
  },
});

// POST /api/analyze - Analyze a property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate property data
    if (!body.price || !body.size || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Invalid property data' },
        { status: 400 }
      );
    }

    const property: Property = {
      ...body,
      id: body.id || crypto.randomUUID(),
      source: body.source || 'manual',
      url: body.url || '',
      title: body.title || 'Immobilie',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Perform AI analysis
    const analysis = await analyzer.analyzeProperty(property);

    return NextResponse.json({
      success: true,
      data: {
        property,
        analysis,
      },
    });
  } catch (error) {
    console.error('Error analyzing property:', error);
    
    // Handle API key errors
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key not configured',
          hint: 'Please set OPENAI_API_KEY environment variable'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to analyze property' },
      { status: 500 }
    );
  }
}

// GET /api/analyze/batch - Analyze multiple properties
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyIds = searchParams.get('ids')?.split(',') || [];
    
    if (propertyIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No property IDs provided' },
        { status: 400 }
      );
    }

    // In production, fetch properties from database
    // For now, return placeholder response
    return NextResponse.json({
      success: true,
      data: {
        message: 'Batch analysis queued',
        count: propertyIds.length,
      },
    });
  } catch (error) {
    console.error('Error in batch analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to queue batch analysis' },
      { status: 500 }
    );
  }
}
