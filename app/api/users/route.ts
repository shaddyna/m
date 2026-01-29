// app/api/users/route.ts
/*import { NextResponse } from 'next/server';

import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}*/

import { NextResponse } from 'next/server';
import { withCors, handleCorsPreflight } from '@/lib/cors';  // Add imports
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const users = await User.find({});
      return NextResponse.json(users);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}