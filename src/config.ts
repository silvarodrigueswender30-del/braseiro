export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  content: string;
  note: string;
}

export interface MenuItemPreview {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'meat' | 'fish' | 'cocktail' | 'users';
  badge?: string;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  iconName: 'flame' | 'anchor' | 'trees' | 'users';
}

export interface SiteConfig {
  name: string;
  tagline: string;
  sloganHighlight: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappMessage: string;
  whatsappUrl: string;
  whatsappEventMessage: string;
  whatsappEventUrl: string;
  hoursShort: string;
  hoursDetail: {
    days: string;
    kitchen: string;
    bar: string;
  };
  locationCity: string;
  addressFull: string;
  parkingInfo: string;
  googleMapsUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  navLinks: Array<{ label: string; href: string }>;
  stats: Array<{ value: number; suffix?: string; label: string }>;
  reviews: ReviewItem[];
  menuHighlights: MenuItemPreview[];
  features: FeatureCardItem[];
  headerMode?: 'transparent' | 'solid';
}

/**
 * GUIA DE SUBSTITUIÇÃO DE FONTE TIPOGRÁFICA:
 * Quando tiver os arquivos de fonte customizada (ex: Londrina Solid, Knewave, etc.):
 * 1. Coloque o arquivo de fonte em /public/fonts/NOME_FONTE.woff2
 * 2. Em index.html, declare o preload com alta prioridade:
 *    <link rel="preload" as="font" href="/fonts/NOME_FONTE.woff2" type="font/woff2" crossorigin />
 * 3. Em src/index.css, declare a regra @font-face:
 *    @font-face {
 *      font-family: 'NomeCustomizado';
 *      src: url('/fonts/NOME_FONTE.woff2') format('woff2');
 *      font-weight: 900;
 *      font-style: normal;
 *      font-display: swap;
 *    }
 * 4. Altere apenas a variável --font-display em src/index.css:
 *    --font-display: 'NomeCustomizado', sans-serif;
 *    (O Hero e as seções atualizarão automaticamente).
 */

export const heroVideos = [
  'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/vid01.mp4',
  'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/vid2.mp4',
  'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/vid3.mp4',
];

// PLACEHOLDERS: TODO - preencher com os dados finais de contato/endereço do restaurante
const PHONE_RAW = '5512999999999'; // TODO: preencher com o telefone real
const PHONE_DISPLAY = '(12) 99999-9999'; // TODO: preencher com o telefone visível real
const ADDRESS_FULL = 'Rua Guarani, 370 - Itaguá, Ubatuba - SP'; // TODO: confirmar endereço exato
const INSTAGRAM_HANDLE = '@braseirocaicara.ubatuba'; // TODO: confirmar usuário do Instagram
const GOOGLE_MAPS_URL = 'https://maps.google.com/?q=Braseiro+Caiçara+Ubatuba';
const PARKING_INFO = 'Vagas na rua e estacionamento próximo';

const MSG_RESERVA = 'Oi! Quero reservar uma mesa no Braseiro Caiçara.';
const MSG_EVENTO = 'Oi! Gostaria de planejar um evento / mesa de grupo no Braseiro Caiçara.';

export const siteConfig: SiteConfig = {
  name: 'Braseiro Caiçara',
  tagline: 'Parrilla · Frutos do Mar · Ubatuba',
  sloganHighlight: 'Acende o fogo, senta à mesa.',
  phoneDisplay: PHONE_DISPLAY,
  phoneRaw: PHONE_RAW,
  whatsappMessage: MSG_RESERVA,
  whatsappUrl: `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(MSG_RESERVA)}`,
  whatsappEventMessage: MSG_EVENTO,
  whatsappEventUrl: `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(MSG_EVENTO)}`,
  hoursShort: 'Todos os dias · 11h30–23h30',
  hoursDetail: {
    days: 'Segunda a Domingo: 11h30 – 23h30',
    kitchen: 'Parrilla acesa das 11h30 às 23h00',
    bar: 'Coquetelaria e chopp até às 23h30',
  },
  headerMode: 'transparent',
  locationCity: 'Ubatuba, SP',
  addressFull: ADDRESS_FULL,
  parkingInfo: PARKING_INFO,
  googleMapsUrl: GOOGLE_MAPS_URL,
  instagramHandle: INSTAGRAM_HANDLE,
  instagramUrl: 'https://instagram.com/braseirocaicara.ubatuba', // [CONFIRMAR]
  navLinks: [
    { label: 'Início', href: '/#inicio' },
    { label: 'A Casa', href: '/#casa' },
    { label: 'O Fogo', href: '/#fogo' },
    { label: 'Pratos', href: '/#pratos' },
    { label: 'Cardápio', href: '/cardapio' },
    { label: 'Eventos', href: '/#eventos' },
    { label: 'Reservas', href: '/#contato-reservas' },
    { label: 'Ambiente', href: '/#ambiente' },
    { label: 'Contato', href: '/#contato' },
  ],
  stats: [
    { value: 7, label: 'dias de brasa por semana' },
    { value: 12, label: 'horas de fogo aceso' },
    { value: 15.8, suffix: ' mil', label: 'no Instagram' },
    { value: 2, label: 'brasas: terra e mar' },
  ],
  menuHighlights: [
    {
      id: 'carnes',
      title: 'Carnes na Brasa',
      subtitle: 'Fogo vivo & cortes nobres',
      description: 'Picanha alta, bife de chorizo e assado de tira no ponto da sua preferência, selados na lenha e sal grosso marinho.',
      iconName: 'meat',
      badge: 'Parrilla Autêntica',
    },
    {
      id: 'frutos-do-mar',
      title: 'Frutos do Mar',
      subtitle: 'Direto do pescador local',
      description: 'Polvo grelhado com azeite de ervas, camarões gigantes na brasa e peixe do dia fresco do litoral de Ubatuba.',
      iconName: 'fish',
      badge: 'Fresco de Ubatuba',
    },
    {
      id: 'drinks',
      title: 'Drinks da Casa',
      subtitle: 'Botânicos & frescor caiçara',
      description: 'Coquetelaria autoral em tons âmbar, cítricos frescos da Mata Atlântica e clássicos reimaginados para acompanhar o fogo.',
      iconName: 'cocktail',
      badge: 'Autoral & Chopp',
    },
    {
      id: 'eventos',
      title: 'Eventos & Grupos',
      subtitle: 'Mesa compartilhada sem pressa',
      description: 'Formatos especiais para aniversários, confraternizações e grupos, com tábuas no centro da mesa e serviço acolhedor.',
      iconName: 'users',
      badge: 'Sob Reserva',
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      author: 'Mariana Silveira [CONFIRMAR]',
      location: 'São Paulo, SP',
      rating: 5,
      date: 'Há 2 semanas',
      content: 'A melhor experiência gastronômica de Ubatuba. O ponto da carne na brasa é impecável e o polvo grelhado derrete na boca. Ambiente acolhedor e atendimento caloroso.',
      note: '[SUBSTITUIR por avaliação real do Google]',
    },
    {
      id: 'rev-2',
      author: 'Rodrigo Medeiros [CONFIRMAR]',
      location: 'Campinas, SP',
      rating: 5,
      date: 'Há 1 mês',
      content: 'Lugar fantástico! A casa tem uma energia caiçara incrível com aquela fumaça boa de lenha. Os drinks em tom âmbar são sensacionais e a mesa de grupo foi perfeita.',
      note: '[SUBSTITUIR por avaliação real do Google]',
    },
    {
      id: 'rev-3',
      author: 'Camila & Felipe [CONFIRMAR]',
      location: 'Ubatuba, SP',
      rating: 5,
      date: 'Há 3 semanas',
      content: 'Frequência obrigatória sempre que descemos para o litoral. O assado de tira e a provoleta são espetaculares. Equipe muito atenciosa do começo ao fim.',
      note: '[SUBSTITUIR por avaliação real do Google]',
    },
  ],
  features: [
    {
      id: 'feat-1',
      title: 'Brasa de Verdade',
      tagline: 'Lenha & Carvão Nobre',
      description: 'Sem atalhos de gás. Fogo lento alimentado com lenha de eucalipto e carvão vegetal que garantem a crosta caramelizada perfeita.',
      image: '/images/pratos/card-brasa-verdade.webp',
      iconName: 'flame',
    },
    {
      id: 'feat-2',
      title: 'Mar na Mesa',
      tagline: 'Pescados da Costa',
      description: 'Pescadores artesanais de Ubatuba entregando peixes frescos, polvos e camarões diariamente direto na nossa cozinha de praia.',
      image: '/images/pratos/card-mar-mesa.webp',
      iconName: 'anchor',
    },
    {
      id: 'feat-3',
      title: 'Casa na Mata',
      tagline: 'Madeira, Brisa & Alma',
      description: 'Construção rústica com elementos de canoa caiçara, tijolo aparente e ventilação natural que abraça o clima de Ubatuba.',
      image: '/images/ambiente/card-casa-mata.webp',
      iconName: 'trees',
    },
    {
      id: 'feat-4',
      title: 'Mesa de Grupo',
      tagline: 'Partilha & Celebração',
      description: 'Aqui ninguém come com pressa. Bancadas e mesas generosas pensadas para abrir vinho, dividir travessas e celebrar a vida.',
      image: '/images/ambiente/card-mesa-grupo.webp',
      iconName: 'users',
    },
  ],
};
