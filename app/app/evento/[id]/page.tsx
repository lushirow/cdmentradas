import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Event } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Trophy, Star, Lock } from 'lucide-react';
import { CheckoutButton } from '@/components/checkout/CheckoutButton';
import { EventCountdown } from '@/components/events/EventCountdown';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getEvent(id: string) {
    try {
        const event = await getOne<Event>(
            'SELECT * FROM events WHERE id = $1',
            [id]
        );
        return event;
    } catch (error) {
        console.error('Error fetching event:', error);
        return null;
    }
}

export default async function EventPage({ params }: PageProps) {
    const { id } = await params;
    const event = await getEvent(id);
    const user = await getCurrentUser();

    if (!event) {
        notFound();
    }

    const eventDate = new Date(event.fecha_hora);
    const TZ = { timeZone: 'America/Argentina/Buenos_Aires' };
    const dateStr = eventDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', ...TZ });
    const timeStr = eventDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', ...TZ });

    return (
        <main className="min-h-screen bg-black overflow-x-hidden">
            <Header user={user} />

            {/* IMMERSIVE HERO MOVIE DETAIL */}
            <div className="relative w-full min-h-[90vh] flex flex-col justify-end md:justify-center pt-32 pb-12">
                {/* Background Cover */}
                <div className="absolute inset-0 z-0">
                    {event.foto_portada_url ? (
                        <Image
                            src={event.foto_portada_url}
                            alt={event.titulo}
                            fill
                            className="object-cover opacity-60 md:opacity-50 blur-[2px] md:blur-none"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                            <Trophy size={120} className="text-white/5" />
                        </div>
                    )}
                    {/* Netflix Vignette Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 md:via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 md:via-black/40 to-transparent hidden md:block w-3/4" />
                </div>

                {/* Content Overlay */}
                <div className="container mx-auto px-4 md:px-12 relative z-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-12">
                    
                    {/* Left: Metadata & Title */}
                    <div className="w-full md:max-w-3xl">
                        <div className="flex items-center gap-3 mb-4 animate-[fadeIn_1s_ease-out]">
                            <span className="bg-club-yellow text-black text-[10px] md:text-xs font-black uppercase px-2 py-1 rounded shadow-[0_0_15px_rgba(255,215,0,0.5)] tracking-widest">
                                En Vivo 
                            </span>
                            <span className="text-white/70 text-sm font-semibold tracking-wider">
                                {dateStr}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                            <span className="text-white/70 text-sm font-semibold tracking-wider">
                                {timeStr} hs
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-2xl tracking-tighter animate-[fadeIn_1s_ease-out_0.2s_both]">
                            {event.titulo}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 mb-8 text-white/80 animate-[fadeIn_1s_ease-out_0.4s_both]">
                            <div className="flex items-center gap-2">
                                <Trophy size={20} className="text-club-yellow" />
                                <span className="font-semibold text-lg">{event.campeonato || 'Amistoso'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={20} className="text-club-yellow" />
                                <span className="font-semibold text-lg">{event.ubicacion || 'La Olla'}</span>
                            </div>
                        </div>

                        <p className="text-lg text-white/70 max-w-2xl mb-8 leading-relaxed animate-[fadeIn_1s_ease-out_0.5s_both]">
                            Asegurá tu lugar y viví el partido en alta definición desde cualquier dispositivo. Acceso exclusivo al streaming oficial del Club Deportivo Malanzán. La transmisión comenzará 15 minutos antes del horario oficial.
                        </p>
                    </div>

                    {/* Right: Checkout Card */}
                    <div className="w-full md:w-auto md:min-w-[340px] animate-[fadeIn_1s_ease-out_0.6s_both]">
                        <Card className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-sm shadow-2xl drop-shadow-2xl">
                            <h3 className="text-lg font-bold text-white/90 mb-6 uppercase tracking-widest text-center border-b border-white/10 pb-4">
                                Acceso al Stream
                            </h3>

                            <div className="mb-8">
                                <EventCountdown targetDate={eventDate} />
                            </div>

                            <div className="text-center mb-6">
                                <div className="text-5xl font-black text-white tracking-tighter mb-1">
                                    <span className="text-2xl text-club-yellow align-top mr-1">$</span>
                                    {event.precio / 100}
                                </div>
                                <p className="text-xs text-white/40 uppercase tracking-widest">Pago Único</p>
                            </div>

                            {event.ventas_habilitadas ? (
                                <CheckoutButton eventId={event.id} price={event.precio} />
                            ) : (
                                <Button disabled className="w-full h-14 bg-white/5 border border-white/10 text-white/40 uppercase tracking-widest font-bold rounded-sm">
                                    Ventas Cerradas
                                </Button>
                            )}

                            <div className="mt-6 flex items-center justify-center text-[10px] text-white/30 gap-2 uppercase tracking-widest font-bold">
                                <Lock size={12} />
                                Pago seguro con MercadoPago
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
            
            {/* Cinematic Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

        </main>
    );
}
