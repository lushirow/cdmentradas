import { NextResponse } from 'next/server';
import { getOne } from '@/lib/db';
import { Event } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch the most relevant active event (e.g., upcoming or most recently created)
        const event = await getOne<Event>(
            `SELECT * FROM events 
             WHERE ventas_habilitadas = true 
             ORDER BY fecha_hora DESC 
             LIMIT 1`
        );

        if (!event) {
            return NextResponse.json({ error: 'No active events found' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error fetching active event:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
