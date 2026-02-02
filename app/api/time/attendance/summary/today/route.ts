/*import { NextRequest, NextResponse } from 'next/server';

import { TimeRecord } from '@/models/TimeRecord';
import User  from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const workDate = today.toISOString().split('T')[0];
    
    // Get all employees
    const totalEmployees = await User.countDocuments({ isActive: true });
    
    // Get today's check-in records
    const todayRecords = await TimeRecord.find({ 
      workDate,
      sessionType: 'check-in'
    }).populate('employee', 'department');
    
    // Get all records for today
    const allTodayRecords = await TimeRecord.find({ workDate }).lean();
    
    // Calculate statistics
    const employeesWithCheckIn = new Set(
      todayRecords.map(record => record.employee._id.toString())
    );
    
    const present = employeesWithCheckIn.size;
    const absent = totalEmployees - present;
    
    // Count statuses
    let late = 0;
    let onTime = 0;
    let early = 0;
    let overtime = 0;
    let incomplete = 0;
    
    // Group records by employee
    const employeeRecords = new Map<string, any>();
    
    allTodayRecords.forEach(record => {
      const empId = record.employee._id.toString();
      if (!employeeRecords.has(empId)) {
        employeeRecords.set(empId, {
          sessions: new Set(),
          lateCount: 0,
          earlyCount: 0,
          overtimeCount: 0
        });
      }
      
      const empData = employeeRecords.get(empId);
      empData.sessions.add(record.sessionType);
      
      if (record.status === 'late') empData.lateCount++;
      if (record.status === 'early') empData.earlyCount++;
      if (record.status === 'overtime') empData.overtimeCount++;
    });
    
    // Calculate final stats
    employeeRecords.forEach(empData => {
      if (empData.lateCount > 0) late++;
      if (empData.lateCount === 0 && empData.earlyCount === 0) onTime++;
      if (empData.earlyCount > 0) early++;
      if (empData.overtimeCount > 0) overtime++;
      
      // Check if incomplete (missing expected sessions)
      const day = today.getDay();
      const expectedSessions = day === 6 ? 2 : day === 0 ? 0 : 4;
      if (empData.sessions.size > 0 && empData.sessions.size < expectedSessions) {
        incomplete++;
      }
    });
    
    // Generate alerts
    const alerts: string[] = [];
    
    if (absent > 0) {
      alerts.push(`${absent} employee${absent > 1 ? 's' : ''} absent today`);
    }
    
    // Check for missing lunch-in
    const lunchInRecords = await TimeRecord.countDocuments({
      workDate,
      sessionType: 'lunch-in'
    });
    const missingLunch = present - lunchInRecords;
    if (missingLunch > 0) {
      alerts.push(`${missingLunch} employee${missingLunch > 1 ? 's' : ''} forgot lunch-in`);
    }
    
    // Check early departures
    const earlyDepartures = await TimeRecord.countDocuments({
      workDate,
      sessionType: 'check-out',
      status: 'early'
    });
    if (earlyDepartures > 0) {
      alerts.push(`${earlyDepartures} employee${earlyDepartures > 1 ? 's' : ''} checked out early`);
    }
    
    // Department summary
    const departmentStats = await TimeRecord.aggregate([
      {
        $match: {
          workDate,
          sessionType: 'check-in'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeData'
        }
      },
      {
        $unwind: '$employeeData'
      },
      {
        $group: {
          _id: '$employeeData.department',
          total: { $sum: 1 },
          onTime: {
            $sum: { $cond: [{ $eq: ['$status', 'on-time'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          department: '$_id',
          present: '$total',
          onTime: 1,
          punctuality: {
            $multiply: [
              { $divide: ['$onTime', '$total'] },
              100
            ]
          }
        }
      }
    ]);
    
    // Get total per department
    const allDepartments = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', total: { $sum: 1 } } }
    ]);
    
    // Merge department stats
    const departmentSummary = allDepartments.map(dept => {
      const stats = departmentStats.find(d => d.department === dept._id);
      return {
        department: dept._id || 'General',
        present: stats?.present || 0,
        absent: dept.total - (stats?.present || 0),
        total: dept.total,
        onTime: stats?.onTime || 0,
        punctuality: stats?.punctuality || 0
      };
    });
    
    return NextResponse.json({
      success: true,
      date: workDate,
      stats: {
        totalEmployees,
        present,
        absent,
        late,
        onTime,
        incomplete,
        early,
        overtime
      },
      alerts,
      departmentSummary
    });
    
  } catch (error: any) {
    console.error('Error in summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}*/

// app/api/attendance/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import { TimeRecord } from '@/models/TimeRecord';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const workDate = today.toISOString().split('T')[0];
      
      // Get all employees
      const totalEmployees = await User.countDocuments({ isActive: true });
      
      // Get today's check-in records
      const todayRecords = await TimeRecord.find({ 
        workDate,
        sessionType: 'check-in'
      }).populate('employee', 'department');
      
      // Get all records for today
      const allTodayRecords = await TimeRecord.find({ workDate }).lean();
      
      // Calculate statistics
      const employeesWithCheckIn = new Set(
        todayRecords.map(record => record.employee._id.toString())
      );
      
      const present = employeesWithCheckIn.size;
      const absent = totalEmployees - present;
      
      // Count statuses
      let late = 0;
      let onTime = 0;
      let early = 0;
      let overtime = 0;
      let incomplete = 0;
      
      // Group records by employee
      const employeeRecords = new Map<string, any>();
      
      allTodayRecords.forEach(record => {
        const empId = record.employee._id.toString();
        if (!employeeRecords.has(empId)) {
          employeeRecords.set(empId, {
            sessions: new Set(),
            lateCount: 0,
            earlyCount: 0,
            overtimeCount: 0
          });
        }
        
        const empData = employeeRecords.get(empId);
        empData.sessions.add(record.sessionType);
        
        if (record.status === 'late') empData.lateCount++;
        if (record.status === 'early') empData.earlyCount++;
        if (record.status === 'overtime') empData.overtimeCount++;
      });
      
      // Calculate final stats
      employeeRecords.forEach(empData => {
        if (empData.lateCount > 0) late++;
        if (empData.lateCount === 0 && empData.earlyCount === 0) onTime++;
        if (empData.earlyCount > 0) early++;
        if (empData.overtimeCount > 0) overtime++;
        
        // Check if incomplete (missing expected sessions)
        const day = today.getDay();
        const expectedSessions = day === 6 ? 2 : day === 0 ? 0 : 4;
        if (empData.sessions.size > 0 && empData.sessions.size < expectedSessions) {
          incomplete++;
        }
      });
      
      // Generate alerts
      const alerts: string[] = [];
      
      if (absent > 0) {
        alerts.push(`${absent} employee${absent > 1 ? 's' : ''} absent today`);
      }
      
      // Check for missing lunch-in
      const lunchInRecords = await TimeRecord.countDocuments({
        workDate,
        sessionType: 'lunch-in'
      });
      const missingLunch = present - lunchInRecords;
      if (missingLunch > 0) {
        alerts.push(`${missingLunch} employee${missingLunch > 1 ? 's' : ''} forgot lunch-in`);
      }
      
      // Check early departures
      const earlyDepartures = await TimeRecord.countDocuments({
        workDate,
        sessionType: 'check-out',
        status: 'early'
      });
      if (earlyDepartures > 0) {
        alerts.push(`${earlyDepartures} employee${earlyDepartures > 1 ? 's' : ''} checked out early`);
      }
      
      // Department summary
      const departmentStats = await TimeRecord.aggregate([
        {
          $match: {
            workDate,
            sessionType: 'check-in'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'employee',
            foreignField: '_id',
            as: 'employeeData'
          }
        },
        {
          $unwind: '$employeeData'
        },
        {
          $group: {
            _id: '$employeeData.department',
            total: { $sum: 1 },
            onTime: {
              $sum: { $cond: [{ $eq: ['$status', 'on-time'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            department: '$_id',
            present: '$total',
            onTime: 1,
            punctuality: {
              $multiply: [
                { $divide: ['$onTime', '$total'] },
                100
              ]
            }
          }
        }
      ]);
      
      // Get total per department
      const allDepartments = await User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$department', total: { $sum: 1 } } }
      ]);
      
      // Merge department stats
      const departmentSummary = allDepartments.map(dept => {
        const stats = departmentStats.find(d => d.department === dept._id);
        return {
          department: dept._id || 'General',
          present: stats?.present || 0,
          absent: dept.total - (stats?.present || 0),
          total: dept.total,
          onTime: stats?.onTime || 0,
          punctuality: stats?.punctuality || 0
        };
      });
      
      return NextResponse.json({
        success: true,
        date: workDate,
        stats: {
          totalEmployees,
          present,
          absent,
          late,
          onTime,
          incomplete,
          early,
          overtime
        },
        alerts,
        departmentSummary
      });
      
    } catch (error: any) {
      console.error('Error in summary:', error);
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