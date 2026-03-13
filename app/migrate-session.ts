import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { pool } from './lib/db';

async function main() {
  try {
    console.log('Adding session_token to users table...');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token UUID;');
    console.log('Successfully added session_token.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

main();
