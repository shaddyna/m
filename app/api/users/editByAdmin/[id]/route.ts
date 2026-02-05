import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import { normalizeRole } from '@/utils/role';

// PUT /api/users/editByAdmin/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      const { id } = params;
      const body = await request.json();

      const allowedFields = ['name', 'email', 'role', 'password'];
      const updates = Object.keys(body);
      const invalid = updates.filter(
        (key) => !allowedFields.includes(key)
      );

      if (invalid.length) {
        return NextResponse.json(
          { error: `Invalid fields: ${invalid.join(', ')}` },
          { status: 400 }
        );
      }

      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (body.role) {
        body.role = normalizeRole(body.role);
      }

      updates.forEach((key) => {
        (user as any)[key] = body[key];
      });

      await user.save();

      return NextResponse.json({ user });

    } catch (error: any) {
      console.error('[ERROR] editByAdmin:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}
