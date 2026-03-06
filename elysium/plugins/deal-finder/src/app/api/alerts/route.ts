import { NextRequest, NextResponse } from 'next/server';
import { AlertConfig } from '../../../types';

// In-memory store (replace with database in production)
const alertConfigsStore: Map<string, AlertConfig> = new Map();

// GET /api/alerts - Get user's alert configuration
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const config = alertConfigsStore.get(userId);

    if (!config) {
      // Return default config
      const defaultConfig: AlertConfig = {
        userId,
        enabled: true,
        pushEnabled: true,
        emailEnabled: false,
        smsEnabled: false,
        filters: {},
        emailSchedule: 'daily',
        smsThreshold: 30,
      };

      return NextResponse.json({
        success: true,
        data: defaultConfig,
      });
    }

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Error fetching alert config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alert configuration' },
      { status: 500 }
    );
  }
}

// POST /api/alerts - Create or update alert configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const config: AlertConfig = {
      userId: body.userId,
      enabled: body.enabled ?? true,
      pushEnabled: body.pushEnabled ?? true,
      emailEnabled: body.emailEnabled ?? false,
      smsEnabled: body.smsEnabled ?? false,
      filters: body.filters || {},
      emailSchedule: body.emailSchedule || 'daily',
      smsThreshold: body.smsThreshold || 30,
    };

    alertConfigsStore.set(body.userId, config);

    return NextResponse.json({
      success: true,
      data: config,
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving alert config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save alert configuration' },
      { status: 500 }
    );
  }
}

// DELETE /api/alerts - Delete alert configuration
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const deleted = alertConfigsStore.delete(userId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Alert config not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Alert configuration deleted',
    });
  } catch (error) {
    console.error('Error deleting alert config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert configuration' },
      { status: 500 }
    );
  }
}
