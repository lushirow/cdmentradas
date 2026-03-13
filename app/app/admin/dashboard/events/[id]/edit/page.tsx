import { Header } from '@/components/ui/Header';
import { requireAdmin, getCurrentUser } from '@/lib/auth';
import { getOne } from '@/lib/db';
import { Event } from '@/types';
import EditEventClient from './EditEventClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Get logged-in user
    const user = await getCurrentUser();

    // 2. Ensure user is admin (throws and redirects internally or locally catch)
    try {
        await requireAdmin();
    } catch (error) {
        redirect('/');
    }

    // 3. Resolve params and get the ID
    const { id } = await params;

    // 4. Fetch the event directly from the database
    let event: Event | null = null;
    try {
        event = await getOne<Event>('SELECT * FROM events WHERE id = $1', [id]);
    } catch (error) {
        console.error('Error fetching event for edit:', error);
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header user={user} />
            <div className="pt-28">
                <EditEventClient id={id} initialEvent={event} />
            </div>
        </div>
    );
}
