/*import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/services/attendance.service';
import dbConnect from '@/lib/dbConnect';


export async function GET() {
  try {
    await dbConnect();
    
    const weeklyTrend = await AttendanceService.getWeeklyTrend();
    
    return NextResponse.json({ weeklyTrend });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}*/

// app/api/attendance/weekly-trend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import { AttendanceService } from '@/services/attendance.service';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const weeklyTrend = await AttendanceService.getWeeklyTrend();
      
      return NextResponse.json({ weeklyTrend });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}