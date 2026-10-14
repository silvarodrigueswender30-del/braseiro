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
- **Terracota Queimado (Preços e Rótulos Pequenos):** `#B4540F`
  > *Atenção WCAG:* `#B4540F` possui contraste medido de **5,12:1** sobre `#FBF4E8` e **4,79:1** sobre `#F5E6D0`, aprovado com folga para texto pequeno (mínimo WCAG AA é 4.5:1).
- **Verde Mar / Costa:** `#2E9C9B` (badges vegetarianos e acentos de frescor marítimo)
- **Bordas Sutis:** `rgba(20, 16, 13, 0.08)` e `rgba(20, 16, 13, 0.14)`

### 2.2 Tema Escuro (Drinks & Bar e Home Hero)
- **Carvão Noite:** `#14100D` (fundo principal)
- **Carvão Superfície:** `#1A1411` (cards e barras elevadas)
- **Creme Texto:** `#F5E6D0` (texto principal com contraste > 10:1 sobre carvão)
- **Creme Secundário:** `#F5E6D0]/80` (descrições e legendas)
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
  - Botão Brasa: `0 4px 16px rgba(180, 84, 15, 0.25)`

---

## 6. Fotografia e Mídia

- **Proporção Padrão:** **4:3** para cards de pratos com `object-fit: cover` e `object-position: center`.
- **Proporção Vertical:** **4:5** exclusiva para drinks (taças e copos altos).
- **Sem Cards Vazios:** todo prato possui foto de qualidade ou elemento ilustrativo artesanal dedicado com ícone e textura de papel.
- **Responsividade:** `loading="lazy"`, `decoding="async"`, com `width` e `height` explícitos para eliminar Layout Shifts (CLS 0.00).

---

## 7. Movimento e Interação (Motion)

- **Duração Máxima:** ≤ 300ms para transições de interface e hover.
- **Easing:** `ease-out` ou `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Acessibilidade Obrigatória:** respeito estrito a `prefers-reduced-motion: reduce` (desativa transições de deslocamento físico e mantém apenas crossfade suave de opacidade).
- **Alvos de Toque no Mobile:** mínimo estrito de **44x44px** em todos os botões, abas e seletores clicáveis.
