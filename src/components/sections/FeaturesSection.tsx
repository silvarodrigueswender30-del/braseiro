import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { siteConfig } from '@/config';
import { Flame, Anchor, Trees, Users } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const FeaturesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'flame':
        return <Flame className="w-6 h-6 text-[#D9741C]" />;
      case 'anchor':
        return <Anchor className="w-6 h-6 text-[#2E9C9B]" />;
      case 'trees':
        return <Trees className="w-6 h-6 text-[#F2B25A]" />;
      case 'users':
        return <Users className="w-6 h-6 text-[#B78A4A]" />;
      default:
        return <Flame className="w-6 h-6 text-[#D9741C]" />;
    }
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background Tint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 800px 500px at 50% 60%, rgba(181, 86, 28, 0.15), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <SectionLabel>DIFERENCIAIS</SectionLabel>
          <h2 className="mt-2 font-condensed font-bold uppercase text-3xl sm:text-5xl text-[#F3E6D0] tracking-wide leading-tight">
            Por que o fogo é diferente
          </h2>
          <div className="my-4">
            <Divider variant="flame" />
          </div>
          <p className="font-serif italic text-xl sm:text-2xl text-[#F2B25A] font-medium leading-relaxed">
            “Não é técnica importada: é respeito pelo produto, pelo tempo e pela nossa terra.”
          </p>
        </div>

        {/* 4 Cards Verticais Altos Delici com Foto de Fundo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.features.map((feat, idx) => (
            <motion.div
              key={feat.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.1 }}
              className="relative h-[440px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#F3E6D0]/15 group shadow-2xl transition-all duration-500 hover:border-[#F2B25A]/50"
            >
              {/* Imagem de Fundo com Zoom Suave no Hover (transform only) */}
              <img
                src={feat.image}
                alt={feat.title}
                width={750}
                height={1000}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Degradê Escuro Sobreposto para Leitura Confortável */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/75 to-[#05070D]/30 pointer-events-none" />

              {/* Moldura Fina Interna Delici */}
              <div className="absolute inset-2.5 rounded-xl border border-[#F2B25A]/20 pointer-events-none transition-colors duration-300 group-hover:border-[#F2B25A]/40" />

              {/* Conteúdo do Card */}
              <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                {/* Topo: Ícone em Círculo Estilizado */}
                <div className="w-12 h-12 rounded-full bg-[#1A1411]/85 border border-[#F2B25A]/30 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {getIcon(feat.iconName)}
                </div>

                {/* Base: Título, Tagline e Descrição */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#F2B25A]">
                    {feat.tagline}
                  </span>
                  <h3 className="font-condensed font-bold uppercase text-2xl text-[#F3E6D0] tracking-wide leading-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F3E6D0]/85 leading-relaxed pt-1">
                    {feat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
