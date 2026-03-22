import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Ticket, Info, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getMany } from '@/lib/db';
import { Event } from '@/types';
import { getCurrentUser } from '@/lib/auth';
import { Carousel } from '@/components/ui/Carousel';
import { EventPoster } from '@/components/events/EventPoster';

export const dynamic = 'force-dynamic';

async function getHomePageData() {
    try {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const arTimeStr = now.toISOString().slice(0, 19).replace('T', ' ');

        // Fetch Next (Featured) Event
        const nextEvents = await getMany<Event & { is_live?: boolean }>(
            "SELECT *, CASE WHEN fecha_hora <= $1::timestamp THEN true ELSE false END as is_live FROM events WHERE fecha_hora > $1::timestamp - INTERVAL '4 hours' ORDER BY fecha_hora ASC LIMIT 1",
            [arTimeStr]
        );
        
        // Fetch Upcoming Events (excluding the featured one)
        let upcomingQuery = "SELECT * FROM events WHERE fecha_hora > $1::timestamp - INTERVAL '4 hours'";
        const params: any[] = [arTimeStr];
        
        if (nextEvents.length > 0) {
            upcomingQuery += ' AND id != $2';
            params.push(nextEvents[0].id);
        }
        upcomingQuery += ' ORDER BY fecha_hora ASC LIMIT 10';
        
        const upcomingEvents = await getMany<Event>(upcomingQuery, params);

        // Fetch Past Events
        const pastEvents = await getMany<Event>(
            "SELECT * FROM events WHERE fecha_hora <= $1::timestamp - INTERVAL '4 hours' ORDER BY fecha_hora DESC LIMIT 10",
            [arTimeStr]
        );

        return {
            featuredEvent: nextEvents[0] || null,
            upcomingEvents,
            pastEvents
        };
    } catch (error) {
        console.error('Error fetching home data:', error);
        return { featuredEvent: null, upcomingEvents: [], pastEvents: [] };
    }
}

export default async function Home() {
    const { featuredEvent, upcomingEvents, pastEvents } = await getHomePageData();
    const isLive = featuredEvent ? (featuredEvent as any).is_live : false;
    const user = await getCurrentUser();

    return (
        <main className="min-h-screen bg-black overflow-x-hidden">
            <Header user={user} />

            {/* MASSIVE HERO (100vh) */}
            <div className="relative w-full h-[90vh] md:h-screen bg-black flex items-end pb-20 md:pb-32">
                {featuredEvent?.foto_portada_url ? (
                    <Image
                        src={featuredEvent.foto_portada_url}
                        alt="Featured Event"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
                        <Calendar size={120} className="text-white/5" />
                    </div>
                )}
                
                {/* Netflix-style vignette masks */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent w-full md:w-2/3" />

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 md:px-12 w-full">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-4 animate-[fadeIn_1s_ease-out]">
                            <span className={`${isLive ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] text-white animate-pulse' : 'bg-club-yellow shadow-[0_0_15px_rgba(255,215,0,0.5)] text-black'} text-xs font-black uppercase px-2 py-1 rounded tracking-widest`}>
                                {isLive ? '🔴 EN VIVO AHORA' : 'Próxima Emisión'}
                            </span>
                            {featuredEvent && (
                                <span className="text-white/80 text-sm font-semibold tracking-wide">
                                    {new Date(featuredEvent.fecha_hora).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Argentina/Buenos_Aires' })}
                                </span>
                            )}
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-4 drop-shadow-2xl animate-[fadeIn_1s_ease-out_0.2s_both]">
                            {featuredEvent ? featuredEvent.titulo : 'Próximo Evento'}
                        </h1>
                        
                        <div className="flex items-center text-club-yellow mb-6 animate-[fadeIn_1s_ease-out_0.3s_both]">
                            <span className="font-black text-xl md:text-2xl tracking-wide uppercase drop-shadow-lg">
                                {featuredEvent?.campeonato || 'Torneo Liga del Sur'}
                            </span>
                        </div>
                        
                        <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mb-8 animate-[fadeIn_1s_ease-out_0.4s_both]">
                            {featuredEvent?.ubicacion 
                                ? `Desde ${featuredEvent.ubicacion}. La plataforma oficial de streaming en vivo del Club Deportivo Malanzán.`
                                : 'La plataforma oficial de streaming en vivo del Club Deportivo Malanzán.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 animate-[fadeIn_1s_ease-out_0.6s_both]">
                            {featuredEvent ? (
                                <>
                                    <Link href={isLive ? `/watch/${featuredEvent.id}` : `/evento/${featuredEvent.id}`}>
                                        <Button size="lg" className={`w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-sm shadow-2xl ${isLive ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30' : 'shadow-club-yellow/20'}`}>
                                            {isLive ? (
                                                <><Play className="fill-white mr-2" size={24} /> Ver Ahora</>
                                            ) : featuredEvent.ventas_habilitadas ? (
                                                <><Ticket className="fill-black mr-2" size={24} /> Comprar Entrada</>
                                            ) : (
                                                <><Info className="mr-2" size={24} /> Ver Detalles</>
                                            )}
                                        </Button>
                                    </Link>
                                    {isLive && featuredEvent.ventas_habilitadas && (
                                        <Link href={`/evento/${featuredEvent.id}`}>
                                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-md rounded-sm">
                                                <Ticket className="mr-2" size={24} /> Comprar Entrada
                                            </Button>
                                        </Link>
                                    )}
                                    {!isLive && featuredEvent.stream_enabled && (
                                        <Link href={`/watch/${featuredEvent.id}`}>
                                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-md rounded-sm">
                                                <Play className="fill-white mr-2" size={24} /> Transmisión
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-sm" disabled>
                                    Próximamente
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CAROUSELS SECTION */}
            <div className="relative z-20 pb-20 -mt-16 md:-mt-24 space-y-8 md:space-y-12">
                
                {upcomingEvents.length > 0 && (
                    <Carousel title="Próximos Partidos">
                        {upcomingEvents.map(event => (
                            <EventPoster key={event.id} event={event} />
                        ))}
                    </Carousel>
                )}

                {pastEvents.length > 0 && (
                    <Carousel title="Archivo Histórico">
                        {pastEvents.map(event => (
                            <EventPoster key={event.id} event={event} isPast />
                        ))}
                    </Carousel>
                )}
                
                {upcomingEvents.length === 0 && pastEvents.length === 0 && !featuredEvent && (
                    <div className="px-4 md:px-12 pt-20 text-center">
                        <Card className="bg-zinc-900 border-none inline-block p-12 text-white/50">
                            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-xl font-bold mb-2">Cartelera Vacía</p>
                            <p className="text-sm">No hay eventos programados en este momento.</p>
                        </Card>
                    </div>
                )}
            </div>

            {/* Minimal Cinematic Footer */}
            <footer className="bg-black py-16 px-4 border-t border-white/10 mt-20">
                <div className="container mx-auto max-w-6xl text-center flex flex-col items-center">
                    <div className="flex gap-1 mb-6 opacity-30">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
                        ))}
                    </div>
                    <p className="text-white/40 text-sm tracking-widest uppercase font-bold mb-2">
                        Club Deportivo Malanzán
                    </p>
                    <p className="text-white/20 text-xs">
                        &copy; 2026 CDM Streaming. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </main>
    );
}
