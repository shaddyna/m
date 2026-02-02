import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/services/attendance.service';
import dbConnect from '@/lib/dbConnect';


export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || undefined;
    
    const attendance = await AttendanceService.getDailyAttendance(date!);
    
    return NextResponse.json({ attendance });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}