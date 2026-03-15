import { getCurrentUser } from '@/lib/auth';
import { getOne } from '@/lib/db';
import { Event, Purchase } from '@/types';
import { notFound, redirect } from 'next/navigation';
import { YouTubePlayer } from '@/components/events/YouTubePlayer';
import { Lock, AlertCircle } from 'lucide-react';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getEventAndValidation(eventId: string, userEmail: string, isAdmin: boolean) {
    // 1. Get Event
    const event = await getOne<Event>('SELECT * FROM events WHERE id = $1', [eventId]);
    if (!event) return { event: null, hasAccess: false };

    // 2. Admin bypass
    if (isAdmin) {
        return { event, hasAccess: true };
    }

    // 3. Check Purchase (Approved)
    const purchase = await getOne<Purchase>(
        'SELECT * FROM purchases WHERE email = $1 AND event_id = $2 AND status = $3',
        [userEmail, eventId, 'approved']
    );

    return {
        event,
        hasAccess: !!purchase
    };
}

export default async function WatchPage({ params }: PageProps) {
    const { id } = await params;

    // 1. Auth Guard - redirect to login instead of throwing a server error
    const user = await getCurrentUser();
    if (!user) {
        redirect(`/admin/login?from=/watch/${id}`);
    }

    // 2. Data Fetching
    const { event, hasAccess } = await getEventAndValidation(id, user.email, user.role === 'admin');

    // 3. Event not found
    if (!event) {
        notFound();
    }

    // 4. Access Denied Guard
    if (!hasAccess) {
        redirect(`/evento/${event.id}?error=no_ticket`);
    }

    return (
        <main className="fixed inset-0 w-screen h-screen bg-black overflow-hidden z-[9999]">
            {event.stream_enabled && event.youtube_video_id ? (
                <YouTubePlayer 
                    videoId={event.youtube_video_id} 
                    titulo={event.titulo}
                    campeonato={event.campeonato}
                />
            ) : (
                <div 
                    className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 px-4 select-none"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <Lock className="text-white/20 mb-6 drop-shadow-2xl" size={64} />
                    <h2 className="text-2xl md:text-5xl font-black text-white mb-3 uppercase tracking-widest text-center animate-[fadeIn_1s_ease-out_0.2s_both]">
                        Transmisión Inactiva
                    </h2>
                    <p className="text-white/50 max-w-lg text-center font-medium md:text-lg mb-8 animate-[fadeIn_1s_ease-out_0.4s_both]">
                        El streaming oficial del Club Deportivo Malanzán aún no ha comenzado o se encuentra en pausa. 
                        La señal suele habilitarse 15 minutos antes del horario oficial del partido.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-club-yellow bg-club-yellow/10 px-6 py-3 rounded-full border border-club-yellow/20 font-bold uppercase tracking-widest animate-[fadeIn_1s_ease-out_0.6s_both]">
                        <AlertCircle size={18} className="animate-pulse" />
                        Esperando Señal...
                    </div>
                </div>
            )}
        </main>
    );
}
