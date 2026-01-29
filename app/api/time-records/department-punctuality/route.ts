// app/api/time-records/department-punctuality/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import { getDepartmentPunctuality } from '@/lib/timeRecord/timeRecordService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const result = await getDepartmentPunctuality();
      return NextResponse.json(result);
    } catch (err: any) {
      console.error("Error fetching department punctuality:", err);
      return NextResponse.json(
        { success: false, message: "Server Error fetching department punctuality", error: err.message },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}