'use client';

import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
    return (
        <main className="min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-16 pt-32 flex justify-center">
                <Card className="max-w-md w-full text-center p-8 bg-club-gray border border-green-500/30 shadow-2xl">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-500" size={48} />
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">¡Pago Exitoso!</h1>
                    <p className="text-foreground/70 mb-8">
                        Tu entrada ha sido confirmada. Te enviamos los detalles por email.
                    </p>

                    <div className="space-y-4">
                        <p className="text-sm bg-club-yellow/10 text-club-yellow p-4 rounded-lg">
                            Podrás acceder a la transmisión 15 minutos antes del partido desde la página del evento o desde "Mis Entradas".
                        </p>

                        <Link href="/" className="block">
                            <Button size="lg" className="w-full">
                                <Home className="mr-2" size={18} />
                                Volver al Inicio
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </main>
    );
}
