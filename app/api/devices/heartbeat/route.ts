import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Device from '@/models/Device';

// API Key validation
const VALID_API_KEYS = process.env.API_KEYS?.split(',') || ['your-secure-api-key-here'];

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key');
  return apiKey ? VALID_API_KEYS.includes(apiKey) : false;
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API Key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { deviceId, isOnline, timestamp, pendingRecords, lastEventTime } = body;

    await dbConnect();

    // Update or create device status
    const device = await Device.findOneAndUpdate(
      { deviceId },
      {
        deviceId,
        isOnline,
        lastHeartbeat: new Date(timestamp || Date.now()),
        pendingRecords: pendingRecords || 0,
        lastEventTime: lastEventTime ? new Date(lastEventTime) : null,
        status: isOnline ? 'online' : 'offline',
      },
      { upsert: true, new: true }
    );

    console.log(`[API] Heartbeat received from ${deviceId}: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

    return NextResponse.json({
      success: true,
      message: 'Heartbeat recorded',
      device,
    });
  } catch (error: any) {
    console.error('[API] Error processing heartbeat:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}