import { NextRequest, NextResponse } from 'next/server';
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
}