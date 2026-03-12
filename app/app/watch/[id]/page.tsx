import { Header } from '@/components/ui/Header';
import { requireAuth } from '@/lib/auth';
import { getOne } from '@/lib/db';
import { Event, Purchase } from '@/types';
import { notFound, redirect } from 'next/navigation';
import { YouTubePlayer } from '@/components/events/YouTubePlayer';
import { LiveChat } from '@/components/events/LiveChat';
import { Card } from '@/components/ui/Card';
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
    // 1. Auth Guard
    const user = await requireAuth();

    // 2. Data Fetching - Next.js 15: params is a Promise
    const { id } = await params;
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
        <main className="min-h-screen bg-club-black">
            <Header user={user} />

            <div className="w-full max-w-[1600px] mx-auto px-4 py-6">

                {/* Header del Stream */}
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        {event.stream_enabled ? (
                            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                        ) : (
                            <span className="w-3 h-3 rounded-full bg-foreground/20" />
                        )}
                        {event.titulo}
                    </h1>
                    <div className="hidden md:block text-sm text-foreground/60 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        Viendo como: <span className="text-club-yellow font-bold">{user.nombre}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left/Main Column: Video Player */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Player Container */}
                        {event.stream_enabled && event.youtube_video_id ? (
                            <YouTubePlayer videoId={event.youtube_video_id} />
                        ) : (
                            <Card className="aspect-video w-full flex flex-col items-center justify-center bg-club-black border-2 border-dashed border-club-yellow/20">
                                <Lock className="text-club-yellow mb-4" size={48} />
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Transmisión no iniciada</h2>
                                <p className="text-foreground/70 max-w-md text-center px-4">
                                    El streaming oficial aún no ha comenzado o se encuentra en pausa.
                                    La señal suele habilitarse 15 minutos antes del partido.
                                </p>
                                <div className="mt-8 flex gap-2 text-sm text-club-yellow bg-club-yellow/10 border border-club-yellow/20 px-4 py-2 rounded-full">
                                    <AlertCircle size={18} />
                                    Esperando señal del administrador...
                                </div>
                            </Card>
                        )}

                        {/* Instrucciones and Details */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <h3 className="text-xl font-bold text-white mb-3">Información de la Transmisión</h3>
                                <p className="text-foreground/70 text-sm leading-relaxed">
                                    Estás en la transmisión oficial de <strong className="text-white">Club Deportivo Malanzán</strong>.
                                    Si experimentas problemas de carga o video congelado, te sugerimos actualizar la página.
                                    Recordá que tu ticket digital es válido exclusivamente para un dispositivo a la vez. ¡Gracias por apoyar al Club!
                                </p>
                            </div>

                            <div className="md:col-span-1">
                                <Card className="bg-club-gray/50 p-5 border border-club-yellow/10 hover:border-club-yellow/30 transition-colors h-full flex flex-col justify-center">
                                    <p className="text-xs text-center text-foreground/40 uppercase tracking-widest mb-2 font-bold">
                                        Asistencia y Soporte
                                    </p>
                                    <p className="text-center text-white font-bold text-lg">
                                        soporte@cdm.com.ar
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Simulated Live Chat */}
                    <div className="lg:col-span-1 h-full min-h-[500px]">
                        <LiveChat currentUser={user.nombre} />
                    </div>
                </div>

            </div>
        </main>
    );
}
