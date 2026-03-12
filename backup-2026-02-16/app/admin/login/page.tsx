'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulación simple de login
        if (email === 'admin@cdm.com' && password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Credenciales inválidas');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-club-black p-4">
            <div className="absolute inset-0 bg-gradient-shield opacity-10 pointer-events-none" />

            <Card className="w-full max-w-md bg-club-black border-club-yellow/30 shadow-2xl shadow-club-yellow/10">
                <div className="text-center mb-8">
                    <Image
                        src="/escudo-principal.png"
                        alt="CDM"
                        width={80}
                        height={80}
                        className="mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-club-yellow">Acceso Administrativo</h1>
                    <p className="text-foreground/60 text-sm mt-2">Ingresá tus credenciales para gestionar</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        placeholder="admin@cdm.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full flex items-center justify-center gap-2">
                        <Lock size={18} />
                        Ingresar al Panel
                    </Button>
                </form>
            </Card>
        </main>
    );
}
