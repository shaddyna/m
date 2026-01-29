import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { normalizeRole } from '@/utils/role';

const JWT_SECRET = process.env.JWT_SECRET!;
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '5');

export const signToken = (_id: string) => jwt.sign({ _id }, JWT_SECRET);

export interface AuthResult {
    success: boolean;
    user?: any;
    token?: string;
    message?: string;
}

export async function registerUser(
    name: string, 
    email: string, 
    password: string, 
    role?: string
): Promise<AuthResult> {
    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { success: false, message: 'Email already in use' };
    }

    // Create user with normalized role
    const normalizedRole = normalizeRole(role);
    const user = await User.create({ 
        name, 
        email, 
        password, 
        role: normalizedRole 
    });

    // Generate token
    const token = signToken(user._id.toString());
    
    // Add token to user's token list
    user.tokens.push({ token });
    await user.save();

    // Return user without password using destructuring
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    return { success: true, user: userWithoutPassword, token };
}

export async function loginUser(
    email: string, 
    password: string
): Promise<AuthResult> {
    const user = await User.findOne({ email });
    
    if (!user) {
        return { success: false, message: 'Invalid credentials' };
    }

    // NOTE: You should use bcrypt.compare() here for hashed passwords
    if (user.password !== password) {
        return { success: false, message: 'Invalid credentials' };
    }

    // Generate token
    const token = signToken(user._id.toString());
    
    // Add token and enforce max limit
    user.tokens.push({ token });
    if (user.tokens.length > MAX_TOKENS) {
        user.tokens = user.tokens.slice(-MAX_TOKENS);
    }
    await user.save();

    // Return user without password using destructuring
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    return { success: true, user: userWithoutPassword, token };
}

export async function logoutUser(userId: string, token: string): Promise<AuthResult> {
    const user = await User.findById(userId);
    if (!user) {
        return { success: false, message: 'User not found' };
    }

    // Remove specific token
    user.tokens = user.tokens.filter((t: any) => t.token !== token);
    await user.save();

    return { success: true, message: 'Logged out successfully' };
}