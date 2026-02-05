import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { handleCorsPreflight, withCors } from '@/lib/cors';
import { normalizeRole } from '@/utils/role';

// POST /api/users/createByAdmin
export async function POST(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();

      const { name, email, password, role } = await request.json();

      console.log(`[INFO] Admin creating user: ${email}`);

      if (!name || !email || !password) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use!!!' },
          { status: 400 }
        );
      }

      const user = await User.create({
        name,
        email,
        password,
        role: normalizeRole(role), // ✅ correct util
      });

      console.log(
        `[SUCCESS] User created by admin: ID=${user._id}`
      );

      return NextResponse.json(
        { user },
        { status: 201 }
      );

    } catch (error: any) {
      console.error(
        `[ERROR] CreateByAdmin failed: ${error.message}`
      );
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
