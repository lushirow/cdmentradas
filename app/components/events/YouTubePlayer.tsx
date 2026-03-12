'use client';

import { useEffect, useState } from 'react';

interface YouTubePlayerProps {
    videoId: string;
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
    return (
        <div className="relative w-full pb-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl border border-club-yellow/20">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                title="Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />

            {/* Overlay transparente para evitar clicks directos (seguridad anti-clickjacking básica) */}
            <div className="absolute inset-0 z-10 opacity-0 bg-transparent pointer-events-none" />
        </div>
    );
}
