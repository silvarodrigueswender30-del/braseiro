import React, { useState, useMemo } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { siteConfig } from '@/config';
import { menuCategories, menuItems, MenuCategoryType } from '@/data/cardapio';
import { ArrowUpRight, Info, MessageSquare } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | MenuCategoryType>('Todos');

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Agrupamento para quando "Todos" estiver selecionado
  const displayedCategories = useMemo(() => {
    if (selectedCategory !== 'Todos') {
      return [selectedCategory];
    }
    return ['Carnes', 'Frutos do mar', 'Acompanhamentos', 'Sobremesas', 'Bebidas'] as MenuCategoryType[];
  }, [selectedCategory]);

  return (
    <div className="relative min-h-screen flex flex-col pt-20">
      {/* Mini-Hero Baixo (40svh) no estilo About Us do Delici */}
      <section
        aria-label="Apresentação do Cardápio"
        className="relative w-full h-[40svh] min-h-[300px] flex items-center justify-center overflow-hidden bg-[#05070D]"
      >
        {/* Imagem de Fundo Reaproveitada com Overlay Forte */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/pratos/mao-na-brasa.webp"
            alt="Fogo e brasa viva da parrilla do Braseiro Caiçara"
            width={1050}
            height={1400}
            fetchPriority="high"
            className="w-full h-full object-cover object-center select-none opacity-30 filter blur-[1px]"
          />
          {/* Overlay escuro duplo para contraste perfeito */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                180deg,
                rgba(5, 7, 13, 0.95) 0%,
                rgba(5, 7, 13, 0.85) 50%,
                #05070D 100%
              )`,
            }}
          />
        </div>

        {/* Conteúdo Central do Mini-Hero */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <SectionLabel>BRASEIRO CAIÇARA</SectionLabel>
          <h1 className="mt-2 font-condensed font-bold uppercase text-4xl sm:text-6xl text-[#F3E6D0] tracking-tight">
            Cardápio da Casa
          </h1>
          <div className="my-3 flex justify-center">
            <Divider variant="flame" />
          </div>
          <p className="font-serif italic text-lg sm:text-xl text-[#F2B25A]">
            “O melhor da brasa e do mar, servido no tempo do fogo.”
          </p>
        </div>
      </section>

      {/* Barra de Filtros Sticky */}
      <nav
        aria-label="Filtros do cardápio"
        className="sticky top-[72px] sm:top-[80px] z-30 w-full bg-[rgba(5,7,13,0.92)] backdrop-blur-md border-y border-[#F3E6D0]/10 py-3 px-4 shadow-lg"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none py-1">
          {menuCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-condensed font-bold uppercase text-xs sm:text-sm tracking-wider transition-all duration-200 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F2B25A] ${
                  isSelected
                    ? 'bg-[#D9741C] text-[#05070D] shadow-md'
                    : 'bg-[#1A1411]/80 text-[#F3E6D0]/80 border border-[#F3E6D0]/15 hover:border-[#F2B25A]/50 hover:text-[#F3E6D0]'
                }`}
                role="tab"
                aria-selected={isSelected}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Conteúdo do Cardápio: 2 Colunas */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="space-y-16">
          {displayedCategories.map((category) => {
            const items = filteredItems.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <section key={category} className="space-y-8" aria-labelledby={`cat-${category}`}>
                {/* Título da Categoria com Divider */}
                <div className="text-center max-w-xl mx-auto">
                  <span className="text-xs uppercase font-semibold tracking-widest text-[#D9741C]">
                    COZINHA CAIÇARA
                  </span>
                  <h2
                    id={`cat-${category}`}
                    className="mt-1 font-condensed font-bold uppercase text-2xl sm:text-4xl text-[#F3E6D0] tracking-wide"
                  >
                    {category === 'Carnes' && 'Carnes na Brasa'}
                    {category === 'Frutos do mar' && 'Frutos do Mar'}
                    {category === 'Acompanhamentos' && 'Acompanhamentos'}
                    {category === 'Sobremesas' && 'Sobremesas'}
                    {category === 'Bebidas' && 'Bebidas & Coquetelaria'}
                  </h2>
                  <div className="mt-3 flex justify-center">
                    <Divider variant="flame" />
                  </div>
                </div>

                {/* Grid de 2 Colunas no Desktop / 1 Coluna no Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="group p-4 rounded-xl bg-[rgba(26,20,17,0.4)] border border-[#F3E6D0]/10 hover:border-[#F2B25A]/35 transition-all duration-300"
                    >
                      {/* Linha do Nome e Preço com Pontilhado */}
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-condensed font-bold uppercase text-lg sm:text-xl text-[#F3E6D0] tracking-wide group-hover:text-[#F2B25A] transition-colors">
                          {item.name}
                        </h3>

                        {/* Linha pontilhada estilo cardápio impresso */}
                        <div className="flex-1 border-b border-dotted border-[#F3E6D0]/25 mx-2 self-center shrink min-w-[24px]" />

                        <span className="font-condensed font-bold text-base sm:text-lg text-[#F2B25A] tracking-wider shrink-0 whitespace-nowrap">
                          {item.price || 'Consulte'}
                        </span>
                      </div>

                      {/* Descrição */}
                      <p className="mt-2 text-xs sm:text-sm text-[#F3E6D0]/80 leading-relaxed font-normal">
                        {item.description}
                      </p>

                      {/* Tags / Badges */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#D9741C]/15 text-[#D9741C] border border-[#D9741C]/25"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Nota de Exemplo Obrigatória */}
                      <div className="mt-2">
                        <span className="text-[10px] text-[#F3E6D0]/40 font-mono">
                          // {item.note}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bloco de Aviso e CTA de Reserva */}
        <div className="mt-20 max-w-3xl mx-auto">
          <Card variant="double" className="text-center">
            <div className="flex flex-col items-center py-2 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#D9741C]/15 border border-[#D9741C]/35 flex items-center justify-center text-[#D9741C]">
                <Info className="w-6 h-6" />
              </div>

              <h3 className="font-condensed font-bold uppercase text-2xl sm:text-3xl text-[#F3E6D0]">
                Cardápio Sujeito a Alteração
              </h3>

              <p className="text-xs sm:text-sm text-[#F3E6D0]/80 max-w-lg leading-relaxed">
                Nossos pratos de frutos do mar dependem diretamente da pesca diária e os cortes nobres seguem o padrão de maturação da lenha. Consulte opções do dia e reserve sua mesa com antecedência.
              </p>

              <div className="pt-2">
                <Button
                  as="a"
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                  className="uppercase font-condensed tracking-wider text-base shadow-[0_4px_25px_rgba(217,116,28,0.4)]"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  <span>Consultar pratos do dia & Reservar</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MenuPage;
