import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const AmbianceSection: React.FC = () => {
  const photos = [
    {
      title: 'O Salão de Madeira',
      subtitle: 'Madeira maciça, clima íntimo e luz âmbar suave',
      image: '/images/ambiente/ambiente-salao.webp',
      alt: 'Salão interno do restaurante Braseiro Caiçara com mesas de madeira e iluminação âmbar',
    },
    {
      title: 'Adega & Arquitetura',
      subtitle: 'Luminárias de palha trançada, adega rústica e teto alto caiçara',
      image: '/images/ambiente/ambiente-adega.webp',
      alt: 'Salão com luminárias artesanais e adega de vinhos no Braseiro Caiçara',
    },
    {
      title: 'Coquetelaria & Bar',
      subtitle: 'Bebidas autorais, notas cítricas e botânicos da Mata Atlântica',
      image: '/images/ambiente/ambiente-drinks.webp',
      alt: 'Coquetel artesanal âmbar servido no bar do Braseiro Caiçara',
    },
  ];

  return (
    <section id="ambiente" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background Tint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 900px 450px at 50% 50%, rgba(46, 156, 155, 0.12), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <SectionLabel>NOSSO ESPAÇO</SectionLabel>
          <h2 className="mt-2 font-condensed font-bold uppercase text-3xl sm:text-5xl text-[#F3E6D0] tracking-wide leading-tight">
            Ambiente & Vida Caiçara
          </h2>
          <div className="my-4">
            <Divider variant="flame" />
          </div>
          <p className="font-serif italic text-xl sm:text-2xl text-[#F2B25A] font-medium leading-relaxed">
            “Um refúgio rústico em Ubatuba para desacelerar o tempo e viver a brasa.”
          </p>
        </div>

        {/* Faixa de 3 Imagens Largas com Hover Suave (Zoom 1.04) e Legenda Discreta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {photos.map((photo, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.14 }}
              className="group relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-[#F3E6D0]/15 shadow-2xl transition-all duration-500 hover:border-[#F2B25A]/50"
            >
              {/* Imagem com Zoom 1.04 no Hover (transform only) */}
              <img
                src={photo.image}
                alt={photo.alt}
                width={960}
                height={1200}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Moldura Delici Interna */}
              <div className="absolute inset-2.5 rounded-xl border border-[#F2B25A]/20 pointer-events-none group-hover:border-[#F2B25A]/40 transition-colors duration-300" />

              {/* Degradê na Base para Legenda */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/95 via-[#05070D]/40 to-transparent pointer-events-none" />

              {/* Legenda Discreta */}
              <div className="absolute bottom-6 inset-x-6 z-10 text-left">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#F2B25A]">
                  Braseiro Caiçara
                </span>
                <h3 className="font-condensed font-bold uppercase text-2xl text-[#F3E6D0] tracking-wide mt-1">
                  {photo.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F3E6D0]/80 mt-1 line-clamp-2">
                  {photo.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
