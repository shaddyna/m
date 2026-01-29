import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleCorsPreflight } from '@/lib/cors';  // Add CORS imports
import dbConnect from '@/lib/dbConnect';
import { getTodayDateRange, getFilteredRecords } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
    // Wrap with CORS
    return withCors(request, async () => {
        try {
            await dbConnect();
            const { searchParams } = new URL(request.url);
            const dateRange = getTodayDateRange();
            const result = await getFilteredRecords(dateRange, {
                page: searchParams.get('page') || undefined,
                limit: searchParams.get('limit') || undefined
            });
            
            result.dateFilter.dateLabel = "Today";
            result.dateFilter.date = new Date().toISOString().split('T')[0];
            
            return NextResponse.json(result);
        } catch (err: any) {
            console.error("Error fetching today's Clean records:", err);
            return NextResponse.json(
                { success: false, message: "Server Error fetching today's records", error: err.message },
                { status: 500 }
            );
        }
    });
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflight(request);
}