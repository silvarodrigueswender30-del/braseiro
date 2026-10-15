import { BrandShapeProps, BrandShapeTone } from '@/components/BrandShape';

export interface SectionFormasConfig {
  id: string;
  page: 'home' | 'cardapio' | 'gastronomia' | 'drinks' | 'executivos';
  sectionName: string;
  shapes: BrandShapeProps[];
}

export interface SectionDividerConfig {
  enabled: boolean;
  type: 'line-selo';
  size: number;
  tone: BrandShapeTone;
}

/**
 * sectionDividersConfig - Configuração dos divisores visuais discretos (Prompt v8).
 * Divisor entre seções escuras Diferenciais <-> Ambiente (linha fina + selo carimbo centralizado).
 * Fácil alternância via flag `enabled: true/false`.
 */
export const sectionDividersConfig = {
  featuresAmbiance: {
    enabled: true,
    type: 'line-selo' as const,
    size: 64, // 56–72px per Prompt v8
    tone: 'terracota' as BrandShapeTone,
  },
};

/**
 * formasLayoutConfig - Catálogo centralizado das formas de marca aplicadas
 * no site Braseiro Caiçara (Home e páginas do Cardápio) conforme Prompt v7 e v8:
 * 
 * DIRETRIZES FUNDAMENTAIS (Prompt v8):
 * 1. Formas nunca cobrem conteúdo: Z-order sempre abaixo de textos, botões, fotos e inputs.
 * 2. Mobile (<= 767px): apenas em faixas de padding com >= 32px de folga ou sangrando nas bordas sem tocar conteúdo.
 *    Se não houver faixa segura, a forma é estritamente ocultada no mobile (hideOnMobile / mobilePlacement: 'hidden').
 * 3. Desktop (>= 1024px): formas posicionadas em gutters livres ou estritamente atrás de cards opacos (behind-card).
 * 4. Aposentadoria de chama-traco em todo o site.
 * 5. Selo apenas como divisor centralizado (item D), nunca flutuando solto no formulário de reservas.
 */
export const formasLayoutConfig: Record<string, SectionFormasConfig> = {
  // ==========================================
  // HOME PAGE
  // ==========================================
  
  // 1. Manifesto: "Sal, fogo e paciência" (Fundo Escuro #14100D)
  // Peça principal: nuvem terracota à esquerda | Apoio: faíscas laranja pequenas à direita
  'home-manifesto': {
    id: 'home-manifesto',
    page: 'home',
    sectionName: 'ManifestoSection',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        placement: 'gutter',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(240px, 26vw, 360px)',
        top: '6%',
        left: '-16%',
        rotate: 8,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'faiscas',
        tone: 'brasa',
        placement: 'gutter',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(110px, 12vw, 160px)',
        bottom: '10%',
        right: '-4%',
        rotate: -10,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // 2. Do mar para a brasa (About) (Fundo Creme #F5E6D0)
  // Layout 3 colunas full-bleed (video | texto | video): sem forma para evitar colisão com mídia
  'home-about': {
    id: 'home-about',
    page: 'home',
    sectionName: 'AboutSection',
    shapes: [],
  },

  // 3. FireSection ("A mão na brasa"): Foto full-bleed -> Sem forma
  'home-fire': {
    id: 'home-fire',
    page: 'home',
    sectionName: 'FireSection',
    shapes: [],
  },

  // 4. Sempre cabe mais um (Events) (Fundo Creme #F5E6D0)
  // Forma em brasa montada diretamente atrás da colagem no componente (behind-card)
  'home-events': {
    id: 'home-events',
    page: 'home',
    sectionName: 'EventsSection',
    shapes: [],
  },

  // 5. Pratos da casa (SignatureDishes) (Fundo Creme #F5E6D0)
  // Sem ornamentos perto do título per Prompt v8 (Defeito B)
  'home-signature-dishes': {
    id: 'home-signature-dishes',
    page: 'home',
    sectionName: 'SignatureDishesSection',
    shapes: [],
  },

  // 6. Quem já sentou à mesa (Reviews) (Fundo Escuro #14100D)
  // Nuvem terracota e marrom-fogo posicionadas atrás dos cards no desktop (behind-card)
  'home-reviews': {
    id: 'home-reviews',
    page: 'home',
    sectionName: 'ReviewsSection',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(280px, 32vw, 460px)',
        top: '18%',
        left: '-8%',
        rotate: 12,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'nuvem-b',
        tone: 'marrom-fogo',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(260px, 30vw, 420px)',
        bottom: '8%',
        right: '-6%',
        rotate: -12,
        flipX: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // 7. Ambiente & vida caiçara (Ambiance) (Fundo Escuro #14100D)
  // Ornamentos de emenda removidos per Prompt v8 (Defeito D: substituídos pelo divisor discreto)
  'home-ambiance': {
    id: 'home-ambiance',
    page: 'home',
    sectionName: 'AmbianceSection',
    shapes: [],
  },

  // 8. Local/Reservas (LocationReservations) (Fundo Escuro #14100D)
  // Nuvem marrom-fogo no gutter direito inferior (selo flutuante removido per Defeito E)
  'home-location-reservations': {
    id: 'home-location-reservations',
    page: 'home',
    sectionName: 'LocationReservationsSection',
    shapes: [
      {
        shape: 'mancha-c',
        tone: 'marrom-fogo',
        placement: 'gutter',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(220px, 26vw, 340px)',
        bottom: '8%',
        right: '-16%',
        rotate: -14,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // ==========================================
  // CARDÁPIO HUB (/cardapio)
  // ==========================================
  'cardapio-hub': {
    id: 'cardapio-hub',
    page: 'cardapio',
    sectionName: 'CardapioIndexPage',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(200px, 22vw, 300px)',
        top: '520px',
        right: '-12%',
        rotate: 10,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'mancha-c',
        tone: 'areia',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(180px, 20vw, 260px)',
        bottom: '8%',
        left: '-12%',
        rotate: -8,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // ==========================================
  // GASTRONOMIA (/cardapio/gastronomia)
  // ==========================================
  'cardapio-gastronomia': {
    id: 'cardapio-gastronomia',
    page: 'gastronomia',
    sectionName: 'GastronomiaPage',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(200px, 22vw, 300px)',
        top: '560px',
        right: '-12%',
        rotate: 12,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'nuvem-b',
        tone: 'areia',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(200px, 22vw, 300px)',
        top: '68%',
        left: '-12%',
        rotate: -10,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // ==========================================
  // DRINKS (/cardapio/drinks)
  // ==========================================
  'cardapio-drinks': {
    id: 'cardapio-drinks',
    page: 'drinks',
    sectionName: 'DrinksPage',
    shapes: [
      {
        shape: 'nuvem-b',
        tone: 'terracota',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(200px, 22vw, 300px)',
        top: '560px',
        left: '-12%',
        rotate: -8,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'mancha-c',
        tone: 'marrom-fogo',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(200px, 22vw, 300px)',
        top: '70%',
        right: '-12%',
        rotate: 14,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // ==========================================
  // EXECUTIVOS (/cardapio/executivos)
  // ==========================================
  'cardapio-executivos': {
    id: 'cardapio-executivos',
    page: 'executivos',
    sectionName: 'ExecutivosPage',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(200px, 22vw, 300px)',
        top: '540px',
        right: '-12%',
        rotate: 14,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'sal',
        tone: 'areia',
        placement: 'behind-card',
        mobilePlacement: 'hidden',
        hideOnMobile: true,
        size: 'clamp(100px, 12vw, 150px)',
        bottom: '10%',
        left: '-12%',
        rotate: 6,
        className: 'pointer-events-none select-none',
      },
    ],
  },
};
