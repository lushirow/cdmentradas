import { Event } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Ticket } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface EventPosterProps {
    event: Event;
    isPast?: boolean;
}

export function EventPoster({ event, isPast }: EventPosterProps) {
    const eventDate = new Date(event.fecha_hora);
    const timeStr = eventDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' });

    return (
        <Link href={`/evento/${event.id}`} className="block group w-64 md:w-72 flex-shrink-0">
            <Card className="relative overflow-hidden bg-club-black border-none rounded-sm transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:z-10 group-hover:shadow-[0_20px_40px_rgba(255,215,0,0.15)] ring-1 ring-white/5 group-hover:ring-club-yellow/50 cursor-pointer h-96">
                
                {/* Image Cover */}
                <div className="absolute inset-0 bg-club-black">
                    {event.foto_portada_url ? (
                        <Image
                            src={event.foto_portada_url}
                            alt={event.titulo}
                            fill
                            className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-club-yellow/20">
                            <Ticket size={48} />
                        </div>
                    )}
                </div>

                {/* Gradients to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {isPast ? (
                            <span className="text-[10px] font-bold text-white/50 bg-white/10 px-2 py-1 rounded backdrop-blur-sm uppercase tracking-wider mb-2 inline-block">
                                Finalizado
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-black bg-club-yellow px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block shadow-lg">
                                Próximamente
                            </span>
                        )}

                        <h3 className="text-xl font-bold text-white leading-tight mb-1 drop-shadow-md line-clamp-2">
                            {event.titulo}
                        </h3>
                        
                        <p className="text-sm font-medium text-white/80 drop-shadow-md">
                            {eventDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} • {timeStr} hs
                        </p>
                        
                        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {isPast && event.stream_enabled ? (
                                <div className="flex items-center text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                                    <Play size={12} className="mr-1 fill-white" /> Ver Repetición
                                </div>
                            ) : event.ventas_habilitadas ? (
                                <div className="flex items-center text-xs font-bold text-club-black bg-club-yellow px-3 py-1.5 rounded-full shadow-lg">
                                    <Ticket size={12} className="mr-1" /> Entradas Disp.
                                </div>
                            ) : (
                                <div className="flex items-center text-xs font-bold text-white/50 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                    No Disponible
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
