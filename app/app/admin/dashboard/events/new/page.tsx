import { Header } from '@/components/ui/Header';
import { requireAdmin, getCurrentUser } from '@/lib/auth';
import NewEventClient from './NewEventClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewEventPage() {
    // 1. Get logged-in user
    const user = await getCurrentUser();

    // 2. Ensure user is admin (throws and redirects internally or locally catch)
    try {
        await requireAdmin();
    } catch (error) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header user={user} />
            <div className="pt-28">
                <NewEventClient />
            </div>
        </div>
    );
}
