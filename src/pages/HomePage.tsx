import React from 'react';
import { Hero } from '@/components/Hero';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { FireSection } from '@/components/sections/FireSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { KitchenSection } from '@/components/sections/KitchenSection';
import { SignatureDishesSection } from '@/components/sections/SignatureDishesSection';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { AmbianceSection } from '@/components/sections/AmbianceSection';
import { LocationReservationsSection } from '@/components/sections/LocationReservationsSection';

export const HomePage: React.FC = () => {
  return (
    <main id="conteudo-principal" className="relative z-10 flex-1">
      {/* Hero Section */}
      <Hero />

      {/* Faixa Animada (Marquee Strip) */}
      <MarqueeStrip />

      {/* 1) Quem Somos (Manifesto: Sal, Fogo e Paciência) */}
      <ManifestoSection />

      {/* 2) O Churrasco do Mar (Vídeo 2 | Texto | Vídeo 3) */}
      <AboutSection />

      {/* 2) A Mão na Brasa */}
      <FireSection />

      {/* 3) Mesa de Grupo, Evento ou Festa */}
      <EventsSection />

      {/* 4) Duas Brasas (Cardápio & Cozinha) */}
      <KitchenSection />

      {/* Tarefa 3: Pratos Assinatura (Carrossel Horizontal) */}
      <SignatureDishesSection />

      {/* 5) Quem Já Sentou à Mesa (Avaliações Google) */}
      <ReviewsSection />

      {/* 6) Por que o Fogo é Diferente */}
      <FeaturesSection />

      {/* 7) Ambiente & Vida Caiçara */}
      <AmbianceSection />

      {/* Tarefa 5: Como Chegar, Reservas & Eventos */}
      <LocationReservationsSection />
    </main>
  );
};

export default HomePage;
