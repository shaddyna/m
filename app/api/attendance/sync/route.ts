import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Attendance, { IAttendance } from '@/models/Attendance';

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

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['recordId', 'userId', 'userName', 'timestamp', 'period', 'periodType'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    // Check if attendance record already exists
    const existingRecord = await Attendance.findOne({
      userId: body.userId,
      timestamp: new Date(body.timestamp),
      period: body.period,
    });

    if (existingRecord) {
      return NextResponse.json(
        { message: 'Attendance record already exists', record: existingRecord },
        { status: 200 }
      );
    }

    // Create new attendance record
    const attendanceData: Partial<IAttendance> = {
      recordId: body.recordId,
      userId: body.userId,
      userName: body.userName,
      doorId: body.doorId || '1',
      timestamp: new Date(body.timestamp),
      period: body.period,
      periodType: body.periodType,
      isLate: body.isLate || false,
      minutesDifference: body.minutesDifference || 0,
      status: body.status || 'UNKNOWN',
      verifiedBy: body.verifiedBy || 'FINGERPRINT',
      syncedAt: new Date(),
    };

    const attendance = await Attendance.create(attendanceData);

    console.log(`[API] Attendance recorded: ${body.userName} - ${body.period} at ${body.timestamp}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Attendance recorded successfully',
        record: attendance,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] Error recording attendance:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate attendance record' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to fetch attendance records
export async function GET(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API Key' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = {};
    
    if (userId) query.userId = userId;
    
    if (fromDate || toDate) {
      query.timestamp = {};
      if (fromDate) query.timestamp.$gte = new Date(fromDate);
      if (toDate) query.timestamp.$lte = new Date(toDate);
    }

    const skip = (page - 1) * limit;
    
    const [records, total] = await Promise.all([
      Attendance.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Attendance.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}