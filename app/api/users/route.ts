/*import { NextRequest, NextResponse } from 'next/server';

import { TimeRecord } from '@/models/TimeRecord';
import  User  from '@/models/User';
import dbConnect from '@/lib/dbConnect';

interface DailySession {
  time?: string;
  status?: string;
  imageUrl?: string;
}

interface DailyAttendance {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: string;
  date: string;
  sessions: {
    checkIn?: DailySession;
    lunchOut?: DailySession;
    lunchIn?: DailySession;
    checkOut?: DailySession;
  };
  missingSessions: string[];
  workedMinutes: number;
  workedHours: string;
  attendanceStatus: 'complete' | 'incomplete' | 'absent';
  lateCount: number;
  earlyCount: number;
  overtimeCount: number;
}

function getDaySchedule(date: Date) {
  const day = date.getDay();
  
  if (day === 0) return null; // Sunday
  if (day === 6) { // Saturday
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

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    
    // Use provided date or today
    const date = dateParam ? new Date(dateParam) : new Date();
    date.setHours(0, 0, 0, 0);
    
    const workDate = date.toISOString().split('T')[0];
    
    // Get all active employees
    const employees = await User.find({ isActive: true })
      .select('_id name email role department')
      .lean();
    
    // Get all time records for this date
    const timeRecords = await TimeRecord.find({ workDate })
      .populate('employee', 'name email role department')
      .sort({ sessionType: 1 })
      .lean();
    
    // Create attendance map
    const attendanceMap = new Map<string, DailyAttendance>();
    
    // Initialize all employees as absent
    employees.forEach((emp: { _id: { toString: () => string; }; name: any; email: any; department: any; role: any; }) => {
      attendanceMap.set(emp._id.toString(), {
        employeeId: emp._id.toString(),
        name: emp.name,
        email: emp.email,
        department: emp.department || 'General',
        role: emp.role,
        date: workDate,
        sessions: {},
        missingSessions: [],
        workedMinutes: 0,
        workedHours: '0h 00m',
        attendanceStatus: 'absent',
        lateCount: 0,
        earlyCount: 0,
        overtimeCount: 0
      });
    });
    
    // Process existing records
    timeRecords.forEach(record => {
      const empId = record.employee._id.toString();
      const attendance = attendanceMap.get(empId);
      
      if (attendance) {
        attendance.attendanceStatus = 'incomplete';
        
        // Store session data
        const sessionKey = record.sessionType.replace('-', '') as keyof typeof attendance.sessions;
        attendance.sessions[sessionKey] = {
          time: record.actualTime,
          status: record.status,
          imageUrl: record.imageUrl
        };
        
        // Count statuses
        if (record.status === 'late') attendance.lateCount++;
        if (record.status === 'early') attendance.earlyCount++;
        if (record.status === 'overtime') attendance.overtimeCount++;
      }
    });
    
    // Calculate missing sessions and working hours
    const schedule = getDaySchedule(date);
    
    attendanceMap.forEach(attendance => {
      if (!schedule) {
        // Sunday - no expected sessions
        attendance.missingSessions = [];
        if (attendance.attendanceStatus === 'absent') {
          attendance.attendanceStatus = 'complete'; // Sunday is off
        }
        return;
      }
      
      const expectedSessions = Object.keys(schedule) as Array<keyof typeof schedule>;
      attendance.missingSessions = expectedSessions.filter(
        session => !attendance.sessions[session.replace('-', '') as keyof typeof attendance.sessions]
      );
      
      // Calculate worked minutes
      const checkIn = attendance.sessions.checkIn;
      const checkOut = attendance.sessions.checkOut;
      const lunchOut = attendance.sessions.lunchOut;
      const lunchIn = attendance.sessions.lunchIn;
      
      if (checkIn && checkOut) {
        const checkInTime = timeToMinutes(checkIn.time!);
        const checkOutTime = timeToMinutes(checkOut.time!);
        
        let lunchMinutes = 0;
        if (lunchOut && lunchIn) {
          lunchMinutes = timeToMinutes(lunchIn.time!) - timeToMinutes(lunchOut.time!);
        }
        
        attendance.workedMinutes = Math.max(0, checkOutTime - checkInTime - lunchMinutes);
        attendance.workedHours = minutesToHours(attendance.workedMinutes);
        
        // Update status if complete
        if (attendance.missingSessions.length === 0) {
          attendance.attendanceStatus = 'complete';
        }
      }
    });
    
    const attendanceArray = Array.from(attendanceMap.values());
    
    return NextResponse.json({ 
      success: true,
      date: workDate,
      attendance: attendanceArray 
    });
    
  } catch (error: any) {
    console.error('Error in daily attendance:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}*/

// app/api/attendance/daily/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import { TimeRecord } from '@/models/TimeRecord';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

interface DailySession {
  time?: string;
  status?: string;
  imageUrl?: string;
}

interface DailyAttendance {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: string;
  date: string;
  sessions: {
    checkIn?: DailySession;
    lunchOut?: DailySession;
    lunchIn?: DailySession;
    checkOut?: DailySession;
  };
  missingSessions: string[];
  workedMinutes: number;
  workedHours: string;
  attendanceStatus: 'complete' | 'incomplete' | 'absent';
  lateCount: number;
  earlyCount: number;
  overtimeCount: number;
}

function getDaySchedule(date: Date) {
  const day = date.getDay();
  
  if (day === 0) return null; // Sunday
  if (day === 6) { // Saturday
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

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const searchParams = request.nextUrl.searchParams;
      const dateParam = searchParams.get('date');
      
      // Use provided date or today
      const date = dateParam ? new Date(dateParam) : new Date();
      date.setHours(0, 0, 0, 0);
      
      const workDate = date.toISOString().split('T')[0];
      
      // Get all active employees
      const employees = await User.find({ isActive: true })
        .select('_id name email role department')
        .lean();
      
      // Get all time records for this date
      const timeRecords = await TimeRecord.find({ workDate })
        .populate('employee', 'name email role department')
        .sort({ sessionType: 1 })
        .lean();
      
      // Create attendance map
      const attendanceMap = new Map<string, DailyAttendance>();
      
      // Initialize all employees as absent
      employees.forEach((emp: { _id: { toString: () => string; }; name: any; email: any; department: any; role: any; }) => {
        attendanceMap.set(emp._id.toString(), {
          employeeId: emp._id.toString(),
          name: emp.name,
          email: emp.email,
          department: emp.department || 'General',
          role: emp.role,
          date: workDate,
          sessions: {},
          missingSessions: [],
          workedMinutes: 0,
          workedHours: '0h 00m',
          attendanceStatus: 'absent',
          lateCount: 0,
          earlyCount: 0,
          overtimeCount: 0
        });
      });
      
      // Process existing records
      timeRecords.forEach(record => {
        const empId = record.employee._id.toString();
        const attendance = attendanceMap.get(empId);
        
        if (attendance) {
          attendance.attendanceStatus = 'incomplete';
          
          // Store session data
          const sessionKey = record.sessionType.replace('-', '') as keyof typeof attendance.sessions;
          attendance.sessions[sessionKey] = {
            time: record.actualTime,
            status: record.status,
            imageUrl: record.imageUrl
          };
          
          // Count statuses
          if (record.status === 'late') attendance.lateCount++;
          if (record.status === 'early') attendance.earlyCount++;
          if (record.status === 'overtime') attendance.overtimeCount++;
        }
      });
      
      // Calculate missing sessions and working hours
      const schedule = getDaySchedule(date);
      
      attendanceMap.forEach(attendance => {
        if (!schedule) {
          // Sunday - no expected sessions
          attendance.missingSessions = [];
          if (attendance.attendanceStatus === 'absent') {
            attendance.attendanceStatus = 'complete'; // Sunday is off
          }
          return;
        }
        
        const expectedSessions = Object.keys(schedule) as Array<keyof typeof schedule>;
        attendance.missingSessions = expectedSessions.filter(
          session => !attendance.sessions[session.replace('-', '') as keyof typeof attendance.sessions]
        );
        
        // Calculate worked minutes
        const checkIn = attendance.sessions.checkIn;
        const checkOut = attendance.sessions.checkOut;
        const lunchOut = attendance.sessions.lunchOut;
        const lunchIn = attendance.sessions.lunchIn;
        
        if (checkIn && checkOut) {
          const checkInTime = timeToMinutes(checkIn.time!);
          const checkOutTime = timeToMinutes(checkOut.time!);
          
          let lunchMinutes = 0;
          if (lunchOut && lunchIn) {
            lunchMinutes = timeToMinutes(lunchIn.time!) - timeToMinutes(lunchOut.time!);
          }
          
          attendance.workedMinutes = Math.max(0, checkOutTime - checkInTime - lunchMinutes);
          attendance.workedHours = minutesToHours(attendance.workedMinutes);
          
          // Update status if complete
          if (attendance.missingSessions.length === 0) {
            attendance.attendanceStatus = 'complete';
          }
        }
      });
      
      const attendanceArray = Array.from(attendanceMap.values());
      
      return NextResponse.json({ 
        success: true,
        date: workDate,
        attendance: attendanceArray 
      });
      
    } catch (error: any) {
      console.error('Error in daily attendance:', error);
      return NextResponse.json(
        { 
          success: false,
          error: error.message 
        },
        { status: 500 }
      );
    }
  });
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}