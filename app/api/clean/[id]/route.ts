// app/api/clean/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleCorsPreflight } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import Clean from '@/models/RecordsClean';
import { validateRecordId } from '@/lib/clean/cleanService';

interface Params {
  id: string;
}

// ------------------ GET ------------------
export async function GET(
  request: NextRequest,
  context: { params: Params }
) {
  return withCors(request, async () => {
    try {
      const { id } = context.params;

      await dbConnect();

      // Validate ID
      const validation = await validateRecordId(id);
      if (validation) {
        return NextResponse.json(validation, { status: validation.status });
      }

      const record = await Clean.findById(id);
      if (!record) {
        return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, record });
    } catch (err: any) {
      console.error('Error fetching clean record:', err);
      return NextResponse.json(
        { success: false, message: 'Server error fetching record', error: err.message },
        { status: 500 }
      );
    }
  });
}

// ------------------ PUT ------------------
export async function PUT(
  request: NextRequest,
  context: { params: Params }
) {
  return withCors(request, async () => {
    try {
      const { id } = context.params;

      await dbConnect();

      const validation = await validateRecordId(id);
      if (validation) {
        return NextResponse.json(validation, { status: validation.status });
      }

      const body = await request.json();
      const existingRecord = await Clean.findById(id);

      if (!existingRecord) {
        return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
      }

      // Check for duplicate documentNo if changing
      if (body.documentNo && body.documentNo !== existingRecord.documentNo) {
        const duplicate = await Clean.findOne({
          documentType: body.documentType || existingRecord.documentType,
          documentNo: body.documentNo,
          _id: { $ne: id },
        });

        if (duplicate) {
          return NextResponse.json(
            { success: false, message: `Document number ${body.documentNo} already exists` },
            { status: 400 }
          );
        }
      }

      const updated = await Clean.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });

      return NextResponse.json({ success: true, message: 'Record updated successfully', record: updated });
    } catch (err: any) {
      console.error('Error updating clean record:', err);
      return NextResponse.json(
        { success: false, message: 'Server error updating record', error: err.message },
        { status: 500 }
      );
    }
  });
}

// ------------------ DELETE ------------------
export async function DELETE(
  request: NextRequest,
  context: { params: Params }
) {
  return withCors(request, async () => {
    try {
      const { id } = context.params;

      await dbConnect();

      const validation = await validateRecordId(id);
      if (validation) {
        return NextResponse.json(validation, { status: validation.status });
      }

      const record = await Clean.findByIdAndDelete(id);
      if (!record) {
        return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Record deleted successfully', record });
    } catch (err: any) {
      console.error('Error deleting clean record:', err);
      return NextResponse.json(
        { success: false, message: 'Server error deleting record', error: err.message },
        { status: 500 }
      );
    }
  });
}

// ------------------ OPTIONS (CORS Preflight) ------------------
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}
