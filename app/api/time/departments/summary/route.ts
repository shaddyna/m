import { NextRequest, NextResponse } from 'next/server';

import { TimeRecord } from '@/models/TimeRecord';
import { User } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'today';
    
    let startDate: Date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (period) {
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      default: // today
        startDate = today;
    }
    
    // Get department totals
    const departmentTotals = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: '$department', 
        total: { $sum: 1 },
        employees: { 
          $push: { 
            _id: '$_id',
            name: '$name',
            role: '$role'
          }
        }
      } }
    ]);
    
    // Get attendance data for period
    const attendanceData = await TimeRecord.aggregate([
      {
        $match: {
          date: { $gte: startDate }
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
          _id: {
            department: '$employeeData.department',
            employee: '$employee'
          },
          checkIns: {
            $sum: { $cond: [{ $eq: ['$sessionType', 'check-in'] }, 1, 0] }
          },
          lateCount: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          },
          onTimeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'on-time'] }, 1, 0] }
          }
        }
      },
      {
        $group: {
          _id: '$_id.department',
          present: { $sum: { $cond: [{ $gt: ['$checkIns', 0] }, 1, 0] } },
          totalEmployees: { $sum: 1 },
          late: { $sum: '$lateCount' },
          onTime: { $sum: '$onTimeCount' }
        }
      }
    ]);
    
    // Merge data
    const departmentSummary = departmentTotals.map(dept => {
      const stats = attendanceData.find(d => d._id === dept._id);
      const present = stats?.present || 0;
      const total = dept.total;
      
      return {
        department: dept._id || 'General',
        present,
        absent: total - present,
        total,
        late: stats?.late || 0,
        onTime: stats?.onTime || 0,
        punctuality: present > 0 ? Math.round((stats?.onTime || 0) / present * 100) : 0,
        attendanceRate: Math.round(present / total * 100)
      };
    });
    
    return NextResponse.json({
      success: true,
      period,
      departments: departmentSummary
    });
    
  } catch (error: any) {
    console.error('Error in department summary:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}