export interface SignatureDish {
  id: string;
  name: string;
  category: 'Carnes' | 'Frutos do mar' | 'Bebidas';
  description: string;
  image: string;
  alt: string;
  whatsappMessage: string;
  note: string;
}

/**
 * Pratos Assinatura do Braseiro Caiçara
 * Fotos reais do acervo do restaurante que ainda não haviam sido utilizadas.
 * NOTA: Nomes e descrições genéricas baseadas estritamente no que se vê em cada foto.
 * Preços omitidos conforme diretriz do projeto.
 */
export const signatureDishes: SignatureDish[] = [
  {
    id: 'prato-1',
    // [CONFIRMAR NOME REAL COM O RESTAURANTE]
    name: 'Corte nobre na brasa',
    category: 'Carnes',
    description: 'Corte bovino alto com capa de gordura selado na brasa com cebolas assadas e alecrim.',
    image: '/images/pratos/prato-corte-nobre.webp',
    alt: 'Corte de carne bovina nobre com capa de gordura na tábua de madeira com guarnições assadas na brasa',
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o Corte Nobre na Brasa do Braseiro Caiçara.',
    note: '', // TODO: Confirmar nome oficial no cardápio impresso
  },
  {
    id: 'prato-2',
    // [CONFIRMAR NOME REAL COM O RESTAURANTE]
    name: 'Arroz caiçara de frutos do mar',
    category: 'Frutos do mar',
    description: 'Arroz cremoso salteado no fogo com camarões graúdos, lula fresca e ervas finas.',
    image: '/images/pratos/prato-arroz-mar.webp',
    alt: 'Prato fundo com arroz cremoso de frutos do mar, camarões e lula servidos com taça de vinho',
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o Arroz Caiçara de Frutos do Mar do Braseiro Caiçara.',
    note: '', // TODO: Confirmar nome oficial no cardápio impresso
  },
  {
    id: 'prato-3',
    // [CONFIRMAR NOME REAL COM O RESTAURANTE]
    name: 'Coquetel cítrico da casa',
    category: 'Bebidas',
    description: 'Drinque autoral âmbar em taça de cristal com fatia de laranja desidratada e hortelã fresca.',
    image: '/images/pratos/prato-coquetel-ambar.webp',
    alt: 'Drinque artesanal âmbar em taça elegante decorado com laranja desidratada sobre tronco rústico',
    whatsappMessage: 'Olá! Gostaria de saber mais sobre a carta de Coquetéis da Casa do Braseiro Caiçara.',
    note: '', // TODO: Confirmar nome oficial no cardápio impresso
  },
  {
    id: 'prato-4',
    // [CONFIRMAR NOME REAL COM O RESTAURANTE]
    name: 'Polvo na brasa com camarão',
    category: 'Frutos do mar',
    description: 'Tentáculos de polvo grelhados no ponto certo com camarão tostado e tomates confitados.',
    image: '/images/pratos/prato-polvo-camarao.webp',
    alt: 'Tentáculo de polvo grelhado na brasa com camarão e tomatinhos em prato rústico',
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o Polvo na Brasa com Camarão do Braseiro Caiçara.',
    note: '', // TODO: Confirmar nome oficial no cardápio impresso
  },
  {
    id: 'prato-5',
    // [CONFIRMAR NOME REAL COM O RESTAURANTE]
    name: 'Frutos do mar na prancha',
    category: 'Frutos do mar',
    description: 'Seleção farta de polvo, camarões pistola e lagosta na grelha finalizados com limão fresco.',
    image: '/images/pratos/prato-prancha-mar.webp',
    alt: 'Tábua generosa de frutos do mar na brasa com polvo e camarões recebendo limão fresco espremido',
    whatsappMessage: 'Olá! Gostaria de saber mais sobre a Prancha de Frutos do Mar do Braseiro Caiçara.',
    note: '', // TODO: Confirmar nome oficial no cardápio impresso
  },
];
