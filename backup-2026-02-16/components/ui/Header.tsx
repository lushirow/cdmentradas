import Image from 'next/image';
import { Star } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-club-black/95 backdrop-blur-sm border-b border-club-yellow/20">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo y Nombre */}
                    <div className="flex items-center gap-4">
                        <Image
                            src="/escudo-principal.png"
                            alt="Escudo CDM"
                            width={60}
                            height={60}
                            className="drop-shadow-lg"
                        />
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-club-yellow">
                                Club Deportivo Malanzán
                            </h1>
                            <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="text-club-yellow fill-club-yellow" size={10} />
                                ))}
                                <span className="text-xs text-foreground/60 ml-2">Campeón 2022</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation (opcional para futuro) */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#" className="text-foreground/80 hover:text-club-yellow transition-colors">
                            Inicio
                        </a>
                        <a href="#entradas" className="text-foreground/80 hover:text-club-yellow transition-colors">
                            Entradas
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}
