import { NextRequest, NextResponse } from 'next/server';

import { TimeRecord } from '@/models/TimeRecord';
import { User } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function minutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    //const employeeId = params.id;
     const { id: employeeId } = await params; 
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') as 'week' | 'month' | 'year' || 'month';
    const date = searchParams.get('date');
    
    // Get employee details
    const employee = await User.findById(employeeId)
      .select('name email role department')
      .lean();
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    if (date) {
      // Get daily attendance for specific date
      const workDate = new Date(date).toISOString().split('T')[0];
      const records = await TimeRecord.find({
        employee: employeeId,
        workDate
      }).lean();
      
      const sessions: any = {};
      let workedMinutes = 0;
      
      records.forEach(record => {
        const sessionKey = record.sessionType.replace('-', '');
        sessions[sessionKey] = {
          time: record.actualTime,
          status: record.status,
          imageUrl: record.imageUrl
        };
      });
      
      // Calculate worked hours if both check-in and check-out exist
      if (sessions.checkIn && sessions.checkOut) {
        const checkInTime = timeToMinutes(sessions.checkIn.time);
        const checkOutTime = timeToMinutes(sessions.checkOut.time);
        
        let lunchMinutes = 0;
        if (sessions.lunchOut && sessions.lunchIn) {
          lunchMinutes = timeToMinutes(sessions.lunchIn.time) - timeToMinutes(sessions.lunchOut.time);
        }
        
        workedMinutes = Math.max(0, checkOutTime - checkInTime - lunchMinutes);
      }
      
      return NextResponse.json({
        success: true,
        attendance: {
          employeeId,
          name: employee.name,
          email: employee.email,
          department: employee.department || 'General',
          role: employee.role,
          date: workDate,
          sessions,
          workedMinutes,
          workedHours: minutesToHours(workedMinutes)
        }
      });
    }
    
    // Get performance for period
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    
    // Get records for period
    const records = await TimeRecord.find({
      employee: employeeId,
      date: { $gte: startDate }
    }).lean();
    
    // Group by day
    const daysMap = new Map<string, any>();
    
    records.forEach(record => {
      const day = record.workDate;
      if (!daysMap.has(day)) {
        daysMap.set(day, {
          date: day,
          sessions: {},
          lateCount: 0,
          earlyCount: 0,
          overtimeCount: 0,
          workedMinutes: 0
        });
      }
      
      const dayData = daysMap.get(day);
      const sessionKey = record.sessionType.replace('-', '');
      dayData.sessions[sessionKey] = {
        time: record.actualTime,
        status: record.status
      };
      
      if (record.status === 'late') dayData.lateCount++;
      if (record.status === 'early') dayData.earlyCount++;
      if (record.status === 'overtime') dayData.overtimeCount++;
    });
    
    // Calculate worked minutes for each day
    daysMap.forEach(dayData => {
      const { checkIn, checkOut, lunchOut, lunchIn } = dayData.sessions;
      
      if (checkIn && checkOut) {
        const checkInTime = timeToMinutes(checkIn.time);
        const checkOutTime = timeToMinutes(checkOut.time);
        
        let lunchMinutes = 0;
        if (lunchOut && lunchIn) {
          lunchMinutes = timeToMinutes(lunchIn.time) - timeToMinutes(lunchOut.time);
        }
        
        dayData.workedMinutes = Math.max(0, checkOutTime - checkInTime - lunchMinutes);
      }
    });
    
    const days = Array.from(daysMap.values());
    const daysPresent = days.length;
    const totalDays = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 3600 * 24));
    const daysAbsent = totalDays - daysPresent;
    
    const lateCount = days.reduce((sum, day) => sum + day.lateCount, 0);
    const earlyCheckOuts = days.reduce((sum, day) => sum + day.earlyCount, 0);
    const overtimeDays = days.filter(day => day.overtimeCount > 0).length;
    
    // Calculate average check-in time
    const checkInRecords = records.filter(r => r.sessionType === 'check-in');
    const checkInTimes = checkInRecords.map(r => timeToMinutes(r.actualTime));
    const avgCheckInMinutes = checkInTimes.length > 0
      ? Math.round(checkInTimes.reduce((a, b) => a + b) / checkInTimes.length)
      : 0;
    
    // Calculate average daily hours
    const totalWorkedMinutes = days.reduce((sum, day) => sum + day.workedMinutes, 0);
    const avgDailyMinutes = daysPresent > 0 ? Math.round(totalWorkedMinutes / daysPresent) : 0;
    
    // Calculate discipline score
    let disciplineScore = 100;
    disciplineScore -= lateCount * 5;
    disciplineScore -= daysAbsent * 10;
    disciplineScore = Math.max(0, Math.min(100, disciplineScore));
    disciplineScore += overtimeDays * 2;
    
    const rating = disciplineScore >= 90 ? 'Excellent' :
                  disciplineScore >= 75 ? 'Good' :
                  disciplineScore >= 60 ? 'Fair' : 'Poor';
    
    const attendanceRate = Math.round((daysPresent / totalDays) * 100);
    
    return NextResponse.json({
      success: true,
      performance: {
        employeeId,
        name: employee.name,
        period,
        metrics: {
          daysPresent,
          daysAbsent,
          avgCheckIn: minutesToTime(avgCheckInMinutes),
          lateCount,
          earlyCheckOuts,
          overtimeDays,
          avgDailyHours: minutesToHours(avgDailyMinutes),
          totalWorkedMinutes
        },
        disciplineScore: Math.round(disciplineScore),
        rating,
        attendanceRate
      }
    });
    
  } catch (error: any) {
    console.error('Error in employee performance:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}