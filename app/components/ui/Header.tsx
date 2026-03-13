'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/lib/auth';
import { UserMenu } from '@/components/auth/UserMenu';

export function Header({ user }: { user?: User | null }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl py-2' : 'bg-gradient-to-b from-black/80 to-transparent py-6'
            }`}
        >
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo y Nombre */}
                <Link href="/" className="flex items-center gap-4 group">
                    <Image
                        src="/logocdm.png"
                        alt="Escudo CDM"
                        width={isScrolled ? 50 : 65}
                        height={isScrolled ? 50 : 65}
                        className="drop-shadow-2xl transition-all duration-300"
                    />
                    <div className="hidden md:block">
                        <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase group-hover:text-club-yellow transition-colors duration-300">
                            CD <span className="text-club-yellow">Malanzán</span>
                        </h1>
                        <div className="flex items-center gap-1 mt-1 opacity-80">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="text-club-yellow fill-club-yellow" size={10} />
                            ))}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white ml-2">Campeón 2022</span>
                        </div>
                    </div>
                </Link>

                {/* Navigation & User Menu */}
                <div className="flex items-center gap-8">
                    <nav className="hidden lg:flex items-center gap-8 font-semibold text-sm tracking-widest uppercase">
                        <Link href="/" className="text-white/80 hover:text-white hover:scale-105 transition-all">
                            Inicio
                        </Link>
                        <Link href="/#entradas" className="text-white/80 hover:text-white hover:scale-105 transition-all">
                            Cartelera
                        </Link>
                    </nav>

                    <UserMenu user={user || null} />
                </div>
            </div>
        </header>
    );
}
