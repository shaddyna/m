// app/api/time-records/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import { getTimeSummary } from '@/lib/timeRecord/timeRecordService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const result = await getTimeSummary();
      return NextResponse.json(result);
    } catch (err: any) {
      console.error("Error fetching time summary:", err);
      return NextResponse.json(
        { success: false, message: "Server Error fetching time summary", error: err.message },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}