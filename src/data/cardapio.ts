/**
 * CARDÁPIO - BRASEIRO CAIÇARA
 *
 * COMO EDITAR ESTE ARQUIVO:
 * 1. Para adicionar ou modificar itens, altere os objetos dentro do array `menuItems`.
 * 2. `categoria` deve ser exatamente uma das seguintes:
 *    'Carnes' | 'Frutos do mar' | 'Acompanhamentos' | 'Sobremesas' | 'Bebidas'
 * 3. Se um item não tiver preço definido, deixe `price: undefined` ou omita o campo; ele exibirá "Consulte".
 * 4. `tags` é opcional (ex: ['Destaque da Casa', 'Para Compartilhar', 'Sem Glúten']).
 *
 * AVISO: Todos os itens abaixo são apenas EXEMPLOS estruturais.
 * Devem ser substituídos pelo cardápio real fornecido pelo restaurante.
 */

export type MenuCategoryType =
  | 'Carnes'
  | 'Frutos do mar'
  | 'Acompanhamentos'
  | 'Sobremesas'
  | 'Bebidas';

export interface MenuItem {
  id: string;
  category: MenuCategoryType;
  name: string;
  description: string;
  price?: string; // Formato: "R$ 00,00" ou undefined
  tags?: string[];
  note: string;
}

export const menuCategories: Array<{ id: 'Todos' | MenuCategoryType; label: string }> = [
  { id: 'Todos', label: 'Todos' },
  { id: 'Carnes', label: 'Carnes na Brasa' },
  { id: 'Frutos do mar', label: 'Frutos do Mar' },
  { id: 'Acompanhamentos', label: 'Acompanhamentos' },
  { id: 'Sobremesas', label: 'Sobremesas' },
  { id: 'Bebidas', label: 'Bebidas & Coquetéis' },
];

export const menuItems: MenuItem[] = [
  // CARNES NA BRASA
  {
    id: 'm-carne-1',
    category: 'Carnes',
    name: 'Picanha na Parrilla [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Corte nobre alto com capa de gordura, grelhado na brasa viva e finalizado com flor de sal marinho.',
    price: 'Consulte',
    tags: ['Destaque'],
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },
  {
    id: 'm-carne-2',
    category: 'Carnes',
    name: 'Bife de Chorizo Caiçara [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Corte tradicional de contrafilé argentino preparado no calor da lenha ao ponto da sua preferência.',
    price: 'Consulte',
    tags: ['Favorito'],
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },
  {
    id: 'm-carne-3',
    category: 'Carnes',
    name: 'Assado de Tira [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Corte transversal de costela com osso fino, suculento e crocante no fogo forte.',
    price: 'Consulte',
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },

  // FRUTOS DO MAR
  {
    id: 'm-mar-1',
    category: 'Frutos do mar',
    name: 'Polvo Grelhado na Brasa [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Tentáculos macios selados no fogo com azeite de ervas frescas e tomatinhos confitados.',
    price: 'Consulte',
    tags: ['Especialidade'],
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },
  {
    id: 'm-mar-2',
    category: 'Frutos do mar',
    name: 'Camarões Pistola na Brasa [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Camarões gigantes pescados em Ubatuba, tostados inteiros com alho crocante e limão cravo.',
    price: 'Consulte',
    tags: ['Fresco de Ubatuba'],
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },
  {
    id: 'm-mar-3',
    category: 'Frutos do mar',
    name: 'Peixe do Dia na Folha de Bananeira [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Pescado fresco desembarcado pelos pescadores locais, assado com farofa caiçara e vinagrete de praia.',
    price: 'Consulte',
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },

  // ACOMPANHAMENTOS
  {
    id: 'm-acomp-1',
    category: 'Acompanhamentos',
    name: 'Farofa Caiçara de Banana da Terra [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Farinha de mandioca torrada na manteiga de garrafa com pedaços de banana e bacon crocante.',
    price: 'Consulte',
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },
  {
    id: 'm-acomp-2',
    category: 'Acompanhamentos',
    name: 'Legumes na Brasa com Azeite de Ervas [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Cebola roxa, abobrinha, abóbora cabotiá e pimentões selados na grelha da parrilla.',
    price: 'Consulte',
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },

  // SOBREMESAS
  {
    id: 'm-sob-1',
    category: 'Sobremesas',
    name: 'Panqueca de Doce de Leite na Brasa [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Massa fininha recheada com doce de leite artesanal, polvilhada com açúcar caramelizado no ferro quente.',
    price: 'Consulte',
    tags: ['Tradicional'],
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },
  {
    id: 'm-sob-2',
    category: 'Sobremesas',
    name: 'Abacaxi Grelhado com Canela e Sorvete [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Fatias de abacaxi douradas na parrilla com especiarias e sorvete artesanal de baunilha.',
    price: 'Consulte',
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },

  // BEBIDAS & COQUETÉIS
  {
    id: 'm-beb-1',
    category: 'Bebidas',
    name: 'Caipirinha Caiçara de Frutas da Mata [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Cachaça artesanal da região, mix de frutas cítricas frescas e açúcar mascavo orgânico.',
    price: 'Consulte',
    tags: ['Autoral'],
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },
  {
    id: 'm-beb-2',
    category: 'Bebidas',
    name: 'Chopp Artesanal Trincando [EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
    description: 'Caneca congelada de chopp artesanal de cervejarias selecionadas do Vale e Litoral.',
    price: 'Consulte',
    note: '[EXEMPLO – SUBSTITUIR PELO CARDÁPIO REAL]',
  },
];
