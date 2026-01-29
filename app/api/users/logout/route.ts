import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleCorsPreflight } from '@/lib/cors';
import { logoutUser } from '@/lib/services/authService';
import dbConnect from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    return withCors(request, async () => {
        try {
            await dbConnect();
            
            // Extract token from header
            const authHeader = request.headers.get('authorization');
            const token = authHeader?.split(' ')[1]; // Bearer TOKEN
            
            if (!token) {
                return NextResponse.json(
                    { success: false, message: 'No token provided' },
                    { status: 401 }
                );
            }

            // Verify token and get user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
            
            const result = await logoutUser(decoded._id, token);
            
            if (!result.success) {
                return NextResponse.json(result, { status: 400 });
            }

            return NextResponse.json(result, { status: 200 });
            
        } catch (error: any) {
            console.error('Logout error:', error);
            return NextResponse.json(
                { success: false, message: 'Server error during logout', error: error.message },
                { status: 500 }
            );
        }
    });
}

export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflight(request);
}