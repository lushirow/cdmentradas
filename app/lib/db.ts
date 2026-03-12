import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err: Error) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper function: Execute query
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error: unknown) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function: Get single row
export async function getOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const res = await query(text, params);
  return res.rows[0] || null;
}

// Helper function: Get multiple rows
export async function getMany<T>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await query(text, params);
  return res.rows;
}

// Helper function: Execute transaction
export async function transaction(callback: (client: unknown) => Promise<void>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await callback(client);
    await client.query('COMMIT');
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Export pool for advanced use cases
export { pool };
