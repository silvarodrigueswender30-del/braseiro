import React from 'react';
import { Link } from 'react-router-dom';
import { CardapioHeader } from '@/components/cardapio/CardapioHeader';
import { cardapioMeta } from '@/data/cardapio';
import { ArrowRight, Clock, Sparkles, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/config';

export const IndexPage: React.FC = () => {
  const cards = [
    {
      id: 'gastronomia',
      titulo: 'Gastronomia',
      subtitulo: 'A Parrilla Nobre & O Frescor do Mar',
      descricao:
        'Carnes Angus certificadas preparadas no calor da brasa viva, peixes frescos da costa de Ubatuba, polvos grelhados, massas artesanais, porções generosas e o tradicional Monte o Prato.',
      destaques: ['Cortes Angus', 'Churrasco do Mar', 'Monte o Prato', 'Massas & Risotos'],
      link: '/cardapio/gastronomia',
      botaoTexto: 'Ver Cardápio de Gastronomia',
      badge: '12 Categorias',
      foto: '/cardapio/fotos/churrasco-do-mar.webp',
      tema: 'claro',
    },
    {
      id: 'drinks',
      titulo: 'Drinks & Bar',
      subtitulo: 'Coquetelaria Autoral & Clássicos do Mar',
      descricao:
        'Criações exclusivas com ingredientes caiçaras como Cambuci e cachaças locais, clássicos internacionais executados com rigor, caipirinhas com frutas frescas, cervejas selecionadas e destilados nobres.',
      destaques: ['19 Coquetéis Autorais', 'Caipirinhas Artesanais', 'Cervejas Especiais', 'Doses & Licores'],
      link: '/cardapio/drinks',
      botaoTexto: 'Ver Carta de Drinks',
      badge: 'Bar Completo',
      foto: '/cardapio/fotos/braseiro-caicara.webp',
      tema: 'escuro',
    },
    {
      id: 'executivos',
      titulo: 'Almoço Executivo',
      subtitulo: 'Sabor de Parrilla no Dia a Dia',
      descricao:
        'Servido das 11h30 às 17h. Pratos completos e fartos com picanha, filé mignon, pescada do mar, frango na brasa ou massas, sempre acompanhados de clássicos da casa.',
      destaques: ['Das 11h30 às 17h', '10 Opções Individuais', 'Picanha & Mignon', 'Pescada & Camarão'],
      link: '/cardapio/executivos',
      botaoTexto: 'Ver Pratos Executivos',
      badge: '11h30 às 17h',
      foto: '/cardapio/executivos/picanha-grelhada.webp',
      tema: 'claro',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FBF4E8] text-[#14100D] transition-colors duration-200">
      {/* Header Editorial da Página */}
      <CardapioHeader
        tituloParte1="O Cardápio da"
        tituloDestaque="Casa"
        subtitulo="Do fogo à mesa: receitas com alma caiçara, ingredientes selecionados e o tempo paciente da brasa viva."
        paginaAtual="indice"
        tema="claro"
        metaTitulo={cardapioMeta.indice.titulo}
        metaDescricao={cardapioMeta.indice.descricao}
      />

      {/* Conteúdo Principal: 3 Grandes Portais de Cardápio */}
      <main id="conteudo-principal" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[8px] border border-[#14100D]/10 bg-white transition-all duration-300 hover:border-[#B4540F]/50 hover:shadow-[0_12px_36px_rgba(20,16,13,0.12)]"
            >
              {/* Imagem de Fundo / Destaque */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#05070D]">
                <img
                  src={card.foto}
                  alt={card.titulo}
                  width={600}
                  height={450}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge de Categoria */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14100D]/85 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    <Sparkles className="w-3 h-3 text-[#E8832A]" />
                    {card.badge}
                  </span>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#14100D] group-hover:text-[#B4540F] transition-colors">
                    {card.titulo}
                  </h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#B4540F]">
                    {card.subtitulo}
                  </p>

                  <p className="mt-3 text-sm text-[#3A322C] leading-relaxed font-sans">
                    {card.descricao}
                  </p>

                  {/* Destaques em chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {card.destaques.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#14100D]/5 border border-[#14100D]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#14100D]/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botão de Ação com min-h de 44px */}
                <div className="mt-6 pt-4 border-t border-[#14100D]/10">
                  <Link
                    to={card.link}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 w-full rounded-[6px] bg-[#14100D] py-3 px-4 text-xs sm:text-sm font-semibold tracking-wide text-[#F5E6D0] transition-all duration-200 hover:bg-[#B4540F] hover:text-white shadow-sm"
                  >
                    <span>{card.botaoTexto}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Informações Complementares da Casa */}
        <section
          aria-label="Informações Adicionais"
          className="mt-16 md:mt-24 pt-12 border-t border-[#14100D]/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="rounded-[8px] bg-white border border-[#14100D]/10 p-6 flex flex-col items-center md:items-start shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#B4540F]/10 flex items-center justify-center text-[#B4540F] mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#14100D]">Onde Estamos</h3>
              <p className="mt-1 text-sm text-[#3A322C] leading-relaxed">
                Rua Guarani, 370 — Itaguá, Ubatuba - SP
                <br />
                A poucos passos da orla com salão climatizado e varanda.
              </p>
            </div>

            <div className="rounded-[8px] bg-white border border-[#14100D]/10 p-6 flex flex-col items-center md:items-start shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#B4540F]/10 flex items-center justify-center text-[#B4540F] mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#14100D]">Horários da Brasa</h3>
              <p className="mt-1 text-sm text-[#3A322C] leading-relaxed">
                Almoço executivo das 11h30 às 17h.
                <br />
                Cardápio de gastronomia e bar servido continuamente.
              </p>
            </div>

            <div className="rounded-[8px] bg-white border border-[#14100D]/10 p-6 flex flex-col items-center md:items-start shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#B4540F]/10 flex items-center justify-center text-[#B4540F] mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#14100D]">Reservas & Eventos</h3>
              <p className="mt-1 text-sm text-[#3A322C] leading-relaxed">
                Atendemos por ordem de chegada e realizamos reservas para grupos e datas especiais.
              </p>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#B4540F] hover:underline"
              >
                Falar pelo WhatsApp →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default IndexPage;
