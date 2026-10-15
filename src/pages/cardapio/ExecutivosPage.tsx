import React from 'react';
import { CardapioHeader } from '@/components/cardapio/CardapioHeader';
import { executivos, cardapioMeta, formatarPreco } from '@/data/cardapio';
import { Clock, AlertCircle, Plus, Utensils, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/config';
import { BrandShape } from '@/components/BrandShape';
import { formasLayoutConfig } from '@/data/formas-layout';

export const ExecutivosPage: React.FC = () => {
  return (
    <div className="relative has-shapes overflow-x-clip min-h-screen bg-[#FBF4E8] text-[#14100D] transition-colors duration-200">
      {/* Formas de marca decorativas (camada de fundo z-0) */}
      {formasLayoutConfig['cardapio-executivos']?.shapes.map((s, idx) => (
        <BrandShape key={`exec-shape-${idx}`} {...s} />
      ))}

      {/* Header Editorial Claro */}
      <CardapioHeader
        tituloParte1="Almoço de"
        tituloDestaque="verdade"
        subtitulo="Servido das 11h30 às 17h. Pratos completos e individuais preparados com o rigor e o calor da nossa brasa viva."
        paginaAtual="executivos"
        tema="claro"
        metaTitulo={cardapioMeta.executivos.titulo}
        metaDescricao={cardapioMeta.executivos.descricao}
      />

      {/* Banner de Horário de Atendimento */}
      <div className="bg-[#F5E6D0]/90 backdrop-blur-md border-b border-[#14100D]/10 py-3.5 px-4 sticky top-[72px] md:top-[83px] z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9C4108] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9C4108]" />
            </span>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#14100D]">
              <Clock className="w-4 h-4 text-[#9C4108]" />
              <span>Horário de Atendimento: {executivos.horario}</span>
            </div>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9C4108] hidden sm:inline-block">
            Almoço Executivo
          </span>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main id="conteudo-principal" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Grid dos 10 Pratos Executivos com Cards Horizontais e Fotos Grandes */}
        <section aria-label="Pratos Executivos">
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9C4108] block mb-1">
              INDIVIDUAIS & COMPLETOS
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#14100D]">
              Os Pratos Executivos
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-[#3A322C] max-w-2xl font-sans leading-relaxed">
              Cada opção inclui o prato principal grelhado na brasa e os acompanhamentos tradicionais descritos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {executivos.itens.map((prato) => (
              <article
                key={prato.id}
                className="group relative flex flex-col sm:flex-row items-stretch overflow-hidden rounded-[8px] border border-[#14100D]/10 bg-white p-4 sm:p-5 transition-all duration-300 hover:border-[#9C4108]/40 hover:shadow-[0_10px_28px_rgba(20,16,13,0.08)]"
              >
                {/* Foto Ampla do Prato (Não apenas miniatura pequena) */}
                <div className="relative w-full sm:w-44 md:w-48 aspect-[4/3] sm:aspect-auto shrink-0 overflow-hidden rounded-[6px] bg-[#0c1424] shadow-sm mb-4 sm:mb-0">
                  <img
                    src={prato.foto.src}
                    alt={prato.foto.alt || prato.nome}
                    width={prato.foto.width || 480}
                    height={prato.foto.height || 255}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Dados do Prato */}
                <div className="flex-1 flex flex-col justify-between sm:pl-5">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[#14100D] group-hover:text-[#9C4108] transition-colors">
                        {prato.nome}
                      </h3>
                      <span className="font-sans font-bold text-lg sm:text-xl text-[#9C4108] tabular-nums shrink-0">
                        {formatarPreco(prato.preco)}
                      </span>
                    </div>

                    <p className="text-sm text-[#3A322C] leading-relaxed font-sans">
                      {prato.descricao}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[#14100D]/10 flex items-center justify-between text-xs text-[#3A322C]/70">
                    <div className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-[#9C4108]" />
                      <span>Empratado individual</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Seção de Guarnições Extras */}
        <section aria-label="Guarnições Extras" className="mt-16 pt-12 border-t border-[#14100D]/10">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9C4108] block mb-1">
              ADICIONE AO SEU PRATO
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#14100D]">
              Guarnições Extras
            </h2>
            <p className="mt-1 text-sm text-[#3A322C] font-sans">
              Porções individuais preparadas na hora para complementar sua refeição.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {executivos.guarnicoes.map((guarnicao, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-[6px] border border-[#14100D]/10 bg-white p-3.5 hover:border-[#9C4108]/30 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#9C4108]" />
                  <span className="text-sm font-medium text-[#14100D]">
                    {guarnicao.nome}
                  </span>
                </div>
                <span className="font-bold text-sm text-[#9C4108] tabular-nums shrink-0 ml-2">
                  {formatarPreco(guarnicao.preco)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bloco de Avisos Importantes (Somente fatos originais da casa) */}
        <section aria-label="Avisos Importantes" className="mt-12">
          <div className="rounded-[8px] border border-[#14100D]/10 bg-white p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#9C4108] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm text-[#3A322C]">
                <span className="font-semibold text-[#14100D] block text-sm mb-1">
                  Observações da Casa:
                </span>
                {executivos.avisos.map((aviso, idx) => (
                  <p key={idx}>• {aviso}</p>
                ))}
              </div>
            </div>

            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 rounded-[6px] bg-[#14100D] text-[#F5E6D0] hover:bg-[#9C4108] hover:text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 select-none"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Dúvidas no WhatsApp</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExecutivosPage;
