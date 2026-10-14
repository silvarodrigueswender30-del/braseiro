import React from 'react';
import { Flame, Leaf, Sparkles, Users, User, UtensilsCrossed } from 'lucide-react';
import { ItemCardapio, formatarPreco } from '@/data/cardapio';

export interface MenuItemCardProps {
  item: ItemCardapio;
  tema?: 'claro' | 'escuro';
  destaqueLayout?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  tema = 'claro',
  destaqueLayout = false,
}) => {
  const isDark = tema === 'escuro';
  const temFoto = Boolean(item.foto?.src);
  const temMultiplosPrecos = item.precos.length > 1;

  return (
    <article
      id={item.id}
      className={`group relative flex flex-col justify-between rounded-[8px] transition-all duration-300 ${
        destaqueLayout ? 'md:col-span-2 md:flex-row gap-6' : ''
      } ${
        isDark
          ? 'border border-[#F5E6D0]/10 bg-[#1A1411] p-4 sm:p-5 hover:border-[#E8832A]/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]'
          : 'border border-[#14100D]/10 bg-white/90 p-4 sm:p-5 hover:border-[#9C4108]/40 hover:bg-white hover:shadow-[0_10px_28px_rgba(20,16,13,0.08)]'
      } ${
        item.assinatura
          ? isDark
            ? 'ring-1 ring-[#E8832A]/40'
            : 'ring-1 ring-[#9C4108]/30 bg-gradient-to-b from-[#FDFBF7] to-white'
          : ''
      }`}
    >
      <div className={`flex flex-col flex-1 ${destaqueLayout ? 'md:flex-row gap-6' : ''}`}>
        {/* Foto do Prato (Proporção 4:3) ou Placeholder Ilustrado Dedicado */}
        <div
          className={`relative overflow-hidden rounded-[6px] shrink-0 bg-[#05070D]/5 ${
            destaqueLayout
              ? 'w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[220px]'
              : 'w-full aspect-[4/3] mb-4'
          }`}
        >
          {temFoto && item.foto ? (
            <img
              src={item.foto.src}
              alt={item.foto.alt || item.nome}
              width={item.foto.width || 600}
              height={item.foto.height || 450}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* Card Ilustrado da Categoria (Sem Foto Falsa) */
            <div
              className={`h-full w-full flex flex-col items-center justify-center p-6 text-center select-none ${
                isDark ? 'bg-[#14100D]' : 'bg-[#F5E6D0]/40'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isDark ? 'bg-[#E8832A]/15 text-[#E8832A]' : 'bg-[#9C4108]/10 text-[#9C4108]'
                }`}
              >
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <span
                className={`font-serif text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-[#F5E6D0]/60' : 'text-[#14100D]/60'
                }`}
              >
                Braseiro Caiçara
              </span>
            </div>
          )}

          {/* Badges sobre a foto */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            {item.assinatura && (
              <span
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-md ${
                  isDark
                    ? 'bg-[#E8832A] text-[#14100D]'
                    : 'bg-[#9C4108] text-white'
                }`}
              >
                <Flame className="w-3 h-3" />
                Assinatura
              </span>
            )}
            {item.destaque && !item.assinatura && (
              <span
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-md ${
                  isDark
                    ? 'bg-[#F5E6D0] text-[#14100D]'
                    : 'bg-[#14100D] text-[#F5E6D0]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Destaque
              </span>
            )}
            {item.vegetariano && (
              <span className="inline-flex items-center gap-1 rounded bg-[#2E9C9B] px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white shadow-md">
                <Leaf className="w-3 h-3" />
                Vegetariano
              </span>
            )}
          </div>
        </div>

        {/* Informações Textuais do Prato */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Linha do Nome e Preço Único */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3">
              <h3
                className={`font-serif font-bold text-lg sm:text-xl leading-snug transition-colors ${
                  isDark
                    ? 'text-[#F5E6D0] group-hover:text-[#E8832A]'
                    : 'text-[#14100D] group-hover:text-[#9C4108]'
                }`}
              >
                {item.nome}
                {item.detalhe && (
                  <span
                    className={`ml-2 font-sans font-normal text-xs ${
                      isDark ? 'text-[#F5E6D0]/60' : 'text-[#3A322C]/70'
                    }`}
                  >
                    {item.detalhe}
                  </span>
                )}
              </h3>

              {/* Preço único destacado (quando há apenas 1 tamanho) */}
              {!temMultiplosPrecos && item.precos[0] && (
                <div className="shrink-0 text-left sm:text-right mt-1 sm:mt-0">
                  <span
                    className={`font-sans font-bold text-lg sm:text-xl tabular-nums ${
                      isDark ? 'text-[#E8832A]' : 'text-[#9C4108]'
                    }`}
                  >
                    {formatarPreco(item.precos[0].valor)}
                  </span>
                  {item.precos[0].serve && (
                    <div
                      className={`flex items-center sm:justify-end gap-1 text-[11px] font-medium mt-0.5 ${
                        isDark ? 'text-[#F5E6D0]/60' : 'text-[#3A322C]/70'
                      }`}
                    >
                      {item.precos[0].serve === 1 ? (
                        <>
                          <User className="w-3 h-3" />
                          <span>1 pessoa</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-3 h-3" />
                          <span>{item.precos[0].serve} pessoas</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Descrição dos Ingredientes */}
            {item.descricao && (
              <p
                className={`mt-2 text-sm leading-relaxed font-sans max-w-[65ch] ${
                  isDark ? 'text-[#F5E6D0]/75' : 'text-[#3A322C]'
                }`}
              >
                {item.descricao}
              </p>
            )}

            {/* Sabores / variações em chips */}
            {item.sabores && item.sabores.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.sabores.map((sabor, idx) => (
                  <span
                    key={idx}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isDark
                        ? 'bg-[#F5E6D0]/5 border border-[#F5E6D0]/10 text-[#F5E6D0]/70'
                        : 'bg-[#14100D]/5 border border-[#14100D]/10 text-[#14100D]/75'
                    }`}
                  >
                    {sabor}
                  </span>
                ))}
              </div>
            )}

            {/* Adicionais com preços */}
            {item.adicionais && item.adicionais.length > 0 && (
              <div
                className={`mt-3 pt-2.5 border-t ${
                  isDark ? 'border-[#F5E6D0]/10' : 'border-[#14100D]/10'
                }`}
              >
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${
                    isDark ? 'text-[#F5E6D0]/60' : 'text-[#3A322C]/70'
                  }`}
                >
                  Adicionais:
                </span>
                <div className="space-y-1">
                  {item.adicionais.map((adc, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between text-xs ${
                        isDark ? 'text-[#F5E6D0]/80' : 'text-[#14100D]/85'
                      }`}
                    >
                      <span>+ {adc.nome}</span>
                      <span
                        className={`font-bold tabular-nums ${
                          isDark ? 'text-[#E8832A]' : 'text-[#9C4108]'
                        }`}
                      >
                        {formatarPreco(adc.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Múltiplos Preços (em linha clara, com rótulo legível, ex: 300g / 600g) */}
          {temMultiplosPrecos && (
            <div
              className={`mt-4 pt-3 border-t flex flex-wrap items-center gap-3 ${
                isDark ? 'border-[#F5E6D0]/10' : 'border-[#14100D]/10'
              }`}
            >
              {item.precos.map((preco, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 rounded-[6px] px-3 py-1.5 border text-xs sm:text-sm ${
                    isDark
                      ? 'bg-[#F5E6D0]/5 border-[#F5E6D0]/10 text-[#F5E6D0]'
                      : 'bg-[#F5E6D0]/40 border-[#14100D]/10 text-[#14100D]'
                  }`}
                >
                  <span className="font-semibold">{preco.rotulo}</span>
                  {preco.serve && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-[11px] ${
                        isDark ? 'text-[#E8832A]' : 'text-[#B4540F]'
                      }`}
                    >
                      {preco.serve === 1 ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      <span>{preco.serve === 1 ? '1 pess.' : `${preco.serve} pess.`}</span>
                    </span>
                  )}
                  <span
                    className={`font-sans font-bold text-sm sm:text-base tabular-nums ${
                      isDark ? 'text-[#E8832A]' : 'text-[#B4540F]'
                    }`}
                  >
                    {formatarPreco(preco.valor)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default MenuItemCard;
