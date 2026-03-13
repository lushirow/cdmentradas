'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download, Mail, Users, CheckCircle, CalendarDays, Plus, Edit, Tv } from 'lucide-react';
import { Event } from '@/types';

export interface Buyer {
    id: number;
    name: string;
    email: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected' | 'refunded';
    amount: number;
}

interface DashboardClientProps {
    buyers: Buyer[];
    events: Event[];
}

export default function DashboardClient({ buyers, events }: DashboardClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'ventas' | 'eventos'>('ventas');

    const handleDownload = () => {
        // Generate text file content
        const emails = buyers
            .filter(b => b.status === 'approved') // Only paid users get access
            .map(b => b.email)
            .join('\n'); // Gmail copy-paste format

        const element = document.createElement("a");
        const file = new Blob([emails], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `youtube_access_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(element); // Required for FireFox
        element.click();
    };

    const handleSendEmails = () => {
        alert('Funcionalidad en desarrollo: Enviar correos con el link del vivo.');
    };

    const totalRevenue = buyers
        .filter(b => b.status === 'approved')
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 pt-28 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-club-yellow mb-2">Panel de Control</h1>
                        <p className="text-foreground/60">Gestión de ventas y eventos</p>
                    </div>

                    <div className="flex bg-club-gray rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setActiveTab('ventas')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ventas'
                                ? 'bg-club-yellow text-background'
                                : 'text-foreground/70 hover:text-white'
                                }`}
                        >
                            Ventas
                        </button>
                        <button
                            onClick={() => setActiveTab('eventos')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'eventos'
                                ? 'bg-club-yellow text-background'
                                : 'text-foreground/70 hover:text-white'
                                }`}
                        >
                            Eventos
                        </button>
                    </div>
                </div>

                {activeTab === 'ventas' ? (
                    <>
                        <div className="flex justify-end mb-6 gap-3">
                            <Button onClick={handleSendEmails} variant="secondary" size="sm">
                                <Mail className="mr-2" size={16} />
                                Enviar Accesos
                            </Button>
                            <Button onClick={handleDownload} size="sm">
                                <Download className="mr-2" size={16} />
                                Descargar Lista YouTube
                            </Button>
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
                                    <p className="text-sm text-foreground/60">Confirmadas</p>
                                    <p className="text-2xl font-bold">{buyers.filter(b => b.status === 'approved').length}</p>
                                </div>
                            </Card>

                            <Card className="flex items-center gap-4">
                                <div className="p-3 bg-club-yellow/10 rounded-lg">
                                    <span className="text-2xl font-bold text-club-yellow">$</span>
                                </div>
                                <div>
                                    <p className="text-sm text-foreground/60">Recaudación Total</p>
                                    <p className="text-2xl font-bold text-club-yellow">
                                        ${(totalRevenue / 100).toLocaleString('es-AR')}
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
                                                <td className="py-4 text-foreground/60">{new Date(buyer.date).toLocaleDateString()}</td>
                                                <td className="py-4">
                                                    <span className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${buyer.status === 'approved'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'}
                            `}>
                                                        {buyer.status === 'approved' ? 'Pagado' : 'Pendiente'}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right pr-4 font-mono">
                                                    ${(buyer.amount / 100).toLocaleString('es-AR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                ) : (
                    <>
                        <div className="flex justify-end mb-6">
                            <Button onClick={() => router.push('/admin/dashboard/events/new')} size="sm">
                                <Plus className="mr-2" size={16} />
                                Nuevo Evento
                            </Button>
                        </div>

                        <Card className="overflow-hidden">
                            <h2 className="text-xl font-bold mb-6 text-foreground">Eventos Programados</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 text-foreground/60 text-sm">
                                            <th className="pb-4 pl-4">Título</th>
                                            <th className="pb-4">Fecha</th>
                                            <th className="pb-4">Precio</th>
                                            <th className="pb-4">Estado</th>
                                            <th className="pb-4 text-right pr-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {events.map((event) => (
                                            <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 pl-4 font-medium flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-club-gray flex items-center justify-center overflow-hidden">
                                                        {event.foto_portada_url ? (
                                                            <img src={event.foto_portada_url} alt={event.titulo} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <CalendarDays className="text-white/50" size={16} />
                                                        )}
                                                    </div>
                                                    {event.titulo}
                                                </td>
                                                <td className="py-4 text-foreground/80">
                                                    {new Date(event.fecha_hora).toLocaleString('es-AR', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    })}
                                                </td>
                                                <td className="py-4 text-foreground/80 font-mono">
                                                    ${(event.precio / 100).toLocaleString('es-AR')}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`text-xs ${event.ventas_habilitadas ? 'text-green-400' : 'text-red-400'}`}>
                                                            {event.ventas_habilitadas ? 'Ventas ON' : 'Ventas OFF'}
                                                        </span>
                                                        <span className={`text-xs ${event.stream_enabled ? 'text-blue-400' : 'text-gray-400'}`}>
                                                            {event.stream_enabled ? 'Stream ON' : 'Stream OFF'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right pr-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => window.open(`/watch/${event.id}`, '_blank')}
                                                            title="Ver Stream (Admin)"
                                                        >
                                                            <Tv size={16} className="text-blue-400" />
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => router.push(`/admin/dashboard/events/${event.id}/edit`)}
                                                            title="Editar Evento"
                                                        >
                                                            <Edit size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {events.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-foreground/50">
                                                    No hay eventos creados todavía.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                )}
            </main>
        </div>
    );
}

