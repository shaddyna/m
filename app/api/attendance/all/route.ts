/*import { NextRequest, NextResponse } from 'next/server';
import { TimeRecord } from '@/models/TimeRecord';
import mongoose from 'mongoose';
import { 
  FormattedTimeRecord,
  AttendanceSummary, 
  DailyAttendance, 
  EmployeeAttendance,
  formatTimeRecord,
  formatTime,
  getDayName,
  calculateTimeDifference
} from '@/lib/attendanceUtils';
import dbConnect from '@/lib/dbConnect';


export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const view = searchParams.get('view') || 'detailed';
    const employeeId = searchParams.get('employeeId');
    const department = searchParams.get('department');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    let query: any = {};

    // Apply filters
    if (employeeId && mongoose.Types.ObjectId.isValid(employeeId)) {
      query.employee = new mongoose.Types.ObjectId(employeeId);
    }
    
    if (department) {
      query.department = department;
    }
    
    if (startDate && endDate) {
      query.workDate = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.workDate = { $gte: startDate };
    } else if (endDate) {
      query.workDate = { $lte: endDate };
    }

    // Handle different views
    switch(view) {
      case 'summary':
        return await getSummaryView(query);
      case 'daily':
        return await getDailyView(query, startDate, endDate);
      case 'employee':
        return await getEmployeeView(query, employeeId);
      default:
        return await getDetailedView(query, page, limit, skip);
    }
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    );
  }
}

// 1. Detailed View (Default)
async function getDetailedView(query: any, page: number, limit: number, skip: number) {
  const [records, total] = await Promise.all([
    TimeRecord.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TimeRecord.countDocuments(query)
  ]);

  // Format records for frontend
  const formattedRecords: FormattedTimeRecord[] = records.map(record => 
    formatTimeRecord(record)
  );

  return NextResponse.json({
    data: formattedRecords,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  });
}

// 2. Summary View
async function getSummaryView(query: any) {
  const [records, employees] = await Promise.all([
    TimeRecord.find(query).lean(),
    TimeRecord.distinct('employee', query)
  ]);

  const summary: AttendanceSummary = {
    totalRecords: records.length,
    employeesCount: employees.length,
    onTimeCount: records.filter(r => r.status === 'on-time').length,
    lateCount: records.filter(r => r.status === 'late').length,
    earlyCount: records.filter(r => r.status === 'early').length,
    overtimeCount: records.filter(r => r.status === 'overtime').length,
    departments: Array.from(new Set(records.map(r => r.department))),
    dateRange: query.workDate?.$gte && query.workDate?.$lte 
      ? { 
          startDate: query.workDate.$gte, 
          endDate: query.workDate.$lte 
        }
      : undefined
  };

  return NextResponse.json(summary);
}

// 3. Daily Grouped View
async function getDailyView(query: any, startDate?: string | null, endDate?: string | null) {
  const records = await TimeRecord.find(query)
    .sort({ workDate: -1, actualTime: 1 })
    .lean();

  // Group by date
  const groupedByDate = records.reduce((acc, record) => {
    const date = record.workDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(formatTimeRecord(record));
    return acc;
  }, {} as Record<string, FormattedTimeRecord[]>);

  // Create daily summaries
  const dailyAttendance: DailyAttendance[] = Object.entries(groupedByDate).map(([date, records]) => {
    const uniqueEmployees = new Set(records.map(r => r.employee));
    
    return {
      date,
      dayName: getDayName(date),
      records,
      summary: {
        totalEmployees: uniqueEmployees.size,
        presentEmployees: records.filter(r => r.sessionType === 'check-in').length,
        onTime: records.filter(r => r.status === 'on-time').length,
        late: records.filter(r => r.status === 'late').length,
        early: records.filter(r => r.status === 'early').length,
        overtime: records.filter(r => r.status === 'overtime').length
      }
    };
  });

  return NextResponse.json({
    days: dailyAttendance,
    totalDays: dailyAttendance.length,
    dateRange: startDate && endDate 
      ? { startDate, endDate }
      : null
  });
}

// 4. Employee-specific View
async function getEmployeeView(query: any, employeeId?: string | null) {
  if (!employeeId) {
    return NextResponse.json(
      { error: 'employeeId is required for employee view' },
      { status: 400 }
    );
  }

  const records = await TimeRecord.find(query)
    .sort({ workDate: -1, sessionType: 1 })
    .lean();

  if (records.length === 0) {
    return NextResponse.json({ error: 'No records found for this employee' }, { status: 404 });
  }

  // Format all records
  const formattedRecords: FormattedTimeRecord[] = records.map(record => 
    formatTimeRecord(record)
  );

  // Group by date for employee
  const groupedByDate = formattedRecords.reduce((acc, record) => {
    const date = record.workDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, FormattedTimeRecord[]>);

  const firstRecord = formattedRecords[0];
  const employeeAttendance: EmployeeAttendance = {
    employeeId: firstRecord.employee,
    employeeName: firstRecord.employeeName,
    employeeEmail: firstRecord.employeeEmail,
    employeeRole: firstRecord.employeeRole,
    department: firstRecord.department,
    records: formattedRecords,
    summary: {
      totalDays: Object.keys(groupedByDate).length,
      presentDays: formattedRecords.filter(r => r.sessionType === 'check-in').length,
      onTimeCount: formattedRecords.filter(r => r.status === 'on-time').length,
      lateCount: formattedRecords.filter(r => r.status === 'late').length,
      earlyCount: formattedRecords.filter(r => r.status === 'early').length,
      overtimeCount: formattedRecords.filter(r => r.status === 'overtime').length
    }
  };

  return NextResponse.json(employeeAttendance);
}*/

import { NextRequest, NextResponse } from 'next/server';
import { TimeRecord } from '@/models/TimeRecord';
import mongoose from 'mongoose';
import {
  FormattedTimeRecord,
  AttendanceSummary,
  DailyAttendance,
  EmployeeAttendance,
  formatTimeRecord,
  getDayName,
} from '@/lib/attendanceUtils';
import dbConnect from '@/lib/dbConnect';
import { handleCorsPreflight, withCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      const searchParams = request.nextUrl.searchParams;
      const view = searchParams.get('view') || 'detailed';
      const employeeId = searchParams.get('employeeId');
      const department = searchParams.get('department');
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const skip = (page - 1) * limit;

      const query: any = {};

      // Filters
      if (employeeId && mongoose.Types.ObjectId.isValid(employeeId)) {
        query.employee = new mongoose.Types.ObjectId(employeeId);
      }

      if (department) {
        query.department = department;
      }

      if (startDate && endDate) {
        query.workDate = { $gte: startDate, $lte: endDate };
      } else if (startDate) {
        query.workDate = { $gte: startDate };
      } else if (endDate) {
        query.workDate = { $lte: endDate };
      }

      switch (view) {
        case 'summary':
          return getSummaryView(query);
        case 'daily':
          return getDailyView(query, startDate, endDate);
        case 'employee':
          return getEmployeeView(query, employeeId);
        default:
          return getDetailedView(query, page, limit, skip);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return NextResponse.json(
        { error: 'Failed to fetch attendance data' },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}


async function getDetailedView(query: any, page: number, limit: number, skip: number) {
  const [records, total] = await Promise.all([
    TimeRecord.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TimeRecord.countDocuments(query),
  ]);

  const formattedRecords: FormattedTimeRecord[] =
    records.map(formatTimeRecord);

  return NextResponse.json({
    data: formattedRecords,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  });
}

async function getSummaryView(query: any) {
  const [records, employees] = await Promise.all([
    TimeRecord.find(query).lean(),
    TimeRecord.distinct('employee', query),
  ]);

  const summary: AttendanceSummary = {
    totalRecords: records.length,
    employeesCount: employees.length,
    onTimeCount: records.filter(r => r.status === 'on-time').length,
    lateCount: records.filter(r => r.status === 'late').length,
    earlyCount: records.filter(r => r.status === 'early').length,
    overtimeCount: records.filter(r => r.status === 'overtime').length,
    departments: Array.from(new Set(records.map(r => r.department))),
    dateRange:
      query.workDate?.$gte && query.workDate?.$lte
        ? {
            startDate: query.workDate.$gte,
            endDate: query.workDate.$lte,
          }
        : undefined,
  };

  return NextResponse.json(summary);
}

async function getDailyView(
  query: any,
  startDate?: string | null,
  endDate?: string | null
) {
  const records = await TimeRecord.find(query)
    .sort({ workDate: -1, actualTime: 1 })
    .lean();

  const groupedByDate = records.reduce((acc, record) => {
    const date = record.workDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(formatTimeRecord(record));
    return acc;
  }, {} as Record<string, FormattedTimeRecord[]>);

  const dailyAttendance: DailyAttendance[] = Object.entries(groupedByDate).map(
    ([date, records]) => {
      const uniqueEmployees = new Set(records.map(r => r.employee));

      return {
        date,
        dayName: getDayName(date),
        records,
        summary: {
          totalEmployees: uniqueEmployees.size,
          presentEmployees: records.filter(r => r.sessionType === 'check-in').length,
          onTime: records.filter(r => r.status === 'on-time').length,
          late: records.filter(r => r.status === 'late').length,
          early: records.filter(r => r.status === 'early').length,
          overtime: records.filter(r => r.status === 'overtime').length,
        },
      };
    }
  );

  return NextResponse.json({
    days: dailyAttendance,
    totalDays: dailyAttendance.length,
    dateRange: startDate && endDate ? { startDate, endDate } : null,
  });
}

async function getEmployeeView(query: any, employeeId?: string | null) {
  if (!employeeId) {
    return NextResponse.json(
      { error: 'employeeId is required for employee view' },
      { status: 400 }
    );
  }

  const records = await TimeRecord.find(query)
    .sort({ workDate: -1, sessionType: 1 })
    .lean();

  if (!records.length) {
    return NextResponse.json(
      { error: 'No records found for this employee' },
      { status: 404 }
    );
  }

  const formattedRecords = records.map(formatTimeRecord);

  const groupedByDate = formattedRecords.reduce((acc, record) => {
    if (!acc[record.workDate]) acc[record.workDate] = [];
    acc[record.workDate].push(record);
    return acc;
  }, {} as Record<string, FormattedTimeRecord[]>);

  const first = formattedRecords[0];

  const employeeAttendance: EmployeeAttendance = {
    employeeId: first.employee,
    employeeName: first.employeeName,
    employeeEmail: first.employeeEmail,
    employeeRole: first.employeeRole,
    department: first.department,
    records: formattedRecords,
    summary: {
      totalDays: Object.keys(groupedByDate).length,
      presentDays: formattedRecords.filter(r => r.sessionType === 'check-in').length,
      onTimeCount: formattedRecords.filter(r => r.status === 'on-time').length,
      lateCount: formattedRecords.filter(r => r.status === 'late').length,
      earlyCount: formattedRecords.filter(r => r.status === 'early').length,
      overtimeCount: formattedRecords.filter(r => r.status === 'overtime').length,
    },
  };

  return NextResponse.json(employeeAttendance);
}
