'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Trophy, Calendar, Ticket } from 'lucide-react';
import { Event } from '@/types';
import { useRouter } from 'next/navigation';
import { EventCountdown } from './EventCountdown';
import Image from 'next/image';

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const router = useRouter();
    const eventDate = new Date(event.fecha_hora);

    // Format date: "Sábado 15 de Febrero"
    const dateStr = eventDate.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    // Format time: "20:00 hs"
    const timeStr = eventDate.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    }) + ' hs';

    return (
        <Card className="max-w-4xl mx-auto overflow-hidden bg-club-gray border-2 border-club-yellow/20">
            <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Image */}
                <div className="relative h-64 md:h-auto min-h-[300px] bg-club-black">
                    {event.foto_portada_url ? (
                        <Image
                            src={event.foto_portada_url}
                            alt={event.titulo}
                            fill
                            className="object-cover opacity-80"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-club-yellow/20">
                            <Trophy size={64} />
                        </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-club-yellow text-club-black font-bold px-3 py-1 rounded text-sm uppercase tracking-wider">
                        Próximo Partido
                    </div>
                </div>

                {/* Right: Info */}
                <div className="p-8 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                        {event.titulo}
                    </h2>

                    <div className="space-y-4 my-6">
                        <div className="flex items-center text-foreground/80">
                            <Calendar className="text-club-yellow mr-3" size={20} />
                            <span className="capitalize">{dateStr} • {timeStr}</span>
                        </div>

                        <div className="flex items-center text-foreground/80">
                            <MapPin className="text-club-yellow mr-3" size={20} />
                            <span>{event.ubicacion || 'La Olla - Estadio Club Deportivo Malanzán'}</span>
                        </div>

                        <div className="flex items-center text-foreground/80">
                            <Trophy className="text-club-yellow mr-3" size={20} />
                            <span>{event.campeonato || 'Amistoso'}</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <h3 className="text-club-yellow text-sm font-bold uppercase tracking-wider mb-2 text-center">
                            Faltan para el partido
                        </h3>
                        <EventCountdown targetDate={eventDate} />

                        <Button
                            size="lg"
                            className="w-full mt-4 text-lg py-6"
                            onClick={() => router.push(`/evento/${event.id}`)}
                            disabled={!event.ventas_habilitadas}
                        >
                            <Ticket className="mr-2" />
                            {event.ventas_habilitadas ? 'Comprar Entrada' : 'Ventas Cerradas'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
