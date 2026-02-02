import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/services/attendance.service';
import dbConnect from '@/lib/dbConnect';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') as 'week' | 'month' | 'year' || 'month';
    const date = searchParams.get('date') || undefined;
    
    const employeeId = params.id;
    
    // Get daily attendance if date provided
    if (date) {
      const attendance = await AttendanceService.getDailyAttendance(date);
      const employeeAttendance = attendance.find(a => a.employeeId.toString() === employeeId);
      
      if (!employeeAttendance) {
        return NextResponse.json(
          { error: 'No attendance record found for this date' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ attendance: employeeAttendance });
    }
    
    // Get performance summary for period
    const performance = await AttendanceService.getEmployeePerformance(employeeId, period);
    
    return NextResponse.json({ performance });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}