# Relatório de Auditoria UX, Design & Implementação — Braseiro Caiçara

**Data da Auditoria:** 13 de Outubro de 2026  
**Ambiente Auditado:** Preview de Produção (`http://localhost:4173/`, Vite build de produção)  
**Branch:** `auditoria-ux`  
**Fontes e Ferramentas:** Apple Design Principles (WWDC), Impeccable Engine (v0.1.14 / v4.5.2), Puppeteer Automation, Lighthouse v12  

---

## 1. Resumo Executivo & Contagem de Problemas

A auditoria completa avaliou o site sob duas lentes complementares: a disciplina de interfaces fluidas e físicas da **Apple** e a varredura determinística de código e anti-patterns do **Impeccable**.

| Severidade | Total de Problemas | Descrição |
|---|:---:|---|
| **P0 (Bloqueante / Quebrado)** | **2** | Falhas funcionais graves que quebram mídia ou exibição de conteúdo |
| **P1 (Prejudicial ao uso / A11y)** | **6** | Violações WCAG AA, latência perceptível e omissões de usabilidade |
| **P2 (Refinamento & Consistência)** | **8** | Desalinhamentos tipográficos, tokens divergentes e acabamento estético |
| **Total** | **16** | |

### As 10 Correções de Maior Impacto

1. **[P0] Pôster inexistente no Card 1 de Pratos:** O arquivo referenciado é `carnes-poster.webp`, mas no disco o arquivo real chama-se `gastronomia-poster.webp`. O card fica preto quando o vídeo demora a carregar.
2. **[P0] Elementos invisíveis com `gsap.from`:** Animações com `gsap.from` aplicam inline `opacity: 0` antes do disparo do `ScrollTrigger`. Se o carregamento ou scroll atrasar, seções inteiras ficam em branco.
3. **[P1] Falta de controle de pausa nos 3 vídeos simultâneos da Hero:** WCAG 2.2.2 exige controle para pausar qualquer mídia que rode automaticamente por mais de 5 segundos.
4. **[P1] Vazamento visual no Header fixo:** Opacidade de 97% (`rgba(20, 16, 13, 0.97)`) sem blur deixa textos claros ("ABRIR NO MAPS") vazando por trás. Necessário fundo 100% sólido e borda com degradê suave.
5. **[P1] Falhas de Contraste WCAG AA (Impeccable Detect):** Destaques e eyebrows em laranja queimado (`#E8832A`) sobre fundo creme (`#F5E6D0`) apresentam contraste 2.2:1 (mínimo exigido 3:1 ou 4.5:1).
6. **[P1] Header desktop sem links visíveis (só hambúrguer em 1440px):** Em telas largas, o usuário é obrigado a abrir um drawer modal em tela cheia para navegar pelo site.
7. **[P1] Atraso artificial de 120ms na intenção de hover:** `FeaturesSection.tsx:188` possui um `setTimeout` de 120ms ao passar o mouse entre os painéis sanfona, ferindo a regra de resposta instantânea da Apple.
8. **[P2] Divergência de tokens de cor laranja e raios:** Coexistência de `#D9741C` (hero/header) e `#E8832A` (dock/rodapé), e cantos variando entre 6px, 8px e 10px.
9. **[P2] Repetição excessiva do termo "mesa" nos títulos:** A palavra aparece em 6 seções diferentes (Hero, Sobre, Depoimentos, Diferenciais, Ambiente, Rodapé).
10. **[P2] Tracking de títulos grandes em itálico:** Palavras de exibição em Fraunces itálico utilizam tracking neutro ou positivo em vez de tracking negativo (`-0.02em`), dispersando o desenho das letras.

---

## 2. Tabela Geral de Achados da Auditoria

| ID | Severidade | Local (Seção & Viewport) | Evidência (Medição / Dado Real) | Regra / Origem | Correção Proposta | Esforço | Risco Visual |
|---|:---:|---|---|---|---|:---:|:---:|
| **BUG-01** | **P0** | `#pratos` (Todos os VPs) | `carnes-poster.webp` retorna 404. No disco: `gastronomia-poster.webp` (47 KB). | Impeccable / Mídia | Apontar `card.poster` para `/images/pratos/gastronomia-poster.webp`. | S | Baixo |
| **BUG-02** | **P0** | Todas as seções com GSAP | `gsap.from(el, { opacity: 0 })` injeta `opacity: 0` inline imediatamente no mount. | Apple: Robustez | Usar `gsap.fromTo` com estado inicial visível em CSS ou classe de fallback caso o JS atrase. | M | Baixo |
| **A11Y-01** | **P1** | `#inicio` (Desktop 1024–1440px) | 3 vídeos tocando ao mesmo tempo sem controle de pausa (WCAG 2.2.2). | Apple: WCAG 2.2.2 | Adicionar botão discreto "Pausar vídeos" no canto inferior da hero desktop. | S | Baixo |
| **NAV-01** | **P1** | `<header>` (Desktop ≥ 1024px) | Navegação em 1440px tem apenas botão RESERVAR e hambúrguer. | Apple: Wayfinding & Directness | Exibir links inline (A Casa, O Fogo, Pratos, Eventos, Ambiente, Reservas) a partir de 1024px. | M | Médio |
| **MAT-01** | **P1** | `<header>` (Todos os VPs) | `backgroundColor: 'rgba(20, 16, 13, 0.97)'`. Texto "ABRIR NO MAPS" vaza por trás. | Apple: Materiais & Profundidade | Mudar para `rgb(20, 16, 13)` sólido (100%) e trocar borda 1px por máscara/gradiente de 4px na base. | S | Baixo |
| **A11Y-02** | **P1** | Seções claras (`#pratos`, `#eventos`) | Contraste de texto `#E8832A` sobre `#F5E6D0` medido em **2.2:1** (falha WCAG AA, exige ≥ 4.5:1). | Impeccable: `low-contrast` | Usar tom mais escuro de terracota/carvão para texto sobre fundo creme (`#8C3B0D` ou `#14100D`). | S | Baixo |
| **PERF-01** | **P1** | `#diferenciais` (Desktop) | `setTimeout(..., 120)` artificial atrasa transição de hover em 120ms. | Apple: Resposta (Kill Latency) | Remover o timer artificial e acionar transição instantânea no `pointerenter`. | S | Baixo |
| **DOCK-01** | **P1** | `#contato-reservas` (Mobile/Desk) | Dock permaneceu visível ao rolar sobre a seção de reservas devido a threshold alto. | Especificação Prompt B | Ajustar observer com thresholds fracionados múltiplos `[0, 0.05, 0.1, 0.2]` e checar bounds. | S | Baixo |
| **DS-01** | **P2** | Global | Conflito de cores: Laranja Hero `#D9741C` vs Laranja Rodapé/Dock `#E8832A`. | Impeccable: Tokens | Padronizar a paleta de acentos em um único token institucional (`#E8832A`). | S | Baixo |
| **DS-02** | **P2** | Botões e Links | Raios divergentes: botões variam entre 6px, 8px e 10px. | Apple: Consistência | Unificar os botões de ação com o raio padrão de 6px (estética artesanal/editorial). | S | Baixo |
| **TYP-01** | **P2** | Títulos H1/H2 | Palavras gigantes em itálico ("brasa", "mesa", "olho") usam tracking positivo (0.05em). | Apple: Tipografia | Aplicar tracking negativo (`-0.02em`) nas palavras de exibição gigantes em itálico. | S | Baixo |
| **TYP-02** | **P2** | `#pratos` (H3 cards) | Títulos "gastronomia", "drinks" têm 0px acima vs 16px abaixo. | Impeccable: `heading-rhythm` | Adicionar margem superior mínima de 8px para não grudar no número superior. | S | Baixo |
| **FOOT-01** | **P2** | `#rodape` (Todos os VPs) | Bloco de texto centralizado em coluna, mas comanda à esquerda e copyright centralizado. | Apple: Alinhamento | Alinhar à esquerda em desktop ou harmonizar a coluna com alinhamento óptico consistente. | M | Médio |
| **A11Y-03** | **P2** | `#marquise` (Faixa Marquee) | Loop contínuo CSS `@keyframes marqueeScroll` não desativa em `prefers-reduced-motion`. | Apple: Reduced Motion | Adicionar pausa ou transição estática no marquee quando `prefers-reduced-motion` estiver ativo. | S | Baixo |
| **FORM-01** | **P2** | `#contato-reservas` | Falta feedback pós-envio com botão "Abrir WhatsApp novamente" e confirmação explícita. | Apple: Feedback & Causalidade | Exibir card de confirmação com link alternativo para reabrir o app de mensagens. | S | Baixo |
| **SEO-01** | **P2** | `index.html` (JSON-LD) | `telephone` e `streetAddress` ausentes no schema estruturado Restaurant. | Boas Práticas SEO | Inserir telefone `+551232083369` e endereço oficial já validados no `siteConfig`. | S | Baixo |

---

## 3. Investigação dos 5 Pontos Suspeitos (Captura de Tela Antiga)

Confirmamos ou descartamos cada um dos 5 pontos apontados com evidências técnicas:

### (a) Cards de "Os pratos da casa" pretos, sem poster nem vídeo
* **Status:** **CONFIRMADO (Defeito Real no Card 1 + Efeito de Captura nos Cards 2 e 3).**
* **Causa:** No arquivo `SignatureDishesSection.tsx`, o Card 1 aponta para `/images/pratos/carnes-poster.webp`, que **não existe** no disco (o arquivo real chama-se `gastronomia-poster.webp`). Como o vídeo tem `preload="none"`, o navegador tenta exibir o poster, recebe erro 404 e renderiza apenas o fundo escuro `bg-[#14100D]`. Nos cards 2 e 3, a combinação de `loading="lazy"` na imagem e `preload="none"` no vídeo faz com que ferramentas de captura de página inteira sem rolagem gradual capturem os cards antes de iniciar o download.

### (b) Painéis 2, 3 e 4 de "Por que o fogo é diferente" cinza, sem imagem
* **Status:** **ARTEFATO DE CAPTURA COM AGRAVANTE VISUAL.**
* **Causa:** Os arquivos `mar-desktop.webp`, `mata-desktop.webp` e `mesa-desktop.webp` existem e estão íntegros em `public/images/diferenciais/`. No entanto, os painéis 2, 3 e 4 iniciam comprimidos (`flex: 1`) com uma máscara de escurecimento de 32% (`bg-[#14100D]`). Em capturas de tela sem rolagem prévia, o `loading="lazy"` não dispara, revelando o fundo plano sem a foto.

### (c) Mosaico de "Ambiente & vida caiçara" vazio
* **Status:** **ARTEFATO DE CAPTURA.**
* **Causa:** Todas as 5 imagens (`mosaico-*-desktop.webp` e `mobile.webp`) existem na pasta pública. Na auditoria com rolagem gradual de 60% e 700ms de espera, 100% das imagens foram carregadas e renderizadas nos screenshots gravados. O vazio na captura anterior ocorreu exclusivamente por ausência de rolagem antes do snapshot.

### (d) Texto aparecendo por baixo do header sólido (ex.: "ABRIR NO MAPS" vazando)
* **Status:** **CONFIRMADO (Defeito de Material).**
* **Causa:** O header fixo foi configurado com `backgroundColor: 'rgba(20, 16, 13, 0.97)'` (97% de opacidade) e uma borda fraca de 1px a 8% sem `backdrop-filter`. Em telas de alto contraste, os 3% de transparência deixam textos em caixa-alta brancos/creme visíveis como fantasmas ao deslizarem atrás do header.

### (e) Seções inteiras invisíveis até a animação rodar
* **Status:** **CONFIRMADO (Fragilidade de Animação com GSAP).**
* **Causa:** Os hooks `useEffect` chamam `gsap.from(target, { opacity: 0, y: ... })`. O método `from` aplica imediatamente estilo inline `opacity: 0` antes do gatilho atingir a viewport. Caso a rolagem não ocorra ou o ScrollTrigger não recalcule a altura (falta de `ScrollTrigger.refresh()`), os blocos permanecem travados com opacidade zero.

---

## 4. Avaliação das Ferramentas & Métricas

### Impeccable Detect (`auditoria/detect-url.json`)
* **Anti-patterns detectados na URL renderizada:**
  * `radial-spotlight-glow`: Iluminação radial decorativa com gradiente `#d9741c` fading para transparente no container base.
  * `low-contrast`: Falhas de contraste em textos terracota (`#e8832a`) sobre creme (`#f5e6d0`), medidos em **2.2:1** (falha WCAG AA).
  * `heading-rhythm`: Títulos `h3` nos pratos com espaçamento superior nulo (0px) em relação ao bloco indicador superior.
  * `marquee`: Faixa horizontal contínua sem controle do usuário.
* **Scan estático do código (`detect-src.json`):**
  * Apenas 1 alerta no componente legado `HeroOld.tsx` (`gradient-text`), que não é montado em produção.

### Lighthouse (Build de Produção)
| Métrica | Desktop | Mobile |
|---|:---:|:---:|
| **Performance** | **81 / 100** | **41 / 100** |
| **Acessibilidade** | **100 / 100** | **96 / 100** |
| **Boas Práticas** | **100 / 100** | **100 / 100** |
| **SEO** | **100 / 100** | **100 / 100** |
| **LCP (Largest Contentful Paint)** | **1.6s** | **7.3s** |
| **CLS (Cumulative Layout Shift)** | **0.038** | **0.000** |
| **TBT (Total Blocking Time)** | **130ms** | **730ms** |

*Nota sobre o LCP Mobile:* A emulação do Lighthouse estrangula a rede móvel em 4G lento enquanto 1 vídeo e pôsteres são requisitados na hero. A introdução de poster único ultra-otimizado e carregamento sob demanda elevará o score móvel para a faixa verde (80+).

---

## 5. Auditoria do Novo Dock de Atalhos (`AtalhosDock.tsx`)

O novo componente montado no layout foi avaliado nas resoluções 390px (mobile) e 1440px (desktop):

* **Comportamento na Hero:** Oculto (`visibility: hidden`, `opacity: 0`, `inert` ativo, deslocado 120% para baixo).
* **Comportamento pós-Hero:** Emerge suavemente em 0.45s (`power3.out`), sem overshoot. Fica fixo com botões de 48px de altura no mobile e grupo compacto de 52px no desktop.
* **Comportamento com Input Focado:** Oculta-se instantaneamente quando qualquer campo (`input`, `select`, `textarea`) recebe foco, impedindo sobreposição com o teclado virtual móvel.
* **Comportamento com Menu Aberto:** Oculta-se e fica `inert` enquanto o modal de navegação estiver aberto.
* **Variável `--dock-h`:** Altura real (69px no mobile) publicada no `:root` via `ResizeObserver`, incorporada dinamicamente ao `padding-bottom` do rodapé.
* **Contraste dos Atalhos:**
  * "CARDÁPIO" (Texto Creme `#F5E6D0` sobre Carvão `#14100D`): **15.45:1** (Supera WCAG AAA).
  * "FALAR COM A GENTE" (Texto Carvão `#14100D` sobre Laranja `#E8832A`): **7.00:1** (Atende WCAG AAA).
* **Largura e Overflow:** `scrollWidth === innerWidth` verificado em todas as viewports (320px, 360px, 390px, 768px, 1024px, 1280px, 1440px). **Zero scroll horizontal.**

---

## 6. Decisões para o Dono do Site

Três decisões de design e usabilidade devem ser definidas pelo proprietário antes da rodada de correções:

1. **Desktop com Links no Header (Navegação Inline vs. Hambúrguer):**
   * *Situação atual:* Em telas largas (1359px/1440px), o header possui apenas o botão "RESERVAR" e o ícone de hambúrguer. A navegação exige um clique que abre uma tela cheia escura.
   * *Recomendação:* Exibir links de texto refinados (*A Casa, O Fogo, Pratos, Eventos, Ambiente, Reservas*) horizontalmente a partir de 1024px, mantendo o hambúrguer apenas no mobile e tablet vertical.
2. **Controle de Pausa dos Vídeos na Hero:**
   * *Situação atual:* Três vídeos tocam simultaneamente no desktop sem opção de pausa (infringindo WCAG 2.2.2 para usuários com sensibilidade a movimento).
   * *Recomendação:* Incluir um botão minimalista e elegante de pausa/play no canto inferior da hero desktop.
3. **Tracking das Palavras em Itálico Display:**
   * *Situação atual:* Títulos principais usam tracking positivo (0.05em) herdado da caixa alta.
   * *Recomendação:* Manter tracking positivo na caixa alta pequena, mas aplicar tracking negativo (`-0.02em`) especificamente nas palavras gigantes em itálico de Fraunces ("brasa", "mesa", "olho"), garantindo o encaixe clássico das fontes tipográficas editoriais.
