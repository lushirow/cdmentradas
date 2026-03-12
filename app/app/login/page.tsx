'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LogIn } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { Suspense } from 'react';

function LoginContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const from = searchParams.get('from') || '/';

    const handleGoogleLogin = () => {
        window.location.href = `/api/auth/callback/google?from=${encodeURIComponent(from)}`;
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-club-black via-club-gray to-club-black p-4">
            <Card className="max-w-md w-full text-center p-8 bg-club-gray border-2 border-club-yellow/20">
                {/* Logo/Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-club-yellow rounded-full flex items-center justify-center">
                        <LogIn size={48} className="text-club-black" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-club-yellow mb-2">
                    El Canario Virtual
                </h1>
                <p className="text-foreground/70 mb-8">
                    Ingresá con tu cuenta de Google para comprar entradas
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">
                            {error === 'auth_failed'
                                ? 'Error al iniciar sesión. Por favor, intentá nuevamente.'
                                : 'Ocurrió un error inesperado.'}
                        </p>
                    </div>
                )}

                {/* Google Login Button */}
                <Button
                    size="lg"
                    className="w-full flex items-center justify-center gap-3"
                    onClick={handleGoogleLogin}
                >
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuar con Google
                </Button>

                {/* Additional Info */}
                <p className="text-foreground/50 text-xs mt-6">
                    Al ingresar, aceptás nuestros términos y condiciones
                </p>
            </Card>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-club-black"><div className="text-club-yellow">Cargando...</div></main>}>
            <LoginContent />
        </Suspense>
    );
}
