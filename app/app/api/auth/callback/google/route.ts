import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';
import { getOrCreateUser } from '@/lib/auth-db';

const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    // Get the dynamic host to support localhost, LAN IP, and production seamlessly
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    
    // Construct the absolute callback URL dynamically
    const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

    // Step 1: If no code, redirect to Google OAuth
    if (!code) {
        const params = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'online',
            prompt: 'select_account',
        });

        return NextResponse.redirect(`${GOOGLE_OAUTH_URL}?${params.toString()}`);
    }

    // Step 2: Exchange code for access token
    try {
        const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenResponse.json();

        if (!tokens.access_token) {
            console.error('Token Error:', tokens);
            throw new Error('No access token received');
        }

        // Step 3: Get user info from Google
        const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const googleUser = await userInfoResponse.json();

        if (!googleUser.email) {
            throw new Error('No email in Google profile');
        }

        // Step 4: Get or create user in our database
        const user = await getOrCreateUser({
            email: googleUser.email,
            name: googleUser.name || googleUser.email,
        });

        // Step 5: Set auth cookie
        await setAuthCookie(user);

        // Step 6: Redirect to home or intended destination
        const intendedUrl = searchParams.get('from') || '/';
        return NextResponse.redirect(new URL(intendedUrl, request.url));

    } catch (error) {
        console.error('Google OAuth error:', error);
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
}
