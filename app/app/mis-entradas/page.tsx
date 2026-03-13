import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getCurrentUser, requireAuth } from '@/lib/auth';
import { getMany } from '@/lib/db';
import { Event } from '@/types';
import { Ticket, Calendar, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PurchasedEvent extends Event {
    purchase_status: string;
    purchase_date: string;
}

export default async function MisEntradasPage() {
    let user;
    try {
        user = await requireAuth();
    } catch (error) {
        redirect('/login?from=/mis-entradas');
    }

    let purchasedEvents: PurchasedEvent[] = [];

    try {
        purchasedEvents = await getMany<PurchasedEvent>(
            `SELECT e.*, p.status as purchase_status, p.created_at as purchase_date 
             FROM events e
             JOIN purchases p ON e.id = p.event_id 
             WHERE p.email = $1 AND p.status = 'approved'
             ORDER BY e.fecha_hora DESC`,
            [user.email]
        );
    } catch (error) {
        console.error('Error fetching purchases:', error);
    }

    return (
        <main className="min-h-screen pb-12">
            <Header user={user} />
            
            <div className="container mx-auto px-4 pt-28 pb-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-club-yellow/10 rounded-full flex items-center justify-center">
                        <Ticket size={24} className="text-club-yellow" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Mis Entradas</h1>
                        <p className="text-foreground/60">Tus accesos a las transmisiones en vivo</p>
                    </div>
                </div>

                {purchasedEvents.length === 0 ? (
                    <Card className="p-12 text-center bg-club-gray border-dashed border-2 border-club-yellow/20">
                        <Ticket size={48} className="mx-auto text-club-yellow/20 mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Aún no tenés entradas</h2>
                        <p className="text-foreground/60 mb-6">Explorá los próximos partidos y comprate una entrada para ver el stream.</p>
                        <Link href="/">
                            <Button>Ver Próximos Eventos</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {purchasedEvents.map((event) => {
                            const date = new Date(event.fecha_hora);
                            return (
                                <Card key={event.id} className="overflow-hidden border border-club-yellow/20 bg-gradient-to-br from-club-gray to-club-black hover:border-club-yellow/50 transition-colors">
                                    <div className="relative h-48 w-full bg-club-black">
                                        {event.foto_portada_url ? (
                                            <Image
                                                src={event.foto_portada_url}
                                                alt={event.titulo}
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-club-gray">
                                                <Ticket size={48} className="text-club-yellow/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                        
                                        <div className="absolute bottom-4 left-4 right-4 focus:outline-none">
                                            <h3 className="text-xl font-bold text-white shadow-sm drop-shadow line-clamp-2">{event.titulo}</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-foreground/70 mb-4 text-sm">
                                            <Calendar size={16} className="text-club-yellow" />
                                            <span>{date.toLocaleDateString('es-AR')} - {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}hs</span>
                                        </div>

                                        {event.stream_enabled ? (
                                            <Link href={`/watch/${event.id}`} className="block w-full">
                                                <Button className="w-full group">
                                                    <Play size={16} className="mr-2 group-hover:scale-125 transition-transform" fill="currentColor" />
                                                    Ver Transmisión / Entrar
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button disabled variant="outline" className="w-full">
                                                Ubicación Física (Sin Stream)
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
