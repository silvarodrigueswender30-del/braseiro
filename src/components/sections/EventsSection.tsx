import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config';
import { Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const EventsSection: React.FC = () => {
  return (
    <section id="eventos" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background Tint: Acolhimento e celebração */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 700px 500px at 85% 50%, rgba(46, 156, 155, 0.12), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Texto à esquerda */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col justify-center space-y-6 text-left order-2 lg:order-1"
          >
            <div>
              <SectionLabel>EVENTOS</SectionLabel>
              <h2 className="mt-2 font-condensed font-bold uppercase text-3xl sm:text-5xl text-[#F3E6D0] tracking-wide leading-tight">
                Aniversário, grupo ou comemoração?
              </h2>
              <div className="my-4 flex justify-start">
                <Divider variant="flame" />
              </div>
            </div>

            <p className="font-serif italic text-xl sm:text-2xl text-[#F2B25A] font-medium leading-relaxed">
              “Mesa caiçara é mesa farta: puxa a cadeira, que aqui sempre cabe mais um.”
            </p>

            <p className="text-sm sm:text-base text-[#F3E6D0]/85 leading-relaxed font-normal">
              Seja para celebrar aniversários, reunir a família inteira depois da praia ou juntar a turma de amigos com chopp artesanal e tábuas generosas de parrilla, nós preparamos tudo para você só se preocupar em brindar.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3 text-sm text-[#F3E6D0]/90">
                <CheckCircle2 className="w-4 h-4 text-[#2E9C9B] shrink-0" />
                <span>Mesas reservadas e integradas para grupos a partir de 8 pessoas</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#F3E6D0]/90">
                <CheckCircle2 className="w-4 h-4 text-[#2E9C9B] shrink-0" />
                <span>Cardápios compartilhados de carnes nobres e frutos do mar</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#F3E6D0]/90">
                <CheckCircle2 className="w-4 h-4 text-[#2E9C9B] shrink-0" />
                <span>Atendimento personalizado direto com nossos anfitriões</span>
              </div>
            </div>

            <div className="pt-3">
              <Button
                as="a"
                href={siteConfig.whatsappEventUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="uppercase font-condensed tracking-wider text-base shadow-[0_4px_25px_rgba(217,116,28,0.4)]"
              >
                <span>Planejar meu evento</span>
                <ArrowUpRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </motion.div>

          {/* Foto à direita: Mesa posta, comemoração e taças */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#F2B25A]/30 shadow-[0_20px_60px_rgba(5,7,13,0.85)] group aspect-[4/5] max-h-[560px] mx-auto w-full">
              <img
                src="/images/ambiente/eventos-mesa.webp"
                alt="Mesa de grupo com pratos da casa, vinho branco e taças no Braseiro Caiçara"
                width={1050}
                height={1400}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Moldura sutil Delici */}
              <div className="absolute inset-3 rounded-xl border border-[#F2B25A]/25 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1411]/90 border border-[#F2B25A]/30 text-xs font-semibold uppercase tracking-wider text-[#F2B25A] backdrop-blur-md">
                  <Users className="w-3.5 h-3.5 text-[#2E9C9B]" />
                  Celebrações & Confraternizações
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
