import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleCorsPreflight } from '@/lib/cors';
import { loginUser } from '@/lib/services/authService';
import dbConnect from '@/lib/dbConnect';
import { corsHeaders } from '@/lib/corsHeadrers';

/*export async function POST(request: NextRequest) {
    return withCors(request, async () => {
        try {
            await dbConnect();
            
            const body = await request.json();
            const { email, password } = body;

            if (!email || !password) {
                return NextResponse.json(
                    { success: false, message: 'Email and password are required' },
                    { status: 400 }
                );
            }

            const result = await loginUser(email, password);
            
            if (!result.success) {
                return NextResponse.json(result, { status: 400 });
            }

            return NextResponse.json(result, { status: 200 });
            
        } catch (error: any) {
            console.error('Login error:', error);
            return NextResponse.json(
                { success: false, message: 'Server error during login', error: error.message },
                { status: 500 }
            );
        }
    });
}*/

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                {
                    status: 400,
                    headers: corsHeaders()
                }
            );
        }

        const result = await loginUser(email, password);

        return NextResponse.json(result, {
            status: result.success ? 200 : 400,
            headers: corsHeaders()
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            {
                status: 500,
                headers: corsHeaders()
            }
        );
    }
}

export async function OPTIONS(request: NextRequest) {
    return handleCorsPreflight(request);
}