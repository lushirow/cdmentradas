import { query, getOne } from './db';
import { User } from './auth';
import { v4 as uuidv4 } from 'uuid';

// Get or create user from Google profile (DB Dependent)
export async function getOrCreateUser(googleProfile: {
    email: string;
    name: string;
}): Promise<User> {
    const sessionToken = uuidv4();

    // Check if user exists
    let user = await getOne<User>(
        'SELECT email, nombre, role FROM users WHERE email = $1',
        [googleProfile.email]
    );

    // Create user if doesn't exist
    if (!user) {
        await query(
            'INSERT INTO users (email, nombre, role, session_token) VALUES ($1, $2, $3, $4)',
            [googleProfile.email, googleProfile.name, 'socio', sessionToken]
        );

        user = {
            email: googleProfile.email,
            nombre: googleProfile.name,
            role: 'socio',
            session_token: sessionToken
        };
    } else {
        // User exists, update their session_token to invalidate old sessions
        await query(
            'UPDATE users SET session_token = $1 WHERE email = $2',
            [sessionToken, googleProfile.email]
        );
        user.session_token = sessionToken;
    }

    return user;
}
