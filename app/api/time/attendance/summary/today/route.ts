import { NextRequest, NextResponse } from 'next/server';

import { withCors } from '@/lib/cors';
import { TimeRecord } from '@/models/TimeRecord';
import  User  from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const today = new Date().toISOString().split('T')[0];
      const todayStart = new Date(today);
      
      // Get today's check-in records
      const todayCheckIns = await TimeRecord.find({
        workDate: today,
        sessionType: 'check-in'
      });
      
      // Get total employees
      const totalEmployees = await User.countDocuments();
      
      // Calculate stats
      let onTime = 0, late = 0, early = 0, overtime = 0;
      const missingLunchIn: string[] = [];
      
      todayCheckIns.forEach(record => {
        if (record.status === 'on-time') onTime++;
        else if (record.status === 'late') late++;
      });
      
      // Get today's check-outs for early/overtime stats
      const todayCheckOuts = await TimeRecord.find({
        workDate: today,
        sessionType: 'check-out'
      });
      
      todayCheckOuts.forEach(record => {
        if (record.status === 'early') early++;
        else if (record.status === 'overtime') overtime++;
      });
      
      // Find employees who forgot lunch-in
      const todayLunchIns = await TimeRecord.find({
        workDate: today,
        sessionType: 'lunch-in'
      });
      
      const employeesWithLunchIn = new Set(todayLunchIns.map(r => r.employee.toString()));
      const employeesWithLunchOut = await TimeRecord.find({
        workDate: today,
        sessionType: 'lunch-out'
      });
      
      employeesWithLunchOut.forEach(record => {
        if (!employeesWithLunchIn.has(record.employee.toString())) {
          missingLunchIn.push(record.employeeName);
        }
      });
      
      const absentCount = totalEmployees - todayCheckIns.length;
      
      // Generate alerts
      const alerts: string[] = [];
      if (missingLunchIn.length > 0) {
        alerts.push(`${missingLunchIn.length} employees forgot lunch-in`);
      }
      if (early > 0) {
        alerts.push(`${early} employees checked out early`);
      }
      if (absentCount > 0) {
        alerts.push(`${absentCount} employees absent without notice`);
      }
      
      return NextResponse.json({
        date: today,
        stats: {
          totalEmployees,
          present: todayCheckIns.length,
          absent: absentCount,
          late,
          onTime,
          early,
          overtime,
          incomplete: missingLunchIn.length + (todayCheckIns.length - todayCheckOuts.length)
        },
        alerts,
        summary: {
          attendanceRate: Math.round((todayCheckIns.length / totalEmployees) * 100),
          punctualityRate: todayCheckIns.length > 0 ? Math.round((onTime / todayCheckIns.length) * 100) : 0
        }
      });
      
    } catch (error: any) {
      console.error('Error fetching today summary:', error);
      return NextResponse.json(
        { error: 'Failed to fetch today summary', details: error.message },
        { status: 500 }
      );
    }
  });
}