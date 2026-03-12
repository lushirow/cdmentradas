
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

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Por favor proporciona un email.');
        console.error('Uso: node scripts/set-admin.js usuario@email.com');
        process.exit(1);
    }

    try {
        const client = await pool.connect();

        // Check if user exists
        const check = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (check.rowCount === 0) {
            console.error(`❌ El usuario ${email} no existe en la base de datos.`);
            console.log('💡 Tip: El usuario debe iniciar sesión al menos una vez para ser creado.');
            process.exit(1);
        }

        // Update role
        await client.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);

        console.log(`✅ ¡Éxito! El usuario ${email} ahora es ADMIN.`);

        client.release();
        process.exit(0);

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

main();
