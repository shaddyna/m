import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleCorsPreflight } from '@/lib/cors';
import { registerUser } from '@/lib/services/authService';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: NextRequest) {
    return withCors(request, async () => {
        try {
            await dbConnect();
            
            const body = await request.json();
            const { name, email, password, role } = body;

            // Validation
            if (!name || !email || !password) {
                return NextResponse.json(
                    { success: false, message: 'Name, email and password are required' },
                    { status: 400 }
                );
            }

            const result = await registerUser(name, email, password, role);
            
            if (!result.success) {
                return NextResponse.json(result, { status: 400 });
            }

            return NextResponse.json(result, { status: 201 });
            
        } catch (error: any) {
            console.error('Register error:', error);
            return NextResponse.json(
                { success: false, message: 'Server error during registration', error: error.message },
                { status: 500 }
            );
        }
    });
}

export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflight(request);
}