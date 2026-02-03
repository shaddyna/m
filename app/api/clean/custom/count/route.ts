// app/api/clean/custom/count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { withCors } from '@/lib/cors';
import { getRecordsCount } from '@/lib/clean/cleanService';

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

      const start = isNaN(Number(startDate)) ? new Date(startDate).getTime() : parseInt(startDate);
      const end = isNaN(Number(endDate)) ? new Date(endDate).getTime() : parseInt(endDate);

      if (isNaN(start) || isNaN(end)) {
        return NextResponse.json(
          { success: false, message: "Invalid date format. Use timestamp or YYYY-MM-DD" },
          { status: 400 }
        );
      }

      // Add one day to end date to include the full end day
      const endDateObj = new Date(end);
      endDateObj.setDate(endDateObj.getDate() + 1);

      const count = await getRecordsCount({ start, end: endDateObj.getTime() });

      return NextResponse.json({ success: true, count, totalRecords: count });
    } catch (err: any) {
      console.error("Error getting custom date range clean count:", err);
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          message: "Server error getting custom date range record count"
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
