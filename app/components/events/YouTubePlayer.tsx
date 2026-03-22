'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize, Volume2, VolumeX, Radio } from 'lucide-react';

interface YouTubePlayerProps {
    videoId: string;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: {
            Player: new (id: string, config: object) => YouTubePlayerInstance;
            PlayerState: { PLAYING: number; PAUSED: number };
        };
        _ytApiLoading?: boolean;
    }
}

interface YouTubePlayerInstance {
    playVideo: () => void;
    pauseVideo: () => void;
    mute: () => void;
    unMute: () => void;
    setVolume: (v: number) => void;
    seekTo: (t: number, allowSeekAhead: boolean) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    destroy: () => void;
}

type YTEvent = { target: YouTubePlayerInstance; data: number };

/**
 * Load the YouTube IFrame API once across all component instances.
 * Chains callbacks so multiple mounts don't race each other.
 */
function loadYouTubeAPI(onReady: () => void) {
    if (window.YT?.Player) {
        onReady();
        return;
    }

    // Chain onto any existing callback to support multiple concurrent mounts
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
        prev?.();
        onReady();
    };

    if (!window._ytApiLoading) {
        window._ytApiLoading = true;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    }
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
    const playerRef = useRef<YouTubePlayerInstance | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Ref mirrors isPlaying so setTimeout closures never read a stale value
    const isPlayingRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isLive, setIsLive] = useState(true);

    const setPlayingState = (playing: boolean) => {
        isPlayingRef.current = playing;
        setIsPlaying(playing);
    };

    // ── Initialize / destroy player ──────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        loadYouTubeAPI(() => {
            if (cancelled) return;

            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }

            playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
                videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    iv_load_policy: 3,
                    disablekb: 1,
                    origin: window.location.origin,
                },
                events: {
                    onReady: (event: YTEvent) => {
                        if (cancelled) return;
                        setIsPlayerReady(true);
                        setDuration(event.target.getDuration());
                    },
                    onStateChange: (event: YTEvent) => {
                        if (cancelled) return;
                        setPlayingState(event.data === 1 /* YT.PlayerState.PLAYING */);
                    },
                },
            });
        });

        return () => {
            cancelled = true;
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
            setIsPlayerReady(false);
        };
    }, [videoId]);

    // ── Sync volume / mute → player ──────────────────────────────────────────
    useEffect(() => {
        const p = playerRef.current;
        if (!p || !isPlayerReady) return;
        if (isMuted) {
            p.mute();
        } else {
            p.unMute();
            p.setVolume(volume);
        }
    }, [volume, isMuted, isPlayerReady]);

    // ── Poll current time & live-edge detection ───────────────────────────────
    useEffect(() => {
        if (!isPlayerReady) return;
        const interval = setInterval(() => {
            const p = playerRef.current;
            if (!p) return;
            const current = p.getCurrentTime();
            const total = p.getDuration();
            setCurrentTime(current);
            if (total > 0) setDuration(total);
            setIsLive(total > 0 && (total - current) < 10);
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlayerReady]);

    // ── Controls auto-hide ────────────────────────────────────────────────────
    const scheduleHide = useCallback(() => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current) setShowControls(false);
        }, 3000);
    }, []);

    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        scheduleHide();
    }, [scheduleHide]);

    // ── Playback actions ──────────────────────────────────────────────────────
    const togglePlay = useCallback(() => {
        const p = playerRef.current;
        if (!p) return;
        isPlayingRef.current ? p.pauseVideo() : p.playVideo();
    }, []);

    /** First click shows controls; second click toggles play — just like YouTube */
    const handleVideoClick = useCallback(() => {
        if (!showControls) {
            setShowControls(true);
            scheduleHide();
        } else {
            togglePlay();
        }
    }, [showControls, scheduleHide, togglePlay]);

    const goLive = useCallback(() => {
        const p = playerRef.current;
        if (!p) return;
        p.seekTo(p.getDuration(), true);
    }, []);

    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const p = playerRef.current;
        if (!p) return;
        const seekTo = parseFloat(e.target.value);
        p.seekTo(seekTo, true);
        setCurrentTime(seekTo);
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const formatTime = (seconds: number): string => {
        if (!isFinite(seconds) || seconds < 0) return '0:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const parts = h > 0 ? [h, m, s] : [m, s];
        return parts.map((v, i) => (i === 0 ? String(v) : String(v).padStart(2, '0'))).join(':');
    };

    // Guard against NaN when duration is 0
    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div
            ref={containerRef}
            className="relative w-full pb-[56.25%] bg-club-black rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.08)] border border-club-yellow/5"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                if (isPlayingRef.current) setShowControls(false);
            }}
        >
            {/* YouTube player mount point */}
            <div
                id={`youtube-player-${videoId}`}
                className="absolute inset-0 pointer-events-none scale-[1.01]"
            />

            {/* Full-area click target — sits below the controls overlay */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={handleVideoClick}
            />

            {/* Controls overlay */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        key="controls"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-20 flex flex-col justify-between p-6 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none"
                    >
                        {/* ── Top: Live badge ── */}
                        <div className="flex justify-end items-start pointer-events-auto">
                            <motion.button
                                whileHover={!isLive ? { scale: 1.05, boxShadow: '0 0 20px rgba(255,215,0,0.3)' } : {}}
                                whileTap={!isLive ? { scale: 0.95 } : {}}
                                onClick={goLive}
                                disabled={isLive}
                                aria-label={isLive ? 'Estás en vivo' : 'Volver al vivo'}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs tracking-tight transition-all backdrop-blur-md shadow-xl border select-none ${
                                    isLive
                                        ? 'bg-red-600/90 text-white border-red-500/50 cursor-default'
                                        : 'bg-club-yellow/90 text-club-black border-club-yellow/50 hover:bg-club-yellow cursor-pointer'
                                }`}
                            >
                                <Radio size={14} className={isLive ? 'animate-pulse' : ''} />
                                {isLive ? 'EN VIVO AHORA' : 'VOLVER AL VIVO'}
                            </motion.button>
                        </div>

                        {/* ── Bottom: meta + timeline + controls ── */}
                        <div className="space-y-4 pointer-events-auto">
                            {/* Live dot + timestamps */}
                            <div className="flex items-center gap-3 px-1">
                                <div
                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                        isLive ? 'bg-red-500 animate-pulse' : 'bg-white/20'
                                    }`}
                                />
                                <span className="text-white/70 font-mono text-[11px] tabular-nums">
                                    {formatTime(currentTime)}
                                    <span className="text-white/30 mx-1.5">/</span>
                                    {formatTime(duration)}
                                </span>
                            </div>

                            {/* DVR timeline */}
                            <div className="px-1">
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 100}
                                    step={0.5}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    aria-label="Línea de tiempo"
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #FFD700 ${progressPct}%, rgba(255,255,255,0.12) ${progressPct}%)`,
                                    }}
                                />
                            </div>

                            {/* Control bar */}
                            <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl px-6 py-3 shadow-2xl">
                                {/* Left: play/pause + volume */}
                                <div className="flex items-center gap-6">
                                    <motion.button
                                        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={togglePlay}
                                        className="text-white hover:text-club-yellow transition-colors"
                                    >
                                        {isPlaying
                                            ? <Pause size={26} fill="currentColor" />
                                            : <Play size={26} fill="currentColor" className="ml-0.5" />
                                        }
                                    </motion.button>

                                    <div className="flex items-center gap-3 group/volume">
                                        <button
                                            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                                            onClick={() => setIsMuted(m => !m)}
                                            className="text-white/70 hover:text-white transition-colors"
                                        >
                                            {isMuted || volume === 0
                                                ? <VolumeX size={20} />
                                                : <Volume2 size={20} />
                                            }
                                        </button>
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={isMuted ? 0 : volume}
                                            onChange={e => setVolume(parseInt(e.target.value))}
                                            aria-label="Volumen"
                                            className="w-0 opacity-0 group-hover/volume:w-24 group-hover/volume:opacity-100 transition-all h-1 rounded-full appearance-none accent-club-yellow"
                                        />
                                    </div>
                                </div>

                                {/* Right: fullscreen */}
                                <button
                                    aria-label="Pantalla completa"
                                    onClick={() => containerRef.current?.requestFullscreen()}
                                    className="p-2 text-white/50 hover:text-club-yellow hover:bg-white/5 rounded-full transition-all"
                                >
                                    <Maximize size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
