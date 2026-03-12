'use client';

import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Home } from 'lucide-react';
import Link from 'next/link';

export default function PendingPage() {
    return (
        <main className="min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Card className="max-w-md w-full text-center p-8 bg-club-gray border border-yellow-500/30 shadow-2xl">
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="text-yellow-500" size={48} />
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">Pago Pendiente</h1>
                    <p className="text-foreground/70 mb-8">
                        Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
                    </p>

                    <Link href="/" className="block">
                        <Button size="lg" className="w-full">
                            <Home className="mr-2" size={18} />
                            Volver al Inicio
                        </Button>
                    </Link>
                </Card>
            </div>
        </main>
    );
}
