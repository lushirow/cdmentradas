import fs from 'fs';
import pg from 'pg';

const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = envFile.match(/DATABASE_URL=(.*)/);
let dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;

if (dbUrl.startsWith('"') && dbUrl.endsWith('"')) {
    dbUrl = dbUrl.slice(1, -1);
}

const pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        console.log('Connecting to DB with URL...');
        await pool.query("ALTER TABLE events ADD COLUMN IF NOT EXISTS ubicacion VARCHAR(255) DEFAULT 'La Olla - Estadio Club Deportivo Malanzán';");
        console.log("Success: Added ubicacion column.");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
main();
