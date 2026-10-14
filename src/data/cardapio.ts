/**
 * CARDÁPIO DO BRASEIRO CAIÇARA
 * ---------------------------------------------------------------------------
 * COMO EDITAR (sem mexer em componentes):
 *  - Mudar um PREÇO: procure o item e altere o número em `$(...)`, ex.: `$(28.9)` -> `$(31.9)`.
 *    Use ponto como separador decimal. A formatação em R$ é automática.
 *  - Item com 2 tamanhos: `[$(136.9, 1, '300g'), $(229.9, 2, '600g')]`
 *      (1º número = preço, 2º = quantas pessoas serve, 3º = rótulo do tamanho).
 *  - Esconder um item sem apagar: acrescente `indisponivel: true`.
 *  - Marcar para conferir depois: acrescente `revisar: true`.
 *  - Textos/fotos novos: use as mesmas chaves dos itens vizinhos.
 *
 * Fonte: transcrito das imagens originais do cardápio (Wix) e conferido item a item.
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
export interface Foto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Preco {
  /** Rótulo do tamanho/variação, ex.: "300g", "P", "Misto ou com leite". */
  rotulo?: string;
  valor: number;
  /** Quantas pessoas serve (ícone de pessoas do cardápio impresso). */
  serve?: 1 | 2 | 3;
}

export interface Adicional {
  nome: string;
  valor: number;
}

export interface ItemCardapio {
  id: string;
  nome: string;
  descricao?: string;
  /** Gramatura/quantidade, ex.: "450g", "1 unidade". */
  detalhe?: string;
  precos: Preco[];
  vegetariano?: boolean;
  destaque?: boolean;
  assinatura?: boolean;
  adicionais?: Adicional[];
  sabores?: string[];
  foto?: Foto;
  indisponivel?: boolean;
  revisar?: boolean;
}

export interface GrupoItens {
  nome?: string;
  itens: ItemCardapio[];
}

export type IconeSecao = 'prato' | 'taca' | 'chama' | 'onda';

export interface CategoriaCardapio {
  id: string;
  nome: string;
  subtitulo?: string;
  /** Selo pequeno acima do título (ex.: "À la carte"). */
  selo?: string;
  icone: IconeSecao;
  grupos: GrupoItens[];
  /** Foto de abertura da categoria (quando não pertence a um prato específico). */
  foto?: Foto;
  /** Bloco de observação ao final da categoria. */
  nota?: { titulo?: string; linhas: string[] };
}

export interface Drink {
  id: string;
  nome: string;
  descricao: string;
  /** Complemento de descrição (ex.: variações). */
  detalhe?: string;
  tags: string[];
  preco: number;
  assinatura?: boolean;
  foto: Foto;
}

export interface LinhaPreco {
  nome: string;
  preco: number;
}

export interface ItemExecutivo {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  foto: Foto;
}

import fotosMapRaw from './fotos-map.json';

const fotosMap = fotosMapRaw as Record<
  string,
  { arquivo: string; arquivo400w?: string; arquivo800w?: string; fonte: string; confianca: string; alt: string }
>;

// ---------------------------------------------------------------------------
// Helpers (não precisa mexer)
// ---------------------------------------------------------------------------
const $ = (valor: number, serve?: 1 | 2 | 3, rotulo?: string): Preco => ({ valor, serve, rotulo });

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

type ItemSemId = Omit<ItemCardapio, 'id'>;
const itens = (prefixo: string, lista: ItemSemId[]): ItemCardapio[] =>
  lista.map((i) => {
    const id = `${prefixo}-${slug(i.nome)}`;
    const fotoInfo = fotosMap[id];
    let foto = i.foto;
    if (!foto && fotoInfo) {
      foto = {
        src: fotoInfo.arquivo800w || fotoInfo.arquivo,
        alt: fotoInfo.alt || i.nome,
        width: 800,
        height: 600,
      };
    }
    return { ...i, id, foto };
  });

const fotoPrato = (arquivo: string, alt: string, width = 1200, height = 600): Foto => ({
  src: `/cardapio/fotos/${arquivo}.webp`,
  alt,
  width,
  height,
});
const fotoDrink = (arquivo: string, alt: string): Foto => ({
  src: `/cardapio/fotos/${arquivo}.webp`,
  alt,
  width: 640,
  height: 800,
});
const fotoExec = (arquivo: string, alt: string): Foto => ({
  src: `/cardapio/executivos/${arquivo}.webp`,
  alt,
  width: 480,
  height: 255,
});

// ---------------------------------------------------------------------------
// GASTRONOMIA
// ---------------------------------------------------------------------------
export const gastronomia: CategoriaCardapio[] = [
  {
    id: 'entradas',
    nome: 'Entradas',
    icone: 'prato',
    grupos: [
      {
        itens: itens('entradas', [
          { nome: 'Casquinha de Siri', precos: [$(28.9)], detalhe: '1 unidade' },
          { nome: 'Casquinha de Lagosta', precos: [$(38.9)], detalhe: '1 unidade' },
          {
            nome: 'Ceviche de Banana da Terra',
            precos: [$(49.9)],
            vegetariano: true,
            descricao:
              'Banana da terra ao molho de limão braseiro, pimentas da casa, coentro. Acompanha chips de batata doce.',
          },
          {
            nome: 'Ceviche de Salmão e Peixe Branco',
            precos: [$(129.9)],
            descricao:
              'Salmão e peixe branco ao molho de limão braseiro, pimentas da casa e coentro. Acompanha chips de batata doce.',
          },
          { nome: 'Bolinho de Bacalhau', precos: [$(36.9)], detalhe: '4 unidades' },
          {
            nome: 'Tentáculos de Polvo',
            precos: [$(169.9)],
            destaque: true,
            descricao:
              'Polvo local cozido em rico caldo, e grelhado na brasa, servido com batata sauté e tomatinhos confit.',
            foto: fotoPrato(
              'tentaculos-de-polvo',
              'Tentáculos de polvo grelhados na brasa com batata sauté e tomatinhos confit, servidos em tábua de madeira'
            ),
          },
          {
            nome: 'Antepastos Braseiro',
            precos: [$(44.9)],
            descricao: 'Pão à moda Braseiro acompanhado de antepasto da casa.',
          },
          {
            nome: 'Provoleta na Brasa',
            precos: [$(29.9)],
            detalhe: '200g',
            descricao: 'Provolone grelhado no fogo forte, servido borbulhando com chimichurri da casa.',
          },
          {
            nome: 'Palmito Pupunha na Brasa',
            precos: [$(59.9)],
            descricao: 'Palmito de pupunha grelhado com azeite de ervas e tomatinhos confit.',
          },
        ]),
      },
    ],
  },
  {
    id: 'porcoes',
    nome: 'Porções',
    icone: 'prato',
    grupos: [
      {
        itens: itens('porcoes', [
          { nome: 'Batata Frita', precos: [$(39.9)] },
          {
            nome: 'Taça Crocante de Camarão',
            precos: [$(154.9)],
            descricao: 'Camarões rosa empanados na panko, crocantes com molho especial do chef servido na taça.',
          },
          {
            nome: 'Pescada à Dorê',
            precos: [$(138.9)],
            detalhe: '450g',
            descricao: 'Iscas de pescada, empanadas, acompanhadas de molho Braseiro.',
          },
          {
            nome: 'Abadejo à Dorê',
            precos: [$(159.9)],
            detalhe: '450g',
            descricao: 'Iscas de abadejo, empanadas, acompanhadas de molho Braseiro.',
          },
          {
            nome: 'Linguiça Artesanal',
            precos: [$(79.9)],
            detalhe: '400g',
            descricao: 'Flambada na cachaça da casa, acompanha farofa, vinagrete e pão Braseiro.',
          },
          {
            nome: 'Torresmo de Rolo',
            precos: [$(42.9)],
            descricao:
              'Nosso torresmo de rolo é um espetáculo da gastronomia, crocante e delicioso. Acompanha geleia de goiaba levemente apimentada.',
          },
          {
            nome: 'Lula à Dorê',
            precos: [$(109.9)],
            descricao: 'Mix de lulas empanadas, acompanha molho Braseiro.',
          },
        ]),
      },
    ],
  },
  {
    id: 'saladas',
    nome: 'Saladas',
    icone: 'prato',
    grupos: [
      {
        itens: itens('saladas', [
          {
            nome: 'Completona',
            precos: [$(59.9)],
            descricao: 'Alface, rúcula, tomate, palmito, cebola roxa, azeitona e ovinhos de codorna.',
          },
          {
            nome: 'Salada Caiçara',
            precos: [$(74.9)],
            destaque: true,
            descricao:
              'Alface americana, camarão braseado, lascas de queijo canastra e croutons ao molho de mostarda e mel.',
            foto: fotoPrato(
              'salada-caicara',
              'Salada Caiçara com camarão braseado, lascas de queijo canastra e croutons em tigela artesanal'
            ),
          },
          {
            nome: 'Palmito',
            precos: [$(69.9)],
            descricao: 'Palmito de palmeira real em conserva, regado no azeite de ervas.',
          },
        ]),
      },
    ],
  },
  {
    id: 'carnes',
    nome: 'Carnes',
    selo: 'À la carte',
    subtitulo: 'Troca de vegetais por fritas sem acréscimo',
    icone: 'prato',
    grupos: [
      {
        itens: itens('carnes', [
          {
            nome: 'Filé Mignon à Parmegiana',
            precos: [$(272.9, 2)],
            descricao:
              'Filé mignon à milanesa com molho de tomate italiano, gratinado com muçarela, acompanha arroz branco e batata frita.',
          },
          {
            nome: 'Picanha Angus',
            precos: [$(299.99, 2)],
            detalhe: '600g',
            descricao: 'Acompanha arroz biro-biro, salada de batata com maionese e vinagrete.',
          },
          {
            nome: 'Filé Mignon Angus',
            precos: [$(259.9, 1)],
            detalhe: '600g',
            descricao: 'Acompanha arroz biro-biro, salada de batata com maionese e vinagrete.',
          },
          {
            nome: 'Bife de Chorizo Angus',
            precos: [$(229.9, 2)],
            detalhe: '600g',
            descricao: 'Acompanha arroz branco, vegetais grelhados, farofa e vinagrete.',
          },
          {
            nome: 'Bife Ancho Angus',
            precos: [$(229.9, 2)],
            detalhe: '600g',
            descricao: 'Acompanha arroz branco, vegetais grelhados, farofa e vinagrete.',
          },
          {
            nome: 'Baby Beef Angus',
            precos: [$(198.9, 2)],
            detalhe: '600g',
            descricao: 'Acompanha arroz biro-biro, salada de batata com maionese e vinagrete.',
          },
          {
            nome: 'Trio Braseiro',
            precos: [$(397.9, 3)],
            detalhe: '900g',
            destaque: true,
            descricao:
              'Bife de ancho Angus, baby beef e picanha Angus; acompanha arroz biro-biro, vegetais grelhados, batata frita e vinagrete.',
          },
        ]),
      },
    ],
  },
  {
    id: 'hamburguer',
    nome: 'Hambúrguer na Brasa',
    icone: 'chama',
    grupos: [
      {
        itens: itens('hamburguer', [
          {
            nome: 'Burguer na Brasa',
            precos: [$(49.9, 1)],
            detalhe: '180g',
            descricao: 'Suculenta carne bovina Angus de 180 gramas com delicioso queijo do chefe.',
            adicionais: [
              { nome: 'Bacon', valor: 8.9 },
              { nome: 'Mais queijo cheddar', valor: 7.9 },
              { nome: 'Salada (alface e tomate)', valor: 7.0 },
              { nome: 'Acompanha fritas', valor: 10.0 },
            ],
          },
          {
            nome: 'Sanduíche de Costela',
            precos: [$(68.9, 1)],
            detalhe: '220g',
            destaque: true,
            descricao:
              '220g de uma suculenta carne de costela bovina preparada por mais de 6 horas na brasa, creme de gorgonzola e a deliciosa batata chips da casa.',
            foto: fotoPrato(
              'sanduiche-de-costela',
              'Sanduíche de costela bovina com creme de gorgonzola e batata chips da casa'
            ),
          },
        ]),
      },
    ],
  },
  {
    id: 'monte-o-prato',
    nome: 'Monte o Prato',
    subtitulo: 'Escolha suas opções e monte ao seu gosto!',
    icone: 'chama',
    foto: fotoPrato('monte-o-prato', 'Corte de carne bovina grelhado na brasa, servido em tábua de madeira'),
    grupos: [
      {
        nome: 'Na Brasa',
        itens: itens('brasa', [
          {
            nome: 'Costela Bovina',
            precos: [$(179.9)],
            detalhe: '700g',
            descricao:
              'Nossa costela bovina é cuidadosamente assada por mais de 6 horas na brasa, resultando em uma carne extremamente suculenta e saborosa. Com aproximadamente 700 gramas, é a escolha perfeita para quem aprecia um corte de carne bem preparado e cheio de sabor.',
          },
          { nome: 'Picanha Angus', precos: [$(98.9)], detalhe: '250g' },
          { nome: 'Baby Beef Angus', precos: [$(68.9)], detalhe: '250g' },
          { nome: 'Bife de Chorizo Angus', precos: [$(78.9)], detalhe: '250g' },
          { nome: 'Bife Ancho Angus', precos: [$(69.9)], detalhe: '250g' },
          { nome: 'Filé Mignon Angus', precos: [$(87.9)], detalhe: '250g' },
        ]),
      },
      {
        nome: 'Acompanhamento individual',
        itens: itens('acomp', [
          { nome: 'Arroz Biro-Biro', precos: [$(39.9)] },
          { nome: 'Arroz Branco', precos: [$(32.9)] },
          { nome: 'Arroz à Grega', precos: [$(39.9)] },
          { nome: 'Arroz de Alho Poró', precos: [$(34.9)] },
          { nome: 'Feijão', precos: [$(18.9)] },
          { nome: 'Batata Sauté', precos: [$(26.9)] },
          { nome: 'Salada de Batata com Maionese', precos: [$(28.9)] },
          { nome: 'Purê de Batata', precos: [$(26.9)] },
          { nome: 'Purê de Mandioquinha', precos: [$(29.9)] },
          { nome: 'Farofa de Torresmo', precos: [$(15.9)] },
          { nome: 'Farofa de Banana', precos: [$(29.9)] },
          { nome: 'Vinagrete Tradicional', precos: [$(12.9)] },
          { nome: 'Ovo Caipira', precos: [$(6.9)] },
          { nome: 'Vegetais na Brasa', precos: [$(42.9)] },
          { nome: 'Omelete', precos: [$(18.9)] },
          { nome: 'Catupiry', precos: [$(18.9)] },
          { nome: 'Camarão Rosa', precos: [$(36.9)], detalhe: 'unidade' },
          { nome: 'Pirão de Peixe', precos: [$(36.9)] },
          { nome: 'Salmão', precos: [$(41.9)], detalhe: '150g' },
          { nome: 'Abadejo', precos: [$(38.9)], detalhe: '150g' },
          { nome: 'Robalo', precos: [$(43.9)], detalhe: '150g' },
          { nome: 'Pescada Branca', precos: [$(32.9)], detalhe: '150g' },
        ]),
      },
    ],
  },
  {
    id: 'peixes',
    nome: 'Peixes',
    icone: 'onda',
    grupos: [
      {
        itens: itens('peixes', [
          {
            nome: 'Pescada Cambucu',
            precos: [$(136.9, 1, '300g'), $(229.9, 2, '600g')],
            descricao: 'Filé de cambucu com leve tempero do chefe, acompanha arroz branco e batata frita.',
          },
          {
            nome: 'Pescada ao Molho de Camarão',
            precos: [$(149.9, 1, '300g'), $(253.9, 2, '600g')],
            descricao:
              'Filé de pescada cambucu empanada e coberta com molho de tomate italiano e camarão, acompanha arroz branco e chips.',
          },
          {
            nome: 'Abadejo ao Molho de Camarão',
            precos: [$(157.9, 1, '300g'), $(279.9, 2, '600g')],
            descricao:
              'Filé de abadejo empanado e coberto com molho de tomate italiano e camarões, acompanha arroz branco e batata frita.',
          },
          {
            nome: 'Robalo do Chef',
            precos: [$(169.9, 1, '300g'), $(289.9, 2, '600g')],
            descricao:
              'Filé de robalo grelhado com camarões rosa salteados no azeite e palmito refogado na manteiga, acompanha arroz branco.',
          },
          {
            nome: 'Salmão na Brasa',
            precos: [$(139.9, 1, '300g'), $(239.9, 2, '600g')],
            descricao: 'Postas de salmão na brasa, acompanha purê de mandioquinha, farofa de banana e arroz de alho poró.',
          },
          {
            nome: 'Abadejo do Chef',
            precos: [$(159.9, 1, '300g'), $(279.9, 2, '600g')],
            descricao: 'Filé de abadejo grelhado e camarões salteados no azeite, acompanha arroz à grega e farofa de banana.',
          },
          {
            nome: 'Abadejo à Valenciana',
            precos: [$(149.9, 1, '300g'), $(269.9, 2, '600g')],
            descricao:
              'Filé de abadejo coberto com lulas da nossa região, azeitonas pretas, pimentões salteados na manteiga. Acompanha arroz branco e purê de batata.',
          },
        ]),
      },
    ],
  },
  {
    id: 'frutos-do-mar',
    nome: 'Frutos do Mar',
    icone: 'onda',
    grupos: [
      {
        itens: itens('frutos-do-mar', [
          {
            nome: 'Churrasco do Mar',
            precos: [$(434.9)],
            destaque: true,
            descricao:
              'Calda de lagosta, tentáculos de polvo, camarões pistola, posta de robalo, acompanha tomate confit, maionese da casa e arroz de alho poró.',
            foto: fotoPrato(
              'churrasco-do-mar',
              'Churrasco do Mar: lagosta, tentáculos de polvo, camarões pistola e posta de robalo em tábua Braseiro Caiçara'
            ),
          },
          {
            nome: 'Camarão ao Catupiry',
            precos: [$(172.9, 1, 'P'), $(298.9, 2, 'G')],
            descricao: 'Camarões rosa descascados cobertos com molho de catupiry e palmito, acompanha arroz branco.',
          },
          {
            nome: 'Camarão do Chefe',
            precos: [$(174.9, 1)],
            descricao:
              'Camarões rosa descascados e salteados no azeite com cenoura, brócolis, batata, tomate confit e palmitos no azeite Braseiro, acompanha arroz branco.',
          },
          {
            nome: 'Chiclete de Camarão',
            precos: [$(189.9, 1, 'P'), $(319.9, 2, 'G')],
            descricao: 'Camarões ao molho clássico Braseiro de três queijos, acompanha arroz de alho poró.',
          },
          {
            nome: 'Lagosta Caiçara',
            precos: [$(269.9, 1, '200g'), $(489.9, 2, '400g')],
            descricao: 'Lagosta salteada na manteiga de ervas, arroz de alho poró, batata sauté e legumes salteados.',
          },
          {
            nome: 'Polvo Braseado',
            precos: [$(329.9, 2)],
            descricao: 'Polvo na brasa, acompanha purê de mandioquinha, tomate confit e arroz branco.',
          },
          {
            nome: 'Camarão na Moranga à Moda Braseiro',
            precos: [$(354.9, 2)],
            destaque: true,
            descricao:
              'Molho elaborado com carne de abóbora, tomate pelado italiano, creme de leite, camarões rosa e sete barbas, gratinado com parmesão e catupiry legítimo. Dois camarões pistola servidos na própria abóbora moranga (podendo acrescentar com valor cobrado à parte), acompanha arroz branco e fritas canoa.',
            foto: fotoPrato(
              'camarao-na-moranga',
              'Camarão na Moranga à moda Braseiro, servido na própria abóbora com dois camarões pistola e chips'
            ),
          },
          {
            nome: 'Moqueca de Peixe',
            precos: [$(279.9, 2)],
            descricao: 'Peixe abadejo ao molho de moqueca com leve toque de coentro, acompanha arroz, farofa de banana e pirão de peixe.',
          },
          {
            nome: 'Moqueca Mista',
            precos: [$(329.9, 2)],
            descricao:
              'Peixe abadejo, camarões rosa ao molho de moqueca com leve toque de coentro, acompanha arroz, farofa de banana e pirão de peixe.',
          },
          {
            nome: 'Caldeirada de Frutos do Mar',
            precos: [$(329.9, 2)],
            descricao: 'Mexilhões, polvo, lula, peixe abadejo e camarão, acompanha arroz branco, farofa de banana e pirão de peixe.',
          },
        ]),
      },
    ],
  },
  {
    id: 'aves',
    nome: 'Aves',
    subtitulo: 'Troca de vegetais por fritas sem acréscimo',
    icone: 'prato',
    grupos: [
      {
        itens: itens('aves', [
          { nome: 'Filé de Frango', precos: [$(75.9, 1)], descricao: 'Filé de frango com vegetais na brasa.' },
          {
            nome: 'Filé de Frango à Parmegiana',
            precos: [$(98.9, 1, 'P'), $(179.9, 2, 'G')],
            descricao:
              'Filé de frango à milanesa com molho de tomate italiano gratinado com muçarela, acompanha arroz branco e batata frita.',
          },
        ]),
      },
    ],
  },
  {
    id: 'massas-risotos',
    nome: 'Massas e Risotos',
    selo: 'Empratados',
    icone: 'prato',
    grupos: [
      {
        itens: itens('massas', [
          {
            nome: 'Massa à Bolonhesa',
            precos: [$(72.9, 1)],
            descricao: 'Linguini servido ao molho de tomate à bolonhesa, acompanha queijo parmesão.',
          },
          {
            nome: 'Massa de Frutos do Mar',
            precos: [$(139.7, 1)],
            descricao: 'Linguini com camarões, lulas, polvo ao molho de tomate italiano e queijo parmesão.',
          },
          {
            nome: 'Massa com Filé Mignon',
            precos: [$(142.9, 1)],
            descricao: 'Linguini alho e óleo, filé mignon na brasa com molho gorgonzola.',
          },
          {
            nome: 'Espaguete Pupunha ao Molho de Camarão',
            precos: [$(102.9, 1)],
            descricao: 'Espaguete de pupunha de origem indígena ao molho de camarão.',
          },
          {
            nome: 'Risoto Trio de Cogumelos',
            precos: [$(119.9, 1)],
            descricao: 'Arroz arbóreo cozido no caldo de legumes e cogumelos.',
          },
          {
            nome: 'Risoto de Frutos do Mar',
            precos: [$(149.9, 1)],
            descricao:
              'Arroz arbóreo cozido no caldo de frutos do mar com vinho branco, camarão, lula, polvo, acompanha queijo parmesão.',
          },
          {
            nome: 'Risoto de Lagosta',
            precos: [$(179.9, 1)],
            descricao:
              'Arroz arbóreo cozido no caldo de frutos do mar com vinho branco, carne de lagosta, acompanha queijo parmesão.',
          },
          {
            nome: 'Risoto de Palmito com Catupiry',
            precos: [$(92.9, 1)],
            descricao: 'Arroz arbóreo cozido no caldo de legumes, palmito e catupiry.',
          },
        ]),
      },
    ],
  },
  {
    id: 'kids',
    nome: 'Pratos Kids',
    icone: 'prato',
    grupos: [
      {
        itens: itens('kids', [
          { nome: 'Carne', precos: [$(46.9)] },
          { nome: 'Frango', precos: [$(39.9)] },
          { nome: 'Peixe', precos: [$(46.9)] },
          { nome: 'Linguiça Toscana', precos: [$(39.9)] },
          { nome: 'Omelete (tomate e queijo)', precos: [$(39.9)] },
        ]),
      },
    ],
    nota: {
      titulo: 'Escolha um dos três acompanhamentos',
      linhas: ['Arroz, feijão e fritas', 'Linguine ao sugo', 'Linguine na manteiga'],
    },
  },
  {
    id: 'bebidas',
    nome: 'Bebidas',
    selo: 'Sem álcool',
    icone: 'taca',
    foto: fotoPrato('soda-italiana', 'Duas sodas italianas, uma de frutas vermelhas e outra de limão e hortelã', 900, 450),
    grupos: [
      {
        itens: itens('bebidas', [
          {
            nome: 'Soda Italiana',
            detalhe: '500ml',
            precos: [$(18.9)],
            sabores: ['Maçã verde', 'Tangerina', 'Limão Siciliano', 'Morango', 'Cereja', 'Frutas Vermelhas'],
          },
          {
            nome: 'Refrigerante Lata',
            precos: [$(11.9)],
            sabores: [
              'Coca-Cola',
              'Coca-Zero',
              'Guaraná',
              'Guaraná zero',
              'Sprite',
              'Fanta Uva/Laranja',
              'Tônica',
              'Schweppes citrus',
            ],
          },
          { nome: 'Água', precos: [$(7.9)] },
          { nome: 'Água com Gás', precos: [$(7.9)] },
          {
            nome: 'Energético',
            precos: [$(21.9)],
            sabores: ['Energy Drink', 'Sugar Free', 'Tropical (frutas tropicais)', 'Melancia'],
          },
          {
            nome: 'Sucos',
            detalhe: '400ml',
            descricao: 'Todos os sucos são naturais da fruta.',
            precos: [$(16.9, undefined, 'Suco'), $(17.9, undefined, 'Misto ou com leite')],
            sabores: ['Laranja', 'Limão', 'Abacaxi', 'Maracujá', 'Uva', 'Amora', 'Morango'],
          },
        ]),
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// DRINKS
// ---------------------------------------------------------------------------
export const coqueteis: Drink[] = [
  {
    id: 'braseiro-caicara',
    nome: 'Braseiro Caiçara',
    descricao: 'Cachaça envelhecida em carvalho, Cynar, vermuthe Rosso, licor de canela com cumaru e defumação com especiarias.',
    tags: ['Defumado', 'Levemente amargo'],
    preco: 38.9,
    assinatura: true,
    foto: fotoDrink('braseiro-caicara', 'Drink Braseiro Caiçara com defumação, casca de laranja e canela'),
  },
  {
    id: 'gastao-madeira',
    nome: 'Gastão Madeira',
    descricao:
      'Cachaça envelhecida no carvalho, absinto, xarope de amêndoas, licor da canela com cumaru, polpa caju e especiarias para defumação.',
    tags: ['Amadeirado', 'Adocicado', 'Encorpado', 'Aromático'],
    preco: 38.9,
    assinatura: true,
    foto: fotoDrink('gastao-madeira', 'Drink Gastão Madeira defumado, com laranja e cravos ao lado do copo'),
  },
  {
    id: 'negroni',
    nome: 'Negroni',
    descricao: 'Campari, vermute tinto e gin.',
    tags: ['Amargo', 'Doce'],
    preco: 38.9,
    foto: fotoDrink('negroni', 'Negroni servido com gelo e casca de laranja'),
  },
  {
    id: 'sangria-jarra',
    nome: 'Sangria Jarra',
    descricao: 'Vinho tinto, licor de laranja, frutas e tônica.',
    detalhe: 'Servida em jarra',
    tags: ['Frutado', 'Refrescante'],
    preco: 135,
    foto: fotoDrink('sangria-jarra', 'Jarra de sangria com frutas ao lado de uma taça'),
  },
  {
    id: 'moscow-mule',
    nome: 'Moscow Mule',
    descricao: 'Vodka, limão e espuma de gengibre.',
    tags: ['Cítrico', 'Picante'],
    preco: 39.9,
    foto: fotoDrink('moscow-mule', 'Moscow Mule em caneca de cobre com espuma de gengibre e hortelã'),
  },
  {
    id: 'mojito',
    nome: 'Mojito',
    descricao: 'Rum, hortelã, limão e água com gás.',
    tags: ['Refrescante', 'Cítrico'],
    preco: 39.9,
    foto: fotoDrink('mojito', 'Mojito em copo alto com hortelã fresca'),
  },
  {
    id: 'aperol-spritz',
    nome: 'Aperol Spritz',
    descricao: 'Aperol, espumante e água com gás.',
    tags: ['Refrescante', 'Levemente amargo'],
    preco: 39.9,
    foto: fotoDrink('aperol-spritz', 'Aperol Spritz em taça com fatia de laranja'),
  },
  {
    id: 'gin-tonica',
    nome: 'Gin Tônica',
    descricao: 'Gin, tônica e limão.',
    detalhe:
      'Opção com frutas, especiarias e xaropes: maçã verde, limão siciliano, tangerina, cereja, morango e frutas vermelhas.',
    tags: ['Refrescante', 'Levemente amargo'],
    preco: 42.9,
    foto: fotoDrink('gin-tonica', 'Gin tônica com morangos em taça, ao lado da garrafa de gin'),
  },
  {
    id: 'margarita',
    nome: 'Margarita',
    descricao: 'Tequila, limão, licor de laranja e borda sal.',
    tags: ['Cítrico'],
    preco: 42.9,
    foto: fotoDrink('margarita', 'Margarita em taça com borda de sal e limões'),
  },
  {
    id: 'caipirinha-da-casa',
    nome: 'Caipirinha da Casa',
    descricao: 'Cachaça Mato Dentro prata, cambuci e limão siciliano.',
    tags: ['Cítrico', 'Refrescante'],
    preco: 38.9,
    foto: fotoDrink('caipirinha-da-casa', 'Caipirinha da Casa com alecrim, fatia de limão e frutas na tábua'),
  },
  {
    id: 'tesouro-do-pirata',
    nome: 'Tesouro do Pirata',
    descricao: 'Rum ouro, licor de banana Canana, especiarias, limão e café.',
    tags: ['Frutado', 'Condimentado', 'Cítrico'],
    preco: 39.9,
    assinatura: true,
    foto: fotoDrink('tesouro-do-pirata', 'Drink Tesouro do Pirata com gelo triturado, hortelã e grãos de café'),
  },
  {
    id: 'ratambufe',
    nome: 'Ratambufe',
    descricao: 'Gin, limão, bitter tropical, Malibu e xarope amora.',
    tags: ['Doce', 'Cítrico', 'Tropical', 'Refrescante'],
    preco: 37.9,
    foto: fotoDrink('ratambufe', 'Drink Ratambufe com canudo laranja e hortelã, borrifado com aroma'),
  },
  {
    id: 'josefa-liberta',
    nome: 'Josefa Liberta',
    descricao: 'Vodka, licor pimenta da Jamaica, xarope de amora, maracujá e limão.',
    tags: ['Frutado', 'Cítrico', 'Levemente picante', 'Refrescante'],
    preco: 39.9,
    foto: fotoDrink('josefa-liberta', 'Drink Josefa Liberta laranja com gelo triturado ao lado de um maracujá'),
  },
  {
    id: 'sex-on-the-beach',
    nome: 'Sex on The Beach',
    descricao: 'Vodka, licor de pêssego, laranja e grenadine.',
    tags: ['Doce', 'Frutado', 'Refrescante'],
    preco: 41.9,
    foto: fotoDrink('sex-on-the-beach', 'Sex on The Beach em copo hurricane, degradê de laranja a vermelho'),
  },
  {
    id: 'pina-colada',
    nome: 'Piña Colada',
    descricao: 'Rum branco, abacaxi, leite de coco, leite condensado e calda de chocolate.',
    tags: ['Doce', 'Cremosa', 'Tropical', 'Encorpada'],
    preco: 42.9,
    foto: fotoDrink('pina-colada', 'Piña Colada cremosa com calda de chocolate escorrendo no copo'),
  },
  {
    id: 'praia-das-palmas',
    nome: 'Praia das Palmas',
    descricao: 'Rum com abacaxi, toque de amêndoas, limão e espuma de gengibre.',
    tags: ['Tropical', 'Cítrico', 'Cremoso', 'Levemente picante'],
    preco: 42.9,
    foto: fotoDrink('praia-das-palmas', 'Drink Praia das Palmas com espuma de gengibre e laranja desidratada'),
  },
  {
    id: 'ibis-escarlate',
    nome: 'Ibis Escarlate',
    descricao:
      'Gin com licor de canela e cumaru, xarope de amora, limão-siciliano, tônica e espuma de gengibre. Aromático, frutado e cheio de personalidade.',
    tags: ['Aromático', 'Cítrico', 'Levemente adocicado', 'Refrescante'],
    preco: 39.9,
    foto: fotoDrink('ibis-escarlate', 'Drink Ibis Escarlate vermelho com espuma e hortelã'),
  },
  {
    id: 'jorge-amado',
    nome: 'Jorge Amado',
    descricao: 'Gabriela com maracujá e limão.',
    tags: ['Tropical', 'Aromático', 'Cítrico', 'Toque quente de especiarias'],
    preco: 37.9,
    foto: fotoDrink('jorge-amado', 'Drink Jorge Amado com hortelã e rodela de laranja desidratada'),
  },
  {
    id: 'corcovado',
    nome: 'Corcovado',
    descricao: 'Vodka com cambuci, maçã verde, limão e hortelã.',
    tags: ['Cítrico', 'Herbáceo', 'Refrescante', 'Levemente ácido'],
    preco: 36.9,
    foto: fotoDrink('corcovado', 'Drink Corcovado com maçã verde e hortelã, ao lado de uma maçã e cambucis'),
  },
];

export const caipirinhas = {
  titulo: 'Caipirinhas',
  subtitulo: 'Cachaça, vodka ou saquê',
  frutas: ['Limão', 'Morango', 'Abacaxi', 'Kiwi', 'Maracujá', 'Frutas vermelhas'],
  bases: [
    { nome: 'Cachaça Mato Dentro', preco: 29.9 },
    { nome: 'Caipiroska Smirnoff', preco: 29 },
    { nome: 'Caipiroska Absolut', preco: 36 },
    { nome: 'Caipiroska Ciroc', preco: 46 },
    { nome: 'Caipisake', preco: 28.9 },
  ] as LinhaPreco[],
};

export const cervejas = {
  longNeck: [
    { nome: 'Heineken', preco: 16.9 },
    { nome: 'Corona Extra', preco: 16.9 },
    { nome: 'Heineken Zero', preco: 18.9 },
    { nome: 'Malzibier', preco: 16.9 },
    { nome: 'Sol', preco: 13.9 },
    { nome: 'Sol Zero', preco: 13.9 },
  ] as LinhaPreco[],
  ml600: [
    { nome: 'Amstel', preco: 24.9 },
    { nome: 'Corona', preco: 26.9 },
    { nome: 'Heineken', preco: 29.9 },
    { nome: 'Original', preco: 26.9 },
    { nome: 'Paullaner (Trigo)', preco: 42.9 },
    { nome: 'Baden Baden', preco: 36.9 },
  ] as LinhaPreco[],
  get garrafa600() {
    return this.ml600;
  },
  obs: 'Para mais opções artesanais consulte o garçom.',
};

export const doses = {
  destilados: [
    { nome: 'Whisky Red Label', preco: 28 },
    { nome: 'Whisky Black Label', preco: 28 },
    { nome: 'Whisky White Horse', preco: 27 },
    { nome: 'Vodka Smirnoff', preco: 18.9 },
    { nome: 'Vodka Absolut', preco: 27 },
    { nome: 'Vodka Ciroc', preco: 38.9 },
    { nome: 'Cachaça Mato Dentro Prata', preco: 18 },
    { nome: 'Cachaça Mato Dentro Carvalho', preco: 18 },
    { nome: 'Rum Bacardi', preco: 15.9 },
    { nome: 'Steinheager', preco: 18 },
    { nome: 'Tequila', preco: 28.9 },
  ] as LinhaPreco[],
  aperitivos: [{ nome: 'Campari', preco: 18 }] as LinhaPreco[],
  licores: [
    { nome: 'Baileys', preco: 28 },
    { nome: 'Cointreau', preco: 28 },
    { nome: 'Frangelico', preco: 28 },
    { nome: 'Amarula', preco: 28 },
    { nome: 'Licor 43', preco: 38.9 },
  ] as LinhaPreco[],
};

export const nossoBar =
  'Drinks autorais e clássicos se unem em ondas para criarem experiências únicas, saborosas e, assim como o mar, inesquecíveis! Mergulhe em nossos sabores e surpreenda-se!';

// ---------------------------------------------------------------------------
// EXECUTIVOS
// ---------------------------------------------------------------------------
export const executivos = {
  horario: 'Das 11h30 às 17h',
  itens: [
    {
      id: 'frango-grelhado',
      nome: 'Filé de Frango Grelhado',
      preco: 48.9,
      descricao: 'Acompanha arroz, batata frita, feijão, alface e tomate.',
      foto: fotoExec('frango-grelhado', 'Prato executivo de filé de frango grelhado com arroz e batata frita'),
    },
    {
      id: 'picanha-grelhada',
      nome: 'Picanha Grelhada',
      preco: 109.9,
      descricao: 'Acompanha arroz, salada de batata com maionese e feijão.',
      foto: fotoExec('picanha-grelhada', 'Prato executivo de picanha grelhada com arroz e salada de batata'),
    },
    {
      id: 'file-mignon-grelhado',
      nome: 'Filé Mignon Grelhado',
      preco: 89.9,
      descricao: 'Acompanha arroz, batata frita, feijão, alface e tomate.',
      foto: fotoExec('file-mignon-grelhado', 'Prato executivo de filé mignon grelhado com arroz e batata frita'),
    },
    {
      id: 'baby-beef-grelhado',
      nome: 'Baby Beef Grelhado',
      preco: 68.9,
      descricao: 'Acompanha arroz, batata frita, feijão, alface e tomate.',
      foto: fotoExec('baby-beef-grelhado', 'Prato executivo de baby beef grelhado com arroz e batata frita'),
    },
    {
      id: 'file-mignon-parmegiana',
      nome: 'Filé Mignon à Parmegiana',
      preco: 89.9,
      descricao: 'Acompanha arroz e batata frita.',
      foto: fotoExec('file-mignon-parmegiana', 'Prato executivo de filé mignon à parmegiana com arroz e batata frita'),
    },
    {
      id: 'parmegiana-de-frango',
      nome: 'Parmegiana de Frango',
      preco: 67.9,
      descricao: 'Acompanha arroz e batata frita.',
      foto: fotoExec('parmegiana-de-frango', 'Prato executivo de parmegiana de frango com arroz e batata frita'),
    },
    {
      id: 'pescada-dore-ou-grelhada',
      nome: 'Pescada à Dorê ou Grelhada',
      preco: 68.9,
      descricao: 'Acompanha arroz, batata frita, feijão, alface e tomate.',
      foto: fotoExec('pescada-dore-ou-grelhada', 'Prato executivo de pescada à dorê com arroz e batata frita'),
    },
    {
      id: 'pescada-molho-de-camarao',
      nome: 'Pescada ao Molho de Camarão',
      preco: 73.9,
      descricao: 'Acompanha arroz e batata frita.',
      foto: fotoExec('pescada-molho-de-camarao', 'Prato executivo de pescada ao molho de camarão com arroz e batata frita'),
    },
    {
      id: 'espaguete-vegetariano',
      nome: 'Espaguete Linguine Vegetariano',
      preco: 44.9,
      descricao: 'Linguine na manteiga de ervas com vegetais na brasa do dia.',
      foto: fotoExec('espaguete-vegetariano', 'Prato executivo de linguine na manteiga de ervas com vegetais na brasa'),
    },
    {
      id: 'espaguete-bolonhesa',
      nome: 'Espaguete Linguine à Bolonhesa',
      preco: 45.9,
      descricao: 'Acompanha queijo parmesão.',
      foto: fotoExec('espaguete-bolonhesa', 'Prato executivo de linguine à bolonhesa'),
    },
  ] as ItemExecutivo[],
  guarnicoes: [
    { nome: 'Vinagrete da casa 120g', preco: 7.9 },
    { nome: 'Ovo frito (unidade)', preco: 7.9 },
    { nome: 'Farofa de Banana', preco: 22.9 },
    { nome: 'Farofa de torresmo', preco: 8.9 },
    { nome: 'Omelete', preco: 24.9 },
    { nome: 'Saladinha (alface, tomate e cebola roxa)', preco: 14.9 },
  ] as LinhaPreco[],
  avisos: ['Todos os pratos executivos são empratados individualmente', 'Não trocamos acompanhamentos'],
};

// ---------------------------------------------------------------------------
// SEO / texto de cada página (usado em <title> e <meta description>)
// ---------------------------------------------------------------------------
export const cardapioMeta = {
  indice: {
    titulo: 'Cardápio | Braseiro Caiçara, parrilla e frutos do mar em Ubatuba',
    descricao:
      'Cardápio do Braseiro Caiçara em Ubatuba: gastronomia na brasa, drinks autorais e pratos executivos. Veja pratos, preços e faça sua reserva.',
  },
  gastronomia: {
    titulo: 'Cardápio de Gastronomia | Braseiro Caiçara, Ubatuba',
    descricao:
      'Entradas, carnes Angus na brasa, peixes, frutos do mar, massas e risotos do Braseiro Caiçara em Ubatuba. Pratos com descrição e preços atualizados.',
  },
  drinks: {
    titulo: 'Drinks e Coquetelaria | Braseiro Caiçara, Ubatuba',
    descricao:
      'Drinks autorais, caipirinhas, cervejas, doses e licores do Braseiro Caiçara em Ubatuba. Veja sabores, ingredientes e preços.',
  },
  executivos: {
    titulo: 'Pratos Executivos, das 11h30 às 17h | Braseiro Caiçara, Ubatuba',
    descricao:
      'Pratos executivos empratados individualmente no Braseiro Caiçara, em Ubatuba, das 11h30 às 17h. Veja opções, guarnições extras e preços.',
  },
};

// ---------------------------------------------------------------------------
// Helpers e aliases de exportação
// ---------------------------------------------------------------------------
export const drinks = coqueteis;

export const formatarPreco = (valor: number): string =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ---------------------------------------------------------------------------
// Retrocompatibilidade para MenuPage (legado)
// ---------------------------------------------------------------------------
export type MenuCategoryType = 'Carnes' | 'Frutos do mar' | 'Acompanhamentos' | 'Sobremesas' | 'Bebidas';

export interface LegacyMenuItem {
  id: string;
  name: string;
  price: string;
  category: MenuCategoryType;
  description: string;
  tags?: string[];
  note?: string;
}

export const menuCategories: { id: 'Todos' | MenuCategoryType; label: string }[] = [
  { id: 'Todos', label: 'Todos' },
  { id: 'Carnes', label: 'Carnes' },
  { id: 'Frutos do mar', label: 'Frutos do Mar' },
  { id: 'Acompanhamentos', label: 'Acompanhamentos' },
  { id: 'Sobremesas', label: 'Sobremesas' },
  { id: 'Bebidas', label: 'Bebidas' },
];

export const menuItems: LegacyMenuItem[] = [
  {
    id: 'picanha-angus',
    name: 'Picanha Angus',
    price: 'R$ 289,90',
    category: 'Carnes',
    description: 'Corte nobre selecionado na brasa viva, maciez e suculência incomparáveis.',
    tags: ['Assinatura', 'Serve 2 pessoas'],
  },
  {
    id: 'churrasco-do-mar',
    name: 'Churrasco do Mar',
    price: 'R$ 299,90',
    category: 'Frutos do mar',
    description: 'Frutos do mar frescos com polvo, peixe e camarões selados no fogo.',
    tags: ['Destaque', 'Serve 2 pessoas'],
  },
  {
    id: 'farofa-banana',
    name: 'Farofa de Banana da Terra',
    price: 'R$ 28,90',
    category: 'Acompanhamentos',
    description: 'Farofa artesanal tostada com banana da terra caramelizada.',
  },
  {
    id: 'drink-braseiro',
    name: 'Braseiro Caiçara',
    price: 'R$ 38,90',
    category: 'Bebidas',
    description: 'Drink autoral com notas defumadas e perfil cítrico marcante.',
    tags: ['Autoral'],
  },
];
