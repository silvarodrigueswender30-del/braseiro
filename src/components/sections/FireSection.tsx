import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { Flame } from 'lucide-react';

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

export const FireSection: React.FC = () => {
  return (
    <section id="fogo" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background Tint: Brasa viva no lado da foto */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 700px 500px at 15% 50%, rgba(217, 116, 28, 0.18), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Foto à esquerda: Carne na chama na parrilla */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#F2B25A]/30 shadow-[0_20px_60px_rgba(5,7,13,0.85)] group aspect-[4/5] max-h-[560px] mx-auto w-full">
              <img
                src="/images/pratos/mao-na-brasa.webp"
                alt="Chamas vivas envolvendo a carne na parrilla artesanal do Braseiro Caiçara"
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
                  <Flame className="w-3.5 h-3.5 text-[#D9741C]" />
                  Fogo de chão autêntico
                </span>
              </div>
            </div>
          </motion.div>

          {/* Texto à direita */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col justify-center space-y-6 lg:pl-4 text-left"
          >
            <div>
              <SectionLabel>O FOGO</SectionLabel>
              <h2 className="mt-2 font-condensed font-bold uppercase text-3xl sm:text-5xl text-[#F3E6D0] tracking-wide leading-tight">
                Brasa é ponto, tempo e olho de quem faz
              </h2>
              <div className="my-4 flex justify-start">
                <Divider variant="flame" />
              </div>
            </div>

            <p className="font-serif italic text-xl sm:text-2xl text-[#F2B25A] font-medium leading-relaxed">
              “Não tem pressa que acelere o carvão, nem relógio que substitua o olhar do assador.”
            </p>

            <p className="text-sm sm:text-base text-[#F3E6D0]/85 leading-relaxed font-normal">
              Na nossa parrilla, o fogo não serve só para cozinhar: ele sela o suco da carne, carameliza a crosta e empresta à gordura aquele aroma inconfundível de lenha estalando. Do chorizo alto malpassado à costela que desmancha, cada corte recebe o calor exato que merece.
            </p>

            <p className="text-sm sm:text-base text-[#F3E6D0]/85 leading-relaxed font-normal">
              Trabalhamos com carnes certificadas, salmoura no ponto certo e uma paixão caiçara que transforma cada almoço e jantar num ritual compartilhado.
            </p>

            <div className="pt-2">
              <Button
                as="a"
                href="/cardapio"
                variant="secondary"
                size="lg"
                className="uppercase font-condensed tracking-wider text-base"
              >
                Ver cardápio
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
