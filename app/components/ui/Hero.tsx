import { ReactNode } from 'react';

interface HeroProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
    backgroundImage?: string;
}

export function Hero({ title, subtitle, children, backgroundImage }: HeroProps) {
    return (
        <section
            className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
            style={backgroundImage ? {
                backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.9)), url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            } : {}}
        >
            <div className="container mx-auto px-4 text-center z-10">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-club-yellow drop-shadow-2xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
                {children}
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-club-black/50 to-club-black pointer-events-none" />
        </section>
    );
}
