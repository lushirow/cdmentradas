import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { query, getOne } from '@/lib/db';
import { UpdateEventDTO, Event } from '@/types';

// GET /api/admin/events/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id: paramId } = await params;
        const id = parseInt(paramId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const event = await getOne<Event>('SELECT * FROM events WHERE id = $1', [id]);

        if (!event) {
            return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error: unknown) {
        console.error('Error fetching event:', error);
        return NextResponse.json(
            { error: 'Error al obtener evento', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/events/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id: paramId } = await params;
        const id = parseInt(paramId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const body: UpdateEventDTO = await request.json();

        // Check if event exists
        const existingEvent = await getOne<Event>('SELECT id FROM events WHERE id = $1', [id]);
        if (!existingEvent) {
            return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
        }

        // Build dynamic update query
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (body.titulo !== undefined) {
            updates.push(`titulo = $${paramIndex++}`);
            values.push(body.titulo);
        }
        if (body.fecha_hora !== undefined) {
            updates.push(`fecha_hora = $${paramIndex++}`);
            values.push(`${body.fecha_hora}-03:00`);
        }
        if (body.precio !== undefined) {
            updates.push(`precio = $${paramIndex++}`);
            values.push(body.precio);
        }
        if (body.foto_portada_url !== undefined) {
            updates.push(`foto_portada_url = $${paramIndex++}`);
            values.push(body.foto_portada_url);
        }
        if (body.youtube_video_id !== undefined) {
            updates.push(`youtube_video_id = $${paramIndex++}`);
            values.push(body.youtube_video_id || null);
        }
        if (body.stream_enabled !== undefined) {
            updates.push(`stream_enabled = $${paramIndex++}`);
            values.push(body.stream_enabled);
        }
        if (body.ventas_habilitadas !== undefined) {
            updates.push(`ventas_habilitadas = $${paramIndex++}`);
            values.push(body.ventas_habilitadas);
        }
        if (body.ubicacion !== undefined) {
            updates.push(`ubicacion = $${paramIndex++}`);
            values.push(body.ubicacion);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No se enviaron datos para actualizar' }, { status: 400 });
        }

        updates.push(`updated_at = NOW()`);
        values.push(id); // The ID is the last parameter

        const updateQuery = `
            UPDATE events 
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await query(updateQuery, values);

        return NextResponse.json(result.rows[0]);
    } catch (error: unknown) {
        console.error('Error updating event:', error);
        return NextResponse.json(
            { error: 'Error al actualizar evento', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/events/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id: paramId } = await params;
        const id = parseInt(paramId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        // Optional: Check if there are purchases linked to this event before deleting
        // For now, CASCADE DELETE in DB schema will handle it, but we might want to warn
        // the admin or soft-delete instead in a real scenario.

        const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Evento eliminado' });
    } catch (error: unknown) {
        console.error('Error deleting event:', error);
        return NextResponse.json(
            { error: 'Error al eliminar evento', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
