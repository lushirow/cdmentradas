import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
    return (
        <div
            className={`
        bg-club-gray border border-club-yellow/20 rounded-xl p-6
        ${hover ? 'hover:border-club-yellow/40 hover:shadow-lg hover:shadow-club-yellow/10 transition-all duration-300' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
