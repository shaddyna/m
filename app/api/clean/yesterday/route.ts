// app/api/clean/yesterday/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { withCors } from '@/lib/cors';
import { getYesterdayDateRange, getFilteredRecords } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(request.url);
      const dateRange = getYesterdayDateRange();

      const result = await getFilteredRecords(dateRange, {
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined
      });

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      result.dateFilter.dateLabel = "Yesterday";
      result.dateFilter.date = yesterday.toISOString().split('T')[0];

      return NextResponse.json(result); // ✅ FIX
    } catch (err: any) {
      console.error("Error fetching yesterday's Clean records:", err);
      return NextResponse.json(
        {
          success: false,
          message: "Server Error fetching yesterday's records",
          error: err.message
        },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return withCors(request, async () => {
    return new NextResponse(null, { status: 200 }); // ✅ FIX
  });
}
