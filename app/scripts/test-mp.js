
const MercadoPagoConfig = require('mercadopago').MercadoPagoConfig;
const Preference = require('mercadopago').Preference;
const fs = require('fs');
const path = require('path');

// Load env vars manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        process.env[key.trim()] = value.trim();
    }
});

console.log('Testing MP Credentials...');
console.log('Access Token:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Present' : 'Missing');

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

const preference = new Preference(client);

async function test() {
    try {
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'test-123',
                        title: 'Test Ticket',
                        quantity: 1,
                        unit_price: 100,
                        currency_id: 'ARS',
                    }
                ],
                back_urls: {
                    success: 'http://localhost:3000/success',
                }
            }
        });

        console.log('✅ Preference created successfully!');
        console.log('Init Point:', result.init_point);
    } catch (error) {
        console.error('❌ Error creating preference:', error);
    }
}

test();
