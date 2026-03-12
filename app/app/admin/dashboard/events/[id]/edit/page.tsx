'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { Event } from '@/types';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        titulo: '',
        fecha_hora: '',
        precio: '',
        foto_portada_url: '',
        youtube_video_id: '',
        stream_enabled: false,
        ventas_habilitadas: false,
        ubicacion: '',
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/admin/events/${id}`);
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to fetch event');
                }
                const event: Event = await response.json();

                // The database stores "2024-03-01T21:55:00.000Z" 
                // We want to extract just the YYYY-MM-DDThh:mm part matching local time.
                // Assuming the database returns the exact literal string if we configured 
                // the column without timezone, OR returns UTC string if it has timezone.
                // It's safest to construct a local ISO format by adjusting the offset:
                const date = new Date(event.fecha_hora);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                const formattedDate = date.toISOString().slice(0, 16);

                setFormData({
                    titulo: event.titulo,
                    fecha_hora: formattedDate,
                    precio: (event.precio / 100).toString(), // convert from cents to ARS
                    foto_portada_url: event.foto_portada_url || '',
                    youtube_video_id: event.youtube_video_id || '',
                    stream_enabled: event.stream_enabled,
                    ventas_habilitadas: event.ventas_habilitadas,
                    ubicacion: event.ubicacion || '',
                });
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Unknown error');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            if (!formData.titulo || !formData.fecha_hora || !formData.precio) {
                throw new Error('Por favor, completa los campos obligatorios.');
            }

            const payload = {
                titulo: formData.titulo,
                fecha_hora: formData.fecha_hora,
                precio: Math.round(parseFloat(formData.precio) * 100),
                foto_portada_url: formData.foto_portada_url || undefined,
                youtube_video_id: formData.youtube_video_id || undefined,
                stream_enabled: formData.stream_enabled,
                ventas_habilitadas: formData.ventas_habilitadas,
                ubicacion: formData.ubicacion || undefined,
            };

            const response = await fetch(`/api/admin/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update event');
            }

            router.push('/admin/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer y puede fallar si ya hay compras asociadas.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/events/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete event');
            }

            router.push('/admin/dashboard');
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <Loader2 className="animate-spin text-club-yellow" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Volver
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 size={16} className="mr-2" />}
                        Eliminar Evento
                    </Button>
                </div>

                <h1 className="text-3xl font-bold text-club-yellow mb-8">Editar Evento</h1>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="titulo" className="block text-sm font-medium">
                                Título del Evento *
                            </label>
                            <input
                                id="titulo"
                                name="titulo"
                                type="text"
                                required
                                value={formData.titulo}
                                onChange={handleChange}
                                className="w-full bg-background border border-white/20 rounded-md p-3 focus:outline-none focus:border-club-yellow transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="fecha_hora" className="block text-sm font-medium">
                                    Fecha y Hora *
                                </label>
                                <input
                                    id="fecha_hora"
                                    name="fecha_hora"
                                    type="datetime-local"
                                    required
                                    value={formData.fecha_hora}
                                    onChange={handleChange}
                                    className="w-full bg-background border border-white/20 rounded-md p-3 focus:outline-none focus:border-club-yellow transition-colors"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="precio" className="block text-sm font-medium">
                                    Precio de Entrada (ARS) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-foreground/50">$</span>
                                    <input
                                        id="precio"
                                        name="precio"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        className="w-full bg-background border border-white/20 rounded-md p-3 pl-8 focus:outline-none focus:border-club-yellow transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="foto_portada_url" className="block text-sm font-medium">
                                URL Foto de Portada (Opcional)
                            </label>
                            <input
                                id="foto_portada_url"
                                name="foto_portada_url"
                                type="url"
                                value={formData.foto_portada_url}
                                onChange={handleChange}
                                className="w-full bg-background border border-white/20 rounded-md p-3 focus:outline-none focus:border-club-yellow transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="ubicacion" className="block text-sm font-medium">
                                Ubicación (Estadio/Cancha)
                            </label>
                            <input
                                id="ubicacion"
                                name="ubicacion"
                                type="text"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                placeholder="Ej: La Olla - Malanzán, La Rioja"
                                className="w-full bg-background border border-white/20 rounded-md p-3 focus:outline-none focus:border-club-yellow transition-colors"
                            />
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <h3 className="text-lg font-semibold text-club-yellow mb-4">Configuración del Streaming</h3>

                            <div className="space-y-2">
                                <label htmlFor="youtube_video_id" className="block text-sm font-medium">
                                    ID del Video de YouTube (Opcional)
                                </label>
                                <input
                                    id="youtube_video_id"
                                    name="youtube_video_id"
                                    type="text"
                                    value={formData.youtube_video_id}
                                    onChange={handleChange}
                                    placeholder="Ej: dQw4w9WgXcQ"
                                    className="w-full bg-background border border-white/20 rounded-md p-3 focus:outline-none focus:border-club-yellow transition-colors"
                                />
                                <p className="text-xs text-foreground/50">Solo el ID final del enlace, no la URL completa.</p>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="stream_enabled"
                                    name="stream_enabled"
                                    checked={formData.stream_enabled}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-club-yellow"
                                />
                                <label htmlFor="stream_enabled" className="text-sm cursor-pointer select-none">
                                    Habilitar acceso al Streaming para compradores
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <h3 className="text-lg font-semibold text-club-yellow mb-4">Ventas</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="ventas_habilitadas"
                                    name="ventas_habilitadas"
                                    checked={formData.ventas_habilitadas}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-club-yellow"
                                />
                                <label htmlFor="ventas_habilitadas" className="text-sm cursor-pointer select-none">
                                    Habilitar compra de entradas
                                </label>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
