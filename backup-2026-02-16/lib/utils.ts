export interface Buyer {
    id: string;
    name: string;
    email: string;
    date: string;
    status: 'paid' | 'pending';
    amount: number;
}

export const MOCK_BUYERS: Buyer[] = [
    { id: '1', name: 'Juan Pérez', email: 'juan.perez@email.com', date: '2026-01-25', status: 'paid', amount: 2500 },
    { id: '2', name: 'Maria Gonzalez', email: 'maria.g@email.com', date: '2026-01-25', status: 'paid', amount: 2500 },
    { id: '3', name: 'Carlos Rodriguez', email: 'carlos.rod@email.com', date: '2026-01-24', status: 'paid', amount: 2500 },
    { id: '4', name: 'Ana Martinez', email: 'ana.martinez@email.com', date: '2026-01-24', status: 'pending', amount: 2500 },
    { id: '5', name: 'Lucas Silva', email: 'lucas.silva@email.com', date: '2026-01-23', status: 'paid', amount: 2500 },
    { id: '6', name: 'Sofia Lopez', email: 'sofia.lopez@email.com', date: '2026-01-23', status: 'paid', amount: 2500 },
    { id: '7', name: 'Miguel Torres', email: 'm.torres@email.com', date: '2026-01-22', status: 'paid', amount: 2500 },
    { id: '8', name: 'Lucia Fernandez', email: 'lucia.f@email.com', date: '2026-01-22', status: 'pending', amount: 2500 },
    { id: '9', name: 'Pedro Sanchez', email: 'pedro.s@email.com', date: '2026-01-21', status: 'paid', amount: 2500 },
    { id: '10', name: 'Elena Diaz', email: 'elena.d@email.com', date: '2026-01-21', status: 'paid', amount: 2500 },
];

export function downloadEmailsTxt(buyers: Buyer[]) {
    // Filtramos solo los que pagaron
    const paidEmails = buyers
        .filter(b => b.status === 'paid')
        .map(b => b.email)
        .join(', '); // Separado por comas para YouTube

    const element = document.createElement("a");
    const file = new Blob([paidEmails], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "lista_youtube_cdm.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
}
