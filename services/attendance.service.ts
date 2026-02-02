import { TimeRecord } from '@/models/TimeRecord';
import { User } from '@/models/User';


import { Types } from 'mongoose';

interface DailySession {
  time?: string;
  status?: string;
  imageUrl?: string;
}

interface DailyAttendance {
  employeeId: Types.ObjectId | string;
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

interface AdminDashboard {
  date: string;
  stats: {
    totalEmployees: number;
    present: number;
    absent: number;
    late: number;
    onTime: number;
    incomplete: number;
    early: number;
    overtime: number;
  };
  alerts: string[];
  departmentSummary: Array<{
    department: string;
    present: number;
    absent: number;
    late: number;
    onTime: number;
    punctuality: number;
  }>;
}

interface EmployeePerformance {
  employeeId: Types.ObjectId | string;
  name: string;
  period: string;
  metrics: {
    daysPresent: number;
    daysAbsent: number;
    avgCheckIn: string;
    lateCount: number;
    earlyCheckOuts: number;
    overtimeDays: number;
    avgDailyHours: string;
    totalWorkedMinutes: number;
  };
  disciplineScore: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  attendanceRate: number;
}

export class AttendanceService {
  private static readonly WORK_SCHEDULE = {
    weekdays: {
      'check-in': '08:30',
      'lunch-out': '13:00',
      'lunch-in': '14:00',
      'check-out': '18:00'
    },
    saturday: {
      'check-in': '09:00',
      'check-out': '14:00'
    }
  };

  // Calculate status based on actual vs expected time
  static calculateStatus(sessionType: string, actualTime: string, recordDate: Date): string {
    const day = recordDate.getDay(); // 0 = Sunday
    const isSaturday = day === 6;
    const isSunday = day === 0;

    if (isSunday) throw new Error('Sunday is not a working day');
    if (isSaturday && (sessionType === 'lunch-out' || sessionType === 'lunch-in')) {
      throw new Error(`${sessionType} is not allowed on Saturday`);
    }

    const schedule = isSaturday ? this.WORK_SCHEDULE.saturday : this.WORK_SCHEDULE.weekdays;
    const expectedTime = schedule[sessionType as keyof typeof schedule];
    
    if (!expectedTime) {
      throw new Error(`${sessionType} is not allowed on this day`);
    }

    const [aH, aM] = actualTime.split(':').map(Number);
    const [eH, eM] = expectedTime.split(':').map(Number);

    const actualMinutes = aH * 60 + aM;
    const expectedMinutes = eH * 60 + eM;
    const diff = actualMinutes - expectedMinutes;

    // Check-out logic
    if (sessionType === 'check-out') {
      if (diff > 15) return 'overtime';
      if (diff < -15) return 'early';
      return 'on-time';
    }

    // Check-in & others (15-minute grace)
    if (diff <= 15) return 'on-time';
    return 'late';
  }

  // Get daily attendance for all employees
  static async getDailyAttendance(date: string): Promise<DailyAttendance[]> {
    const workDate = date || new Date().toISOString().split('T')[0];
    const allEmployees = await User.find({ isActive: true });
    const dayRecords = await TimeRecord.find({ workDate })
      .sort({ sessionType: 1 })
      .populate('employee', 'name email department role');

    const attendanceMap = new Map<string, DailyAttendance>();

    // Initialize all employees
    allEmployees.forEach((emp: 
        {
        _id: Types.ObjectId;
         //_id: { toString: () => string; };
         name: any; email: any; department: any; role: any; }) => {
      attendanceMap.set(emp._id.toString(), {
        employeeId: emp._id,
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

    // Process records
    dayRecords.forEach(record => {
      const empId = record.employee._id.toString();
      const attendance = attendanceMap.get(empId);
      
      if (attendance) {
        attendance.attendanceStatus = 'incomplete'; // At least one session exists
        
        // Store session data
        attendance.sessions[record.sessionType as keyof typeof attendance.sessions] = {
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
    for (const attendance of attendanceMap.values()) {
      const day = new Date(workDate).getDay();
      const isSaturday = day === 6;
      const expectedSessions = isSaturday 
        ? ['check-in', 'check-out']
        : ['check-in', 'lunch-out', 'lunch-in', 'check-out'];

      // Find missing sessions
      attendance.missingSessions = expectedSessions.filter(
        session => !attendance.sessions[session as keyof typeof attendance.sessions]
      );

      // Calculate worked minutes if both check-in and check-out exist
      const checkIn = attendance.sessions.checkIn;
      const checkOut = attendance.sessions.checkOut;
      const lunchOut = attendance.sessions.lunchOut;
      const lunchIn = attendance.sessions.lunchIn;

      if (checkIn && checkOut) {
        const checkInTime = this.timeToMinutes(checkIn.time!);
        const checkOutTime = this.timeToMinutes(checkOut.time!);
        
        let lunchMinutes = 0;
        if (lunchOut && lunchIn) {
          lunchMinutes = this.timeToMinutes(lunchIn.time!) - this.timeToMinutes(lunchOut.time!);
        }

        attendance.workedMinutes = Math.max(0, checkOutTime - checkInTime - lunchMinutes);
        attendance.workedHours = this.minutesToHours(attendance.workedMinutes);

        // Determine attendance status
        if (attendance.missingSessions.length === 0) {
          attendance.attendanceStatus = 'complete';
        }
      }
    }

    return Array.from(attendanceMap.values());
  }

  // Get admin dashboard data
  static async getAdminDashboard(date?: string): Promise<AdminDashboard> {
    const workDate = date || new Date().toISOString().split('T')[0];
    const attendance = await this.getDailyAttendance(workDate);
    const totalEmployees = await User.countDocuments({ isActive: true });

    const stats = {
      totalEmployees,
      present: attendance.filter(a => a.attendanceStatus !== 'absent').length,
      absent: attendance.filter(a => a.attendanceStatus === 'absent').length,
      late: attendance.reduce((sum, a) => sum + a.lateCount, 0),
      onTime: attendance.filter(a => a.lateCount === 0 && a.earlyCount === 0).length,
      incomplete: attendance.filter(a => a.attendanceStatus === 'incomplete').length,
      early: attendance.reduce((sum, a) => sum + a.earlyCount, 0),
      overtime: attendance.reduce((sum, a) => sum + a.overtimeCount, 0)
    };

    // Generate alerts
    const alerts: string[] = [];
    if (stats.absent > 0) alerts.push(`${stats.absent} employee(s) absent today`);
    
    const missingLunch = attendance.filter(a => a.missingSessions.includes('lunch-in')).length;
    if (missingLunch > 0) alerts.push(`${missingLunch} employee(s) forgot lunch-in`);
    
    const earlyDepartures = attendance.filter(a => a.earlyCount > 0).length;
    if (earlyDepartures > 0) alerts.push(`${earlyDepartures} employee(s) checked out early`);

    // Department summary
    const departmentMap = new Map<string, any>();
    attendance.forEach(a => {
      if (!departmentMap.has(a.department)) {
        departmentMap.set(a.department, {
          department: a.department,
          present: 0,
          absent: 0,
          late: 0,
          onTime: 0,
          employees: []
        });
      }
      
      const dept = departmentMap.get(a.department);
      dept.employees.push(a);
      if (a.attendanceStatus !== 'absent') dept.present++;
      if (a.attendanceStatus === 'absent') dept.absent++;
      if (a.lateCount > 0) dept.late++;
      if (a.lateCount === 0 && a.earlyCount === 0) dept.onTime++;
    });

    const departmentSummary = Array.from(departmentMap.values()).map(dept => ({
      ...dept,
      punctuality: Math.round((dept.onTime / dept.employees.length) * 100) || 0
    }));

    return {
      date: workDate,
      stats,
      alerts,
      departmentSummary
    };
  }

  // Get employee performance for period
  static async getEmployeePerformance(
    employeeId: string,
    period: 'week' | 'month' | 'year'
  ): Promise<EmployeePerformance> {
    const employee = await User.findById(employeeId);
    if (!employee) throw new Error('Employee not found');

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const records = await TimeRecord.find({
      employee: employeeId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    // Group by day
    const daysMap = new Map<string, any>();
    records.forEach(record => {
      const day = record.workDate;
      if (!daysMap.has(day)) {
        daysMap.set(day, {
          date: day,
          sessions: {},
          workedMinutes: 0,
          lateCount: 0,
          earlyCount: 0
        });
      }
      
      const dayData = daysMap.get(day);
      dayData.sessions[record.sessionType] = {
        time: record.actualTime,
        status: record.status
      };

      if (record.status === 'late') dayData.lateCount++;
      if (record.status === 'early') dayData.earlyCount++;
    });

    // Calculate metrics
    const days = Array.from(daysMap.values());
    const daysPresent = days.length;
    const totalDays = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const daysAbsent = totalDays - daysPresent;

    const lateCount = days.reduce((sum, day) => sum + day.lateCount, 0);
    const earlyCheckOuts = days.reduce((sum, day) => sum + day.earlyCount, 0);
    
    // Calculate overtime days (days with overtime status)
    const overtimeDays = records.filter(r => r.status === 'overtime').length;

    // Calculate average check-in time
    const checkInTimes = records
      .filter(r => r.sessionType === 'check-in')
      .map(r => this.timeToMinutes(r.actualTime));
    
    const avgCheckInMinutes = checkInTimes.length > 0 
      ? Math.round(checkInTimes.reduce((a, b) => a + b) / checkInTimes.length)
      : 0;
    
    const avgCheckIn = this.minutesToTime(avgCheckInMinutes);

    // Calculate average daily hours
    const totalWorkedMinutes = days.reduce((sum, day) => sum + day.workedMinutes, 0);
    const avgDailyMinutes = daysPresent > 0 ? Math.round(totalWorkedMinutes / daysPresent) : 0;
    const avgDailyHours = this.minutesToHours(avgDailyMinutes);

    // Calculate discipline score
    let disciplineScore = 100;
    disciplineScore -= lateCount * 5;      // -5 per late
    disciplineScore -= daysAbsent * 10;    // -10 per absence
    disciplineScore = Math.max(0, Math.min(100, disciplineScore));
    disciplineScore += overtimeDays * 2;   // +2 per overtime day

    const rating = disciplineScore >= 90 ? 'Excellent' :
                   disciplineScore >= 75 ? 'Good' :
                   disciplineScore >= 60 ? 'Fair' : 'Poor';

    const attendanceRate = Math.round((daysPresent / totalDays) * 100);

    return {
      employeeId,
      name: employee.name,
      period,
      metrics: {
        daysPresent,
        daysAbsent,
        avgCheckIn,
        lateCount,
        earlyCheckOuts,
        overtimeDays,
        avgDailyHours,
        totalWorkedMinutes
      },
      disciplineScore: Math.round(disciplineScore),
      rating,
      attendanceRate
    };
  }

  // Get weekly trend data
  static async getWeeklyTrend(): Promise<Array<{ day: string; rate: number }>> {
    const startOfWeek = new Date();
    const dayOfWeek = startOfWeek.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyData = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const workDate = day.toISOString().split('T')[0];

      const dayRecords = await TimeRecord.countDocuments({
        workDate,
        sessionType: 'check-in'
      });

      const totalEmployees = await User.countDocuments({ isActive: true });
      const attendanceRate = totalEmployees ? (dayRecords / totalEmployees) * 100 : 0;

      weeklyData.push({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        date: workDate,
        rate: Math.round(attendanceRate),
        present: dayRecords,
        total: totalEmployees
      });
    }

    return weeklyData;
  }

  // Helper methods
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private static minutesToHours(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  }
}