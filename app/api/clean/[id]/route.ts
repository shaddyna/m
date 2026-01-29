import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleCorsPreflight } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import Clean from '@/models/RecordsClean';
import { validateRecordId } from '@/lib/clean/cleanService';

// Type for route context in Next.js 15+
type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    return withCors(request, async () => {
        try {
            await dbConnect();
            const { id } = await context.params;  // Await params
            const validation = await validateRecordId(id);
            if (validation) return NextResponse.json(validation, { status: validation.status });
            
            const record = await Clean.findById(id);
            if (!record) {
                return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
            }
            
            return NextResponse.json({ success: true, record });
        } catch (err: any) {
            console.error("Error fetching clean record:", err);
            return NextResponse.json(
                { success: false, message: "Server Error fetching record", error: err.message },
                { status: 500 }
            );
        }
    });
}

export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    return withCors(request, async () => {
        try {
            await dbConnect();
            const { id } = await context.params;  // Await params
            const validation = await validateRecordId(id);
            if (validation) return NextResponse.json(validation, { status: validation.status });
            
            const body = await request.json();
            const existingRecord = await Clean.findById(id);
            
            if (!existingRecord) {
                return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
            }
            
            // Duplicate check if documentNo changing
            if (body.documentNo && body.documentNo !== existingRecord.documentNo) {
                const duplicate = await Clean.findOne({
                    documentType: body.documentType || existingRecord.documentType,
                    documentNo: body.documentNo,
                    _id: { $ne: id }
                });
                
                if (duplicate) {
                    return NextResponse.json(
                        { success: false, message: `Document number ${body.documentNo} already exists` },
                        { status: 400 }
                    );
                }
            }
            
            const updated = await Clean.findByIdAndUpdate(
                id,
                { $set: body },
                { new: true, runValidators: true }
            );
            
            return NextResponse.json({ success: true, message: "Record updated successfully", record: updated });
        } catch (error: any) {
            console.error("Error updating clean record:", error);
            return NextResponse.json(
                { success: false, message: "Server error updating record", error: error.message },
                { status: 500 }
            );
        }
    });
}

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    return withCors(request, async () => {
        try {
            await dbConnect();
            const { id } = await context.params;  // Await params
            const validation = await validateRecordId(id);
            if (validation) return NextResponse.json(validation, { status: validation.status });
            
            const record = await Clean.findByIdAndDelete(id);
            if (!record) {
                return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
            }
            
            return NextResponse.json({ success: true, message: "Record deleted successfully", record });
        } catch (error: any) {
            console.error("Error deleting clean record:", error);
            return NextResponse.json(
                { success: false, message: "Server error deleting record", error: error.message },
                { status: 500 }
            );
        }
    });
}

export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflight(request);
}