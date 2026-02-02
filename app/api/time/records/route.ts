import { NextRequest, NextResponse } from 'next/server';
import { TimeRecord } from '@/models/TimeRecord';
import { User } from '@/models/User';
import { AttendanceService } from '@/services/attendance.service';

import { cloudinary } from '@/lib/cloudinay';
import dbConnect from '@/lib/dbConnect';


export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { employeeId, sessionType, actualTime, notes, imageData } = body;
    
    if (!employeeId || !sessionType || !actualTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const employee = await User.findById(employeeId);
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    const recordDate = new Date();
    const workDate = recordDate.toISOString().split('T')[0];
    
    // Validate session
    const day = recordDate.getDay();
    if (day === 0) {
      return NextResponse.json(
        { error: 'Sunday is not a working day' },
        { status: 400 }
      );
    }
    
    const isSaturday = day === 6;
    if (isSaturday && (sessionType === 'lunch-out' || sessionType === 'lunch-in')) {
      return NextResponse.json(
        { error: `${sessionType} is not allowed on Saturday` },
        { status: 400 }
      );
    }
    
    // Calculate status
    const status = AttendanceService.calculateStatus(sessionType, actualTime, recordDate);
    
    // Upload image if provided
    let imageUrl;
    if (imageData) {
      const uploadResponse = await cloudinary.uploader.upload(imageData, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: 'time-management'
      });
      imageUrl = uploadResponse.secure_url;
    }
    
    // Create time record
    const timeRecord = await TimeRecord.create({
      employee: employee._id,
      employeeName: employee.name,
      employeeEmail: employee.email,
      employeeRole: employee.role,
      workDate,
      date: recordDate,
      sessionType,
      recordedTime: recordDate.toTimeString().slice(0, 5),
      actualTime,
      status,
      imageUrl,
      notes,
      department: employee.department || 'General'
    });
    
    return NextResponse.json(
      { timeRecord, message: 'Time record created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}