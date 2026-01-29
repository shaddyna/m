// lib/timeRecord/timeRecordService.ts
import TimeRecord, { ITimeRecord } from '@/models/TimeRecord';
import User, { IUser } from '@/models/User';
import { cloudinary } from '@/lib/cloudinay';

const EXPECTED_SCHEDULE = {
  'check-in': '08:30',
  'lunch-out': '13:00',
  'lunch-in': '14:00',
  'check-out': '18:00'
};

export function calculateStatus(sessionType: string, actualTime: string): 'on-time' | 'late' | 'overtime' | 'early' {
  const expectedTime = EXPECTED_SCHEDULE[sessionType as keyof typeof EXPECTED_SCHEDULE];
  const [actualHours, actualMinutes] = actualTime.split(':').map(Number);
  const [expectedHours, expectedMinutes] = expectedTime.split(':').map(Number);
  
  const actualTotalMinutes = actualHours * 60 + actualMinutes;
  const expectedTotalMinutes = expectedHours * 60 + expectedMinutes;
  
  const difference = actualTotalMinutes - expectedTotalMinutes;
  
  if (sessionType === 'check-out') {
    if (difference > 0) return 'overtime';
    if (difference < -15) return 'early';
  }
  
  if (difference <= 0) return 'on-time';
  if (difference > 0 && difference <= 15) return 'on-time'; // 15-minute grace period
  return 'late';
}

export async function uploadImage(imageData: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      folder: 'time-management'
    });
    return result.secure_url;
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

export interface CreateTimeRecordData {
  employeeId: string;
  sessionType: 'check-in' | 'lunch-out' | 'lunch-in' | 'check-out';
  actualTime: string;
  notes?: string;
  imageData?: string;
}

export async function createTimeRecord(data: CreateTimeRecordData) {
  const { employeeId, sessionType, actualTime, notes, imageData } = data;
  
  const employee = await User.findById(employeeId);
  if (!employee) {
    throw new Error('Employee not found');
  }
  
  let imageUrl: string | undefined;
  if (imageData) {
    imageUrl = await uploadImage(imageData);
  }
  
  const status = calculateStatus(sessionType, actualTime);
  
  const timeRecord = await TimeRecord.create({
    employee: employeeId,
    sessionType,
    recordedTime: new Date().toTimeString().slice(0, 5),
    actualTime,
    status,
    imageUrl,
    notes,
    //department: employee.department || 'General'
  });
  
  return timeRecord;
}

export interface GetTimeRecordsParams {
  date?: string;
  department?: string;
  employeeId?: string;
  sessionType?: string;
  page?: string;
  limit?: string;
}

export async function getAllTimeRecords(params: GetTimeRecordsParams) {
  const { date, department, employeeId, sessionType, page = '1', limit = '10' } = params;
  
  let filter: any = {};
  
  // Date filtering
  if (date) {
    if (date === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: today };
    } else if (date === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: yesterday, $lt: today };
    }
  }
  
  // Department filtering
  if (department && department !== 'all') {
    filter.department = department;
  }
  
  // Employee filtering
  if (employeeId) {
    filter.employee = employeeId;
  }
  
  // Session type filtering
  if (sessionType) {
    filter.sessionType = sessionType;
  }
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  
  const [timeRecords, total] = await Promise.all([
    TimeRecord.find(filter)
      .populate('employee', 'name email role department')
      .sort({ date: -1, recordedTime: -1 })
      .skip(skip)
      .limit(limitNum),
    TimeRecord.countDocuments(filter)
  ]);
  
  return {
    timeRecords,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  };
}

export async function getTimeSummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayRecords = await TimeRecord.find({
    date: { $gte: today }
  }).populate('employee', 'name department');
  
  const stats = {
    onTime: 0,
    late: 0,
    overtime: 0,
    early: 0,
    absent: 0
  };
  
  const employeesWithCheckIn = new Set<string>();
  todayRecords.forEach(record => {
    if (record.sessionType === 'check-in') {
      employeesWithCheckIn.add(record.employee._id.toString());
      
      if (record.status === 'on-time') stats.onTime++;
      else if (record.status === 'late') stats.late++;
    }
    
    if (record.sessionType === 'check-out') {
      if (record.status === 'overtime') stats.overtime++;
      else if (record.status === 'early') stats.early++;
    }
  });
  
  const totalEmployees = await User.countDocuments();
  stats.absent = totalEmployees - employeesWithCheckIn.size;
  
  return { stats };
}

export async function getWeeklyTrend() {
  const startOfWeek = new Date();
  const dayOfWeek = startOfWeek.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyData = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayRecords = await TimeRecord.find({
      date: { $gte: day, $lt: nextDay },
      sessionType: 'check-in'
    });

    const totalEmployees = await User.countDocuments();
    const attendanceRate = totalEmployees ? (dayRecords.length / totalEmployees) * 100 : 0;

    weeklyData.push({
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      rate: Math.round(attendanceRate)
    });
  }

  return { weeklyTrend: weeklyData };
}

export async function getDepartmentPunctuality() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const departmentStats = await TimeRecord.aggregate([
    {
      $match: {
        date: { $gte: today },
        sessionType: 'check-in'
      }
    },
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        onTime: {
          $sum: {
            $cond: [{ $eq: ['$status', 'on-time'] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        department: '$_id',
        punctualityRate: {
          $multiply: [
            { $divide: ['$onTime', '$total'] },
            100
          ]
        }
      }
    }
  ]);
  
  return { departmentPunctuality: departmentStats };
}