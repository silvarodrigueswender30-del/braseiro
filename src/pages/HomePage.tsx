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
import { BrandShape } from '@/components/BrandShape';
import { sectionDividersConfig } from '@/data/formas-layout';

export const HomePage: React.FC = () => {
  return (
    <main id="conteudo-principal" className="relative z-10 flex-1">
      {/* Hero Section (Crítica para LCP - Otimizada poster-first) */}
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

      {/* Tarefa 3: Pratos Assinatura (Carrossel Horizontal - Creme #F5E6D0) */}
      <SignatureDishesSection />

      {/* Emenda Creme <-> Escuro: Forma de marca cobrindo a divisa (apenas desktop) */}
      <div className="seam" aria-hidden="true">
        <BrandShape
          shape="nuvem-b"
          tone="terracota"
          placement="seam"
          mobilePlacement="hidden"
          hideOnMobile={true}
          size="clamp(220px, 24vw, 340px)"
          style={{ top: '-40px', right: '-16%', transform: 'rotate(-4deg)' }}
        />
      </div>

      {/* 5) Quem Já Sentou à Mesa (Avaliações Google - Escuro #14100D) */}
      <ReviewsSection />

      {/* 6) Por que o Fogo é Diferente */}
      <FeaturesSection />

      {/* Divisor discreto Diferenciais <-> Ambiente per Prompt v8 (Defeito D: linha fina + selo 64px terracota) */}
      {sectionDividersConfig.featuresAmbiance.enabled && (
        <div
          className="w-full max-w-[1280px] mx-auto px-6 pt-28 pb-16 flex items-center justify-center relative z-10 select-none pointer-events-none"
          aria-hidden="true"
        >
          <div className="flex-1 h-[1px] bg-[#F5E6D0]/15" />
          <div className="mx-5 shrink-0 flex items-center justify-center">
            <BrandShape
              shape="selo"
              tone={sectionDividersConfig.featuresAmbiance.tone}
              size={`${sectionDividersConfig.featuresAmbiance.size}px`}
              placement="padding-band"
              mobilePlacement="padding-band"
              className="relative !static"
              style={{ position: 'relative' }}
              reveal={false}
            />
          </div>
          <div className="flex-1 h-[1px] bg-[#F5E6D0]/15" />
        </div>
      )}

      {/* 7) Ambiente & Vida Caiçara */}
      <AmbianceSection />

      {/* Tarefa 5: Como Chegar, Reservas & Eventos */}
      <LocationReservationsSection />
    </main>
  );
};

export default HomePage;
