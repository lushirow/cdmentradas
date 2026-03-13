'use client';

import { useRef, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CarouselProps {
    title: string;
    children: ReactNode;
}

export function Carousel({ title, children }: CarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current: container } = scrollContainerRef;
            const scrollAmount = direction === 'left' ? -container.offsetWidth * 0.75 : container.offsetWidth * 0.75;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full py-8 group">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-12 inline-flex items-center gap-2">
                {title}
            </h2>

            <div className="relative">
                {/* Left Arrow Controls */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 z-40 bg-black/60 hover:bg-black/90 text-white px-2 md:px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm hidden md:flex items-center justify-center focus:outline-none focus:opacity-100 disabled:opacity-0"
                >
                    <ChevronLeft size={36} />
                </button>

                {/* Scroll Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-4 md:px-12 pb-8 pt-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {children}
                </div>

                {/* Right Arrow Controls */}
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-40 bg-black/60 hover:bg-black/90 text-white px-2 md:px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm hidden md:flex items-center justify-center focus:outline-none focus:opacity-100"
                >
                    <ChevronRight size={36} />
                </button>
            </div>
            
            {/* Custom CSS to hide scrollbar cross-browser */}
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
