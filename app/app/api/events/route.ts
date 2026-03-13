import { NextRequest, NextResponse } from 'next/server';
import { query, getMany } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { CreateEventDTO, Event } from '@/types';

// GET: List all future events (public) or all events (admin)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const adminMode = searchParams.get('admin') === 'true';

        let sql = 'SELECT * FROM events';
        const params: any[] = [];

        // Filter logic: Only show future events by default for public
        if (!adminMode) {
            sql += ' WHERE fecha_hora > NOW() ORDER BY fecha_hora ASC';
        } else {
            sql += ' ORDER BY fecha_hora DESC'; // Admin sees latest first
        }

        const events = await getMany<Event>(sql, params);

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Create new event (Admin only)
export async function POST(request: NextRequest) {
    try {
        // 1. Verify admin
        await requireAdmin();

        // 2. Parse body
        const body = await request.json() as CreateEventDTO;

        // 3. Validation
        if (!body.titulo || !body.fecha_hora || !body.precio) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 4. Insert into DB
        const sql = `
      INSERT INTO events (titulo, fecha_hora, precio, foto_portada_url, stream_enabled, ventas_habilitadas, campeonato)
      VALUES ($1, $2, $3, $4, false, true, $5)
      RETURNING *
    `;

        const result = await query(sql, [
            body.titulo,
            body.fecha_hora, // Ensure this is a valid date string/object
            body.precio,
            body.foto_portada_url || null,
            body.campeonato || 'Liga del Sur Riojano'
        ]);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating event:', error);
        if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
