'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewEventClient() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        titulo: '',
        fecha_hora: '',
        precio: '',
        foto_portada_url: '',
        ubicacion: '',
        campeonato: 'Liga del Sur Riojano',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Basic validation
            if (!formData.titulo || !formData.fecha_hora || !formData.precio) {
                throw new Error('Por favor, completa los campos obligatorios.');
            }

            const payload = {
                titulo: formData.titulo,
                // Supabase expects a valid timestamp format. 
                // We send the 'YYYY-MM-DDThh:mm' string exactly as is 
                // so Postgres stores the exact wall-clock time instead of 
                // shifting it by +3 hours into UTC.
                fecha_hora: formData.fecha_hora,
                // Convert price to cents
                precio: Math.round(parseFloat(formData.precio) * 100),
                foto_portada_url: formData.foto_portada_url || undefined,
                ubicacion: formData.ubicacion || undefined,
                campeonato: formData.campeonato || 'Liga del Sur Riojano',
            };

            const response = await fetch('/api/admin/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create event');
            }

            router.push('/admin/dashboard');
            router.refresh(); // Refresh data on the dashboard
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-2xl">
            <Button
                variant="secondary"
                size="sm"
                onClick={() => router.back()}
                className="mb-6 flex items-center"
            >
                <ArrowLeft size={16} className="mr-2" />
                Volver
            </Button>

            <h1 className="text-3xl font-bold text-club-yellow mb-8">Crear Nuevo Evento</h1>

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
                            placeholder="Ej: CDM vs. Portezuelo"
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
                                className="w-full bg-background border border-white/20 rounded-md p-3 focus:outline-none focus:border-club-yellow transition-colors color-scheme-dark"
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
                                    placeholder="2500"
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
                            placeholder="https://ejemplo.com/foto.jpg"
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

                    <div className="space-y-2">
                        <label htmlFor="campeonato" className="block text-sm font-medium">
                            Campeonato / Competición
                        </label>
                        <input
                            id="campeonato"
                            name="campeonato"
                            type="text"
                            value={formData.campeonato}
                            onChange={handleChange}
                            placeholder="Ej: Liga del Sur Riojano"
                            className="w-full bg-background border border-white/20 rounded-md p-3 focus:outline-none focus:border-club-yellow transition-colors"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center"
                        >
                            <Save size={18} className="mr-2" />
                            {isLoading ? 'Guardando...' : 'Crear Evento'}
                        </Button>
                    </div>
                </form>
            </Card>
        </main>
    );
}
