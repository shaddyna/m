// app/api/time-records/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import {
  createTimeRecord,
  getAllTimeRecords,
  getTimeSummary,
  getWeeklyTrend,
  getDepartmentPunctuality,
  CreateTimeRecordData
} from '@/lib/timeRecord/timeRecordService';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const { searchParams } = new URL(request.url);
      
      // Check for specific endpoints
      const path = searchParams.get('path');
      
      if (path === 'summary') {
        const result = await getTimeSummary();
        return NextResponse.json(result);
      }
      
      if (path === 'weekly-trend') {
        const result = await getWeeklyTrend();
        return NextResponse.json(result);
      }
      
      if (path === 'department-punctuality') {
        const result = await getDepartmentPunctuality();
        return NextResponse.json(result);
      }
      
      // Default: get all time records with filtering
      const result = await getAllTimeRecords({
        date: searchParams.get('date') || undefined,
        department: searchParams.get('department') || undefined,
        employeeId: searchParams.get('employeeId') || undefined,
        sessionType: searchParams.get('sessionType') || undefined,
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined
      });
      
      return NextResponse.json(result);
      
    } catch (err: any) {
      console.error("Error fetching time records:", err);
      return NextResponse.json(
        { success: false, message: "Server Error fetching time records", error: err.message },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const body: CreateTimeRecordData = await request.json();
      
      // Validation
      const requiredFields = ['employeeId', 'sessionType', 'actualTime'];
      const missingFields = requiredFields.filter(field => {
        const val = body[field as keyof CreateTimeRecordData];
        return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
      });

      if (missingFields.length > 0) {
        return NextResponse.json(
          { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
          { status: 400 }
        );
      }

      const validSessionTypes = ['check-in', 'lunch-out', 'lunch-in', 'check-out'];
      if (!validSessionTypes.includes(body.sessionType)) {
        return NextResponse.json(
          { success: false, message: `Invalid sessionType. Must be one of: ${validSessionTypes.join(', ')}` },
          { status: 400 }
        );
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(body.actualTime)) {
        return NextResponse.json(
          { success: false, message: 'Invalid time format. Must be HH:MM' },
          { status: 400 }
        );
      }

      const timeRecord = await createTimeRecord(body);
      
      return NextResponse.json(
        { success: true, message: "Time record created successfully", timeRecord },
        { status: 201 }
      );

    } catch (error: any) {
      console.error("Error creating time record:", error);
      
      if (error.message.includes('Employee not found')) {
        return NextResponse.json(
          { success: false, message: "Employee not found" },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Image upload failed')) {
        return NextResponse.json(
          { success: false, message: "Image upload failed", error: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: "Server error creating time record", error: error.message },
        { status: 500 }
      );
    }
  });
}

// Add OPTIONS handler for preflight
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}