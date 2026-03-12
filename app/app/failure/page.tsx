'use client';

import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function FailurePage() {
    return (
        <main className="min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Card className="max-w-md w-full text-center p-8 bg-club-gray border border-red-500/30 shadow-2xl">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="text-red-500" size={48} />
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">Pago Fallido</h1>
                    <p className="text-foreground/70 mb-8">
                        No se pudo procesar el pago. Por favor verificá tus datos o intentá con otro medio de pago.
                    </p>

                    <Link href="/" className="block">
                        <Button size="lg" className="w-full" variant="outline">
                            <RefreshCw className="mr-2" size={18} />
                            Intentar Nuevamente
                        </Button>
                    </Link>
                </Card>
            </div>
        </main>
    );
}
