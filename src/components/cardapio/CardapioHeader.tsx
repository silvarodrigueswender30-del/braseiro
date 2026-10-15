import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed, Wine, Clock } from 'lucide-react';

export interface CardapioHeaderProps {
  tituloParte1: string;
  tituloDestaque: string;
  tituloParte2?: string;
  subtitulo: string;
  paginaAtual: 'indice' | 'gastronomia' | 'drinks' | 'executivos';
  tema?: 'claro' | 'escuro';
  metaTitulo?: string;
  metaDescricao?: string;
}

export const CardapioHeader: React.FC<CardapioHeaderProps> = ({
  tituloParte1,
  tituloDestaque,
  tituloParte2 = '',
  subtitulo,
  paginaAtual,
  tema = 'claro',
  metaTitulo,
  metaDescricao,
}) => {
  const location = useLocation();

  // Atualização dinâmica de SEO
  useEffect(() => {
    if (metaTitulo) {
      document.title = metaTitulo;
    }
    if (metaDescricao) {
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', metaDescricao);
    }
  }, [metaTitulo, metaDescricao, location.pathname]);

  const secoes = [
    {
      id: 'gastronomia',
      label: 'Gastronomia',
      href: '/cardapio/gastronomia',
      icon: UtensilsCrossed,
      desc: 'Parrilla & Mar',
    },
    {
      id: 'drinks',
      label: 'Drinks & Bar',
      href: '/cardapio/drinks',
      icon: Wine,
      desc: 'Coquetelaria',
    },
    {
      id: 'executivos',
      label: 'Executivos',
      href: '/cardapio/executivos',
      icon: Clock,
      desc: '11h30 às 17h',
    },
  ];

  const isDark = tema === 'escuro';

  return (
    <header
      aria-label="Apresentação do Cardápio"
      className={`relative w-full overflow-hidden pt-24 pb-8 md:pt-32 md:pb-12 border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#14100D] text-[#F5E6D0] border-[#F5E6D0]/10'
          : 'bg-[#FBF4E8] text-[#14100D] border-[#14100D]/10'
      }`}
    >
      {/* Luz ambiente de brasa de fundo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-20 filter blur-3xl pointer-events-none ${
            isDark ? 'bg-[#E8832A]' : 'bg-[#E8832A]/20'
          }`}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb e botão de voltar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs sm:text-sm">
          <nav
            aria-label="Navegação estrutural"
            className={`flex items-center gap-2 ${isDark ? 'text-[#F5E6D0]/60' : 'text-[#14100D]/60'}`}
          >
            <Link
              to="/"
              className="hover:text-[#E8832A] transition-colors focus:outline-none focus:ring-1 focus:ring-[#E8832A] rounded px-1"
            >
              Início
            </Link>
            <span>/</span>
            {paginaAtual === 'indice' ? (
              <span className={`font-semibold ${isDark ? 'text-[#F5E6D0]' : 'text-[#14100D]'}`}>
                Cardápio
              </span>
            ) : (
              <>
                <Link
                  to="/cardapio"
                  className="hover:text-[#E8832A] transition-colors focus:outline-none focus:ring-1 focus:ring-[#E8832A] rounded px-1"
                >
                  Cardápio
                </Link>
                <span>/</span>
                <span className={`font-semibold capitalize ${isDark ? 'text-[#E8832A]' : 'text-[#9C4108]'}`}>
                  {paginaAtual}
                </span>
              </>
            )}
          </nav>

          {paginaAtual !== 'indice' && (
            <Link
              to="/cardapio"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider rounded px-3 py-1.5 transition-colors group focus:outline-none focus:ring-1 focus:ring-[#E8832A] ${
                isDark
                  ? 'text-[#F5E6D0]/80 bg-[#F5E6D0]/5 border border-[#F5E6D0]/10 hover:border-[#E8832A]/40 hover:text-[#E8832A]'
                  : 'text-[#14100D]/80 bg-[#14100D]/5 border border-[#14100D]/10 hover:border-[#9C4108]/40 hover:text-[#9C4108]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Ver todas as seções</span>
            </Link>
          )}
        </div>

        {/* Bloco central do título */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow com traços laterais (estilo da Home) */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span
              className={`h-[1px] w-6 sm:w-10 ${
                isDark ? 'bg-[#E8832A]/50' : 'bg-[#9C4108]/40'
              }`}
            />
            <span
              className={`font-sans font-bold uppercase tracking-[0.22em] text-xs sm:text-sm select-none ${
                isDark ? 'text-[#E8832A]' : 'text-[#9C4108]'
              }`}
            >
              CARDÁPIO DO BRASEIRO CAIÇARA
            </span>
            <span
              className={`h-[1px] w-6 sm:w-10 ${
                isDark ? 'bg-[#E8832A]/50' : 'bg-[#9C4108]/40'
              }`}
            />
          </div>

          <h1
            className={`font-serif font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] ${
              isDark ? 'text-[#F5E6D0]' : 'text-[#14100D]'
            }`}
          >
            {tituloParte1}{' '}
            <span
              className={`italic ${isDark ? 'text-[#E8832A]' : 'text-[#9C4108]'}`}
              style={{
                fontStyle: 'italic',
                fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
              }}
            >
              {tituloDestaque}
            </span>{' '}
            {tituloParte2}
          </h1>

          <p
            className={`mt-4 font-sans text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
              isDark ? 'text-[#F5E6D0]/80' : 'text-[#3A322C]'
            }`}
          >
            {subtitulo}
          </p>
        </div>

        {/* Barra de Navegação entre Seções (Segmented Control Editorial) */}
        {paginaAtual !== 'indice' && (
          <div className="mt-8 pt-2 flex justify-start sm:justify-center overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <nav
              aria-label="Navegação entre seções do cardápio"
              className={`inline-flex items-center p-1.5 rounded-full border shadow-sm shrink-0 ${
                isDark
                  ? 'bg-[#1A1411] border-[#F5E6D0]/15'
                  : 'bg-[#F0E4D2]/70 border-[#14100D]/10'
              }`}
            >
              {secoes.map((secao) => {
                const isActive = paginaAtual === secao.id;
                const Icon = secao.icon;

                let botaoClasses = '';
                if (isActive) {
                  botaoClasses = isDark
                    ? 'bg-[#E8832A] text-[#14100D] shadow-md font-bold'
                    : 'bg-white text-[#9C4108] shadow-[0_2px_8px_rgba(20,16,13,0.12)] font-bold';
                } else {
                  botaoClasses = isDark
                    ? 'text-[#F5E6D0]/70 hover:text-[#F5E6D0]'
                    : 'text-[#14100D]/75 hover:text-[#9C4108]';
                }

                return (
                  <Link
                    key={secao.id}
                    to={secao.href}
                    className={`min-h-[40px] flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shrink-0 select-none ${botaoClasses}`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? isDark
                            ? 'text-[#14100D]'
                            : 'text-[#9C4108]'
                          : isDark
                          ? 'text-[#E8832A]'
                          : 'text-[#9C4108]/70'
                      }`}
                    />
                    <span>{secao.label}</span>
                    <span
                      className={`hidden sm:inline text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isActive
                          ? isDark
                            ? 'bg-[#14100D] text-[#E8832A] font-bold'
                            : 'bg-[#9C4108]/10 text-[#9C4108]'
                          : isDark
                          ? 'bg-[#F5E6D0]/10 text-[#F5E6D0]/80'
                          : 'bg-[#14100D]/5 text-[#14100D]/80'
                      }`}
                    >
                      {secao.desc}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default CardapioHeader;
