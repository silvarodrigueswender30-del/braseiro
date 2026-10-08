import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { siteConfig } from '@/config';
import { Flame, Waves, Wine, Users2, ArrowUpRight } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const KitchenSection: React.FC = () => {
  return (
    <section id="cardapio" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Tinta de Seção: Âmbar/Fogo na esquerda (Carnes) & Turquesa/Maré na direita (Frutos do Mar) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: `
            radial-gradient(ellipse 650px 500px at 15% 50%, rgba(217, 116, 28, 0.22), transparent 70%),
            radial-gradient(ellipse 650px 500px at 85% 50%, rgba(46, 156, 155, 0.20), transparent 70%)
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <SectionLabel>NOSSA COZINHA</SectionLabel>
          <h2 className="mt-2 font-condensed font-bold uppercase text-3xl sm:text-5xl text-[#F3E6D0] tracking-wide leading-tight">
            Duas brasas, uma mesa
          </h2>
          <div className="my-4">
            <Divider variant="flame" />
          </div>
          <p className="font-serif italic text-xl sm:text-2xl text-[#F2B25A] font-medium leading-relaxed">
            “A força do pasto encontra a maresia do Atlântico sobre a mesma lenha viva.”
          </p>
        </div>

        {/* Layout Central: Prato Circular Delici + 2 itens à esquerda + 2 itens à direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Lado Esquerdo (2 Itens: Carnes na Brasa e Frutos do Mar) */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1 text-center lg:text-right">
            {/* Item 1: Carnes na Brasa */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="p-5 sm:p-6 rounded-2xl bg-[rgba(26,20,17,0.55)] border border-[#D9741C]/25 backdrop-blur-sm hover:border-[#D9741C]/50 transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D9741C]/15 border border-[#D9741C]/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Flame className="w-6 h-6 text-[#D9741C]" />
                </div>
                <div>
                  <div className="flex items-center justify-center lg:justify-end gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9741C] bg-[#D9741C]/10 px-2 py-0.5 rounded-full border border-[#D9741C]/20">
                      Parrilla
                    </span>
                    <h3 className="font-condensed font-bold uppercase text-xl sm:text-2xl text-[#F3E6D0]">
                      Carnes na Brasa
                    </h3>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#F3E6D0]/85 leading-relaxed">
                    Picanha, chorizo e assado de tira no ponto certo, selados na lenha com flor de sal marinho.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Item 2: Frutos do Mar */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="p-5 sm:p-6 rounded-2xl bg-[rgba(26,20,17,0.55)] border border-[#2E9C9B]/25 backdrop-blur-sm hover:border-[#2E9C9B]/50 transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2E9C9B]/15 border border-[#2E9C9B]/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Waves className="w-6 h-6 text-[#2E9C9B]" />
                </div>
                <div>
                  <div className="flex items-center justify-center lg:justify-end gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2E9C9B] bg-[#2E9C9B]/10 px-2 py-0.5 rounded-full border border-[#2E9C9B]/20">
                      Costa de Ubatuba
                    </span>
                    <h3 className="font-condensed font-bold uppercase text-xl sm:text-2xl text-[#F3E6D0]">
                      Frutos do Mar
                    </h3>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#F3E6D0]/85 leading-relaxed">
                    Polvo tenro grelhado, camarões pistola na brasa e peixe do dia fresco dos pescadores locais.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Centro: Prato Circular Delici Recortado com Moldura Fina */}
          <div className="lg:col-span-4 flex justify-center order-1 lg:order-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center"
            >
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border border-[#F2B25A]/35 shadow-[0_0_50px_rgba(217,116,28,0.25)] animate-pulse" />
              {/* Moldura dupla fina concêntrica */}
              <div className="absolute inset-3 rounded-full border border-[#F2B25A]/20 pointer-events-none" />

              {/* Foto Circular do Prato */}
              <div className="relative w-[88%] h-[88%] rounded-full overflow-hidden border-2 border-[#F2B25A]/50 shadow-2xl group">
                <img
                  src="/images/pratos/prato-circular-duas-brasas.webp"
                  alt="Prato de arroz de brasa caiçara com camarões e frutos do mar no Braseiro Caiçara"
                  width={750}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Selo Centralizado Flutuante na Base do Círculo */}
              <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                <span className="px-4 py-1.5 rounded-full bg-[#1A1411]/90 border border-[#F2B25A]/40 text-xs font-condensed font-bold uppercase tracking-widest text-[#F2B25A] shadow-xl backdrop-blur-md">
                  Sabores da Brasa & Mar
                </span>
              </div>
            </motion.div>
          </div>

          {/* Lado Direito (2 Itens: Drinks da Casa e Eventos & Grupos) */}
          <div className="lg:col-span-4 space-y-8 order-3 lg:order-3 text-center lg:text-left">
            {/* Item 3: Drinks da Casa */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="p-5 sm:p-6 rounded-2xl bg-[rgba(26,20,17,0.55)] border border-[#F2B25A]/25 backdrop-blur-sm hover:border-[#F2B25A]/50 transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F2B25A]/15 border border-[#F2B25A]/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Wine className="w-6 h-6 text-[#F2B25A]" />
                </div>
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <h3 className="font-condensed font-bold uppercase text-xl sm:text-2xl text-[#F3E6D0]">
                      Drinks da Casa
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2B25A] bg-[#F2B25A]/10 px-2 py-0.5 rounded-full border border-[#F2B25A]/20">
                      Coquetelaria
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#F3E6D0]/85 leading-relaxed">
                    Coquetéis autorais em tons âmbar, infusões de botânicos da mata, caipirinhas de frutas locais e chopp trincando.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Item 4: Eventos e Grupos */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="p-5 sm:p-6 rounded-2xl bg-[rgba(26,20,17,0.55)] border border-[#B78A4A]/25 backdrop-blur-sm hover:border-[#B78A4A]/50 transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#B78A4A]/15 border border-[#B78A4A]/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Users2 className="w-6 h-6 text-[#B78A4A]" />
                </div>
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <h3 className="font-condensed font-bold uppercase text-xl sm:text-2xl text-[#F3E6D0]">
                      Eventos e Grupos
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B78A4A] bg-[#B78A4A]/10 px-2 py-0.5 rounded-full border border-[#B78A4A]/20">
                      Sob Reserva
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#F3E6D0]/85 leading-relaxed">
                    Experiências para famílias e grupos compartilharem cortes nobres e pratos de frutos do mar no centro da mesa.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA para o Cardápio Completo & WhatsApp */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <a
            href="/cardapio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D9741C] text-[#05070D] hover:bg-[#F2B25A] transition-all duration-300 font-condensed font-bold uppercase text-sm sm:text-base tracking-wider shadow-lg"
          >
            <span>Ver Cardápio Completo</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1411]/90 border border-[#F2B25A]/40 text-[#F2B25A] hover:text-[#05070D] hover:bg-[#F2B25A] transition-all duration-300 font-condensed font-bold uppercase text-sm sm:text-base tracking-wider shadow-lg"
          >
            <span>Consultar pratos do dia no WhatsApp</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
