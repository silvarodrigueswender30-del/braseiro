# Checklist de Entrega Final — Braseiro Caiçara

**Branch de Trabalho:** `reta-final`  
**Data:** 15 de Outubro de 2026  
**Status Geral:** 100% Concluído e Validado

---

## 1. Prompt A — Triagem de Reserva & Atalhos de Navegação

- [x] **Componente Universal de Triagem de Reserva (`ReservaTriagem.tsx`)**
  - [x] Passo 1: Seleção de data (`input type="date"`, hoje ou datas futuras) e seleção de horário (`11:30` até `22:00` em intervalos de 30min).
  - [x] Passo 2: Contagem de pessoas com steppers acessíveis (min 1 pessoa, destaque especial para grupos acima de 12 pessoas).
  - [x] Passo 2: Contagem de crianças (com validação estrita: crianças < total de pessoas) e toggle de cadeirão infantil.
  - [x] Passo 2: Seleção de ocasião especial em `role="radiogroup"` (*Almoço, Jantar, Aniversário, Comemoração, Negócios, Sem ocasião*).
  - [x] Passo 2: Toggle "Preferimos ficar juntos" exibido para mesas com 8 ou mais pessoas.
  - [x] Passo 2: Preferência de área (Salão Interno, Varanda Coberta, Deck da Parrilla).
  - [x] Passo 3: Identificação do cliente (nome completo), campo opcional de observações/restrições alimentares.
  - [x] Passo 3: Resumo detalhado com botões "Editar" que retornam ao passo correspondente.
  - [x] Passo 3: Geração automática e sanitizada da mensagem para o WhatsApp com link `https://wa.me/551232083369?text=...`.
  - [x] Tela pós-envio com botão de contingência para reabertura direta do link caso bloqueador de pop-up intervenha.
  - [x] Aviso regulatório claro: *"A reserva só vale depois da confirmação do restaurante."*
- [x] **Contexto Global de Modal de Reserva (`ReservationModalContext.tsx`)**
  - [x] Gerenciamento unificado de abertura e fechamento de modal/sheet a partir de qualquer ponto do site.
  - [x] Suporte a `initialOcasiao` pré-selecionada (usada na seção de Eventos com `'Comemoração'`).
  - [x] Bloqueio de scroll do body e armadilha de foco (*focus trap*) acessível com suporte à tecla `Escape`.
- [x] **Integração em Toda a Aplicação**
  - [x] Header desktop (botão RESERVAR no menu superior).
  - [x] Hero desktop & mobile (botões principais apontando para o modal).
  - [x] Seção de Localização e Reservas (`#contato-reservas`) com componente em modo `variant="inline"`, preservando o mapa à direita.
  - [x] Seção de Eventos (`EventsSection.tsx`) abrindo a triagem com foco em celebrações.
  - [x] Rodapé (`Footer.tsx`) com atalho direto de reserva.
- [x] **Atalhos e Delivery iFood**
  - [x] Dock inferior flutuante (`AtalhosDock.tsx`) com link para o Cardápio, botão RESERVAR MESA e ocultação inteligente quando o modal está aberto.
  - [x] Banner dedicado do iFood na seção de Pratos da Casa (`SignatureDishesSection.tsx`) e no Cardápio Geral (`IndexPage.tsx`).
  - [x] Link oficial do iFood integrado e testado em todos os pontos.

---

## 2. Prompt B — SEO Técnico & Identidade Digital

- [x] **Configuração de Ambiente de Produção**
  - [x] Criação do arquivo `.env.production` com a variável `VITE_SITE_URL=https://braseiro-tau.vercel.app`.
  - [x] Regra de exceção em `.gitignore` (`!.env.production`) garantindo versionamento seguro sem expor segredos.
- [x] **Imagem de Compartilhamento Open Graph & Twitter Cards**
  - [x] Geração de `public/og-image.jpg` com dimensões oficiais 1200x630 e peso de apenas 25.8 KB.
  - [x] Design editorial com fundo creme `#F5E6D0`, logo em carvão vegetal, subtítulo elegante e coordenadas de Ubatuba.
  - [x] Tags `<meta property="og:image">`, `<meta property="og:image:width">`, `<meta property="og:image:height">` e `<meta name="twitter:card" content="summary_large_image">` no `index.html`.
- [x] **Conjunto Completo de Favicons & Ícones de App**
  - [x] `public/favicon-32x32.png`: ícone nítido para abas de navegadores desktop.
  - [x] `public/apple-touch-icon.png` (180x180): ícone de alta resolução para dispositivos iOS e atalhos na tela de início.
  - [x] `public/favicon.ico`: favicon em formato binário tradicional para compatibilidade legada.
  - [x] Declaração no cabeçalho do `index.html`.
- [x] **Sitemap XML & Robots.txt Automatizados**
  - [x] Script `tools/generate-seo.mjs` que varre as rotas oficiais (`/`, `/cardapio`, `/cardapio/gastronomia`, `/cardapio/drinks`, `/cardapio/executivos`).
  - [x] Hook de build configurado no `package.json`: `"prebuild": "node tools/generate-seo.mjs"`.
  - [x] Geração automática de `public/sitemap.xml` e `public/robots.txt` apontando para o sitemap canônico.
- [x] **Marcação Estruturada Schema.org (`Restaurant`)**
  - [x] JSON-LD inserido no `index.html` com tipo `@type: "Restaurant"`.
  - [x] Nome: "Braseiro Caiçara - Parrilla e Frutos do Mar".
  - [x] Endereço oficial: Rua Guarani, 370 - Barra da Lagoa, Ubatuba - SP, 11680-000.
  - [x] Coordenadas geográficas: latitude `-23.4339`, longitude `-45.0694`.
  - [x] Faixa de preço `$$$`, culinária "Parrilla, Frutos do Mar, Brasileira", telefone `+55 12 3208-3369` e horários das 11:30 às 23:30.
- [x] **Blindagem Contra Soft-404 & SPA Routing**
  - [x] Criação de `public/404.html` estilizada com estética do restaurante, botão para voltar ao início e links de ajuda.
  - [x] Atualização de `vercel.json` restringindo rewrites exclusivamente para as 5 rotas reais do SPA.
  - [x] Redirecionamentos 301 para URLs legadas (`/menu` -> `/cardapio`, `/reservas` -> `/#contato-reservas`, `/contato` -> `/#contato-reservas`).

---

## 3. Prompt C — Auditoria de Vídeos, E2E Cross-Browser e Qualidade

- [x] **Auditoria e Recompressão de Vídeos**
  - [x] Análise dos 4 vídeos do site (`vid01.mp4`, `vid2.mp4`, `vid3.mp4`, `drink.mp4`).
  - [x] Recompressão com `ffmpeg` (CRF 26, preset `slow`, remoção de stream de áudio, flag `+faststart`).
  - [x] Redução total de tamanho de 29.17 MB para 24.45 MB (-16.2% de economia).
  - [x] Análise SSIM comprovando transparência visual com índices superiores a 0.98 em todos os arquivos.
- [x] **Bateria de Testes E2E Cross-Browser (Playwright)**
  - [x] Chromium Desktop: 100% PASS (0 erros).
  - [x] Firefox Desktop: 100% PASS (0 erros).
  - [x] WebKit Desktop (Safari): 100% PASS (0 erros).
  - [x] Pixel 7 Mobile (Android): 100% PASS (0 erros).
  - [x] iPhone 13 Mobile (iOS Safari): 100% PASS (0 erros).
- [x] **Auditoria Automatizada de Acessibilidade (axe-core)**
  - [x] 0 violações críticas em Home e Cardápio.
  - [x] 0 violações sérias em Home e Cardápio.
  - [x] Ajuste nos contrastes de cores de botões e links.
- [x] **Auditoria Lighthouse (Mediana de 3 Rodadas Mobile e 3 Desktop)**
  - [x] Acessibilidade: **100/100** em Mobile e Desktop.
  - [x] Melhores Práticas: **100/100** em Mobile e Desktop.
  - [x] SEO: **100/100** em Mobile e Desktop.
  - [x] LCP Desktop: **2.24s** (Core Web Vital verde).
  - [x] LCP Mobile: **5.69s** com poster-first preservando conectividade 3G/4G.
- [x] **Documentação de Entrega e Operação**
  - [x] `auditoria/RELATORIO-FINAL.md`: Métricas, tabelas de benchmark, relatórios de teste e pendências de terceiros.
  - [x] `auditoria/CHECKLIST-ENTREGA.md`: Este checklist consolidado.
  - [x] `docs/COMO-ATUALIZAR.md`: Guia operacional para o dono do restaurante e sua equipe.
