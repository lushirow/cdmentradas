import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createTicketPreference } from '@/lib/mercadopago';
import { getOne } from '@/lib/db';
import { Event, Purchase } from '@/types';

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate user
        const user = await requireAuth();

        // 2. Parse body
        const body = await request.json();
        const eventId = body?.eventId;

        if (!eventId) {
            return NextResponse.json({ error: 'Falta eventId' }, { status: 400 });
        }

        // 3. Get event details (using parameterized query correctly)
        const event = await getOne<Event>(
            'SELECT * FROM events WHERE id = $1',
            [eventId]
        );

        if (!event) {
            return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
        }

        // Convert string 'true'/'false' or boolean check for habilitadas
        if (!event.ventas_habilitadas) {
            return NextResponse.json({ error: 'Ventas cerradas para este evento' }, { status: 403 });
        }

        // 4. Check if user already purchased ticket (simple query)
        const existing = await getOne<Purchase>(
            'SELECT id FROM purchases WHERE email = $1 AND event_id = $2 AND status = $3',
            [user.email, eventId, 'approved']
        );

        if (existing) {
            return NextResponse.json({ error: 'Ya compraste una entrada para este evento' }, { status: 409 });
        }

        // 5. Create MercadoPago preference
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
        const baseUrl = `${protocol}://${host}`;

        console.log(`Creating MP Preference with base URL: ${baseUrl}`);

        const preference = await createTicketPreference(
            {
                title: `Entrada: ${event.titulo}`,
                quantity: 1,
                unit_price: event.precio / 100, // MP expects price in pesos (assuming DB cents)
            },
            {
                email: user.email,
                name: user.nombre,
            },
            {
                event_id: event.id,
                user_email: user.email,
            },
            baseUrl
        );

        if (!preference.id && !preference.init_point) {
            throw new Error('No init_point received from MercadoPago preference creation');
        }

        return NextResponse.json({ init_point: preference.init_point });

    } catch (error: unknown) {
        console.error('Checkout API error:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
