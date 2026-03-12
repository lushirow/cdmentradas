'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MOCK_BUYERS, downloadEmailsTxt, Buyer } from '@/lib/utils';
import { Download, Mail, Users, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar autenticación
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
            return;
        }

        // Cargar datos (simulado)
        setTimeout(() => {
            setBuyers(MOCK_BUYERS);
            setIsLoading(false);
        }, 500);
    }, [router]);

    const handleDownload = () => {
        downloadEmailsTxt(buyers);
    };

    const handleSendEmails = () => {
        alert('Simulación: Enviando correos con el link del vivo a a todos los usuarios pagos...');
    };

    const totalRevenue = buyers
        .filter(b => b.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

    if (isLoading) {
        return <div className="min-h-screen bg-club-black text-club-yellow flex items-center justify-center">Cargando Panel...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-club-yellow mb-2">Panel de Control</h1>
                        <p className="text-foreground/60">Gestión de ventas y accesos</p>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleSendEmails} variant="secondary" size="sm">
                            <Mail className="mr-2" size={16} />
                            Enviar Accesos
                        </Button>
                        <Button onClick={handleDownload} size="sm">
                            <Download className="mr-2" size={16} />
                            Descargar Lista YouTube
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-club-yellow/10 rounded-lg">
                            <Users className="text-club-yellow" size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-foreground/60">Total Entradas</p>
                            <p className="text-2xl font-bold">{buyers.length}</p>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-foreground/60">Pagadas</p>
                            <p className="text-2xl font-bold">{buyers.filter(b => b.status === 'paid').length}</p>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-club-yellow/10 rounded-lg">
                            <span className="text-2xl font-bold text-club-yellow">$</span>
                        </div>
                        <div>
                            <p className="text-sm text-foreground/60">Recaudación Total</p>
                            <p className="text-2xl font-bold text-club-yellow">
                                ${totalRevenue.toLocaleString()}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Buyers Table */}
                <Card className="overflow-hidden">
                    <h2 className="text-xl font-bold mb-6 text-foreground">Últimas Ventas</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-foreground/60 text-sm">
                                    <th className="pb-4 pl-4">Comprador</th>
                                    <th className="pb-4">Email</th>
                                    <th className="pb-4">Fecha</th>
                                    <th className="pb-4">Estado</th>
                                    <th className="pb-4 text-right pr-4">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {buyers.map((buyer) => (
                                    <tr key={buyer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4 font-medium">{buyer.name}</td>
                                        <td className="py-4 text-foreground/80">{buyer.email}</td>
                                        <td className="py-4 text-foreground/60">{buyer.date}</td>
                                        <td className="py-4">
                                            <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${buyer.status === 'paid'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'}
                      `}>
                                                {buyer.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4 font-mono">
                                            ${buyer.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
}
