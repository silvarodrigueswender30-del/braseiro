import React, { useState, useMemo, useEffect } from 'react';
import { CardapioHeader } from '@/components/cardapio/CardapioHeader';
import { MenuItemCard } from '@/components/cardapio/MenuItemCard';
import { gastronomia, cardapioMeta, ItemCardapio } from '@/data/cardapio';
import { Search, X, Flame, Info, ChevronRight, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/config';

export const GastronomiaPage: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(gastronomia[0]?.id || 'entradas');

  // Filtro de busca em tempo real em todas as 12 categorias
  const resultadoBusca = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return null;

    const itensEncontrados: { item: ItemCardapio; categoriaNome: string }[] = [];

    gastronomia.forEach((cat) => {
      cat.grupos.forEach((grupo) => {
        grupo.itens.forEach((it) => {
          const matchNome = it.nome.toLowerCase().includes(termo);
          const matchDesc = it.descricao?.toLowerCase().includes(termo);
          const matchDetalhe = it.detalhe?.toLowerCase().includes(termo);
          const matchSabores = it.sabores?.some((s) => s.toLowerCase().includes(termo));
          const matchAdicionais = it.adicionais?.some((a) => a.nome.toLowerCase().includes(termo));

          if (matchNome || matchDesc || matchDetalhe || matchSabores || matchAdicionais) {
            itensEncontrados.push({
              item: it,
              categoriaNome: cat.nome,
            });
          }
        });
      });
    });

    return itensEncontrados;
  }, [busca]);

  // Scroll spy com IntersectionObserver
  useEffect(() => {
    if (busca.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const targetId = visibleEntries[0].target.id.replace('cat-', '');
          setCategoriaAtiva(targetId);
        }
      },
      {
        rootMargin: '-120px 0px -60% 0px',
        threshold: [0, 0.2, 0.5],
      }
    );

    gastronomia.forEach((cat) => {
      const el = document.getElementById(`cat-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [busca]);

  const scrollToCategoria = (catId: string) => {
    setCategoriaAtiva(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      const headerOffset = 150;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FBF4E8] text-[#14100D] transition-colors duration-200">
      {/* Header Editorial Claro */}
      <CardapioHeader
        tituloParte1="Do mar para a"
        tituloDestaque="mesa"
        subtitulo="Cortes nobres Angus na brasa viva, peixes frescos da costa de Ubatuba, massas artesanais e o sabor autêntico do litoral norte."
        paginaAtual="gastronomia"
        tema="claro"
        metaTitulo={cardapioMeta.gastronomia.titulo}
        metaDescricao={cardapioMeta.gastronomia.descricao}
      />

      {/* Barra de Filtro de Busca e Categorias Sticky */}
      <nav
        aria-label="Filtros e busca do cardápio"
        className="bg-[#FBF4E8]/95 backdrop-blur-md border-b border-[#14100D]/10 py-3 px-4 sticky top-[72px] md:top-[83px] z-30 shadow-sm"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Input de Busca */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#14100D]/50" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar prato ou ingrediente..."
              aria-label="Buscar prato ou ingrediente no cardápio"
              className="w-full min-h-[44px] rounded-[6px] bg-white border border-[#14100D]/15 py-2.5 pl-9 pr-9 text-sm text-[#14100D] placeholder-[#14100D]/40 focus:border-[#9C4108] focus:outline-none focus:ring-1 focus:ring-[#9C4108]"
            />
            {busca && (
              <button
                onClick={() => setBusca('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#14100D]/50 hover:text-[#9C4108] p-1.5 focus:outline-none"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Atalho de Categorias em Chips horizontais com toque mínimo de 44px */}
          {!busca && (
            <div className="w-full overflow-x-auto scrollbar-none flex items-center gap-1.5 py-1">
              {gastronomia.map((cat) => {
                const isActive = categoriaAtiva === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategoria(cat.id)}
                    className={`shrink-0 min-h-[44px] rounded-[6px] px-3.5 py-2 text-xs font-semibold tracking-wide transition-all select-none cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'bg-[#14100D] text-[#F5E6D0] shadow-sm font-bold'
                        : 'bg-white/80 text-[#14100D]/80 border border-[#14100D]/10 hover:border-[#9C4108]/50 hover:bg-white hover:text-[#14100D]'
                    }`}
                  >
                    {cat.nome}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main id="conteudo-principal" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* CASO 1: Resultados de Busca Ativa */}
        {resultadoBusca !== null ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#14100D]">
                {resultadoBusca.length === 0
                  ? 'Nenhum prato encontrado'
                  : `${resultadoBusca.length} ${resultadoBusca.length === 1 ? 'prato encontrado' : 'pratos encontrados'}`}
              </h2>
              <button
                onClick={() => setBusca('')}
                className="text-xs font-semibold text-[#9C4108] hover:underline"
              >
                Limpar busca
              </button>
            </div>

            {resultadoBusca.length === 0 ? (
              <div className="rounded-[8px] border border-[#14100D]/10 bg-white p-8 text-center max-w-md mx-auto my-8 shadow-sm">
                <Search className="w-8 h-8 text-[#9C4108]/50 mx-auto mb-3" />
                <p className="text-sm text-[#3A322C]">
                  Não encontramos nenhum prato para "{busca}". Tente buscar por termos como "picanha", "polvo", "camarão" ou "massa".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resultadoBusca.map(({ item, categoriaNome }) => (
                  <div key={item.id} className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9C4108] mb-1.5 flex items-center gap-1">
                      <span>{categoriaNome}</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                    <MenuItemCard item={item} tema="claro" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* CASO 2: Visualização Editorial das 12 Categorias */
          <div className="space-y-16 md:space-y-24">
            {gastronomia.map((categoria) => (
              <section
                key={categoria.id}
                id={`cat-${categoria.id}`}
                className="scroll-mt-36"
                aria-labelledby={`titulo-${categoria.id}`}
              >
                {/* Cabeçalho da Categoria com Eyebrow */}
                <div className="mb-8">
                  {categoria.selo && (
                    <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#9C4108] mb-1">
                      {categoria.selo}
                    </span>
                  )}
                  <h2
                    id={`titulo-${categoria.id}`}
                    className="font-serif font-bold text-3xl sm:text-4xl text-[#14100D] tracking-tight"
                  >
                    {categoria.nome}
                  </h2>
                  {categoria.subtitulo && (
                    <p className="mt-1.5 text-sm sm:text-base text-[#3A322C] max-w-2xl font-sans leading-relaxed">
                      {categoria.subtitulo}
                    </p>
                  )}
                </div>

                {/* Foto de Abertura da Categoria (quando houver) */}
                {categoria.foto && (
                  <div className="relative mb-8 w-full max-h-[380px] overflow-hidden rounded-[8px] border border-[#14100D]/10 bg-[#05070D] shadow-sm">
                    <img
                      src={categoria.foto.src}
                      alt={categoria.foto.alt}
                      width={categoria.foto.width}
                      height={categoria.foto.height}
                      loading="lazy"
                      className="w-full h-full object-cover object-center max-h-[380px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14100D]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                      <span className="bg-[#14100D]/85 backdrop-blur-md px-3 py-1.5 rounded-[4px] border border-white/20 font-medium">
                        {categoria.foto.alt}
                      </span>
                    </div>
                  </div>
                )}

                {/* Grupos de Itens */}
                <div className="space-y-8">
                  {categoria.grupos.map((grupo, gIdx) => (
                    <div key={gIdx}>
                      {grupo.nome && (
                        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#14100D] mb-4 pb-2 border-b border-[#14100D]/10 flex items-center gap-2">
                          <Flame className="w-4 h-4 text-[#9C4108]" />
                          <span>{grupo.nome}</span>
                        </h3>
                      )}

                      {/* Grade com ritmo editorial alternando destaques em 2 colunas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {grupo.itens.map((item) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            tema="claro"
                            destaqueLayout={Boolean(item.assinatura && item.foto)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nota de rodapé da categoria */}
                {categoria.nota && (
                  <div className="mt-8 rounded-[6px] border border-[#14100D]/10 bg-white/70 p-4 flex items-start gap-3 shadow-sm">
                    <Info className="w-5 h-5 text-[#9C4108] shrink-0 mt-0.5" />
                    <div className="text-xs text-[#3A322C] space-y-1">
                      {categoria.nota.titulo && (
                        <span className="font-semibold text-[#14100D] block text-sm">
                          {categoria.nota.titulo}
                        </span>
                      )}
                      {categoria.nota.linhas.map((linha, lIdx) => (
                        <p key={lIdx} className="leading-relaxed">
                          {linha}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* Fechamento com CTA de Reserva e Dúvidas (Idêntico ao estilo da Home) */}
        <section
          aria-label="Reservas e Atendimento"
          className="mt-20 pt-12 border-t border-[#14100D]/10 text-center max-w-2xl mx-auto"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B4540F] block mb-2">
            EXPERIÊNCIA BRASEIRO
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#14100D]">
            Dúvidas sobre o cardápio ou reserva de mesas?
          </h2>
          <p className="mt-2 text-sm text-[#3A322C] leading-relaxed">
            Nossa equipe está à disposição para informações sobre pratos, opções para grupos e datas comemorativas.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#14100D] text-[#F5E6D0] hover:bg-[#B4540F] hover:text-white transition-colors duration-200 px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm select-none"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Falar pelo WhatsApp</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GastronomiaPage;
