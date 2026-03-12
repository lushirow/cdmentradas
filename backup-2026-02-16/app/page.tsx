'use client';

import { Header } from '@/components/ui/Header';
import { Hero } from '@/components/ui/Hero';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ticket, Calendar, MapPin, Trophy, Star, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const handleBuy = () => {
    router.push('/checkout');
  };

  return (
    <main className="min-h-screen">
      <Header />
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
        <Button size="lg" className="mt-4" onClick={handleBuy}>
          <Ticket className="inline mr-2" size={20} />
          Comprar Entrada
        </Button>
      </Hero>

      {/* Info Section */}
      <section className="py-16 px-4" id="entradas">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-club-yellow">
            Próximo Partido
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card hover className="text-center">
              <Calendar className="mx-auto mb-4 text-club-yellow" size={48} />
              <h3 className="text-xl font-semibold mb-2">Fecha</h3>
              <p className="text-foreground/70">Sábado 15 de Febrero</p>
              <p className="text-foreground/70">20:00 hs</p>
            </Card>

            <Card hover className="text-center">
              <MapPin className="mx-auto mb-4 text-club-yellow" size={48} />
              <h3 className="text-xl font-semibold mb-2">Lugar</h3>
              <p className="text-foreground/70">Estadio del Club</p>
              <p className="text-foreground/70">Malanzán, La Rioja</p>
            </Card>

            <Card hover className="text-center">
              <Trophy className="mx-auto mb-4 text-club-yellow" size={48} />
              <h3 className="text-xl font-semibold mb-2">Competencia</h3>
              <p className="text-foreground/70">Liga del Sur Riojano</p>
              <p className="text-club-yellow font-semibold">Defensa del Título</p>
            </Card>
          </div>

          {/* Pricing Card */}
          <Card className="max-w-md mx-auto text-center bg-gradient-to-br from-club-gray to-club-black border-2 border-club-yellow/30">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="text-2xl font-bold text-club-yellow">Entrada General</h3>
              <Trophy className="text-club-yellow" size={24} />
            </div>
            <div className="text-5xl font-bold mb-6">
              <span className="text-club-yellow">$2.500</span>
            </div>
            <ul className="text-left mb-6 space-y-3">
              <li className="flex items-center">
                <Star className="text-club-yellow mr-2 fill-club-yellow" size={16} />
                Acceso al estadio
              </li>
              <li className="flex items-center">
                <Star className="text-club-yellow mr-2 fill-club-yellow" size={16} />
                Link exclusivo del stream en vivo
              </li>
              <li className="flex items-center">
                <Star className="text-club-yellow mr-2 fill-club-yellow" size={16} />
                Confirmación por email
              </li>
              <li className="flex items-center">
                <Star className="text-club-yellow mr-2 fill-club-yellow" size={16} />
                Apoyá al campeón 2022
              </li>
            </ul>
            <Button size="lg" className="w-full" onClick={handleBuy}>
              Comprar Ahora
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-club-gray border-t border-club-yellow/20 py-8 mt-16">
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
            <Link href="/admin/login" className="text-foreground/20 hover:text-club-yellow text-xs flex items-center gap-1 transition-colors">
              <Lock size={10} />
              Acceso Admin
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
