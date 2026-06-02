// app/api/attendance/unified/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import Attendance from '@/models/Attendance';
import { TimeRecord } from '@/models/TimeRecord';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const { searchParams } = new URL(request.url);
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
      
      // Get biometrics attendance data
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const biometricsRecords = await Attendance.find({
        timestamp: { $gte: startDate, $lte: endDate }
      }).lean();
      
      // Get tablet time records
      const tabletRecords = await TimeRecord.find({
        workDate: date
      }).populate('employee', 'name email role').lean();
      
      // Get all employees/users
      const employees = await User.find({}).select('-password -tokens').lean();
      
      // Transform biometrics records to unified format
      const unifiedBiometrics = biometricsRecords.map(record => ({
        id: record._id,
        source: 'biometrics',
        employeeId: record.userId,
        employeeName: record.userName,
        employeeEmail: '',
        sessionType: mapPeriodToSessionType(record.period),
        time: record.timestamp.toTimeString().slice(0, 5),
        status: record.isLate ? 'late' : 'on-time',
        isLate: record.isLate,
        minutesDifference: record.minutesDifference,
        verifiedBy: record.verifiedBy,
        timestamp: record.timestamp
      }));
      
      // Transform tablet records to unified format
      const unifiedTablet = tabletRecords.map(record => ({
        id: record._id,
        source: 'tablet',
        employeeId: (record.employee as any)?._id?.toString() || record.employee,
        employeeName: record.employeeName,
        employeeEmail: record.employeeEmail,
        sessionType: record.sessionType,
        time: record.actualTime,
        status: record.status,
        isLate: record.status === 'late',
        minutesDifference: 0,
        verifiedBy: 'TABLET',
        timestamp: record.date,
        hasImage: !!record.imageUrl,
        notes: record.notes
      }));
      
      // Combine both sources
      const allRecords = [...unifiedBiometrics, ...unifiedTablet];
      
      // Group by employee
      const employeeMap = new Map();
      
      // Initialize with all employees
      employees.forEach(emp => {
        employeeMap.set(emp._id.toString(), {
          employeeId: emp._id.toString(),
          employeeName: emp.name,
          employeeEmail: emp.email,
          role: emp.role,
          sessions: [],
          currentStatus: 'Not Checked In',
          source: 'both'
        });
      });
      
      // Add records to employees
      allRecords.forEach(record => {
        let employeeId = record.employeeId;
        
        // Handle case where employeeId might be ObjectId
        if (typeof employeeId === 'object' && employeeId._id) {
          employeeId = employeeId._id.toString();
        } else if (typeof employeeId === 'object') {
          employeeId = employeeId.toString();
        }
        
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            employeeId: employeeId,
            employeeName: record.employeeName,
            employeeEmail: record.employeeEmail,
            sessions: [],
            currentStatus: 'Not Checked In',
            source: record.source
          });
        }
        
        const employee = employeeMap.get(employeeId);
        employee.sessions.push({
          sessionType: record.sessionType,
          time: record.time,
          status: record.status,
          source: record.source,
          verifiedBy: record.verifiedBy,
          isLate: record.isLate
        });
        
        // Update current status based on latest session
        if (record.sessionType === 'check-in' || record.sessionType === 'MorningIn') {
          employee.currentStatus = 'Checked In';
        } else if (record.sessionType === 'lunch-out' || record.sessionType === 'LunchOut') {
          employee.currentStatus = 'On Lunch';
        } else if (record.sessionType === 'lunch-in' || record.sessionType === 'LunchIn') {
          employee.currentStatus = 'Checked In';
        } else if (record.sessionType === 'check-out' || record.sessionType === 'Departure') {
          employee.currentStatus = 'Checked Out';
        }
      });
      
      // Calculate statistics
      let checkedIn = 0, onLunch = 0, checkedOut = 0, notCheckedIn = 0;
      let lateArrivals = 0, earlyDepartures = 0;
      
      Array.from(employeeMap.values()).forEach(emp => {
        switch (emp.currentStatus) {
          case 'Checked In': checkedIn++; break;
          case 'On Lunch': onLunch++; break;
          case 'Checked Out': checkedOut++; break;
          default: notCheckedIn++;
        }
        
        // Count late arrivals
        const checkInSession = emp.sessions.find((s: any) => 
          s.sessionType === 'check-in' || s.sessionType === 'MorningIn'
        );
        if (checkInSession?.isLate) lateArrivals++;
        
        // Count early departures
        const checkOutSession = emp.sessions.find((s: any) => 
          s.sessionType === 'check-out' || s.sessionType === 'Departure'
        );
        if (checkOutSession?.isLate) earlyDepartures++;
      });
      
      // Create recent activities from both sources
      const recentActivities = [...unifiedBiometrics, ...unifiedTablet]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 15)
        .map(record => ({
          employeeName: record.employeeName,
          action: getActionDisplayName(record.sessionType),
          time: record.time,
          status: record.status,
          source: record.source,
          verifiedBy: record.verifiedBy
        }));
      
      const response = {
        date: date,
        dayName: getDayName(date),
        lastUpdated: new Date().toISOString(),
        sources: {
          biometrics: biometricsRecords.length,
          tablet: tabletRecords.length,
          total: biometricsRecords.length + tabletRecords.length
        },
        statistics: {
          totalEmployees: employees.length,
          checkedIn,
          onLunch,
          checkedOut,
          notCheckedIn,
          lateArrivals,
          earlyDepartures,
          attendanceRate: employees.length > 0 ? (checkedIn / employees.length * 100) : 0
        },
        employees: Array.from(employeeMap.values()),
        recentActivities
      };
      
      return NextResponse.json(response);
      
    } catch (err: any) {
      console.error("Error fetching unified attendance:", err);
      return NextResponse.json(
        { error: "Failed to fetch unified attendance", details: err.message },
        { status: 500 }
      );
    }
  });
}

// Helper function to map period names
function mapPeriodToSessionType(period: string): string {
  switch (period) {
    case 'MorningIn': return 'check-in';
    case 'LunchOut': return 'lunch-out';
    case 'LunchIn': return 'lunch-in';
    case 'Departure': return 'check-out';
    default: return period;
  }
}

function getActionDisplayName(sessionType: string): string {
  switch (sessionType) {
    case 'check-in': return 'Checked In';
    case 'check-out': return 'Checked Out';
    case 'lunch-out': return 'Went to Lunch';
    case 'lunch-in': return 'Returned from Lunch';
    case 'MorningIn': return 'Checked In';
    case 'Departure': return 'Checked Out';
    case 'LunchOut': return 'Went to Lunch';
    case 'LunchIn': return 'Returned from Lunch';
    default: return sessionType;
  }
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}