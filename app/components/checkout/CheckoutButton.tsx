'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
    eventId: number;
    price: number;
    disabled?: boolean;
}

export function CheckoutButton({ eventId, price, disabled }: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId }),
            });

            // Handle specific error cases
            if (!response.ok) {
                if (response.status === 401) {
                    // User not logged in -> Redirect to login
                    const returnUrl = `/evento/${eventId}`;
                    router.push(`/login?from=${encodeURIComponent(returnUrl)}`);
                    return;
                }

                const data = await response.json();
                throw new Error(data.error || 'Error al iniciar pago');
            }

            const { init_point } = await response.json();

            if (init_point) {
                // Redirect to MercadoPago
                window.location.href = init_point;
            } else {
                throw new Error('No se recibió link de pago');
            }

        } catch (error: any) {
            console.error('Checkout error:', error);
            // Show explicit alert to user so they know what happened
            alert(`⚠️ ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="lg"
            className="w-full text-lg py-6 font-bold"
            onClick={handleCheckout}
            disabled={disabled || loading}
        >
            {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <ShoppingCart className="mr-2 h-5 w-5" />
            )}
            {loading ? 'Procesando...' : `Comprar Entrada ($${price / 100})`}
        </Button>
    );
}
