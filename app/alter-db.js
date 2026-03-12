import 'dotenv/config'; // Load variables from .env if needed
import pg from 'pg';

// Fallback to process.env.DATABASE_URL
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/cdm'; // Replace with actual if it's missing in env but usually next loads it if we run with `dotenv`

const pool = new pg.Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function main() {
    try {
        console.log('Connecting to database...');
        // Add column softly
        await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS ubicacion VARCHAR(255) DEFAULT 'La Olla';`);
        console.log('Successfully added ubicacion column to events table!');
    } catch (err) {
        console.error('Error altering table:', err);
    } finally {
        pool.end();
    }
}

main();
