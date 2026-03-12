'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Send, Users } from 'lucide-react';

interface ChatMessage {
    id: string;
    user: string;
    text: string;
    timestamp: Date;
    isSystem: boolean;
}

const SIMULATED_MESSAGES = [
    "¡Vamos Malanzán! 💛🖤",
    "¿A qué hora empieza el partido?",
    "Saludos desde La Rioja capital",
    "Hoy ganamos seguro, puro aguante",
    "¿Se corta un poco o soy yo?",
    "Perfecto acá, 1080p espectacular",
    "Ese mediocampo hoy tiene que volar",
    "¡Dale campeón!",
    "Presente apoyando al club 🏆"
];

const SIMULATED_USERS = [
    "JuanP_LR", "Marta1985", "LocoXMalanzan", "CDM_Fan_87",
    "Socio_4502", "Gaby_Riojana", "ElPibeDelClub", "Carlos_M"
];

export function LiveChat({ currentUser }: { currentUser: string }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [viewers, setViewers] = useState(45);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Simulated Chat Logic
    useEffect(() => {
        // Initial system message
        setMessages([
            {
                id: 'sys-1',
                user: 'Sistema',
                text: 'Bienvenido al chat en vivo del Club Deportivo Malanzán. Por favor, mantén el respeto.',
                timestamp: new Date(),
                isSystem: true
            }
        ]);

        // Random new messages
        const messageInterval = setInterval(() => {
            if (Math.random() > 0.4) {
                const randomMsg = SIMULATED_MESSAGES[Math.floor(Math.random() * SIMULATED_MESSAGES.length)];
                const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];

                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    user: randomUser,
                    text: randomMsg,
                    timestamp: new Date(),
                    isSystem: false
                }]);
            }
        }, 5000);

        // Fluctuate viewers
        const viewersInterval = setInterval(() => {
            setViewers(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                return Math.max(12, prev + change);
            });
        }, 7000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(viewersInterval);
        };
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            user: currentUser,
            text: inputValue.trim(),
            timestamp: new Date(),
            isSystem: false
        }]);
        setInputValue('');
    };

    return (
        <Card className="flex flex-col h-[600px] lg:h-full bg-club-gray border border-club-yellow/10 overflow-hidden">
            {/* Chat Head */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-club-gray/80">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Chat en Vivo
                </h3>
                <div className="flex items-center gap-1 text-club-yellow text-sm font-semibold">
                    <Users size={14} />
                    {viewers}
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-club-yellow/20 scrollbar-track-transparent">
                {messages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                        {msg.isSystem ? (
                            <div className="text-center text-club-yellow/60 text-xs italic my-4">
                                {msg.text}
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <span className={`font-bold ${msg.user === currentUser ? 'text-club-yellow' : 'text-foreground/80'}`}>
                                    {msg.user}
                                    <span className="text-[10px] text-foreground/40 font-normal ml-2">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </span>
                                <span className="text-white mt-1 break-words">{msg.text}</span>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-club-black border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-club-yellow transition-colors placeholder:text-foreground/40"
                    />
                    <Button type="submit" size="sm" className="px-3" disabled={!inputValue.trim()}>
                        <Send size={16} />
                    </Button>
                </div>
            </form>
        </Card>
    );
}
