// app/api/clean/last-7-days/count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { withCors } from '@/lib/cors';
import { getRecordsCount, getLastNDaysDateRange } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const dateRange = getLastNDaysDateRange(7);
      const count = await getRecordsCount(dateRange);
      return NextResponse.json({ success: true, count, totalRecords: count });
    } catch (err: any) {
      console.error("Error getting last 7 days clean count:", err);
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          message: "Server error getting last 7 days record count"
        },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return withCors(request, async () => {
    return new NextResponse(null, { status: 200 });
  });
}
