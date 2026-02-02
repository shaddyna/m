// app/api/time/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json(
        { 
            success: true, 
            message: 'Time Management API',
            version: '1.0.0',
            endpoints: [
                '/api/time/attendance/daily',
                '/api/time/attendance/summary/today',
                '/api/time/attendance/weekly-trend',
                '/api/time/departments/summary',
                '/api/time/records'
            ]
        },
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        }
    )
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    })
}