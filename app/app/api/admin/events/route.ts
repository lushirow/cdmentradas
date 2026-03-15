import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { query, getMany } from '@/lib/db';
import { CreateEventDTO, Event } from '@/types';

// GET /api/admin/events
// Fetch all events for the admin dashboard
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const events = await getMany<Event>(
            'SELECT * FROM events ORDER BY fecha_hora DESC'
        );

        return NextResponse.json(events);
    } catch (error: unknown) {
        console.error('Error fetching events:', error);
        return NextResponse.json(
            { error: 'Error al obtener eventos', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// POST /api/admin/events
// Create a new event
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body: CreateEventDTO = await request.json();

        // Validate required fields
        if (!body.titulo || !body.fecha_hora || typeof body.precio !== 'number') {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios (titulo, fecha_hora, precio)' },
                { status: 400 }
            );
        }

        // Convert Argentina time (UTC-3) to UTC by adding 3 hours
        // TIMESTAMP WITHOUT TIME ZONE ignores -03:00 suffix, so we convert explicitly
        const arDate = new Date(`${body.fecha_hora}:00Z`);
        arDate.setUTCHours(arDate.getUTCHours() + 3);
        const localTimestamp = arDate.toISOString();

        const result = await query(
            `INSERT INTO events (
                titulo, fecha_hora, precio, foto_portada_url, 
                stream_enabled, ventas_habilitadas, ubicacion
            ) VALUES ($1, $2, $3, $4, false, true, $5) RETURNING *`,
            [
                body.titulo,
                localTimestamp,
                body.precio,
                body.foto_portada_url || null,
                body.ubicacion || null
            ]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { error: 'Error al crear evento', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
