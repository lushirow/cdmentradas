'use client';

import { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { LogOut, User as UserIcon, LayoutDashboard, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
    user: User | null;
}

export function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.refresh();
    };

    if (!user) {
        return (
            <Link href="/login">
                <Button size="sm" variant="outline" className="border-club-yellow/50 text-club-yellow hover:bg-club-yellow hover:text-club-black">
                    Ingresar
                </Button>
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-foreground hover:text-club-yellow transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-club-yellow text-club-black flex items-center justify-center font-bold">
                    {user.nombre.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm font-medium truncate max-w-[100px]">
                    {user.nombre.split(' ')[0]}
                </span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-club-gray border border-club-yellow/20 rounded-lg shadow-xl z-50 py-1">
                        <div className="px-4 py-2 border-b border-club-yellow/10">
                            <p className="text-sm font-medium text-white truncate">{user.nombre}</p>
                            <p className="text-xs text-foreground/50 truncate">{user.email}</p>
                        </div>

                        {user.role === 'admin' && (
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:bg-club-yellow/10 hover:text-club-yellow transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <LayoutDashboard size={14} />
                                Admin Dashboard
                            </Link>
                        )}

                        <Link
                            href="/mis-entradas"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:bg-club-yellow/10 hover:text-club-yellow transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Ticket size={14} />
                            Mis Entradas
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                            <LogOut size={14} />
                            Cerrar Sesión
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
