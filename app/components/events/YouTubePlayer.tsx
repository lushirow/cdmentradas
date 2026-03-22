'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';

interface YouTubePlayerProps {
    videoId: string;
    titulo?: string;
    campeonato?: string;
}

function extractYouTubeId(urlOrId: string) {
    if (!urlOrId) return '';
    // Si ya es un ID de 11 caracteres, devolverlo
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
    
    // Intentar extraer de varios formatos de URLs
    const match = urlOrId.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : urlOrId;
}

export function YouTubePlayer({ videoId, titulo, campeonato }: YouTubePlayerProps) {
    const cleanVideoId = extractYouTubeId(videoId);
    const [isStarted, setIsStarted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Custom Player Controls State
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [volume, setVolume] = useState(100);

    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    // Fade out controls after 3 seconds of inactivity
    const resetControlsTimeout = () => {
        setShowControls(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    useEffect(() => {
        if (isStarted) {
            resetControlsTimeout();
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isStarted]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => {
                // Try to lock orientation to landscape on mobile
                try {
                    if (screen.orientation && (screen.orientation as any).lock) {
                        (screen.orientation as any).lock('landscape').catch(() => {});
                    }
                } catch (e) {}
            }).catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
            try {
                if (screen.orientation && screen.orientation.unlock) {
                    screen.orientation.unlock();
                }
            } catch (e) {}
        }
    };

    const sendCommand = (func: string, args: any[] = []) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func, args }),
                '*'
            );
        }
    };

    const togglePlay = () => {
        const nextState = !isPlaying;
        setIsPlaying(nextState);
        sendCommand(nextState ? 'playVideo' : 'pauseVideo');
        resetControlsTimeout();
    };

    const toggleMute = () => {
        const nextState = !isMuted;
        setIsMuted(nextState);
        sendCommand(nextState ? 'mute' : 'unMute');
        resetControlsTimeout();
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        sendCommand('setVolume', [newVolume]);
        resetControlsTimeout();
    };

    return (
        <div 
            ref={containerRef}
            className="absolute inset-0 w-full h-full bg-black select-none cursor-default group"
            onMouseMove={resetControlsTimeout}
            onTouchStart={resetControlsTimeout}
            onContextMenu={(e) => e.preventDefault()}
        >
            {!isStarted ? (
                // Pantalla de inicio personalizada (requerida para habilitar Autoplay en navegadores)
                <div 
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-club-black cursor-pointer hover:bg-club-gray transition-colors group"
                    onClick={() => setIsStarted(true)}
                >
                    <div className="w-20 h-20 bg-club-yellow rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                        <Play size={40} className="text-club-black ml-2" />
                    </div>
                    <p className="text-white font-bold text-lg md:text-xl">Haz clic para entrar a la transmisión</p>
                    <p className="text-foreground/50 text-sm mt-2">Protección Anti-Piratería Activada</p>
                </div>
            ) : (
                <>
                    {/* 
                        Iframe real de YouTube:
                        - enablejsapi=1 permite mandar comandos postMessage (Play/Pause/Vol).
                        - pointer-events-none evita que el usuario pueda cliquear el video pausándolo o yendo a YouTube.
                        - autoplay=1 forzará la reproducción (ahora permitida porque el usuario hizo clic en la pantalla anterior).
                    */}
                    <iframe
                        ref={iframeRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        src={`https://www.youtube-nocookie.com/embed/${cleanVideoId}?enablejsapi=1&autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&widget_referrer=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                        title="Transmisión Oficial CDM"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{ border: 'none' }}
                    />

                    {/* Top Overlay */}
                    <div className={`absolute top-0 left-0 w-full p-4 md:p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-50 flex items-start justify-between transition-opacity duration-300 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-start gap-4">
                            <button 
                                onClick={(e) => { e.stopPropagation(); window.history.back(); }}
                                className="p-2 sm:p-3 bg-black/40 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all cursor-pointer pointer-events-auto"
                                title="Volver"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                            </button>
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter drop-shadow-md">
                                    {titulo || 'Transmisión Oficial'}
                                </h1>
                                {campeonato && (
                                    <div className="flex items-center gap-2 text-club-yellow/90 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                                        <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{campeonato}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-red-600/20 text-red-500 px-3 py-1.5 rounded-sm shadow-lg border border-red-500/30">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                <span className="text-xs font-black uppercase tracking-widest">En Vivo</span>
                            </div>
                        </div>
                    </div>

                    {/* Overlay transparente para interceptar clics e impedir menú contextual */}
                    <div 
                        className="absolute inset-0 z-40 bg-transparent"
                        onClick={togglePlay}
                        onDoubleClick={toggleFullscreen}
                    />
                    
                    {/* Barra de Controles Personalizados inferior */}
                    <div className={`absolute bottom-0 left-0 w-full p-4 md:p-8 pt-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-50 flex items-center justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Izquierda (Play/Pause, Volumen) */}
                        <div className="flex items-center gap-2 sm:gap-6">
                            <button
                                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                className="p-3 sm:p-4 bg-transparent hover:bg-white/10 text-white rounded-full transition-all"
                                title={isPlaying ? "Pausar" : "Reproducir"}
                            >
                                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                            </button>

                            <div className="flex items-center gap-3 group/vol">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                    className="p-2 sm:p-3 bg-transparent hover:bg-white/10 text-white rounded-full transition-all"
                                    title={isMuted ? "Activar Sonido" : "Silenciar"}
                                >
                                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </button>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={volume} 
                                    onChange={handleVolumeChange}
                                    className="w-0 md:w-24 h-1 bg-white/30 rounded-full appearance-none outline-none cursor-pointer group-hover/vol:w-24 transition-all duration-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-club-yellow [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125"
                                    style={{
                                        background: `linear-gradient(to right, #FFC61E ${volume}%, rgba(255,255,255,0.3) ${volume}%)`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Derecha (Fullscreen) */}
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                            className="p-3 sm:p-4 bg-transparent hover:bg-white/10 text-white rounded-full transition-all"
                            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                        >
                            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
