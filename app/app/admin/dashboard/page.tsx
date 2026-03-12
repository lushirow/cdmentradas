import { Header } from '@/components/ui/Header';
import { requireAdmin } from '@/lib/auth';
import { getMany } from '@/lib/db';
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';
import { Event } from '@/types';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await getCurrentUser();
    let buyers: any[] = [];
    let events: Event[] = [];
    let fetchError: Error | null = null;

    try {
        // Enforce Admin Auth
        await requireAdmin();

        // Fetch Sales Data
        const purchases = await getMany<any>(
            `SELECT p.id, u.nombre as name, u.email, p.created_at as date, p.status, p.amount
             FROM purchases p
             JOIN users u ON p.email = u.email
             ORDER BY p.created_at DESC`
        );

        // Fetch Events Data
        events = await getMany<Event>(
            `SELECT * FROM events ORDER BY fecha_hora DESC`
        );

        // Map to simpler format for client
        buyers = purchases.map(p => ({
            id: p.id,
            name: p.name || 'Desconocido',
            email: p.email,
            date: p.date,
            status: p.status,
            amount: p.amount,
        }));

    } catch (error: unknown) {
        if (error instanceof Error && (error.message.includes('Forbidden') || error.message.includes('Unauthorized'))) {
            redirect('/');
        }
        console.error('Dashboard Error:', error);
        fetchError = error instanceof Error ? error : new Error('Unknown error');
    }

    if (fetchError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Error al cargar el panel de administración.
            </div>
        );
    }

    return (
        <>
            <Header user={user} />
            <DashboardClient buyers={buyers} events={events} />
        </>
    );
}
