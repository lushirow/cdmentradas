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
    // Next.js 15: params is a Promise, must be awaited
    const { id } = await params;
    const event = await getEvent(id);
    const user = await getCurrentUser();

    if (!event) {
        notFound();
    }

    const eventDate = new Date(event.fecha_hora);

    return (
        <main className="min-h-screen pb-12">
            <Header user={user} />

            {/* Hero / Cover */}
            <div className="relative h-[40vh] w-full bg-club-black">
                {event.foto_portada_url ? (
                    <Image
                        src={event.foto_portada_url}
                        alt={event.titulo}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-club-yellow/20">
                        <Trophy size={100} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 container mx-auto">
                    <span className="bg-club-yellow text-club-black font-bold px-3 py-1 rounded text-sm uppercase mb-4 inline-block">
                        Próximo Partido
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                        {event.titulo}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Main Content (Left) */}
                    <div className="md:col-span-2 space-y-8">
                        <Card className="bg-club-gray border border-club-yellow/10 p-6">
                            <h2 className="text-2xl font-bold text-club-yellow mb-6">Detalles del Encuentro</h2>

                            <div className="space-y-4 text-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-club-yellow/10 flex items-center justify-center text-club-yellow">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Fecha y Hora</p>
                                        <p className="text-foreground/70">
                                            {eventDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            {' - '}
                                            {eventDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-club-yellow/10 flex items-center justify-center text-club-yellow">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Lugar</p>
                                        <p className="text-foreground/70">{event.ubicacion || 'La Olla - Estadio Club Deportivo Malanzán'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-club-yellow/10 flex items-center justify-center text-club-yellow">
                                        <Trophy size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Competencia</p>
                                        <p className="text-foreground/70">Liga del Sur Riojano</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-club-gray border border-club-yellow/10 p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Información Importante</h3>
                            <ul className="space-y-2 text-foreground/70 list-disc list-inside">
                                <li>El stream comenzará 15 minutos antes del partido.</li>
                                <li>Podrás ver el partido desde un solo dispositivo a la vez.</li>
                                <li>Si tenés problemas, contactanos por soporte.</li>
                            </ul>
                        </Card>
                    </div>

                    {/* Sidebar (Right) - Checkout */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            <Card className="bg-gradient-to-br from-club-gray to-club-black border-2 border-club-yellow/30 p-6 text-center shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-2">Comprar Entrada</h3>
                                <p className="text-sm text-foreground/60 mb-6">Acceso exclusivo al streaming en vivo</p>

                                <div className="mb-6">
                                    <EventCountdown targetDate={eventDate} />
                                </div>

                                <div className="text-4xl font-bold text-club-yellow mb-2">
                                    ${event.precio / 100}
                                </div>
                                <p className="text-xs text-foreground/40 mb-6">Precio final, impuestos incluidos</p>

                                {event.ventas_habilitadas ? (
                                    <CheckoutButton eventId={event.id} price={event.precio} />
                                ) : (
                                    <Button disabled className="w-full" size="lg">Ventas Cerradas</Button>
                                )}

                                <div className="mt-4 flex items-center justify-center text-xs text-foreground/50 gap-1">
                                    <Lock size={12} />
                                    Pago seguro con MercadoPago
                                </div>
                            </Card>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
