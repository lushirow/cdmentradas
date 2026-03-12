import { query, getOne } from './db';
import { User } from './auth';

// Get or create user from Google profile (DB Dependent)
export async function getOrCreateUser(googleProfile: {
    email: string;
    name: string;
}): Promise<User> {
    // Check if user exists
    let user = await getOne<User>(
        'SELECT email, nombre, role FROM users WHERE email = $1',
        [googleProfile.email]
    );

    // Create user if doesn't exist
    if (!user) {
        await query(
            'INSERT INTO users (email, nombre, role) VALUES ($1, $2, $3)',
            [googleProfile.email, googleProfile.name, 'socio']
        );

        user = {
            email: googleProfile.email,
            nombre: googleProfile.name,
            role: 'socio'
        };
    }

    return user;
}
