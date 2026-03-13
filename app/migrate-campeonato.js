const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        console.log('Adding campeonato column to events table...');
        await pool.query(`
            ALTER TABLE events 
            ADD COLUMN IF NOT EXISTS campeonato VARCHAR(150) DEFAULT 'Liga del Sur Riojano';
        `);
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
