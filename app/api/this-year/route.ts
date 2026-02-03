import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { withCors } from '@/lib/cors';
import { getThisYearDateRange, getFilteredRecords } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(request.url);
      const dateRange = getThisYearDateRange();

      const result = await getFilteredRecords(dateRange, {
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined
      });

      result.dateFilter.dateLabel = "This Year";
      result.dateFilter.year = new Date().getFullYear();

      return NextResponse.json(result); // ✅ FIX
    } catch (err: any) {
      console.error("Error fetching this year's Clean records:", err);
      return NextResponse.json(
        {
          success: false,
          message: "Server Error fetching this year's records",
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
