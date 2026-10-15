# DESIGN SYSTEM — BRASEIRO CAIÇARA

Diretrizes visuais e tokens de design oficiais para a experiência nativa do Braseiro Caiçara (Restaurante, Parrilla e Frutos do Mar em Ubatuba - SP).

---

## 1. Filosofia e Personalidade Visual

- **Calor da Lenha e Frescor do Atlântico:** fusão entre a rusticidade elegante da parrilla a lenha e a brisa costeira de Ubatuba.
- **Editorial e Artesanal:** tipografia rica em serifas com personalidade display, espaçamentos generosos, superfícies de papel encorpado e fotografia autêntica.
- **Tema Claro para Gastronomia e Executivos:** fundo em papel creme artesanal (`#FBF4E8` / `#F5E6D0`) com texto em carvão profundo (`#14100D`) e acentos em brasa viva (`#E8832A`).
- **Tema Noturno para Drinks & Bar:** atmosfera intimista e sofisticada (`#14100D` / `#1A1411`) com reflexos dourados e âmbar.

---

## 2. Paleta Cromática

### 2.1 Tema Claro (Gastronomia e Executivos)
- **Papel Creme Primário:** `#FBF4E8` (fundo principal de páginas diurnas)
- **Papel Creme Secundário:** `#F5E6D0` (cards, cabeçalhos e seções alternadas)
- **Carvão Profundo (Texto):** `#14100D` (contraste > 12:1 sobre papel creme)
- **Carvão Médio (Texto Secundário):** `#3A322C` (contraste > 7:1 sobre papel creme)
- **Brasa Viva (Acento Primário):** `#E8832A` (títulos destacados em itálico, botões principais e ícones)
- **Terracota Queimado (Preços e Rótulos Pequenos):** `#9C4108`
  > *Conformidade WCAG AA:* `#9C4108` possui contraste real medido de **5,4:1** sobre `#F5E6D0` e **5,8:1** sobre `#FBF4E8`, aprovado com folga para texto pequeno (mínimo WCAG AA é 4.5:1). O token anterior `#B4540F` foi aposentado por reprovar no limiar de 4.5:1.
- **Verde Mar / Costa:** `#2E9C9B` (badges vegetarianos e acentos de frescor marítimo)
- **Bordas Sutis:** `rgba(20, 16, 13, 0.08)` e `rgba(20, 16, 13, 0.14)`

### 2.2 Tema Escuro (Drinks & Bar e Home Hero)
- **Carvão Noite:** `#14100D` (fundo principal)
- **Marrom-Fogo (Tom sobre tom):** `#2A1C14` (formas de marca e blocos tonais em fundo escuro)
- **Carvão Superfície:** `#1A1411` (cards e barras elevadas)
- **Creme Texto:** `#F5E6D0` (texto principal com contraste > 10:1 sobre carvão)
- **Creme Secundário:** `rgba(245, 230, 208, 0.80)` (descrições e legendas)
- **Brasa Dourada:** `#E8832A` (preços, chips e botões de destaque)

---

## 3. Tipografia

- **Display / Títulos:** `Fraunces`, `serif`
  - Variações: regular, semi-bold (600), bold (700) e black (900).
  - Uso de itálico nobre com variação de fonte: `"SOFT" 100, "WONK" 1, "opsz" 144`.
  - Palavras em itálico com a cor da brasa (`#E8832A`) geram a assinatura visual do restaurante.
- **Corpo de Texto & UI:** `Instrument Sans`, `sans-serif`
  - Pesos: 400 (regular), 500 (medium), 600 (semi-bold) e 700 (bold).
  - Corpo no mobile: **mínimo de 16px (1rem)** com entrelinha de 1.5 a 1.6 para leitura confortável.
  - Largura de parágrafo: máximo de 65 a 70 caracteres (`max-w-prose` ou `max-w-[65ch]`).

---

## 4. Escala de Espaçamento (Grade de 4/8px)

| Token | Valor | Uso Típico |
|---|---|---|
| `space-1` | 4px | Espaçamento mínimo interno entre ícone e rótulo |
| `space-2` | 8px | Padding de chips, badges e espaçamento entre pílulas |
| `space-3` | 12px | Padding interno de inputs e botões compactos |
| `space-4` | 16px | Padding interno de cards no mobile |
| `space-6` | 24px | Padding de cards no desktop e gaps de grid |
| `space-8` | 32px | Distância entre blocos e seções menores |
| `space-12` | 48px | Respiro vertical entre grupos de pratos |
| `space-16` | 64px | Padding superior/inferior de seções |
| `space-24` | 96px | Espaçamento de grandes seções na home |

---

## 5. Formas, Bordas e Sombras

- **Raios de Borda:**
  - Botões, inputs e chips: `rounded-[6px]` (6px)
  - Cards de pratos e containers: `rounded-[8px]` (8px)
  - Badges circulares e pílulas de filtro: `rounded-full` (9999px)
- **Sombras no Tema Claro:**
  - Card repouso: `0 4px 18px rgba(20, 16, 13, 0.05)`
  - Card hover: `0 12px 28px rgba(20, 16, 13, 0.10)`
  - Botão Brasa: `0 4px 16px rgba(156, 65, 8, 0.25)`

---

## 6. Fotografia e Mídia

- **Proporção Padrão:** **4:3** para cards de pratos com `object-fit: cover` e `object-position: center`.
- **Proporção Vertical:** **4:5** exclusiva para drinks (taças e copos altos).
- **Sem Cards Vazios:** todo prato possui foto de qualidade ou elemento ilustrativo artesanal dedicado com ícone e textura de papel.
- **Responsividade:** `loading="lazy"`, `decoding="async"`, com `width` e `height` explícitos para eliminar Layout Shifts (CLS 0.00).

---

## 7. Movimento e Interação (Motion)

- **Duração Máxima:** ≤ 380ms para revelação viewport e ≤ 300ms para hover de interface.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` ou `ease-out`.
- **Acessibilidade Obrigatória:** respeito estrito a `prefers-reduced-motion: reduce` (desativa transições de deslocamento físico e mantém apenas opacidade imediata).
- **Alvos de Toque no Mobile:** mínimo estrito de **44x44px** em todos os botões, abas e seletores clicáveis.

---

## 8. Formas de Marca (Brand Shapes — Prompt v7)

Sistema de formas decorativas em bloco de cor sólida e textura artesanal viva (`public/images/formas-raster/*.webp`, `public/images/formas/*.svg` e componente `<BrandShape />`).

### 8.1 Catálogo de Formas e Texturas
- **`nuvem-a`:** Silhueta globular densa com textura de xilogravura e rachaduras finas de carimbo (proporção `870 / 740`).
- **`nuvem-b`:** Silhueta horizontal alongada em bloco rochoso com fissuras verticais profundas (proporção `1310 / 733`). Ideal como fundo para polaroids e murais.
- **`mancha-c`:** Silhueta fluida e dinâmica de fogo orgânico com labareda ascendente (proporção `997 / 739`).
- **`pincelada-d`:** Faixa horizontal com textura de cerdas ásperas desfiadas nas pontas e fendas de terra no centro (proporção `1489 / 534`).
- **`faiscas`:** Revoada de partículas e diamantes incandescentes (proporção `2213 / 477`). Ideal para cruzar emendas e pontuar calor.
- **`selo`:** Emblema circular com anel duplo rústico vazado, chama central e ondas do mar (proporção `879 / 881`). Acoplado aos CTAs finais.
- **`sal`:** Constelação de grãos dispersos de sal marinho grosso artesanal (proporção `683 / 552`).
- **`chama-traco`:** Labareda artesanal em traço expressivo (proporção `320 / 400`), posicionada junto aos títulos de destaque.

### 8.2 Diretrizes Cromáticas (Do "Watermark" para "Bloco de Cor")
1. **Cor Sólida e Saturada (Proibido Opacidade Baixa):**
   - É **terminantemente proibido** usar `opacity < 0.85` para esmaecer formas. As formas operam como blocos de cor sólidos da paleta editorial.
   - Para sutileza no fundo escuro (`#14100D`), usa-se o tom sólido **marrom-fogo (`#2A1C14`)**, obtendo sofisticação tom sobre tom sem lavar a textura.
2. **Distribuição Harmônica 60-30-10 por Página:**
   - **~60% Fundos:** Carvão (`#14100D`) ou Papel Creme (`#F5E6D0` / `#FBF4E8`).
   - **~30% Blocos Médios:** Terracota (`#A83A2A`), Areia (`#D9C4A0`) e Marrom-fogo (`#2A1C14`).
   - **~10% Brasa (`#E8832A`):** Acento focal de máxima energia. No máximo **1 peça grande em brasa por tela (viewport)**.
3. **Pares Cromáticos Eficazes:**
   - `terracota` e `brasa` leem bem com contraste garantido tanto no fundo escuro quanto no creme.
   - `areia` opera exclusivamente em fundos creme.
   - `marrom-fogo` opera exclusivamente em fundos escuros.

### 8.3 Orçamento de Área e Ritmo
1. **Orçamento de Área:** As formas ocupam **≤ 15–20%** da área de cada seção.
2. **Composição por Seção:** No máximo **1 peça principal saturada** + **até 1 peça de apoio** (tonal ou menor). Seções com foto full-bleed continuam sem formas.
3. **Não Competição Visual:** Se o título da seção possui palavra em itálico laranja (`#E8832A`), a forma vizinha é obrigatoriamente terracota, areia ou marrom-fogo. As peças em brasa são posicionadas em áreas neutras, ecoando o tom à distância.
4. **Camadas e Profundidade (Estilo Bonança):** As formas passam por trás de cartões, polaroids e murais de avaliações, espiando pelas bordas. Os cartões mantêm fundos sólidos e legibilidade intocada.
5. **Emendas entre Seções (`.seam`):** Transições entre blocos escuros e claros utilizam o container `.seam` (`position: relative; height: 0; z-index: 5`) permitindo que uma única peça atravesse a divisa entre dois fundos de maneira limpa.
6. **Alternância e Ritmo:** Alterne lados (esquerda / direita), escalas e rotações ao longo da página. No máximo 2 usos da mesma peça em toda a home.

### 8.4 Movimento e Desempenho
- **Revelação Viewport:** Fade-in suave com deslocamento vertical ≤ 24px e duração ≤ 380ms (`ease-out`), acionado via IntersectionObserver.
- **Acessibilidade:** Desativado sob `prefers-reduced-motion: reduce`.
- **Performance e CLS:** Zero Layout Shift (CLS 0.00), imagens com dimensões explícitas, `loading="lazy"`, `decoding="async"`. Masks geradas em WebP ultraleve (10–25 KB cada).
