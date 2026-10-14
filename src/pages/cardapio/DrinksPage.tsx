import React, { useState } from 'react';
import { CardapioHeader } from '@/components/cardapio/CardapioHeader';
import { drinks, caipirinhas, cervejas, doses, nossoBar, cardapioMeta, formatarPreco } from '@/data/cardapio';
import { Wine, Beer, Sparkles, Flame, GlassWater, Droplets } from 'lucide-react';

export const DrinksPage: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'coqueteis' | 'caipirinhas' | 'cervejas' | 'doses'>('coqueteis');

  return (
    <div className="relative min-h-screen bg-[#14100D] text-[#F5E6D0] transition-colors duration-200">
      {/* Header Editorial Escuro */}
      <CardapioHeader
        tituloParte1="Alquimia &"
        tituloDestaque="fogo"
        subtitulo="Sabores intensos, cítricos marcantes e ingredientes nativos de Ubatuba combinados ao tempo paciente da brasa viva."
        paginaAtual="drinks"
        tema="escuro"
        metaTitulo={cardapioMeta.drinks.titulo}
        metaDescricao={cardapioMeta.drinks.descricao}
      />

      {/* Menu Rápido entre as categorias do bar com toque de 44px */}
      <nav
        aria-label="Categorias do bar"
        className="bg-[#1A1411]/95 backdrop-blur-md border-b border-[#F5E6D0]/10 py-3 px-4 sticky top-[72px] md:top-[83px] z-30 shadow-md"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setAbaAtiva('coqueteis')}
            className={`shrink-0 min-h-[44px] rounded-[6px] px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all select-none cursor-pointer flex items-center gap-2 ${
              abaAtiva === 'coqueteis'
                ? 'bg-[#E8832A] text-[#14100D] shadow-sm font-bold'
                : 'bg-[#F5E6D0]/5 text-[#F5E6D0]/75 hover:bg-[#F5E6D0]/10 hover:text-[#F5E6D0]'
            }`}
          >
            <Wine className="w-4 h-4" />
            <span>Coquetéis (19)</span>
          </button>

          <button
            onClick={() => setAbaAtiva('caipirinhas')}
            className={`shrink-0 min-h-[44px] rounded-[6px] px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all select-none cursor-pointer flex items-center gap-2 ${
              abaAtiva === 'caipirinhas'
                ? 'bg-[#E8832A] text-[#14100D] shadow-sm font-bold'
                : 'bg-[#F5E6D0]/5 text-[#F5E6D0]/75 hover:bg-[#F5E6D0]/10 hover:text-[#F5E6D0]'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Caipirinhas</span>
          </button>

          <button
            onClick={() => setAbaAtiva('cervejas')}
            className={`shrink-0 min-h-[44px] rounded-[6px] px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all select-none cursor-pointer flex items-center gap-2 ${
              abaAtiva === 'cervejas'
                ? 'bg-[#E8832A] text-[#14100D] shadow-sm font-bold'
                : 'bg-[#F5E6D0]/5 text-[#F5E6D0]/75 hover:bg-[#F5E6D0]/10 hover:text-[#F5E6D0]'
            }`}
          >
            <Beer className="w-4 h-4" />
            <span>Cervejas</span>
          </button>

          <button
            onClick={() => setAbaAtiva('doses')}
            className={`shrink-0 min-h-[44px] rounded-[6px] px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all select-none cursor-pointer flex items-center gap-2 ${
              abaAtiva === 'doses'
                ? 'bg-[#E8832A] text-[#14100D] shadow-sm font-bold'
                : 'bg-[#F5E6D0]/5 text-[#F5E6D0]/75 hover:bg-[#F5E6D0]/10 hover:text-[#F5E6D0]'
            }`}
          >
            <GlassWater className="w-4 h-4" />
            <span>Doses & Licores</span>
          </button>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main id="conteudo-principal" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* ABA 1: COQUETÉIS (19 DRINKS COM FOTOS VERTICAIS 4:5) */}
        {abaAtiva === 'coqueteis' && (
          <section aria-label="Coquetéis Autorais e Clássicos">
            <div className="mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8832A] block mb-1">
                COQUETELARIA DA CASA
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#F5E6D0]">
                Coquetéis Autorais & Clássicos
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#F5E6D0]/70 max-w-2xl font-sans">
                Cada drink é pensado para harmonizar com os cortes da brasa ou refrescar as tardes à beira-mar de Ubatuba.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {drinks.map((drink) => (
                <article
                  key={drink.id}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-[8px] border border-[#F5E6D0]/15 bg-[#1A1411] transition-all duration-300 hover:border-[#E8832A]/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] ${
                    drink.assinatura ? 'ring-1 ring-[#E8832A]/30' : ''
                  }`}
                >
                  {/* Foto vertical do drink (aspect ratio 4:5) */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#05070D]">
                    <img
                      src={drink.foto.src}
                      alt={drink.foto.alt || drink.nome}
                      width={drink.foto.width || 600}
                      height={drink.foto.height || 750}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1411] via-[#1A1411]/20 to-transparent" />

                    {/* Badge de assinatura */}
                    {drink.assinatura && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8832A] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#14100D] shadow-md">
                          <Flame className="w-3.5 h-3.5" />
                          Assinatura
                        </span>
                      </div>
                    )}

                    {/* Preço sobre a imagem no canto inferior */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="inline-block rounded-[6px] bg-[#14100D]/90 backdrop-blur-md border border-[#F5E6D0]/20 px-3 py-1 font-sans font-bold text-base sm:text-lg text-[#E8832A] shadow-lg tabular-nums">
                        {formatarPreco(drink.preco)}
                      </span>
                    </div>
                  </div>

                  {/* Detalhes do Drink */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#F5E6D0] group-hover:text-[#E8832A] transition-colors leading-tight">
                        {drink.nome}
                      </h3>

                      <p className="mt-2 text-sm text-[#F5E6D0]/80 leading-relaxed font-sans">
                        {drink.descricao}
                      </p>

                      {drink.detalhe && (
                        <p className="mt-1 text-xs text-[#E8832A] font-medium">
                          {drink.detalhe}
                        </p>
                      )}
                    </div>

                    {/* Chips de perfil de sabor */}
                    <div className="mt-4 pt-3 border-t border-[#F5E6D0]/10 flex flex-wrap gap-1.5">
                      {drink.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded-full bg-[#F5E6D0]/5 border border-[#F5E6D0]/10 px-2.5 py-0.5 text-[11px] text-[#F5E6D0]/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ABA 2: CAIPIRINHAS DA CASA */}
        {abaAtiva === 'caipirinhas' && (
          <section aria-label="Caipirinhas da Casa" className="space-y-8">
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8832A] block mb-1">
                TRADIÇÃO & BRASILIDADE
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#F5E6D0]">
                Caipirinhas da Casa
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#F5E6D0]/70 max-w-2xl font-sans">
                Escolha suas frutas preferidas e a sua base alcoólica. Preparadas artesanalmente na hora.
              </p>
            </div>

            {/* Destaque: Caipirinha da Casa com Cambuci */}
            <div className="relative overflow-hidden rounded-[8px] border border-[#E8832A]/40 bg-gradient-to-r from-[#1A1411] to-[#14100D] p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1 rounded bg-[#E8832A] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#14100D] mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Receita Exclusiva
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#F5E6D0]">
                    Caipirinha da Casa
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-[#F5E6D0]/80 leading-relaxed font-sans">
                    Cachaça Mato Dentro prata com infusão de Cambuci silvestre e limão siciliano fresco. Equilíbrio perfeito entre a acidez do fruto da Mata Atlântica e a doçura da cana.
                  </p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <span className="text-xs uppercase tracking-wider text-[#F5E6D0]/60 block">Valor</span>
                  <span className="font-sans font-bold text-2xl sm:text-3xl text-[#E8832A] tabular-nums">
                    R$ 36,90
                  </span>
                </div>
              </div>
            </div>

            {/* Painel: Frutas da Estação & Tabela de Bases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frutas Disponíveis */}
              <div className="rounded-[8px] border border-[#F5E6D0]/15 bg-[#1A1411] p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#F5E6D0] mb-2 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-[#E8832A]" />
                    <span>Frutas Frescas da Estação</span>
                  </h3>
                  <p className="text-xs text-[#F5E6D0]/70 mb-4 font-sans">
                    Combine até 1 fruta inclusa no valor da base ou monte seu blend com frutas extras:
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {caipirinhas.frutas.map((fruta, idx) => (
                      <div
                        key={idx}
                        className="rounded-[6px] bg-[#F5E6D0]/5 border border-[#F5E6D0]/10 p-3 text-center"
                      >
                        <span className="font-medium text-sm text-[#F5E6D0]">{fruta}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F5E6D0]/10 text-xs text-[#E8832A]">
                  * Adicional para 2 ou mais frutas: <strong>+ R$ 4,00</strong>
                </div>
              </div>

              {/* Bases Alcoólicas e Valores */}
              <div className="rounded-[8px] border border-[#F5E6D0]/15 bg-[#1A1411] p-6">
                <h3 className="font-serif font-bold text-xl text-[#F5E6D0] mb-2 flex items-center gap-2">
                  <Wine className="w-5 h-5 text-[#E8832A]" />
                  <span>Bases Alcoólicas</span>
                </h3>
                <p className="text-xs text-[#F5E6D0]/70 mb-4 font-sans">
                  Preço final da caipirinha de acordo com o destilado escolhido:
                </p>

                <div className="divide-y divide-[#F5E6D0]/10">
                  {caipirinhas.bases.map((base, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                      <span className="text-[#F5E6D0]">{base.nome}</span>
                      <span className="font-bold text-[#E8832A] tabular-nums">
                        {formatarPreco(base.preco)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ABA 3: CERVEJAS */}
        {abaAtiva === 'cervejas' && (
          <section aria-label="Cervejas" className="space-y-8">
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8832A] block mb-1">
                EXTREMAMENTE GELADAS
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#F5E6D0]">
                Cervejas Selecionadas
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#F5E6D0]/70 max-w-2xl font-sans">
                Long necks especiais e garrafas de 600ml para compartilhar na mesa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Long Necks */}
              <div className="rounded-[8px] border border-[#F5E6D0]/15 bg-[#1A1411] p-6">
                <h3 className="font-serif font-bold text-xl text-[#F5E6D0] mb-4 pb-2 border-b border-[#F5E6D0]/10 flex items-center gap-2">
                  <Beer className="w-5 h-5 text-[#E8832A]" />
                  <span>Long Necks</span>
                </h3>
                <div className="divide-y divide-[#F5E6D0]/10">
                  {cervejas.longNeck.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-sm">
                      <span className="text-[#F5E6D0] font-medium">{item.nome}</span>
                      <span className="font-bold text-[#E8832A] tabular-nums">
                        {formatarPreco(item.preco)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Garrafas 600ml */}
              <div className="rounded-[8px] border border-[#F5E6D0]/15 bg-[#1A1411] p-6">
                <h3 className="font-serif font-bold text-xl text-[#F5E6D0] mb-4 pb-2 border-b border-[#F5E6D0]/10 flex items-center gap-2">
                  <Beer className="w-5 h-5 text-[#E8832A]" />
                  <span>Garrafas 600ml</span>
                </h3>
                <div className="divide-y divide-[#F5E6D0]/10">
                  {cervejas.ml600.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-sm">
                      <span className="text-[#F5E6D0] font-medium">{item.nome}</span>
                      <span className="font-bold text-[#E8832A] tabular-nums">
                        {formatarPreco(item.preco)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ABA 4: DOSES & LICORES */}
        {abaAtiva === 'doses' && (
          <section aria-label="Doses e Licores" className="space-y-8">
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8832A] block mb-1">
                DESTILADOS & DIGESTIVOS
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#F5E6D0]">
                Doses, Aperitivos & Licores
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#F5E6D0]/70 max-w-2xl font-sans">
                Rótulos selecionados de Whiskies, Cachaças premium de alambique, Tequilas, Aperitivos amargos e Licores para fechar a refeição.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Destilados */}
              <div className="rounded-[8px] border border-[#F5E6D0]/15 bg-[#1A1411] p-6">
                <h3 className="font-serif font-bold text-lg text-[#F5E6D0] mb-3 pb-2 border-b border-[#F5E6D0]/10">
                  Destilados
                </h3>
                <div className="divide-y divide-[#F5E6D0]/10">
                  {doses.destilados.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[#F5E6D0]">{item.nome}</span>
                      <span className="font-bold text-[#E8832A] tabular-nums">
                        {formatarPreco(item.preco)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aperitivos */}
              <div className="rounded-[8px] border border-[#F5E6D0]/15 bg-[#1A1411] p-6">
                <h3 className="font-serif font-bold text-lg text-[#F5E6D0] mb-3 pb-2 border-b border-[#F5E6D0]/10">
                  Aperitivos
                </h3>
                <div className="divide-y divide-[#F5E6D0]/10">
                  {doses.aperitivos.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[#F5E6D0]">{item.nome}</span>
                      <span className="font-bold text-[#E8832A] tabular-nums">
                        {formatarPreco(item.preco)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Licores */}
              <div className="rounded-[8px] border border-[#F5E6D0]/15 bg-[#1A1411] p-6">
                <h3 className="font-serif font-bold text-lg text-[#F5E6D0] mb-3 pb-2 border-b border-[#F5E6D0]/10">
                  Licores Finos
                </h3>
                <div className="divide-y divide-[#F5E6D0]/10">
                  {doses.licores.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[#F5E6D0]">{item.nome}</span>
                      <span className="font-bold text-[#E8832A] tabular-nums">
                        {formatarPreco(item.preco)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Manifesto Poético "Nosso Bar" */}
        <section aria-label="Manifesto do Bar" className="mt-16 md:mt-24 pt-12 border-t border-[#F5E6D0]/10">
          <div className="rounded-[8px] border border-[#E8832A]/20 bg-gradient-to-b from-[#1A1411] to-[#14100D] p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8832A] block mb-3">
              NOSSO BAR
            </span>
            <blockquote className="font-serif italic text-lg sm:text-2xl text-[#F5E6D0] leading-relaxed">
              "{nossoBar}"
            </blockquote>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DrinksPage;
