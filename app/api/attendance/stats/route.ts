import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';

const VALID_API_KEYS = process.env.API_KEYS?.split(',') || ['your-secure-api-key-here'];

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key');
  return apiKey ? VALID_API_KEYS.includes(apiKey) : false;
}

export async function GET(request: NextRequest) {
  try {
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

    const matchQuery: any = {};
    
    if (userId) matchQuery.userId = userId;
    
    if (fromDate || toDate) {
      matchQuery.timestamp = {};
      if (fromDate) matchQuery.timestamp.$gte = new Date(fromDate);
      if (toDate) matchQuery.timestamp.$lte = new Date(toDate);
    }

    const stats = await Attendance.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          lateArrivals: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$period', 'MorningIn'] }, { $eq: ['$isLate', true] }] }, 1, 0],
            },
          },
          earlyDepartures: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$period', 'Departure'] }, { $eq: ['$isLate', true] }] }, 1, 0],
            },
          },
          onTime: {
            $sum: {
              $cond: [{ $eq: ['$isLate', false] }, 1, 0],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalRecords: 0,
      uniqueUsers: [],
      lateArrivals: 0,
      earlyDepartures: 0,
      onTime: 0,
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalRecords: result.totalRecords,
        totalUsers: result.uniqueUsers.length,
        lateArrivals: result.lateArrivals,
        earlyDepartures: result.earlyDepartures,
        onTime: result.onTime,
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}