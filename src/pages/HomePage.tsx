import React, { Suspense, lazy } from 'react';
import { Hero } from '@/components/Hero';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { ManifestoSection } from '@/components/sections/ManifestoSection';

// Code splitting: Seções abaixo da dobra carregadas sob demanda com React.lazy
const AboutSection = lazy(() => import('@/components/sections/AboutSection'));
const FireSection = lazy(() => import('@/components/sections/FireSection'));
const EventsSection = lazy(() => import('@/components/sections/EventsSection'));
const KitchenSection = lazy(() => import('@/components/sections/KitchenSection'));
const SignatureDishesSection = lazy(() => import('@/components/sections/SignatureDishesSection'));
const ReviewsSection = lazy(() => import('@/components/sections/ReviewsSection'));
const FeaturesSection = lazy(() => import('@/components/sections/FeaturesSection'));
const AmbianceSection = lazy(() => import('@/components/sections/AmbianceSection'));
const LocationReservationsSection = lazy(() => import('@/components/sections/LocationReservationsSection'));

// Placeholder invisível para Suspense que preserva layout sem CLS
const SectionFallback: React.FC<{ minHeight?: string }> = ({ minHeight = '300px' }) => (
  <div className="w-full" style={{ minHeight }} aria-hidden="true" />
);

export const HomePage: React.FC = () => {
  return (
    <main id="conteudo-principal" className="relative z-10 flex-1">
      {/* Hero Section (Crítica para LCP - Síncrona) */}
      <Hero />

      {/* Faixa Animada (Marquee Strip - Síncrona) */}
      <MarqueeStrip />

      {/* 1) Quem Somos (Manifesto: Sal, Fogo e Paciência - Síncrona) */}
      <ManifestoSection />

      {/* Seções abaixo da dobra (Code-split sob demanda com Suspense) */}
      <Suspense fallback={<SectionFallback minHeight="600px" />}>
        {/* 2) O Churrasco do Mar (Vídeo 2 | Texto | Vídeo 3) */}
        <AboutSection />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="400px" />}>
        {/* 2) A Mão na Brasa */}
        <FireSection />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="500px" />}>
        {/* 3) Mesa de Grupo, Evento ou Festa */}
        <EventsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="400px" />}>
        {/* 4) Duas Brasas (Cardápio & Cozinha) */}
        <KitchenSection />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="600px" />}>
        {/* Tarefa 3: Pratos Assinatura (Carrossel Horizontal) */}
        <SignatureDishesSection />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="500px" />}>
        {/* 5) Quem Já Sentou à Mesa (Avaliações Google) */}
        <ReviewsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="600px" />}>
        {/* 6) Por que o Fogo é Diferente */}
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="600px" />}>
        {/* 7) Ambiente & Vida Caiçara */}
        <AmbianceSection />
      </Suspense>

      <Suspense fallback={<div id="contato-reservas" className="w-full min-h-[700px]" aria-hidden="true" />}>
        {/* Tarefa 5: Como Chegar, Reservas & Eventos */}
        <LocationReservationsSection />
      </Suspense>
    </main>
  );
};

export default HomePage;
