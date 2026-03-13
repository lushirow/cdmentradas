'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export function ViewersCounter() {
    const [viewers, setViewers] = useState(45);

    useEffect(() => {
        const viewersInterval = setInterval(() => {
            setViewers(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                return Math.max(12, prev + change);
            });
        }, 7000);

        return () => clearInterval(viewersInterval);
    }, []);

    return (
        <div className="flex items-center gap-2 text-club-yellow text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <Users size={16} />
            {viewers} <span className="hidden sm:inline">espectadores</span>
        </div>
    );
}
