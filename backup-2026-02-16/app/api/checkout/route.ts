import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, payer } = body;

        const preference = new Preference(client);

        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        // MercadoPago no permite auto_return en localhost
        const isLocalhost = host.includes('localhost');

        const result = await preference.create({
            body: {
                items: items,
                payer: {
                    email: payer.email,
                    name: payer.name,
                },
                back_urls: {
                    success: `${baseUrl}/success`,
                    failure: `${baseUrl}/checkout?status=failure`,
                    pending: `${baseUrl}/checkout?status=pending`,
                },
                auto_return: isLocalhost ? undefined : 'approved',
            }
        });

        return NextResponse.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
        console.error('------- MERCADOPAGO ERROR -------');
        console.error(JSON.stringify(error, null, 2));
        console.error('---------------------------------');
        return NextResponse.json({ error: 'Error creating preference', details: error }, { status: 500 });
    }
}
