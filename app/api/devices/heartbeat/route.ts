/*import { NextRequest, NextResponse } from 'next/server';
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
}*/

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Device from '@/models/Device';

// API Key validation
const VALID_API_KEYS =
  process.env.API_KEYS?.split(',').map(k => k.trim()) ||
  ['your-secure-api-key-here'];

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key');
  return !!apiKey && VALID_API_KEYS.includes(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      console.warn('[API] Invalid API key received');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API Key' },
        { status: 401 }
      );
    }

    const body = await request.json();

    console.log('[API] Heartbeat payload:', JSON.stringify(body));

    // Support both C# PascalCase and JS camelCase
    const deviceId =
      body.deviceId ??
      body.DeviceId;

    const isOnline =
      body.isOnline ??
      body.IsOnline ??
      false;

    const pendingRecords =
      body.pendingRecords ??
      body.PendingRecords ??
      0;

    const timestamp =
      body.timestamp ??
      body.Timestamp;

    const lastEventTime =
      body.lastEventTime ??
      body.LastEventTime;

    if (!deviceId) {
      console.error('[API] Missing deviceId');
      return NextResponse.json(
        { error: 'deviceId is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData = {
      deviceId,
      isOnline,
      lastHeartbeat: timestamp
        ? new Date(timestamp)
        : new Date(),
      pendingRecords,
      lastEventTime: lastEventTime
        ? new Date(lastEventTime)
        : undefined,
      status: isOnline ? 'online' : 'offline',
    };

    const device = await Device.findOneAndUpdate(
      { deviceId },
      updateData,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    console.log(
      `[API] Heartbeat received from ${deviceId}: ${
        isOnline ? 'ONLINE' : 'OFFLINE'
      } | Pending=${pendingRecords}`
    );

    return NextResponse.json({
      success: true,
      message: 'Heartbeat recorded',
      device,
    });
  } catch (error: any) {
    console.error('[API] Error processing heartbeat:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}