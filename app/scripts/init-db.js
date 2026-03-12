
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load env vars
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        process.env[key.trim()] = value.trim();
    }
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const schema = `
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  email VARCHAR(255) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'socio' CHECK (role IN ('socio', 'admin')),
  last_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de eventos (partidos)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  fecha_hora TIMESTAMP NOT NULL,
  precio INTEGER NOT NULL,
  foto_portada_url TEXT,
  youtube_video_id VARCHAR(50),
  stream_enabled BOOLEAN DEFAULT FALSE,
  ventas_habilitadas BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de compras
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  mercadopago_payment_id VARCHAR(255) UNIQUE,
  mercadopago_preference_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  amount INTEGER NOT NULL,
  cupon_compensacion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email, event_id)
);

-- Tabla de sesiones activas (session lock)
CREATE TABLE IF NOT EXISTS active_sessions (
  email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
  session_token VARCHAR(255) PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  last_ping TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices (check if exists logic is complex in pure SQL, skipping specifically or using IF NOT EXISTS where supported)
-- Postgres doesn't support CREATE INDEX IF NOT EXISTS in all versions, but 9.5+ does.
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_event ON purchases(event_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_email ON active_sessions(email);
CREATE INDEX IF NOT EXISTS idx_events_fecha ON events(fecha_hora);
`;

async function init() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Connected! Executing schema...');
        await client.query(schema);
        console.log('Schema created successfully! ✅');
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

init();
