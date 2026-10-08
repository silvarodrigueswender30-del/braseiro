import React from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config';
import { Button } from '../ui/Button';
import { SectionLabel } from '../ui/SectionLabel';
import { Card } from '../ui/Card';
import { Clock, MapPin, CalendarDays, ArrowUpRight, Flame } from 'lucide-react';

import type { Variants } from 'framer-motion';

// Lightweight Framer Motion variants using strictly transform and opacity (Vercel Best Practice)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const Hero: React.FC = () => {
  return (
    <section
      id="inicio"
      className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#05070D]"
    >
      {/* Background Image Container anchored at bottom with slow cinematic scale (transform only) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="w-full h-full"
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{ willChange: 'transform' }}
        >
          <picture className="w-full h-full block">
            <source srcSet="/images/hero/home1.webp" type="image/webp" />
            <img
              src="/images/hero/home1.jpg"
              alt="Fachada iluminada do restaurante Braseiro Caiçara à noite em Ubatuba"
              width={2752}
              height={1536}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-[center_bottom] select-none"
            />
          </picture>
        </motion.div>

        {/* Master Gradient Overlay:
            0% - 32%: #05070D sólido no céu garantindo que o título fique 100% no céu noturno sem tocar na fachada
            32% - 65%: Degradê escuro (0.85 a 0.50) sobre a área intermediária
            65% - 85%: Transparência suave revelando a iluminação dourada e a fachada rústica
            85% - 100%: Escurece até #1A1411 (--rua) para emendar sem corte com a próxima seção
        */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(
              180deg,
              #05070D 0%,
              rgba(5, 7, 13, 0.98) 26%,
              rgba(5, 7, 13, 0.88) 46%,
              rgba(5, 7, 13, 0.35) 68%,
              rgba(26, 20, 17, 0.82) 88%,
              #1A1411 100%
            )`,
          }}
        />

        {/* Focused Scrim Radial for Typographic Contrast */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 950px 500px at 50% 28%, rgba(5, 7, 13, 0.78) 0%, transparent 80%)',
          }}
        />

        {/* Warm Ambient Glow at bottom */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-screen"
          style={{
            background:
              'radial-gradient(ellipse at 50% 90%, rgba(217, 116, 28, 0.3) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Hero Content: Posicionado com folga no topo para garantir que o letreiro da fachada fique visível abaixo */}
      <div className="relative z-20 flex-1 flex flex-col justify-start items-center text-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-8 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* Section Label */}
          <motion.div variants={itemVariants} className="mb-3">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1A1411]/85 border border-[#F2B25A]/35 backdrop-blur-md shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#D9741C]" />
              <SectionLabel className="text-[11px] sm:text-xs tracking-[0.2em]">
                {siteConfig.tagline}
              </SectionLabel>
            </div>
          </motion.div>

          {/* H1 - Barlow Condensed Caixa-Alta no céu escuro */}
          <motion.h1
            variants={itemVariants}
            className="font-condensed font-bold uppercase text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight text-[#F3E6D0] leading-[0.95] max-w-3xl drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]"
          >
            Fogo de chão, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2B25A] via-[#D9741C] to-[#F3E6D0]">
              sal de mar
            </span>
          </motion.h1>

          {/* Bloco de Contraste Escuro Protetor para Subtítulo, Destaque e Botões (Garante contraste AA+) */}
          <motion.div
            variants={itemVariants}
            className="mt-4 sm:mt-5 max-w-2xl px-5 sm:px-8 py-4 sm:py-5 rounded-2xl bg-[rgba(5,7,13,0.78)] border border-[#F3E6D0]/10 backdrop-blur-md shadow-[0_8px_32px_rgba(5,7,13,0.85)] flex flex-col items-center"
          >
            {/* Subtítulo em DM Sans */}
            <p className="text-sm sm:text-base md:text-lg text-[#F3E6D0]/95 font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(5,7,13,0.9)]">
              Carnes e frutos do mar na brasa, num cantinho de Ubatuba onde a mesa é de todo mundo.
            </p>

            {/* Frase em Fraunces Itálico (1 frase por tela) */}
            <div className="mt-3">
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#F2B25A] tracking-normal font-medium drop-shadow-[0_2px_12px_rgba(217,116,28,0.5)]">
                “{siteConfig.sloganHighlight}”
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <Button
                as="a"
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto uppercase font-condensed tracking-wider text-base sm:text-lg shadow-[0_4px_25px_rgba(217,116,28,0.45)]"
              >
                <span>Reservar minha mesa</span>
                <ArrowUpRight className="w-5 h-5 ml-1" />
              </Button>

              <Button
                as="a"
                href="/cardapio"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto uppercase font-condensed tracking-wider text-base sm:text-lg"
              >
                Ver cardápio
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Faixa de Horário e Localização na base do hero (Card translúcido com whitespace-nowrap) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 w-full max-w-5xl mx-auto px-4 pb-4 sm:pb-6"
      >
        <Card className="py-3 sm:py-3.5 px-4 sm:px-8 border border-[#F3E6D0]/15 bg-[rgba(26,20,17,0.8)] backdrop-blur-md shadow-[0_12px_40px_rgba(5,7,13,0.75)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F3E6D0]/15 text-center sm:text-left items-center">
            {/* Horário (whitespace-nowrap no desktop) */}
            <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1 sm:pt-0 sm:pr-4">
              <Clock className="w-4 h-4 text-[#F2B25A] shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#F3E6D0]/95 tracking-wide whitespace-normal sm:whitespace-nowrap">
                {siteConfig.hoursShort}
              </span>
            </div>

            {/* Localização */}
            <div className="flex items-center justify-center gap-2.5 pt-2 sm:pt-0 sm:px-4">
              <MapPin className="w-4 h-4 text-[#D9741C] shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#F3E6D0]/95 tracking-wide">
                {siteConfig.locationCity}
              </span>
            </div>

            {/* Eventos e Reservas */}
            <div className="flex items-center justify-center sm:justify-end gap-2.5 pt-2 sm:pt-0 sm:pl-4">
              <CalendarDays className="w-4 h-4 text-[#2E9C9B] shrink-0" />
              <a
                href={siteConfig.whatsappEventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-semibold text-[#F2B25A] hover:text-[#F3E6D0] transition-colors underline decoration-[#F2B25A]/40 underline-offset-4"
              >
                Reservas e eventos
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};
