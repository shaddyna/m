import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { withCors } from '@/lib/cors';
import { getThisMonthDateRange, getFilteredRecords } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(request.url);
      const dateRange = getThisMonthDateRange();

      const result = await getFilteredRecords(dateRange, {
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined
      });

      result.dateFilter.dateLabel = "This Month";

      return NextResponse.json(result); // ✅ FIX
    } catch (err: any) {
      console.error("Error fetching this month's Clean records:", err);
      return NextResponse.json(
        {
          success: false,
          message: "Server Error fetching this month's records",
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
