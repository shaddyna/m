import { NextRequest, NextResponse } from 'next/server';

import { withCors } from '@/lib/cors';
import { TimeRecord } from '@/models/TimeRecord';
import { User } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const employeeId = params.id;
      const { searchParams } = new URL(request.url);
      const period = searchParams.get('period') || 'month'; // month, week, or custom range
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      
      // Get employee details
      const employee = await User.findById(employeeId).select('name email department role');
      if (!employee) {
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        );
      }
      
      // Build date range filter
      let dateFilter: any = {};
      const now = new Date();
      
      if (period === 'month') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter.workDate = { $gte: firstDay.toISOString().split('T')[0] };
      } else if (period === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
        dateFilter.workDate = { $gte: startOfWeek.toISOString().split('T')[0] };
      } else if (startDate && endDate) {
        dateFilter.workDate = { $gte: startDate, $lte: endDate };
      }
      
      // Get employee's time records
      const timeRecords = await TimeRecord.find({
        employee: employeeId,
        ...dateFilter
      }).sort({ workDate: -1 });
      
      // Calculate metrics
      const checkInRecords = timeRecords.filter(r => r.sessionType === 'check-in');
      const checkOutRecords = timeRecords.filter(r => r.sessionType === 'check-out');
      
      let totalLate = 0;
      let totalEarly = 0;
      let totalOvertime = 0;
      let totalMinutes = 0;
      const checkInTimes: number[] = [];
      
      // Group by date to analyze daily patterns
      const recordsByDate = new Map();
      timeRecords.forEach(record => {
        if (!recordsByDate.has(record.workDate)) {
          recordsByDate.set(record.workDate, {});
        }
        recordsByDate.get(record.workDate)[record.sessionType] = record;
      });
      
      recordsByDate.forEach((dailyRecords, date) => {
        const checkIn = dailyRecords['check-in'];
        const checkOut = dailyRecords['check-out'];
        const lunchOut = dailyRecords['lunch-out'];
        const lunchIn = dailyRecords['lunch-in'];
        
        if (checkIn) {
          if (checkIn.status === 'late') totalLate++;
          checkInTimes.push(parseInt(checkIn.actualTime.replace(':', '')));
        }
        
        if (checkOut) {
          if (checkOut.status === 'early') totalEarly++;
          if (checkOut.status === 'overtime') totalOvertime++;
          
          // Calculate worked minutes
          if (checkIn) {
            const checkInMinutes = parseInt(checkIn.actualTime.split(':')[0]) * 60 + 
                                  parseInt(checkIn.actualTime.split(':')[1]);
            const checkOutMinutes = parseInt(checkOut.actualTime.split(':')[0]) * 60 + 
                                   parseInt(checkOut.actualTime.split(':')[1]);
            let dailyMinutes = checkOutMinutes - checkInMinutes;
            
            // Deduct lunch break
            if (lunchOut && lunchIn) {
              const lunchOutMinutes = parseInt(lunchOut.actualTime.split(':')[0]) * 60 + 
                                     parseInt(lunchOut.actualTime.split(':')[1]);
              const lunchInMinutes = parseInt(lunchIn.actualTime.split(':')[0]) * 60 + 
                                    parseInt(lunchIn.actualTime.split(':')[1]);
              dailyMinutes -= (lunchInMinutes - lunchOutMinutes);
            }
            
            totalMinutes += Math.max(0, dailyMinutes);
          }
        }
      });
      
      // Calculate average check-in time
      let avgCheckIn = '--:--';
      if (checkInTimes.length > 0) {
        const avgMinutes = checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length;
        const hours = Math.floor(avgMinutes / 100);
        const minutes = Math.round(avgMinutes % 100);
        avgCheckIn = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      
      // Calculate average daily hours
      const daysWithCheckIn = checkInRecords.length;
      const avgDailyMinutes = daysWithCheckIn > 0 ? totalMinutes / daysWithCheckIn : 0;
      const avgDailyHours = `${Math.floor(avgDailyMinutes / 60)}h ${Math.round(avgDailyMinutes % 60).toString().padStart(2, '0')}m`;
      
      // Calculate discipline score
      let disciplineScore = 100;
      disciplineScore -= totalLate * 5;
      disciplineScore -= totalEarly * 3;
      disciplineScore += totalOvertime * 2;
      
      // Count missing sessions
      const missingSessions = timeRecords.filter(r => r.sessionType === 'check-in' && !recordsByDate.get(r.workDate)['check-out']).length;
      disciplineScore -= missingSessions * 10;
      disciplineScore = Math.max(0, Math.min(100, disciplineScore));
      
      // Determine rating
      let rating = 'Excellent';
      if (disciplineScore < 60) rating = 'Poor';
      else if (disciplineScore < 75) rating = 'Fair';
      else if (disciplineScore < 90) rating = 'Good';
      else if (disciplineScore < 95) rating = 'Very Good';
      
      return NextResponse.json({
        employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        role: employee.role,
        period: period === 'month' ? new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Custom',
        
        metrics: {
          daysPresent: checkInRecords.length,
          daysAbsent: 0, // Would need to know working days to calculate
          avgCheckIn,
          lateCount: totalLate,
          earlyCheckOuts: totalEarly,
          overtimeDays: totalOvertime,
          avgDailyHours,
          missingSessions,
          workedMinutes: totalMinutes,
          workedHours: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
        },
        
        disciplineScore: Math.round(disciplineScore),
        rating,
        
        recentRecords: timeRecords.slice(0, 10).map(record => ({
          date: record.workDate,
          sessionType: record.sessionType,
          actualTime: record.actualTime,
          status: record.status,
          notes: record.notes
        }))
      });
      
    } catch (error: any) {
      console.error('Error fetching user attendance:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user attendance', details: error.message },
        { status: 500 }
      );
    }
  });
}