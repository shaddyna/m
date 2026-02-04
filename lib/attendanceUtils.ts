
// Extended interface for formatted records (frontend use)
export interface FormattedTimeRecord {
  _id: string;
  employee: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  workDate: string;
  date: Date;
  sessionType: 'check-in' | 'lunch-out' | 'lunch-in' | 'check-out';
  recordedTime: string;
  actualTime: string;
  status: 'on-time' | 'late' | 'early' | 'overtime';
  imageUrl?: string;
  notes?: string;
  department: string;

  // 🔹 backend metadata (safe to expose)
  createdAt: Date;
  updatedAt: Date;
  __v?: number;

  // Frontend formatted properties
  formattedDate?: string;
  formattedTime?: string;
  dayName?: string;
  timeDiff?: string | null;
}


export interface AttendanceSummary {
  totalRecords: number;
  employeesCount: number;
  onTimeCount: number;
  lateCount: number;
  earlyCount: number;
  overtimeCount: number;
  departments: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export interface DailyAttendance {
  date: string;
  dayName: string;
  records: FormattedTimeRecord[];
  summary: {
    totalEmployees: number;
    presentEmployees: number;
    onTime: number;
    late: number;
    early: number;
    overtime: number;
  };
}

export interface EmployeeAttendance {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  department: string;
  records: FormattedTimeRecord[];
  summary: {
    totalDays: number;
    presentDays: number;
    onTimeCount: number;
    lateCount: number;
    earlyCount: number;
    overtimeCount: number;
    averageCheckInTime?: string;
  };
}

export interface PaginatedResponse {
  data: FormattedTimeRecord[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Utility function to convert MongoDB document to frontend-friendly format
export function formatTimeRecord(record: any): FormattedTimeRecord {
  return {
    _id: record._id.toString(),
    employee: record.employee.toString(),
    employeeName: record.employeeName,
    employeeEmail: record.employeeEmail,
    employeeRole: record.employeeRole,
    workDate: record.workDate,
    date: record.date,
    sessionType: record.sessionType,
    recordedTime: record.recordedTime,
    actualTime: record.actualTime,
    status: record.status,
    imageUrl: record.imageUrl,
    notes: record.notes,
    department: record.department,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    __v: record.__v,
    
    // Frontend formatted properties
    formattedDate: new Date(record.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    formattedTime: formatTime(record.actualTime),
    dayName: getDayName(record.workDate),
    timeDiff: record.recordedTime !== record.actualTime 
      ? calculateTimeDifference(record.recordedTime, record.actualTime)
      : null
  };
}

// Utility functions
export const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export const calculateTimeDifference = (recorded: string, actual: string): string => {
  const [rHour, rMinute] = recorded.split(':').map(Number);
  const [aHour, aMinute] = actual.split(':').map(Number);
  
  const recordedMinutes = rHour * 60 + rMinute;
  const actualMinutes = aHour * 60 + aMinute;
  
  const diffMinutes = actualMinutes - recordedMinutes;
  const hours = Math.floor(Math.abs(diffMinutes) / 60);
  const minutes = Math.abs(diffMinutes) % 60;
  
  const prefix = diffMinutes > 0 ? '+' : '-';
  return `${prefix}${hours}h ${minutes}m`;
};

export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const calculateDuration = (startTime: string, endTime: string): string => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};