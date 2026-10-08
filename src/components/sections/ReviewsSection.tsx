import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { Card } from '@/components/ui/Card';
import { siteConfig } from '@/config';
import { Star, Quote, MessageSquare } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const ReviewsSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Fundo com Textura Estilizada de Madeira Escura em CSS e Brilho Âmbar */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundColor: '#120B08',
          backgroundImage: `
            radial-gradient(ellipse 900px 500px at 50% 30%, rgba(217, 116, 28, 0.16), transparent 70%),
            repeating-linear-gradient(
              90deg,
              rgba(42, 21, 12, 0.25) 0px,
              rgba(42, 21, 12, 0.25) 2px,
              transparent 2px,
              transparent 48px
            ),
            linear-gradient(180deg, rgba(5,7,13,0.85) 0%, rgba(42,21,12,0.4) 50%, rgba(26,20,17,0.85) 100%)
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <SectionLabel>EXPERIÊNCIA</SectionLabel>
          <h2 className="mt-2 font-condensed font-bold uppercase text-3xl sm:text-5xl text-[#F3E6D0] tracking-wide leading-tight">
            Quem já sentou à mesa
          </h2>
          <div className="my-4">
            <Divider variant="flame" />
          </div>
          <p className="font-serif italic text-xl sm:text-2xl text-[#F2B25A] font-medium leading-relaxed">
            “O melhor elogio do assador é prato limpo e riso solto.”
          </p>
        </div>

        {/* 3 Cards de Depoimento Delici */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {siteConfig.reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.12 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col justify-between p-6 sm:p-7 border border-[#F3E6D0]/15 bg-[rgba(26,20,17,0.7)] backdrop-blur-md hover:border-[#F2B25A]/40 transition-colors duration-300">
                <div>
                  {/* Ícone de Aspas e Estrelas */}
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="w-8 h-8 text-[#D9741C]/40" />
                    <div className="flex items-center gap-1 text-[#F2B25A]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F2B25A]" />
                      ))}
                    </div>
                  </div>

                  {/* Conteúdo do Depoimento */}
                  <p className="text-sm sm:text-base text-[#F3E6D0]/90 leading-relaxed italic">
                    “{rev.content}”
                  </p>

                  {/* Tag Obrigatória de Placeholder do Google */}
                  <div className="mt-3">
                    <span className="inline-block text-[11px] font-semibold text-[#D9741C] bg-[#D9741C]/15 px-2.5 py-0.5 rounded border border-[#D9741C]/30">
                      {rev.note}
                    </span>
                  </div>
                </div>

                {/* Autor e Local */}
                <div className="mt-6 pt-4 border-t border-[#F3E6D0]/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-condensed font-bold uppercase text-base text-[#F3E6D0] tracking-wide">
                      {rev.author}
                    </h3>
                    <p className="text-xs text-[#F2B25A]/80">{rev.location}</p>
                  </div>
                  <span className="text-[11px] text-[#F3E6D0]/50">{rev.date}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Rodapé da Seção com Nota Google */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(26,20,17,0.8)] border border-[#F3E6D0]/15 text-xs text-[#F3E6D0]/80">
            <MessageSquare className="w-4 h-4 text-[#F2B25A]" />
            <span>Avaliações integradas ao Google Meu Negócio de Ubatuba [CONFIRMAR]</span>
          </div>
        </div>
      </div>
    </section>
  );
};
