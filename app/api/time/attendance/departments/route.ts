import { NextRequest, NextResponse } from 'next/server';

import { withCors } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import { TimeRecord } from '@/models/TimeRecord';
import User from '@/models/User';


export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const { searchParams } = new URL(request.url);
      const period = searchParams.get('period') || 'month';
      
      // Calculate date range
      const now = new Date();
      let startDate: Date;
      
      if (period === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      } else {
        startDate = new Date(now.getFullYear(), 0, 1); // Year start
      }
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = now.toISOString().split('T')[0];
      
      // Get department stats
      const departmentStats = await TimeRecord.aggregate([
        {
          $match: {
            workDate: { $gte: startDateStr, $lte: endDateStr },
            sessionType: 'check-in'
          }
        },
        {
          $group: {
            _id: '$department',
            totalCheckIns: { $sum: 1 },
            onTimeCheckIns: {
              $sum: { $cond: [{ $eq: ['$status', 'on-time'] }, 1, 0] }
            },
            lateCheckIns: {
              $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            department: '$_id',
            totalCheckIns: 1,
            onTimeCheckIns: 1,
            lateCheckIns: 1,
            punctualityRate: {
              $multiply: [
                { $divide: ['$onTimeCheckIns', '$totalCheckIns'] },
                100
              ]
            },
            attendanceRate: {
              $multiply: [
                { $divide: ['$totalCheckIns', { $size: '$employees' }] },
                100
              ]
            }
          }
        },
        {
          $sort: { punctualityRate: -1 }
        }
      ]);
      
      // Get total employees per department
      const employeesByDept = await User.aggregate([
        {
          $group: {
            _id: '$department',
            totalEmployees: { $sum: 1 }
          }
        }
      ]);
      
      // Merge employee counts with stats
      const deptMap = new Map(employeesByDept.map(dept => [dept._id, dept.totalEmployees]));
      
      const enrichedStats = departmentStats.map(stat => {
        const totalEmployees = deptMap.get(stat.department) || 0;
        const attendanceRate = totalEmployees > 0 
          ? Math.round((stat.totalCheckIns / (totalEmployees * 20)) * 100) // Assuming 20 working days
          : 0;
        
        return {
          ...stat,
          totalEmployees,
          attendanceRate: Math.min(100, attendanceRate), // Cap at 100%
          punctualityRate: Math.round(stat.punctualityRate || 0)
        };
      });
      
      // Calculate overall company stats
      const overallStats = {
        totalDepartments: enrichedStats.length,
        avgPunctualityRate: enrichedStats.length > 0 
          ? Math.round(enrichedStats.reduce((sum, stat) => sum + stat.punctualityRate, 0) / enrichedStats.length)
          : 0,
        avgAttendanceRate: enrichedStats.length > 0
          ? Math.round(enrichedStats.reduce((sum, stat) => sum + stat.attendanceRate, 0) / enrichedStats.length)
          : 0,
        bestDepartment: enrichedStats.length > 0 
          ? enrichedStats.reduce((best, current) => 
              current.punctualityRate > best.punctualityRate ? current : best
            )
          : null,
        needsAttention: enrichedStats.filter(dept => dept.punctualityRate < 75 || dept.attendanceRate < 80)
      };
      
      return NextResponse.json({
        period,
        startDate: startDateStr,
        endDate: endDateStr,
        departments: enrichedStats,
        overall: overallStats
      });
      
    } catch (error: any) {
      console.error('Error fetching department stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch department stats', details: error.message },
        { status: 500 }
      );
    }
  });
}