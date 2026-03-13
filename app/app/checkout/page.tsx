'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Star, ArrowRight, Wallet, LogIn, AlertCircle } from 'lucide-react';
import { Event, User } from '@/types';

export default function CheckoutPage() {
    const router = useRouter();

    // State
    const [event, setEvent] = useState<Event | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Active Event
                const eventRes = await fetch('/api/events/active');
                if (!eventRes.ok) {
                    if (eventRes.status === 404) {
                        setError('No hay eventos disponibles para venta en este momento.');
                    } else {
                        setError('Error al cargar el evento.');
                    }
                } else {
                    const eventData = await eventRes.json();
                    setEvent(eventData);
                }

                // 2. Fetch User Session
                const authRes = await fetch('/api/auth/me');
                if (authRes.ok) {
                    const authData = await authRes.json();
                    setUser(authData.user);
                }

            } catch (err) {
                console.error(err);
                setError('Error de conexión. Por favor intente recargar.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogin = () => {
        // Redirect to Google Login returning to this page
        const returnUrl = encodeURIComponent('/checkout');
        window.location.href = `/api/auth/callback/google?from=${returnUrl}`;
    };

    const handlePayment = async () => {
        if (!event || !user) return;

        setIsProcessing(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: event.id, // Sending the ID required by the API
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar el pago.');
            }

            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                alert('Error al iniciar el pago. Respuesta inválida de MercadoPago.');
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Hubo un error de conexión.');
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-club-yellow animate-pulse">Cargando...</div>
            </main>
        );
    }

    if (error || !event) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-12 pt-28 flex justify-center">
                    <Card className="max-w-md w-full bg-club-gray/50 border-red-500/20 p-8 text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-xl font-bold text-white mb-2">Lo sentimos</h2>
                        <p className="text-foreground/60">{error || 'Evento no encontrado.'}</p>
                        <Button
                            className="mt-6 w-full"
                            onClick={() => router.push('/')}
                        >
                            Volver al Inicio
                        </Button>
                    </Card>
                </div>
            </main>
        );
    }

    // Format Date
    const formattedDate = new Date(event.fecha_hora).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });

    const price = (event.precio / 100).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 pt-28 pb-12">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">

                    {/* Resumen de Compra */}
                    <div className="order-2 md:order-1">
                        <h2 className="text-2xl font-bold text-club-yellow mb-6 flex items-center gap-2">
                            <Trophy size={24} />
                            Tu Entrada
                        </h2>

                        <Card className="bg-club-gray/50 border-club-yellow/20">
                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{event.titulo}</h3>
                                    <p className="text-sm text-foreground/60 capitalize">{formattedDate} hs</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-club-yellow">{price}</p>
                                    <p className="text-xs text-foreground/40">ARS</p>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-sm text-foreground/80">
                                    <Star className="text-club-yellow mr-3 fill-club-yellow" size={16} />
                                    Acceso garantizado al estadio
                                </li>
                                {event.stream_enabled && (
                                    <li className="flex items-center text-sm text-foreground/80">
                                        <Star className="text-club-yellow mr-3 fill-club-yellow" size={16} />
                                        Acceso exclusivo al Stream en Vivo
                                    </li>
                                )}
                                <li className="flex items-center text-sm text-foreground/80">
                                    <Star className="text-club-yellow mr-3 fill-club-yellow" size={16} />
                                    Participá del sorteo de camisetas
                                </li>
                            </ul>

                            <div className="bg-club-yellow/10 p-4 rounded-lg border border-club-yellow/20">
                                <p className="text-xs text-club-yellow/80 text-center">
                                    Al completar el pago recibirás los accesos en tu correo electrónico.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Login / Checkout Action */}
                    <div className="order-1 md:order-2">
                        <Card className="bg-club-black border-club-yellow/30 shadow-2xl shadow-club-yellow/5">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {user ? `¡Hola, ${user.nombre.split(' ')[0]}!` : 'Identificación'}
                                </h2>
                                <p className="text-sm text-foreground/60">
                                    {user
                                        ? 'Estás a un paso de asegurar tu lugar. Revisa los datos y confirma el pago.'
                                        : 'Para continuar con la compra, necesitamos que inicies sesión con tu cuenta de Google.'
                                    }
                                </p>
                            </div>

                            {!user ? (
                                <div className="space-y-4">
                                    <Button
                                        size="lg"
                                        className="w-full flex items-center justify-center gap-3 py-6"
                                        onClick={handleLogin}
                                    >
                                        <LogIn size={20} />
                                        Iniciar Sesión con Google
                                    </Button>
                                    <p className="text-xs text-center text-foreground/40">
                                        Usamos tu cuenta de Google para enviarte el acceso al evento en vivo de YouTube de forma segura.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                        <p className="text-xs text-foreground/40 mb-1">Cuenta conectada</p>
                                        <p className="font-medium text-white">{user.email}</p>
                                    </div>

                                    <Button
                                        onClick={handlePayment}
                                        className="w-full relative group overflow-hidden"
                                        disabled={isProcessing}
                                        size="lg"
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            {isProcessing ? (
                                                <>Procesando...</>
                                            ) : (
                                                <>
                                                    <Wallet size={20} />
                                                    Pagar con MercadoPago
                                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-xs text-foreground/40 mt-4 flex items-center justify-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            Pagos procesados de forma segura por MercadoPago
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                </div>
            </div>
        </main>
    );
}
