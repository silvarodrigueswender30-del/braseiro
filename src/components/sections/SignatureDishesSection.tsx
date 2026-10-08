import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { signatureDishes } from '@/data/pratos';
import { siteConfig } from '@/config';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const SignatureDishesSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const cardWidth = scrollContainerRef.current.firstElementChild
      ? (scrollContainerRef.current.firstElementChild as HTMLElement).clientWidth + 24
      : 360;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Carnes':
        return 'text-[#D9741C] bg-[#D9741C]/15 border-[#D9741C]/30';
      case 'Frutos do mar':
        return 'text-[#2E9C9B] bg-[#2E9C9B]/15 border-[#2E9C9B]/30';
      case 'Bebidas':
        return 'text-[#F2B25A] bg-[#F2B25A]/15 border-[#F2B25A]/30';
      default:
        return 'text-[#F2B25A] bg-[#F2B25A]/15 border-[#F2B25A]/30';
    }
  };

  return (
    <section id="pratos" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Tinta de Seção: Brilho Âmbar Suave herdando o Degradê Mestre */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            'radial-gradient(ellipse 900px 500px at 50% 50%, rgba(217, 116, 28, 0.18), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho com Setas de Navegação em Desktop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="text-center md:text-left max-w-2xl">
            <SectionLabel>DA BRASA PRA MESA</SectionLabel>
            <h2 className="mt-2 font-condensed font-bold uppercase text-3xl sm:text-5xl text-[#F3E6D0] tracking-wide leading-tight">
              Os pratos da casa
            </h2>
            <div className="my-4 flex justify-center md:justify-start">
              <Divider variant="flame" />
            </div>
            <p className="font-serif italic text-xl sm:text-2xl text-[#F2B25A] font-medium leading-relaxed">
              “Receitas feitas com o calor da lenha e o frescor da maré de Ubatuba.”
            </p>
          </div>

          {/* Botões de Navegação do Carrossel (Desktop) */}
          <div className="hidden md:flex items-center gap-3 mt-6 md:mt-0 justify-center">
            <button
              onClick={() => scroll('left')}
              className="w-11 h-11 rounded-full bg-[#1A1411]/90 border border-[#F3E6D0]/20 flex items-center justify-center text-[#F3E6D0] hover:text-[#05070D] hover:bg-[#F2B25A] hover:border-[#F2B25A] transition-all duration-300 shadow-lg cursor-pointer"
              aria-label="Rolar pratos para a esquerda"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full bg-[#1A1411]/90 border border-[#F3E6D0]/20 flex items-center justify-center text-[#F3E6D0] hover:text-[#05070D] hover:bg-[#F2B25A] hover:border-[#F2B25A] transition-all duration-300 shadow-lg cursor-pointer"
              aria-label="Rolar pratos para a direita"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carrossel Horizontal: 3 por vez no Desktop, Scroll-Snap no Mobile */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {signatureDishes.map((dish, idx) => {
            const waUrl = `https://wa.me/${siteConfig.phoneRaw}?text=${encodeURIComponent(dish.whatsappMessage)}`;
            return (
              <motion.div
                key={dish.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.1 }}
                className="w-[84vw] sm:w-[360px] lg:w-[calc(33.333%-16px)] shrink-0 snap-start h-[520px] rounded-2xl overflow-hidden border border-[#F3E6D0]/15 group relative shadow-2xl transition-all duration-500 hover:border-[#F2B25A]/50 bg-[#1A1411]"
              >
                {/* Imagem Vertical (Aspect 4/5) com Zoom Suave (transform only) */}
                <img
                  src={dish.image}
                  alt={dish.alt}
                  width={900}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                />

                {/* Moldura Interna Delici */}
                <div className="absolute inset-2.5 rounded-xl border border-[#F2B25A]/20 pointer-events-none group-hover:border-[#F2B25A]/40 transition-colors duration-300" />

                {/* Overlay Escuro com Degradê Suave para Leitura */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/65 to-transparent pointer-events-none" />

                {/* Conteúdo do Card */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
                  {/* Topo: Etiqueta de Categoria */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md ${getCategoryColor(
                        dish.category
                      )}`}
                    >
                      {dish.category}
                    </span>
                  </div>

                  {/* Rodapé: Título, Descrição e Botão */}
                  <div className="space-y-3 pointer-events-auto">
                    <h3 className="font-condensed font-bold uppercase text-2xl sm:text-3xl text-[#F3E6D0] tracking-wide leading-tight drop-shadow-md">
                      {dish.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#F3E6D0]/85 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="pt-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#D9741C] hover:bg-[#F2B25A] text-[#05070D] font-condensed font-bold uppercase text-xs sm:text-sm tracking-wider transition-all duration-300 shadow-lg cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Pedir pelo WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Indicador de Deslize no Mobile */}
        <div className="flex md:hidden justify-center items-center gap-2 mt-4 text-xs text-[#F2B25A]/70">
          <span>Deslize para ver mais pratos</span>
          <ChevronRight className="w-4 h-4 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
