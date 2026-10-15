# Guia de Operação e Atualização — Braseiro Caiçara

Este manual foi elaborado para orientar o proprietário e a equipe do **Braseiro Caiçara** a realizarem manutenções rotineiras no site sem complicações.

---

## 1. Onde Ficam as Informações Principais?

Todo o conteúdo editável do site está concentrado em **dois arquivos principais**:

| O que você quer alterar? | Arquivo que deve abrir |
|---|---|
| **Horários, endereço, telefone, WhatsApp, link do iFood e Instagram** | `src/config.ts` |
| **Pratos, descrições, preços, categorias e fotos do cardápio** | `src/data/cardapio.ts` |

---

## 2. Como Alterar Preços dos Pratos

Abra o arquivo [`src/data/cardapio.ts`](file:///c:/Users/Teste/Downloads/braseiro/src/data/cardapio.ts).

Cada item do cardápio é um bloco como este:

```typescript
{
  id: 'gastro-picanha-angus',
  nome: 'Picanha Angus Premium',
  descricao: 'Corte nobre grelhado na parrilla ao ponto desejado...',
  preco: 148.00, // <-- Altere o valor aqui (use ponto em vez de vírgula)
  categoria: 'Cortes Especiais',
  servePessoas: '2 pessoas',
  foto: '/cardapio/fotos/picanha.webp',
}
```

- Para mudar o preço de R$ 148,00 para R$ 158,00, basta alterar `preco: 148.00` para `preco: 158.00`.
- Salve o arquivo.

---

## 3. Como Adicionar ou Ocultar um Prato

### Para Ocultar Temporariamente (Prato Esgotado):
Se um prato ou peixe da estação não estiver disponível hoje, você pode:
1. Adicionar o campo `esgotado: true` no bloco do prato em [`src/data/cardapio.ts`](file:///c:/Users/Teste/Downloads/braseiro/src/data/cardapio.ts). O site exibirá automaticamente uma etiqueta discreta informando que o prato está temporariamente indisponível.
2. Ou comentar as linhas do prato colocando `/*` antes do bloco e `*/` depois.

### Para Adicionar um Novo Prato:
1. Copie um bloco existente dentro da categoria correspondente (`gastronomiaData.itens`, `drinksData.itens` ou `executivosData.itens`).
2. Dê um `id` único (sem espaços ou acentos, por exemplo: `gastro-polvo-lagareiro`).
3. Preencha nome, descrição, preço, categoria e foto.

---

## 4. Como Alterar Horários, Endereço ou Contatos

Abra o arquivo [`src/config.ts`](file:///c:/Users/Teste/Downloads/braseiro/src/config.ts).

```typescript
export const siteConfig = {
  name: 'Braseiro Caiçara',
  phoneDisplay: '(12) 3208-3369',
  phoneRaw: '551232083369', // Número internacional para WhatsApp (sem traços)
  
  address: {
    street: 'Rua Guarani, 370',
    neighborhood: 'Barra da Lagoa',
    city: 'Ubatuba',
    state: 'SP',
    zip: '11680-000',
  },

  hours: {
    fullDisplay: 'Todos os dias, das 11h30 às 23h30',
    lunchDisplay: 'Almoço: 11h30 às 17h00',
    dinnerDisplay: 'Jantar: 17h00 às 23h30',
  },

  ifoodUrl: 'https://www.ifood.com.br/delivery/ubatuba-sp/braseiro-caicara-parrilla-frutos-do-mar-barra-da-lagoa/4a688dc8-9630-4e1a-a7b0-8ce115c7f96c',
  instagramUrl: 'https://instagram.com/braseiro_caicara',
};
```

- Basta alterar o texto entre aspas simples `'...'` e salvar o arquivo. As alterações refletem automaticamente no rodapé, no cabeçalho, na seção de localização e no formulário de reserva.

---

## 5. Como Adicionar ou Trocar Fotos

1. **Formato Recomendado:** Use sempre imagens em formato **WebP** ou **AVIF** para manter o site rápido no celular. (Você pode usar ferramentas gratuitas online como o [squoosh.app](https://squoosh.app) para converter JPG em WebP com qualidade 80%).
2. **Dimensões Ideais:**
   - Fotos de pratos e drinks: `800 x 600` pixels (proporção 4:3), pesando menos de 100 KB.
   - Fotos panorâmicas / salão: `1200 x 800` pixels.
3. **Onde Salvar os Arquivos:**
   - Salve a nova imagem dentro da pasta: `public/cardapio/fotos/` (exemplo: `public/cardapio/fotos/novo-prato.webp`).
4. **Vincular ao Prato:**
   - No arquivo `src/data/cardapio.ts`, aponte o campo `foto` para o caminho correspondente:
     `foto: '/cardapio/fotos/novo-prato.webp'`

---

## 6. Como Publicar as Alterações na Internet

Depois de alterar e salvar os arquivos:

1. Abra o terminal na pasta do projeto e verifique se o site compila sem erros:
   ```bash
   npm run build
   ```
2. Adicione e envie as alterações para o repositório Git:
   ```bash
   git add .
   git commit -m "chore: atualizacao de precos do cardapio"
   git push origin main
   ```
3. A Vercel detectará o envio automaticamente e publicará a nova versão em poucos segundos!
