import { NextRequest, NextResponse } from 'next/server';

import { withCors } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import { TimeRecord } from '@/models/TimeRecord';

interface SessionInfo {
  time: string;
  status: string;
  imageUrl?: string;
}

interface DailyAttendance {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  workDate: string;
  sessions: {
    checkIn?: SessionInfo;
    lunchOut?: SessionInfo;
    lunchIn?: SessionInfo;
    checkOut?: SessionInfo;
  };
  missingSessions: string[];
  workedMinutes: number;
  workedHours: string;
  attendanceStatus: 'complete' | 'incomplete' | 'absent';
  disciplineScore?: number;
}

function getDaySchedule(date: Date) {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday

  // Sunday → no work
  if (day === 0) return null;

  // Saturday
  if (day === 6) {
    return {
      'check-in': '09:00',
      'check-out': '14:00'
    };
  }

  // Monday – Friday
  return {
    'check-in': '08:30',
    'lunch-out': '13:00',
    'lunch-in': '14:00',
    'check-out': '18:00'
  };
}

function calculateWorkedMinutes(checkInTime: string, checkOutTime: string, lunchOutTime?: string, lunchInTime?: string): number {
  if (!checkInTime || !checkOutTime) return 0;
  
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  let totalMinutes = timeToMinutes(checkOutTime) - timeToMinutes(checkInTime);
  
  // Deduct lunch break if both lunch-out and lunch-in are recorded
  if (lunchOutTime && lunchInTime) {
    totalMinutes -= (timeToMinutes(lunchInTime) - timeToMinutes(lunchOutTime));
  }
  
  return Math.max(0, totalMinutes);
}

function formatHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const { searchParams } = new URL(request.url);
      const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
      const department = searchParams.get('department');
      
      // Get all employees
      const filter: any = {};
      if (department && department !== 'all') {
        filter.department = department;
      }
      
      const employees = await User.find(filter).select('_id name email department role');
      
      // Get time records for the date
      const timeRecords = await TimeRecord.find({ workDate: dateParam })
        .populate('employee', 'name department role')
        .sort({ actualTime: 1 });
      
      // Group records by employee
      const recordsByEmployee = new Map();
      timeRecords.forEach(record => {
        const empId = record.employee._id.toString();
        if (!recordsByEmployee.has(empId)) {
          recordsByEmployee.set(empId, {});
        }
        recordsByEmployee.get(empId)[record.sessionType] = {
          time: record.actualTime,
          status: record.status,
          imageUrl: record.imageUrl
        };
      });
      
      const schedule = getDaySchedule(new Date(dateParam));
      const isWorkingDay = schedule !== null;
      
      // Build daily attendance for each employee
      const dailyAttendance: DailyAttendance[] = await Promise.all(employees.map(async (employee) => {
        const employeeRecords = recordsByEmployee.get(employee._id.toString()) || {};
        const sessions = employeeRecords;
        
        // Determine missing sessions
        const missingSessions: string[] = [];
        if (isWorkingDay) {
          const expectedSessions = Object.keys(schedule!);
          expectedSessions.forEach(session => {
            if (!employeeRecords[session]) {
              missingSessions.push(session);
            }
          });
        }
        
        // Calculate worked hours
        const workedMinutes = calculateWorkedMinutes(
          employeeRecords['check-in']?.time,
          employeeRecords['check-out']?.time,
          employeeRecords['lunch-out']?.time,
          employeeRecords['lunch-in']?.time
        );
        
        // Determine attendance status
        let attendanceStatus: 'complete' | 'incomplete' | 'absent' = 'absent';
        if (isWorkingDay) {
          if (employeeRecords['check-in']) {
            attendanceStatus = missingSessions.length === 0 ? 'complete' : 'incomplete';
          }
        } else {
          attendanceStatus = 'complete'; // Non-working day
        }
        
        // Calculate discipline score for the day
        let disciplineScore = 100;
        if (isWorkingDay) {
          Object.values(employeeRecords).forEach((record: any) => {
            if (record.status === 'late') disciplineScore -= 5;
            else if (record.status === 'early') disciplineScore -= 3;
            // Overtime adds points
            if (record.status === 'overtime') disciplineScore += 2;
          });
          missingSessions.forEach(() => disciplineScore -= 10);
          disciplineScore = Math.max(0, Math.min(100, disciplineScore));
        }
        
        return {
          employeeId: employee._id.toString(),
          name: employee.name,
          email: employee.email,
          department: employee.department,
          workDate: dateParam,
          sessions: {
            checkIn: sessions['check-in'],
            lunchOut: sessions['lunch-out'],
            lunchIn: sessions['lunch-in'],
            checkOut: sessions['check-out']
          },
          missingSessions,
          workedMinutes,
          workedHours: formatHours(workedMinutes),
          attendanceStatus,
          disciplineScore: isWorkingDay ? disciplineScore : undefined
        };
      }));
      
      return NextResponse.json({
        date: dateParam,
        isWorkingDay,
        totalEmployees: employees.length,
        presentCount: dailyAttendance.filter(d => d.attendanceStatus !== 'absent').length,
        absentCount: dailyAttendance.filter(d => d.attendanceStatus === 'absent').length,
        incompleteCount: dailyAttendance.filter(d => d.attendanceStatus === 'incomplete').length,
        attendance: dailyAttendance
      });
      
    } catch (error: any) {
      console.error('Error fetching daily attendance:', error);
      return NextResponse.json(
        { error: 'Failed to fetch daily attendance', details: error.message },
        { status: 500 }
      );
    }
  });
}