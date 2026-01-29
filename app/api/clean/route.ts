// app/api/clean/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Clean from '@/models/RecordsClean';
import { getAllRecords } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const result = await getAllRecords({
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined
        });
        return NextResponse.json(result);
    } catch (err: any) {
        console.error("Error fetching Clean records:", err);
        return NextResponse.json(
            { success: false, message: "Server Error fetching Clean records", error: err.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        
        // Validation
        const requiredFields = [
            'documentType', 'documentNo', 'customerName', 'amount', 
            'facilitator', 'createdBy', 'created_time_utc', 'created_time_nairobi',
            'createdAt_date', 'createdAt_text', 'created_year', 'created_month', 'created_day'
        ];

        const missingFields = requiredFields.filter(field => {
            const val = body[field];
            return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
        });

        if (missingFields.length > 0) {
            return NextResponse.json(
                { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        const validDocumentTypes = ['INVOICE', 'CASH_SALE', 'QUOTATION'];
        if (!validDocumentTypes.includes(body.documentType)) {
            return NextResponse.json(
                { success: false, message: `Invalid documentType. Must be one of: ${validDocumentTypes.join(', ')}` },
                { status: 400 }
            );
        }

        const existingRecord = await Clean.findOne({
            documentType: body.documentType,
            documentNo: body.documentNo
        });

        if (existingRecord) {
            return NextResponse.json(
                { success: false, message: `Document number ${body.documentNo} already exists for ${body.documentType}` },
                { status: 400 }
            );
        }

        const cleanRecord = await Clean.create(body);
        return NextResponse.json(
            { success: true, message: "Clean record created successfully", record: cleanRecord },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating clean record:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "Document number must be unique per document type", error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Server error creating clean record", error: error.message },
            { status: 500 }
        );
    }
}*/

import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';  
import dbConnect from '@/lib/dbConnect';
import Clean from '@/models/RecordsClean';
import { getAllRecords } from '@/lib/clean/cleanService';

export async function GET(request: NextRequest) {
  // Wrap with CORS
  return withCors(request, async () => {
    try {
      await dbConnect();
      const { searchParams } = new URL(request.url);
      const result = await getAllRecords({
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined
      });
      return NextResponse.json(result);
    } catch (err: any) {
      console.error("Error fetching Clean records:", err);
      return NextResponse.json(
        { success: false, message: "Server Error fetching Clean records", error: err.message },
        { status: 500 }
      );
    }
  });
}


// POST with CORS - This fixes your issue!
export async function POST(request: NextRequest) {
    return withCors(request, async () => {
        try {
            await dbConnect();
            const body = await request.json();
            
            // Validation
            const requiredFields = [
                'documentType', 'documentNo', 'customerName', 'amount', 
                'facilitator', 'createdBy', 'created_time_utc', 'created_time_nairobi',
                'createdAt_date', 'createdAt_text', 'created_year', 'created_month', 'created_day'
            ];

            const missingFields = requiredFields.filter(field => {
                const val = body[field];
                return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
            });

            if (missingFields.length > 0) {
                return NextResponse.json(
                    { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
                    { status: 400 }
                );
            }

            const validDocumentTypes = ['INVOICE', 'CASH_SALE', 'QUOTATION'];
            if (!validDocumentTypes.includes(body.documentType)) {
                return NextResponse.json(
                    { success: false, message: `Invalid documentType. Must be one of: ${validDocumentTypes.join(', ')}` },
                    { status: 400 }
                );
            }

            const existingRecord = await Clean.findOne({
                documentType: body.documentType,
                documentNo: body.documentNo
            });

            if (existingRecord) {
                return NextResponse.json(
                    { success: false, message: `Document number ${body.documentNo} already exists for ${body.documentType}` },
                    { status: 400 }
                );
            }

            const cleanRecord = await Clean.create(body);
            
            // Return success with CORS headers
            return NextResponse.json(
                { success: true, message: "Clean record created successfully", record: cleanRecord },
                { status: 201 }
            );

        } catch (error: any) {
            console.error("Error creating clean record:", error);
            if (error.code === 11000) {
                return NextResponse.json(
                    { success: false, message: "Document number must be unique per document type", error: error.message },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, message: "Server error creating clean record", error: error.message },
                { status: 500 }
            );
        }
    });
}

// Add OPTIONS handler for preflight
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}