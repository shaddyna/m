/*import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { TimeRecord } from '@/models/TimeRecord';
import  User  from '@/models/User';

/* ----------------------------- Helpers ----------------------------- *

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`;
}

function minutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

/* ----------------------------- GET Handler ----------------------------- *

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Extract ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const employeeId = pathParts[pathParts.length - 1];
    
    if (!employeeId || employeeId === '[id]') {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    
    const period =
      (searchParams.get('period') as 'week' | 'month' | 'year') ?? 'month';
    const date = searchParams.get('date');

    /* ------------------------ Employee Info ------------------------ *

    const employee = await User.findById(employeeId)
      .select('name email role department')
      .lean();

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    /* -------------------- Daily Attendance -------------------- *

    if (date) {
      const workDate = new Date(date).toISOString().split('T')[0];

      const records = await TimeRecord.find({
        employee: employeeId,
        workDate,
      }).lean();

      const sessions: Record<string, any> = {};
      let workedMinutes = 0;

      for (const record of records) {
        const key = record.sessionType.replace('-', '');
        sessions[key] = {
          time: record.actualTime,
          status: record.status,
          imageUrl: record.imageUrl,
        };
      }

      if (sessions.checkIn && sessions.checkOut) {
        const checkInTime = timeToMinutes(sessions.checkIn.time);
        const checkOutTime = timeToMinutes(sessions.checkOut.time);

        let lunchMinutes = 0;
        if (sessions.lunchOut && sessions.lunchIn) {
          lunchMinutes =
            timeToMinutes(sessions.lunchIn.time) -
            timeToMinutes(sessions.lunchOut.time);
        }

        workedMinutes = Math.max(
          0,
          checkOutTime - checkInTime - lunchMinutes
        );
      }

      return NextResponse.json({
        success: true,
        attendance: {
          employeeId,
          name: employee.name,
          email: employee.email,
          department: employee.department ?? 'General',
          role: employee.role,
          date: workDate,
          sessions,
          workedMinutes,
          workedHours: minutesToHours(workedMinutes),
        },
      });
    }

    /* -------------------- Period Performance -------------------- *

    const startDate = new Date();

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

    const records = await TimeRecord.find({
      employee: employeeId,
      workDate: { $gte: startDate.toISOString() },
    }).lean();

    const daysMap = new Map<string, any>();

    for (const record of records) {
      const day = record.workDate;

      if (!daysMap.has(day)) {
        daysMap.set(day, {
          date: day,
          sessions: {},
          lateCount: 0,
          earlyCount: 0,
          overtimeCount: 0,
          workedMinutes: 0,
        });
      }

      const dayData = daysMap.get(day);
      const key = record.sessionType.replace('-', '');

      dayData.sessions[key] = {
        time: record.actualTime,
        status: record.status,
      };

      if (record.status === 'late') dayData.lateCount++;
      if (record.status === 'early') dayData.earlyCount++;
      if (record.status === 'overtime') dayData.overtimeCount++;
    }

    /* -------------------- Work Hours Calc -------------------- *

    for (const dayData of daysMap.values()) {
      const { checkIn, checkOut, lunchOut, lunchIn } = dayData.sessions;

      if (checkIn && checkOut) {
        const checkInTime = timeToMinutes(checkIn.time);
        const checkOutTime = timeToMinutes(checkOut.time);

        let lunchMinutes = 0;
        if (lunchOut && lunchIn) {
          lunchMinutes =
            timeToMinutes(lunchIn.time) -
            timeToMinutes(lunchOut.time);
        }

        dayData.workedMinutes = Math.max(
          0,
          checkOutTime - checkInTime - lunchMinutes
        );
      }
    }

    const days = Array.from(daysMap.values());
    const daysPresent = days.length;

    const totalDays = Math.max(
      1,
      Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    const daysAbsent = totalDays - daysPresent;

    const lateCount = days.reduce((s, d) => s + d.lateCount, 0);
    const earlyCheckOuts = days.reduce((s, d) => s + d.earlyCount, 0);
    const overtimeDays = days.filter(d => d.overtimeCount > 0).length;

    const checkInTimes = records
      .filter(r => r.sessionType === 'check-in')
      .map(r => timeToMinutes(r.actualTime));

    const avgCheckInMinutes =
      checkInTimes.length > 0
        ? Math.round(
            checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length
          )
        : 0;

    const totalWorkedMinutes = days.reduce(
      (sum, day) => sum + day.workedMinutes,
      0
    );

    const avgDailyMinutes =
      daysPresent > 0
        ? Math.round(totalWorkedMinutes / daysPresent)
        : 0;

    /* -------------------- Discipline Score -------------------- *

    let disciplineScore = 100;
    disciplineScore -= lateCount * 5;
    disciplineScore -= daysAbsent * 10;
    disciplineScore += overtimeDays * 2;
    disciplineScore = Math.min(100, Math.max(0, disciplineScore));

    const rating =
      disciplineScore >= 90
        ? 'Excellent'
        : disciplineScore >= 75
        ? 'Good'
        : disciplineScore >= 60
        ? 'Fair'
        : 'Poor';

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
          totalWorkedMinutes,
        },
        disciplineScore,
        rating,
        attendanceRate,
      },
    });
  } catch (error: any) {
    console.error('Employee attendance error:', error);

    return NextResponse.json(
      { success: false, error: error.message ?? 'Internal Server Error' },
      { status: 500 }
    );
  }
}*/

// app/api/attendance/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import { TimeRecord } from '@/models/TimeRecord';
import User from '@/models/User';

/* ----------------------------- Helpers ----------------------------- */

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`;
}

function minutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

/* ----------------------------- GET Handler ----------------------------- */

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      // Extract ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const employeeId = pathParts[pathParts.length - 1];
      
      if (!employeeId || employeeId === '[id]') {
        return NextResponse.json(
          { success: false, error: 'Employee ID is required' },
          { status: 400 }
        );
      }
      
      const searchParams = request.nextUrl.searchParams;
      
      const period =
        (searchParams.get('period') as 'week' | 'month' | 'year') ?? 'month';
      const date = searchParams.get('date');

      /* ------------------------ Employee Info ------------------------ */

      const employee = await User.findById(employeeId)
        .select('name email role department')
        .lean();

      if (!employee) {
        return NextResponse.json(
          { success: false, error: 'Employee not found' },
          { status: 404 }
        );
      }

      /* -------------------- Daily Attendance -------------------- */

      if (date) {
        const workDate = new Date(date).toISOString().split('T')[0];

        const records = await TimeRecord.find({
          employee: employeeId,
          workDate,
        }).lean();

        const sessions: Record<string, any> = {};
        let workedMinutes = 0;

        for (const record of records) {
          const key = record.sessionType.replace('-', '');
          sessions[key] = {
            time: record.actualTime,
            status: record.status,
            imageUrl: record.imageUrl,
          };
        }

        if (sessions.checkIn && sessions.checkOut) {
          const checkInTime = timeToMinutes(sessions.checkIn.time);
          const checkOutTime = timeToMinutes(sessions.checkOut.time);

          let lunchMinutes = 0;
          if (sessions.lunchOut && sessions.lunchIn) {
            lunchMinutes =
              timeToMinutes(sessions.lunchIn.time) -
              timeToMinutes(sessions.lunchOut.time);
          }

          workedMinutes = Math.max(
            0,
            checkOutTime - checkInTime - lunchMinutes
          );
        }

        return NextResponse.json({
          success: true,
          attendance: {
            employeeId,
            name: employee.name,
            email: employee.email,
            department: employee.department ?? 'General',
            role: employee.role,
            date: workDate,
            sessions,
            workedMinutes,
            workedHours: minutesToHours(workedMinutes),
          },
        });
      }

      /* -------------------- Period Performance -------------------- */

      const startDate = new Date();

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

      const records = await TimeRecord.find({
        employee: employeeId,
        workDate: { $gte: startDate.toISOString() },
      }).lean();

      const daysMap = new Map<string, any>();

      for (const record of records) {
        const day = record.workDate;

        if (!daysMap.has(day)) {
          daysMap.set(day, {
            date: day,
            sessions: {},
            lateCount: 0,
            earlyCount: 0,
            overtimeCount: 0,
            workedMinutes: 0,
          });
        }

        const dayData = daysMap.get(day);
        const key = record.sessionType.replace('-', '');

        dayData.sessions[key] = {
          time: record.actualTime,
          status: record.status,
        };

        if (record.status === 'late') dayData.lateCount++;
        if (record.status === 'early') dayData.earlyCount++;
        if (record.status === 'overtime') dayData.overtimeCount++;
      }

      /* -------------------- Work Hours Calc -------------------- */

      for (const dayData of daysMap.values()) {
        const { checkIn, checkOut, lunchOut, lunchIn } = dayData.sessions;

        if (checkIn && checkOut) {
          const checkInTime = timeToMinutes(checkIn.time);
          const checkOutTime = timeToMinutes(checkOut.time);

          let lunchMinutes = 0;
          if (lunchOut && lunchIn) {
            lunchMinutes =
              timeToMinutes(lunchIn.time) -
              timeToMinutes(lunchOut.time);
          }

          dayData.workedMinutes = Math.max(
            0,
            checkOutTime - checkInTime - lunchMinutes
          );
        }
      }

      const days = Array.from(daysMap.values());
      const daysPresent = days.length;

      const totalDays = Math.max(
        1,
        Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      const daysAbsent = totalDays - daysPresent;

      const lateCount = days.reduce((s, d) => s + d.lateCount, 0);
      const earlyCheckOuts = days.reduce((s, d) => s + d.earlyCount, 0);
      const overtimeDays = days.filter(d => d.overtimeCount > 0).length;

      const checkInTimes = records
        .filter(r => r.sessionType === 'check-in')
        .map(r => timeToMinutes(r.actualTime));

      const avgCheckInMinutes =
        checkInTimes.length > 0
          ? Math.round(
              checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length
            )
          : 0;

      const totalWorkedMinutes = days.reduce(
        (sum, day) => sum + day.workedMinutes,
        0
      );

      const avgDailyMinutes =
        daysPresent > 0
          ? Math.round(totalWorkedMinutes / daysPresent)
          : 0;

      /* -------------------- Discipline Score -------------------- */

      let disciplineScore = 100;
      disciplineScore -= lateCount * 5;
      disciplineScore -= daysAbsent * 10;
      disciplineScore += overtimeDays * 2;
      disciplineScore = Math.min(100, Math.max(0, disciplineScore));

      const rating =
        disciplineScore >= 90
          ? 'Excellent'
          : disciplineScore >= 75
          ? 'Good'
          : disciplineScore >= 60
          ? 'Fair'
          : 'Poor';

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
            totalWorkedMinutes,
          },
          disciplineScore,
          rating,
          attendanceRate,
        },
      });
    } catch (error: any) {
      console.error('Employee attendance error:', error);

      return NextResponse.json(
        { success: false, error: error.message ?? 'Internal Server Error' },
        { status: 500 }
      );
    }
  });
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}