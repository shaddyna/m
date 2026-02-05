import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';

// DELETE /api/users/deleteByAdmin/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      // ✅ Must await params before destructuring
      const { id } = await params;

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      console.log(`[SUCCESS] User deleted: ${id}`);

      return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      console.error('[ERROR] deleteByAdmin:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}