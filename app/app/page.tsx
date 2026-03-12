import { Header } from '@/components/ui/Header';
import { Hero } from '@/components/ui/Hero';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import { getMany } from '@/lib/db';
import { Event } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic'; // Ensure we always get latest event

async function getNextEvent() {
  try {
    // We construct the current date and shift it to Argentina Time
    // so we evaluate "upcoming" literally against the localized wallclock
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const arTimeStr = now.toISOString().slice(0, 19).replace('T', ' ');

    const events = await getMany<Event>(
      'SELECT * FROM events WHERE fecha_hora > $1 ORDER BY fecha_hora ASC LIMIT 1',
      [arTimeStr]
    );
    return events[0] || null;
  } catch (error) {
    console.error('Error fetching next event:', error);
    return null;
  }
}

export default async function Home() {
  const nextEvent = await getNextEvent();
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen">
      <Header user={user} />

      {/* Hero Section */}
      <Hero
        title="Club Deportivo Malanzán"
        subtitle="Campeón Liga del Sur Riojano 2022 🏆"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1984, 1985, 2022, 1986, 1987].map((year) => (
            <div key={year} className="flex flex-col items-center">
              <Star className="text-club-yellow fill-club-yellow" size={year === 2022 ? 32 : 20} />
              <span className="text-xs mt-1 text-club-yellow font-bold">{year}</span>
            </div>
          ))}
        </div>

        {nextEvent && (
          <div className="mt-8 animate-fade-in-up">
            <p className="text-club-yellow font-bold tracking-widest uppercase text-sm mb-2">Próximo Partido</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-md">
              {nextEvent.titulo}
            </h3>
          </div>
        )}
      </Hero>

      {/* Event Section */}
      <section className="py-16 px-4" id="entradas">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-club-yellow">
            {nextEvent ? 'Venta de Entradas' : 'Próximamente'}
          </h2>

          {nextEvent ? (
            <EventCard event={nextEvent} />
          ) : (
            <Card className="text-center py-12 max-w-2xl mx-auto">
              <Calendar className="mx-auto mb-4 text-club-yellow/50" size={64} />
              <h3 className="text-2xl font-bold text-white mb-2">No hay partidos programados</h3>
              <p className="text-foreground/60">
                Estamos definiendo la fecha del próximo encuentro. <br />
                Seguinos en redes sociales para enterarte de las novedades.
              </p>
            </Card>
          )}


        </div>
      </section>

      {/* Footer */}
      <footer className="bg-club-gray border-t border-club-yellow/20 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="text-club-yellow fill-club-yellow" size={16} />
            ))}
          </div>
          <p className="text-foreground/80 font-semibold mb-2">Club Deportivo Malanzán</p>
          <p className="text-foreground/60 text-sm">Campeón Liga del Sur Riojano 2022</p>
          <div className="flex flex-col items-center gap-2 mt-8">
            <p className="text-foreground/40 text-xs">&copy; 2026 CDM. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main >
  );
}
