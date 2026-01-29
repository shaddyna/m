// app/api/users/route.ts
import { NextResponse } from 'next/server';

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
}