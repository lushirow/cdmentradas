export interface User {
    email: string;
    nombre: string;
    role: 'socio' | 'admin';
    last_session_id?: string;
    created_at?: Date;
}

export interface Event {
    id: number;
    titulo: string;
    fecha_hora: Date;
    precio: number; // en centavos (ej: 250000 = $2500)
    foto_portada_url?: string;
    youtube_video_id?: string;
    stream_enabled: boolean;
    ventas_habilitadas: boolean;
    ubicacion?: string;
    created_at?: Date;
}

export interface Purchase {
    id: number;
    email: string;
    event_id: number;
    mercadopago_payment_id?: string;
    mercadopago_preference_id?: string;
    status: 'pending' | 'approved' | 'rejected' | 'refunded';
    amount: number;
    cupon_compensacion: boolean;
    created_at?: Date;
}

export interface CreateEventDTO {
    titulo: string;
    fecha_hora: string; // ISO string
    precio: number;
    foto_portada_url?: string;
    ubicacion?: string;
}

export interface UpdateEventDTO {
    titulo?: string;
    fecha_hora?: string;
    precio?: number;
    foto_portada_url?: string;
    youtube_video_id?: string;
    stream_enabled?: boolean;
    ventas_habilitadas?: boolean;
    ubicacion?: string;
}
