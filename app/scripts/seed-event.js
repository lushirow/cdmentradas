
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

async function seed() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        // Calculate next Saturday 20:00
        const today = new Date();
        const nextSaturday = new Date(today);
        nextSaturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
        nextSaturday.setHours(20, 0, 0, 0);

        const event = {
            titulo: 'CDM vs. Atlético Chepes',
            fecha_hora: nextSaturday.toISOString(),
            precio: 250000, // $2500
            foto_portada_url: 'https://images.unsplash.com/photo-1544698310-74ea9d18e5b7?q=80&w=1920&auto=format&fit=crop',
            youtube_video_id: 'jfKfPfyJRdk', // Lofi Girl (stream 24/7 seguro para pruebas)
        };

        const sql = `
      INSERT INTO events (titulo, fecha_hora, precio, foto_portada_url, stream_enabled, ventas_habilitadas)
      VALUES ($1, $2, $3, $4, false, true)
      RETURNING *
    `;

        console.log('Seeding event:', event);
        const res = await client.query(sql, [event.titulo, event.fecha_hora, event.precio, event.foto_portada_url]);
        console.log('Event created! ID:', res.rows[0].id);

        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seed();
