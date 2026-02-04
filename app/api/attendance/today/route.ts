/*import { NextRequest, NextResponse } from 'next/server';
import { TimeRecord } from '@/models/TimeRecord';

import { formatTime, getDayName, formatTimeRecord } from '@/lib/attendanceUtils';
import dbConnect from '@/lib/dbConnect';

interface TodaySession {
  sessionType: string;
  time: string;
  recordedTime: string;
  status: string;
  notes?: string;
  imageUrl?: string;
}

interface TodayEmployee {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  department: string;
  sessions: TodaySession[];
  currentStatus: string;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Get all check-ins for today
    const todayRecords = await TimeRecord.find({ 
      workDate: today 
    }).sort({ actualTime: 1 }).lean();

    // Group by employee
    const employeeMap = new Map<string, TodayEmployee>();
    
    todayRecords.forEach(record => {
      const employeeId = record.employee.toString();
      if (!employeeMap.has(employeeId)) {
        employeeMap.set(employeeId, {
          employeeId,
          employeeName: record.employeeName,
          employeeEmail: record.employeeEmail,
          employeeRole: record.employeeRole,
          department: record.department,
          sessions: [],
          currentStatus: 'Not Checked In'
        });
      }
      
      const employeeData = employeeMap.get(employeeId)!;
      employeeData.sessions.push({
        sessionType: record.sessionType,
        time: formatTime(record.actualTime),
        recordedTime: formatTime(record.recordedTime),
        status: record.status,
        notes: record.notes,
        imageUrl: record.imageUrl
      });
      
      // Update current status based on last session
      const lastSession = record.sessionType;
      if (lastSession === 'check-in') employeeData.currentStatus = 'Working';
      if (lastSession === 'lunch-out') employeeData.currentStatus = 'On Lunch';
      if (lastSession === 'lunch-in') employeeData.currentStatus = 'Working';
      if (lastSession === 'check-out') employeeData.currentStatus = 'Checked Out';
    });

    // Calculate overall stats
    const totalEmployees = employeeMap.size;
    const checkedIn = Array.from(employeeMap.values())
      .filter(e => e.currentStatus === 'Working').length;
    const onLunch = Array.from(employeeMap.values())
      .filter(e => e.currentStatus === 'On Lunch').length;
    const checkedOut = Array.from(employeeMap.values())
      .filter(e => e.currentStatus === 'Checked Out').length;
    const notCheckedIn = totalEmployees - checkedIn - onLunch - checkedOut;

    // Format response
    const response = {
      date: today,
      dayName: getDayName(today),
      lastUpdated: new Date().toISOString(),
      statistics: {
        totalEmployees,
        checkedIn,
        onLunch,
        checkedOut,
        notCheckedIn,
        lateArrivals: todayRecords.filter(r => 
          r.sessionType === 'check-in' && r.status === 'late'
        ).length,
        earlyDepartures: todayRecords.filter(r => 
          r.sessionType === 'check-out' && r.status === 'early'
        ).length
      },
      employees: Array.from(employeeMap.values()),
      recentActivities: todayRecords.slice(0, 10).map(r => ({
        employeeName: r.employeeName,
        action: r.sessionType.replace('-', ' '),
        time: formatTime(r.actualTime),
        status: r.status,
        department: r.department
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching today\'s attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch today\'s attendance' },
      { status: 500 }
    );
  }
}*/

import { NextRequest, NextResponse } from 'next/server';
import { TimeRecord } from '@/models/TimeRecord';
import { formatTime, getDayName } from '@/lib/attendanceUtils';
import dbConnect from '@/lib/dbConnect';
import { handleCorsPreflight, withCors } from '@/lib/cors';

interface TodaySession {
  sessionType: string;
  time: string;
  recordedTime: string;
  status: string;
  notes?: string;
  imageUrl?: string;
}

interface TodayEmployee {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  department: string;
  sessions: TodaySession[];
  currentStatus: string;
}

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const todayRecords = await TimeRecord.find({
        workDate: today,
      })
        .sort({ actualTime: 1 })
        .lean();

      const employeeMap = new Map<string, TodayEmployee>();

      todayRecords.forEach((record) => {
        const employeeId = record.employee.toString();

        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            employeeId,
            employeeName: record.employeeName,
            employeeEmail: record.employeeEmail,
            employeeRole: record.employeeRole,
            department: record.department,
            sessions: [],
            currentStatus: 'Not Checked In',
          });
        }

        const employeeData = employeeMap.get(employeeId)!;

        employeeData.sessions.push({
          sessionType: record.sessionType,
          time: formatTime(record.actualTime),
          recordedTime: formatTime(record.recordedTime),
          status: record.status,
          notes: record.notes,
          imageUrl: record.imageUrl,
        });

        // Update current status
        switch (record.sessionType) {
          case 'check-in':
            employeeData.currentStatus = 'Working';
            break;
          case 'lunch-out':
            employeeData.currentStatus = 'On Lunch';
            break;
          case 'lunch-in':
            employeeData.currentStatus = 'Working';
            break;
          case 'check-out':
            employeeData.currentStatus = 'Checked Out';
            break;
        }
      });

      const employees = Array.from(employeeMap.values());

      const checkedIn = employees.filter(e => e.currentStatus === 'Working').length;
      const onLunch = employees.filter(e => e.currentStatus === 'On Lunch').length;
      const checkedOut = employees.filter(e => e.currentStatus === 'Checked Out').length;
      const notCheckedIn =
        employees.length - checkedIn - onLunch - checkedOut;

      const response = {
        date: today,
        dayName: getDayName(today),
        lastUpdated: new Date().toISOString(),
        statistics: {
          totalEmployees: employees.length,
          checkedIn,
          onLunch,
          checkedOut,
          notCheckedIn,
          lateArrivals: todayRecords.filter(
            r => r.sessionType === 'check-in' && r.status === 'late'
          ).length,
          earlyDepartures: todayRecords.filter(
            r => r.sessionType === 'check-out' && r.status === 'early'
          ).length,
        },
        employees,
        recentActivities: todayRecords.slice(0, 10).map(r => ({
          employeeName: r.employeeName,
          action: r.sessionType.replace('-', ' '),
          time: formatTime(r.actualTime),
          status: r.status,
          department: r.department,
        })),
      };

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
      return NextResponse.json(
        { error: "Failed to fetch today's attendance" },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}
