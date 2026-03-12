import Image from 'next/image';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/lib/auth';
import { UserMenu } from '@/components/auth/UserMenu';

export function Header({ user }: { user?: User | null }) {
    return (
        <header className="sticky top-0 z-50 bg-club-black/95 backdrop-blur-sm border-b border-club-yellow/20">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo y Nombre */}
                    <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
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
                    </Link>

                    {/* Navigation & User Menu */}
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-foreground/80 hover:text-club-yellow transition-colors">
                                Inicio
                            </Link>
                            <Link href="/#entradas" className="text-foreground/80 hover:text-club-yellow transition-colors">
                                Entradas
                            </Link>
                        </nav>

                        <div className="h-6 w-px bg-club-yellow/20 hidden md:block" />

                        <UserMenu user={user || null} />
                    </div>
                </div>
            </div>
        </header>
    );
}
