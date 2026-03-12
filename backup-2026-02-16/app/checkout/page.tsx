'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trophy, Star, ArrowRight, Wallet } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);

    // Validación simple de Gmail
    const isGmail = (email: string) => email.toLowerCase().endsWith('@gmail.com');
    const isValid = formData.fullName.length > 3 && isGmail(formData.email);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setIsProcessing(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: [
                        {
                            id: 'entrada-general',
                            title: 'Entrada General - CDM vs Rival',
                            unit_price: 2500,
                            quantity: 1,
                        }
                    ],
                    payer: {
                        name: formData.fullName,
                        email: formData.email,
                    }
                }),
            });

            const data = await response.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                alert('Error al iniciar el pago. Por favor intente nuevamente.');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(error);
            alert('Hubo un error de conexión.');
            setIsProcessing(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-12">
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
                                    <h3 className="font-bold text-lg mb-1">Entrada General</h3>
                                    <p className="text-sm text-foreground/60">Sábado 15 de Febrero - 20:00 hs</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-club-yellow">$2.500</p>
                                    <p className="text-xs text-foreground/40">ARS</p>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-sm text-foreground/80">
                                    <Star className="text-club-yellow mr-3 fill-club-yellow" size={16} />
                                    Acceso garantizado al estadio
                                </li>
                                <li className="flex items-center text-sm text-foreground/80">
                                    <Star className="text-club-yellow mr-3 fill-club-yellow" size={16} />
                                    Acceso exclusivo al Stream en Vivo
                                </li>
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

                    {/* Formulario de Checkout */}
                    <div className="order-1 md:order-2">
                        <Card className="bg-club-black border-club-yellow/30 shadow-2xl shadow-club-yellow/5">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Datos del Hincha</h2>
                                <p className="text-sm text-foreground/60">
                                    Necesitamos tu correo de Google para habilitarte el acceso al vivo en YouTube.
                                </p>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-6">
                                <Input
                                    label="Nombre Completo"
                                    placeholder="Ej: Lionel Messi"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />

                                <div>
                                    <Input
                                        label="Correo Electrónico (Gmail)"
                                        type="email"
                                        placeholder="usuario@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className={formData.email && !isGmail(formData.email) ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {formData.email && !isGmail(formData.email) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Por favor ingresá una dirección @gmail.com para YouTube.
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full relative group overflow-hidden"
                                    disabled={!isValid || isProcessing}
                                    size="lg"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        {isProcessing ? (
                                            <>Procesando pago...</>
                                        ) : (
                                            <>
                                                <Wallet size={20} />
                                                Pagar con MercadoPago
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                    {/* Efecto de brillo en hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </Button>

                                <div className="text-center">
                                    <p className="text-xs text-foreground/40 mt-4 flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Pagos procesados de forma segura por MercadoPago
                                    </p>
                                </div>
                            </form>
                        </Card>
                    </div>

                </div>
            </div>
        </main>
    );
}
