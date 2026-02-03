// app/api/clean/custom/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { withCors } from '@/lib/cors';
import { getFilteredRecords } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      const { searchParams } = new URL(request.url);
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      if (!startDate || !endDate) {
        return NextResponse.json(
          { success: false, message: "Both startDate and endDate query parameters are required" },
          { status: 400 }
        );
      }

      const start = isNaN(Number(startDate))
        ? new Date(startDate).getTime()
        : parseInt(startDate);

      const end = isNaN(Number(endDate))
        ? new Date(endDate).getTime()
        : parseInt(endDate);

      if (isNaN(start) || isNaN(end)) {
        return NextResponse.json(
          { success: false, message: "Invalid date format. Use timestamp or YYYY-MM-DD" },
          { status: 400 }
        );
      }

      // Include full end day
      const endDateObj = new Date(end);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const adjustedEnd = endDateObj.getTime();

      const result = await getFilteredRecords(
        { start, end: adjustedEnd },
        {
          page: searchParams.get('page') || undefined,
          limit: searchParams.get('limit') || undefined
        }
      );

      result.dateFilter.dateLabel = "Custom Date Range";
      result.dateFilter.startDateHuman = new Date(start).toISOString().split('T')[0];
      result.dateFilter.endDateHuman = new Date(end).toISOString().split('T')[0];

      return NextResponse.json(result); // ✅ FIXED
    } catch (err: any) {
      console.error("Error fetching custom date range Clean records:", err);
      return NextResponse.json(
        {
          success: false,
          message: "Server Error fetching custom date range records",
          error: err.message
        },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return withCors(request, async () => new NextResponse(null, { status: 200 })); // ✅ FIXED
}
