import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleCorsPreflight } from '@/lib/cors';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const users = await User.find({}).select('-password -tokens');
      return NextResponse.json({ success: true, users });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  });
}

// POST /api/users - Register new user (consolidated from duplicate routes)
export async function POST(request: NextRequest) {
  return withCors(request, async () => {
    try {
      await dbConnect();
      const body = await request.json();
      
      const { name, email, password } = body;

      // Validation
      if (!name || !email || !password) {
        return NextResponse.json(
          { success: false, error: 'Name, email, and password are required' },
          { status: 400 }
        );
      }

      if (password.length < 7) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 7 characters' },
          { status: 400 }
        );
      }

      // Check existing user
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already in use' },
          { status: 400 }
        );
      }

      // Hash password (recommended security improvement)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with default role
      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'facilitator' // Default role
      });

      await user.save();
      
      // Generate token
      const token = await user.generateAuthToken();

      return NextResponse.json(
        { 
          success: true, 
          message: 'User registered successfully',
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Error registering user:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request);
}