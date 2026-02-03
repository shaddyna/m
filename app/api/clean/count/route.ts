// app/api/clean/count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { withCors } from '@/lib/cors';
import { getRecordsCount } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const count = await getRecordsCount();
      return NextResponse.json({ success: true, count, totalRecords: count });
    } catch (err: any) {
      console.error("Error getting clean count:", err);
      return NextResponse.json(
        { success: false, error: err.message, message: "Server error getting record count" },
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
