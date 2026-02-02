/*import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/services/attendance.service';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || undefined;
    
    const dashboard = await AttendanceService.getAdminDashboard(date);
    
    return NextResponse.json(dashboard);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}*/

// app/api/attendance/admin/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import { AttendanceService } from '@/services/attendance.service';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      
      const searchParams = request.nextUrl.searchParams;
      const date = searchParams.get('date') || undefined;
      
      const dashboard = await AttendanceService.getAdminDashboard(date);
      
      return NextResponse.json(dashboard);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}