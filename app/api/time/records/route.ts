/*import { NextRequest, NextResponse } from 'next/server';
import { TimeRecord } from '@/models/TimeRecord';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const employeeId = searchParams.get('employee');
    const sessionType = searchParams.get('session');
    const date = searchParams.get('date');
    
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: any = {};
    
    if (employeeId && employeeId !== 'all') {
      filter.employee = employeeId;
    }
    
    if (sessionType && sessionType !== 'all') {
      filter.sessionType = sessionType;
    }
    
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.date = {
        $gte: searchDate,
        $lt: nextDay
      };
    }
    
    // Get records with pagination
    const records = await TimeRecord.find(filter)
      .populate('employee', 'name email department role')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await TimeRecord.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching records:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}*/
// app/api/attendance/records/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import { TimeRecord } from '@/models/TimeRecord';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const searchParams = request.nextUrl.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const employeeId = searchParams.get('employee');
      const sessionType = searchParams.get('session');
      const date = searchParams.get('date');
      
      const skip = (page - 1) * limit;
      
      // Build filter
      const filter: any = {};
      
      if (employeeId && employeeId !== 'all') {
        filter.employee = employeeId;
      }
      
      if (sessionType && sessionType !== 'all') {
        filter.sessionType = sessionType;
      }
      
      if (date) {
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        filter.date = {
          $gte: searchDate,
          $lt: nextDay
        };
      }
      
      // Get records with pagination
      const records = await TimeRecord.find(filter)
        .populate('employee', 'name email department role')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Get total count
      const total = await TimeRecord.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);
      
      return NextResponse.json({
        success: true,
        records,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
      
    } catch (error: any) {
      console.error('Error fetching records:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  });
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}