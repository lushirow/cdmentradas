import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export interface User {
    email: string;
    nombre: string;
    role: 'socio' | 'admin';
}

export interface Session {
    user: User;
    exp: number;
}

// Create JWT token
export async function createToken(user: User): Promise<string> {
    return await new SignJWT({ user })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<Session | null> {
    try {
        const verified = await jwtVerify(token, JWT_SECRET);
        return verified.payload as unknown as Session;
    } catch (error) {
        return null;
    }
}

// Get current user from cookies (No DB dependency)
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return null;

    const session = await verifyToken(token);
    return session?.user || null;
}

// Require authentication (throws if not authenticated)
export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}

// Require admin role (throws if not admin)
export async function requireAdmin(): Promise<User> {
    const user = await requireAuth();
    if (user.role !== 'admin') {
        throw new Error('Forbidden - Admin access required');
    }
    return user;
}

// Set auth cookie
export async function setAuthCookie(user: User) {
    const token = await createToken(user);
    const cookieStore = await cookies();

    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

// Clear auth cookie
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}
