import { BrandShapeProps } from '@/components/BrandShape';

export interface SectionFormasConfig {
  id: string;
  page: 'home' | 'cardapio' | 'gastronomia' | 'drinks' | 'executivos';
  sectionName: string;
  shapes: BrandShapeProps[];
}

/**
 * formasLayoutConfig - Catálogo centralizado das formas de marca aplicadas
 * no site Braseiro Caiçara (Home e páginas do Cardápio) conforme Prompt v7:
 * 
 * DIRETRIZES FUNDAMENTAIS (Prompt v7):
 * 1. Cor sólida e saturada: Proibido opacity < 0.85. Efeitos sutis usam marrom-fogo sólido no escuro.
 * 2. Regra 60-30-10: ~60% fundos, ~30% terracota/areia/marrom-fogo, ~10% brasa.
 * 3. Orçamento de área: formas cobrem <= 15-20% da área da seção.
 * 4. Ritmo e alternância: alternar lado (esq/dir), escala e rotação; máx 2 usos da mesma peça na home.
 * 5. Não competir com destaques: se o título tem palavra em itálico laranja, a forma vizinha é terracota/areia/marrom.
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
        size: 'clamp(280px, 36vw, 480px)',
        top: '6%',
        left: '-12%',
        rotate: 8,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'faiscas',
        tone: 'brasa',
        size: 'clamp(140px, 16vw, 220px)',
        bottom: '10%',
        right: '4%',
        rotate: -10,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // 2. Do mar para a brasa (About) (Fundo Creme #F5E6D0)
  // Peça principal: terracota atrás/saindo do cartão de endereço | Apoio: grão de sal em areia
  'home-about': {
    id: 'home-about',
    page: 'home',
    sectionName: 'AboutSection',
    shapes: [
      {
        shape: 'sal',
        tone: 'areia',
        size: 'clamp(120px, 14vw, 180px)',
        top: '12%',
        left: '3%',
        rotate: -8,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // 3. FireSection ("A mão na brasa"): Foto full-bleed -> Regra: "Seções com foto full-bleed continuam sem forma"
  'home-fire': {
    id: 'home-fire',
    page: 'home',
    sectionName: 'FireSection',
    shapes: [],
  },

  // 4. Sempre cabe mais um (Events) (Fundo Creme #F5E6D0)
  // Peça principal: nuvem brasa grande montada diretamente atrás da colagem de polaroids
  'home-events': {
    id: 'home-events',
    page: 'home',
    sectionName: 'EventsSection',
    shapes: [],
  },

  // 5. Pratos da casa (SignatureDishes) (Fundo Creme #F5E6D0)
  // Peça principal: faíscas laranja + chama em traço montadas diretamente junto ao cabeçalho do título
  'home-signature-dishes': {
    id: 'home-signature-dishes',
    page: 'home',
    sectionName: 'SignatureDishesSection',
    shapes: [],
  },

  // 6. Quem já sentou à mesa (Reviews) (Fundo Escuro #14100D)
  // Peça principal: nuvem terracota atrás do mural | Apoio: nuvem marrom-fogo (tom sobre tom)
  'home-reviews': {
    id: 'home-reviews',
    page: 'home',
    sectionName: 'ReviewsSection',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        size: 'clamp(300px, 36vw, 500px)',
        top: '20%',
        left: '-10%',
        rotate: 12,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'nuvem-b',
        tone: 'marrom-fogo',
        size: 'clamp(280px, 34vw, 460px)',
        bottom: '8%',
        right: '-8%',
        rotate: -12,
        flipX: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // 7. Ambiente & vida caiçara (Ambiance) (Fundo Escuro #14100D)
  // Peça principal: faíscas laranja cruzando a emenda superior
  'home-ambiance': {
    id: 'home-ambiance',
    page: 'home',
    sectionName: 'AmbianceSection',
    shapes: [
      {
        shape: 'pincelada-d',
        tone: 'marrom-fogo',
        size: 'clamp(300px, 38vw, 520px)',
        top: '-40px',
        left: '-8%',
        rotate: 4,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'faiscas',
        tone: 'brasa',
        size: 'clamp(180px, 22vw, 300px)',
        top: '-20px',
        right: '4%',
        rotate: -6,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // 8. Local/Reservas (LocationReservations) (Fundo Escuro #14100D)
  // Peça principal: nuvem marrom-fogo + selo carimbo brasa acoplado ao CTA
  'home-location-reservations': {
    id: 'home-location-reservations',
    page: 'home',
    sectionName: 'LocationReservationsSection',
    shapes: [
      {
        shape: 'mancha-c',
        tone: 'marrom-fogo',
        size: 'clamp(320px, 40vw, 540px)',
        bottom: '8%',
        right: '-10%',
        rotate: -14,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // ==========================================
  // CARDÁPIO HUB (/cardapio)
  // ==========================================
  // Fundo creme: 1 nuvem terracota no hero + 1 areia lateral
  'cardapio-hub': {
    id: 'cardapio-hub',
    page: 'cardapio',
    sectionName: 'CardapioIndexPage',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        size: 'clamp(260px, 32vw, 440px)',
        top: '-20px',
        right: '-10%',
        rotate: 10,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'mancha-c',
        tone: 'areia',
        size: 'clamp(240px, 28vw, 380px)',
        bottom: '6%',
        left: '-10%',
        rotate: -8,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // ==========================================
  // GASTRONOMIA (/cardapio/gastronomia)
  // ==========================================
  // Fundo creme: 1 nuvem terracota no hero + 1 areia lateral (sem forma atrás de preço/foto)
  'cardapio-gastronomia': {
    id: 'cardapio-gastronomia',
    page: 'gastronomia',
    sectionName: 'GastronomiaPage',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        size: 'clamp(260px, 32vw, 440px)',
        top: '25px',
        right: '-12%',
        rotate: 12,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'nuvem-b',
        tone: 'areia',
        size: 'clamp(260px, 30vw, 400px)',
        top: '46%',
        left: '-14%',
        rotate: -10,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // ==========================================
  // DRINKS (/cardapio/drinks)
  // ==========================================
  // Fundo escuro: nuvem terracota no hero + faíscas laranja + marrom-fogo tonal
  'cardapio-drinks': {
    id: 'cardapio-drinks',
    page: 'drinks',
    sectionName: 'DrinksPage',
    shapes: [
      {
        shape: 'nuvem-b',
        tone: 'terracota',
        size: 'clamp(280px, 34vw, 460px)',
        top: '20px',
        left: '-10%',
        rotate: -8,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'faiscas',
        tone: 'brasa',
        size: 'clamp(180px, 22vw, 300px)',
        top: '160px',
        right: '2%',
        rotate: 6,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'mancha-c',
        tone: 'marrom-fogo',
        size: 'clamp(260px, 32vw, 420px)',
        top: '52%',
        right: '-12%',
        rotate: 14,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },

  // ==========================================
  // EXECUTIVOS (/cardapio/executivos)
  // ==========================================
  // Fundo creme: 1 nuvem terracota no hero + 1 areia lateral
  'cardapio-executivos': {
    id: 'cardapio-executivos',
    page: 'executivos',
    sectionName: 'ExecutivosPage',
    shapes: [
      {
        shape: 'nuvem-a',
        tone: 'terracota',
        size: 'clamp(260px, 32vw, 420px)',
        top: '20px',
        right: '-10%',
        rotate: 14,
        className: 'pointer-events-none select-none',
      },
      {
        shape: 'sal',
        tone: 'areia',
        size: 'clamp(120px, 15vw, 190px)',
        bottom: '8%',
        left: '-20px',
        rotate: 6,
        hideOnMobile: true,
        className: 'pointer-events-none select-none',
      },
    ],
  },
};
