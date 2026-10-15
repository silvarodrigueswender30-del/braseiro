import { BrandShapeProps } from '@/components/BrandShape';

export interface SectionFormasConfig {
  id: string;
  page: 'home' | 'cardapio' | 'gastronomia' | 'drinks' | 'executivos';
  sectionName: string;
  shapes: BrandShapeProps[];
}

/**
 * formasLayoutConfig - Catálogo centralizado das formas de marca aplicadas
 * no site Braseiro Caiçara (Home e páginas do Cardápio).
 * 
 * Regras Bonança seguidas:
 * - Formas grandes sangram 20-40% pela borda da seção (overflow-x: clip na seção com .has-shapes).
 * - z-index: 0 atrás do conteúdo.
 * - Tom "brasa" no máximo 1x por página.
 * - Fundo claro usa areia/terracota com opacidade 0.10 - 0.20.
 * - Fundo escuro usa carvao/terracota com opacidade 0.25 - 0.45.
 * - Seções vizinhas alternam lado (esquerda/direita) e formato.
 */
export const formasLayoutConfig: Record<string, SectionFormasConfig> = {
  // ==========================================
  // HOME PAGE
  // ==========================================
  
  // Manifesto: "Sal, fogo e paciência" (Fundo Escuro #14100D)
  'home-manifesto': {
    id: 'home-manifesto',
    page: 'home',
    sectionName: 'ManifestoSection',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        opacity: 0.28,
        size: 'clamp(280px, 42vw, 560px)',
        top: '5%',
        left: '-14%',
        rotate: 8,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'sal',
        tone: 'areia',
        opacity: 0.22,
        size: 'clamp(140px, 18vw, 220px)',
        bottom: '8%',
        right: '4%',
        rotate: -12,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // About: "Do mar para a mesa" (Fundo Creme #F5E6D0)
  'home-about': {
    id: 'home-about',
    page: 'home',
    sectionName: 'AboutSection',
    shapes: [
      {
        shape: 'mancha-c',
        tone: 'areia',
        opacity: 0.16,
        size: 'clamp(300px, 45vw, 600px)',
        bottom: '-10%',
        right: '-16%',
        rotate: 15,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // Fire: "A mão na brasa" (Fundo Escuro #14100D) - Transição de fogo
  'home-fire': {
    id: 'home-fire',
    page: 'home',
    sectionName: 'FireSection',
    shapes: [
      {
        shape: 'faiscas',
        tone: 'terracota',
        opacity: 0.35,
        size: 'clamp(320px, 50vw, 680px)',
        top: '-30px',
        right: '-6%',
        rotate: -4,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // Events: "Sempre cabe mais um" (Fundo Creme #F5E6D0)
  'home-events': {
    id: 'home-events',
    page: 'home',
    sectionName: 'EventsSection',
    shapes: [
      {
        shape: 'nuvem-b',
        tone: 'terracota',
        opacity: 0.12,
        size: 'clamp(320px, 48vw, 650px)',
        top: '12%',
        left: '-18%',
        flipX: true,
        rotate: -6,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // SignatureDishes: "Os pratos da casa" (Fundo Creme #FBF4E8)
  'home-signature-dishes': {
    id: 'home-signature-dishes',
    page: 'home',
    sectionName: 'SignatureDishesSection',
    shapes: [
      {
        shape: 'pincelada-d',
        tone: 'areia',
        opacity: 0.14,
        size: 'clamp(380px, 60vw, 850px)',
        top: '110px',
        left: '5%',
        rotate: -2,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // Reviews: "Quem já sentou à mesa" (Fundo Escuro #14100D)
  'home-reviews': {
    id: 'home-reviews',
    page: 'home',
    sectionName: 'ReviewsSection',
    shapes: [
      {
        shape: 'mancha-c',
        tone: 'carvao',
        opacity: 0.40,
        size: 'clamp(340px, 46vw, 640px)',
        top: '18%',
        right: '-14%',
        rotate: -12,
        flipX: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // Ambiance: "Ambiente & vida caiçara" (Fundo Escuro #14100D)
  'home-ambiance': {
    id: 'home-ambiance',
    page: 'home',
    sectionName: 'AmbianceSection',
    shapes: [
      {
        shape: 'faiscas',
        tone: 'areia',
        opacity: 0.22,
        size: 'clamp(300px, 45vw, 620px)',
        top: '4%',
        left: '-10%',
        rotate: 6,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // LocationReservations: "Como chegar / A brasa já está acesa" (Fundo Escuro #14100D)
  'home-location-reservations': {
    id: 'home-location-reservations',
    page: 'home',
    sectionName: 'LocationReservationsSection',
    shapes: [
      // Peça grande de fundo
      {
        shape: 'nuvem-a',
        tone: 'carvao',
        opacity: 0.35,
        size: 'clamp(320px, 48vw, 660px)',
        bottom: '10%',
        right: '-12%',
        rotate: -15,
        className: 'pointer-events-none select-none',
      },
      // Única forma "brasa" da home: o selo acoplado ao CTA final
      {
        shape: 'selo',
        tone: 'brasa',
        opacity: 0.85,
        size: 'clamp(90px, 11vw, 150px)',
        top: '25px',
        left: '-30px',
        rotate: -8,
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
        shape: 'nuvem-b',
        tone: 'areia',
        opacity: 0.18,
        size: 'clamp(320px, 45vw, 620px)',
        top: '-5%',
        right: '-15%',
        rotate: 10,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'selo',
        tone: 'terracota',
        opacity: 0.12,
        size: 'clamp(140px, 18vw, 220px)',
        bottom: '4%',
        left: '-40px',
        rotate: -6,
        hideOnMobile: true,
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
      // Hero superior direito (sangrando)
      {
        shape: 'nuvem-a',
        tone: 'areia',
        opacity: 0.16,
        size: 'clamp(300px, 44vw, 580px)',
        top: '40px',
        right: '-16%',
        rotate: 12,
        className: 'pointer-events-none select-none',
      },
      // Meio da página entre categorias (lateral esquerda)
      {
        shape: 'mancha-c',
        tone: 'terracota',
        opacity: 0.10,
        size: 'clamp(320px, 42vw, 540px)',
        top: '42%',
        left: '-18%',
        rotate: -15,
        hideOnMobile: true,
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
      // Hero superior esquerdo
      {
        shape: 'nuvem-b',
        tone: 'carvao',
        opacity: 0.45,
        size: 'clamp(320px, 48vw, 640px)',
        top: '20px',
        left: '-15%',
        rotate: -8,
        className: 'pointer-events-none select-none',
      },
      // Meio da página (transição)
      {
        shape: 'pincelada-d',
        tone: 'terracota',
        opacity: 0.24,
        size: 'clamp(350px, 50vw, 700px)',
        top: '48%',
        right: '-15%',
        rotate: 4,
        hideOnMobile: true,
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
        shape: 'mancha-c',
        tone: 'areia',
        opacity: 0.16,
        size: 'clamp(320px, 44vw, 580px)',
        top: '30px',
        right: '-14%',
        rotate: 14,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'sal',
        tone: 'terracota',
        opacity: 0.12,
        size: 'clamp(140px, 18vw, 240px)',
        bottom: '8%',
        left: '-30px',
        rotate: 8,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },
};
