// app/api/time-records/weekly-trend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import { getWeeklyTrend } from '@/lib/timeRecord/timeRecordService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const result = await getWeeklyTrend();
      return NextResponse.json(result);
    } catch (err: any) {
      console.error("Error fetching weekly trend:", err);
      return NextResponse.json(
        { success: false, message: "Server Error fetching weekly trend", error: err.message },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}