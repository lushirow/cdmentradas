'use client';

import { Hero } from '@/components/ui/Hero';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-club-black">
            <Hero
                title="¡Pago Exitoso!"
                subtitle="Ya sos parte de la fiesta del campeón."
            >
                <div className="flex flex-col items-center justify-center">
                    <CheckCircle className="text-green-500 mb-6" size={80} />

                    <div className="bg-club-gray p-6 rounded-xl border border-club-yellow/20 max-w-lg w-full mb-8">
                        <h3 className="text-xl font-bold text-club-yellow mb-4 text-center">Detalles de tu compra</h3>
                        <p className="text-foreground/80 mb-2">Te enviamos el comprobante y los accesos a tu correo electrónico.</p>
                        <p className="text-sm text-foreground/60 text-center mt-4">
                            Si no lo recibís en unos minutos, revisá tu carpeta de SPAM.
                        </p>
                    </div>

                    <Link href="/">
                        <Button variant="outline">
                            <Home className="mr-2" size={20} />
                            Volver al Inicio
                        </Button>
                    </Link>
                </div>
            </Hero>
        </main>
    );
}
