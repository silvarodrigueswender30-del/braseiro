import { chromium, firefox, webkit, devices } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const TEST_ENVIRONMENTS = [
  { name: 'Chromium Desktop', browserType: chromium, options: { viewport: { width: 1280, height: 800 } } },
  { name: 'Firefox Desktop', browserType: firefox, options: { viewport: { width: 1280, height: 800 } } },
  { name: 'WebKit Desktop', browserType: webkit, options: { viewport: { width: 1280, height: 800 } } },
  { name: 'Pixel 7 Mobile', browserType: chromium, options: { ...devices['Pixel 7'] }, isMobile: true },
  { name: 'iPhone 13 Mobile', browserType: webkit, options: { ...devices['iPhone 13'] }, isMobile: true },
];

async function runE2EAndAudit() {
  console.log('=== INICIANDO TESTES E2E E AUDITORIA DE ACESSIBILIDADE ===\n');

  const results = [];
  let axeResultsSummary = null;

  for (const env of TEST_ENVIRONMENTS) {
    console.log(`\n--- Testando em: ${env.name} ---`);
    const browser = await env.browserType.launch({ headless: true });
    const context = await browser.newContext(env.options);
    const page = await context.newPage();

    // Stub window.open para não tentar abrir abas externas no WhatsApp durante automação
    await page.addInitScript(() => {
      window.open = (url) => {
        return { closed: false, focus: () => {} };
      };
    });

    const envResult = {
      name: env.name,
      homepageStatus: 0,
      reservaSheetFlow: false,
      reservaInlineFlow: false,
      cardapioNavFlow: false,
      ifoodLinkValid: false,
      mapsLinkValid: false,
      errors: [],
    };

    try {
      // 1. Acesso à HomePage
      const res = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      envResult.homepageStatus = res.status();
      console.log(`  [Home] Status ${envResult.homepageStatus}`);

      // 2. Teste do Fluxo de Triagem de Reserva (Sheet / Modal)
      // No desktop: botão RESERVAR no header. No mobile: botão RESERVAR no Hero
      const reserveBtn = env.isMobile
        ? page.locator('[data-hero-cta="true"]').last()
        : page.locator('[data-testid="desktop-nav"] a:has-text("RESERVAR")').first();

      await reserveBtn.click({ force: true });
      await page.waitForTimeout(400);

      const dialog = page.locator('[role="dialog"]').filter({ hasText: 'Reserva' }).first();
      await dialog.waitFor({ state: 'visible', timeout: 5000 });
      const dialogVisible = await dialog.isVisible();

      if (dialogVisible) {
        // Passo 1: Data e Horário
        const dateInput = dialog.locator('input[type="date"]');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const tomorrowStr = `${yyyy}-${mm}-${dd}`;
        await dateInput.fill(tomorrowStr);

        const continueBtn1 = dialog.locator('button:has-text("Continuar")');
        await continueBtn1.click({ force: true });
        await page.waitForTimeout(300);

        // Passo 2: Pessoas, Crianças, Cadeirão, Ocasião
        const plusPessoa = dialog.locator('button[aria-label="Aumentar uma pessoa"]');
        await plusPessoa.click({ force: true });
        await plusPessoa.click({ force: true }); // pessoas = 4

        const plusCrianca = dialog.locator('button[aria-label="Aumentar crianças"]');
        await plusCrianca.click({ force: true }); // criancas = 1

        const cadeiraoToggle = dialog.locator('input[type="checkbox"]').first();
        await cadeiraoToggle.check({ force: true });

        const niverBtn = dialog.locator('button:has-text("Aniversário")');
        await niverBtn.click({ force: true });

        const continueBtn2 = dialog.locator('button:has-text("Continuar")');
        await continueBtn2.click({ force: true });
        await page.waitForTimeout(300);

        // Passo 3: Nome, Obs e Resumo
        const nomeInput = dialog.locator('input[autocomplete="name"]');
        await nomeInput.fill('Wender Silva');

        const obsTextarea = dialog.locator('textarea');
        await obsTextarea.fill('Trazer bolo surpresa');

        // Clica no botão "ENVIAR PELO WHATSAPP"
        const submitBtn = dialog.locator('button[type="submit"]:has-text("ENVIAR PELO WHATSAPP")');
        await submitBtn.click({ force: true });
        await page.waitForTimeout(400);

        // Validação do link final gerado
        const waLink = dialog.locator('a[href*="wa.me"]');
        const href = await waLink.first().getAttribute('href');
        const isHrefValid = href && href.includes('wa.me/551232083369') && href.includes(encodeURIComponent('Wender Silva'));

        if (isHrefValid) {
          envResult.reservaSheetFlow = true;
          console.log('  [Reserva Sheet] Fluxo completo e URL wa.me validada!');
        } else {
          envResult.errors.push('Link do WhatsApp inválido após envio no modal de reserva');
        }

        // Teste de fechamento via botão de fechar ou Escape
        const closeBtn = dialog.locator('button[aria-label*="Fechar"]').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click({ force: true });
        } else {
          await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(300);
      } else {
        envResult.errors.push('Modal de reserva não abriu');
      }

      // 3. Teste do Formulário Inline (#contato-reservas)
      const inlineForm = page.locator('#contato-reservas [aria-label="Reserva de mesa no Braseiro Caiçara"]').first();
      const inlineExists = await inlineForm.count() > 0;
      if (inlineExists) {
        envResult.reservaInlineFlow = true;
        console.log('  [Reserva Inline] Componente inline presente e acessível na seção #contato-reservas.');
      } else {
        envResult.errors.push('Formulário inline não encontrado em #contato-reservas');
      }

      // 4. Teste de Navegação do Cardápio
      await page.goto(`${BASE_URL}/cardapio`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1');
      const cardapioHeading = await page.locator('h1').first().isVisible();

      await page.goto(`${BASE_URL}/cardapio/gastronomia`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('article', { timeout: 10000 });
      const gastroCards = await page.locator('article').count();

      await page.goto(`${BASE_URL}/cardapio/drinks`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('article', { timeout: 10000 });
      const drinksCards = await page.locator('article').count();

      await page.goto(`${BASE_URL}/cardapio/executivos`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('article', { timeout: 10000 });
      const execCards = await page.locator('article').count();

      if (cardapioHeading && gastroCards > 0 && drinksCards > 0 && execCards > 0) {
        envResult.cardapioNavFlow = true;
        console.log(`  [Cardápio] Navegação e renderização OK (${gastroCards} gastronomia, ${drinksCards} drinks, ${execCards} executivos).`);
      } else {
        envResult.errors.push(`Falha na navegação do cardápio: cards (g:${gastroCards}, d:${drinksCards}, e:${execCards})`);
      }

      // 5. Links Externos (iFood e Google Maps)
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('a[href*="ifood.com.br"]', { timeout: 10000 });
      const ifoodLinks = page.locator('a[href*="ifood.com.br"]');
      const ifoodCount = await ifoodLinks.count();
      if (ifoodCount > 0) {
        const ifoodHref = await ifoodLinks.first().getAttribute('href');
        if (ifoodHref && ifoodHref.includes('braseiro-caicara')) {
          envResult.ifoodLinkValid = true;
          console.log(`  [iFood] Link verificado (${ifoodCount} botões apontando para o iFood oficial).`);
        }
      } else {
        envResult.errors.push('Nenhum link do iFood encontrado');
      }

      const mapsLinks = page.locator('a[href*="maps.google.com"], a[href*="google.com/maps"]');
      const mapsCount = await mapsLinks.count();
      if (mapsCount > 0) {
        envResult.mapsLinkValid = true;
        console.log(`  [Google Maps] Link verificado (${mapsCount} links presentes).`);
      } else {
        envResult.errors.push('Nenhum link do Google Maps encontrado');
      }

      // 6. Auditoria de Acessibilidade Automatizada com axe-core (Apenas no Chromium Desktop para base de relatório)
      if (env.name === 'Chromium Desktop') {
        console.log('  [Acessibilidade] Executando análise axe-core...');
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);
        const axeHome = await new AxeBuilder({ page }).analyze();
        const criticalOrSeriousHome = axeHome.violations.filter(v => ['critical', 'serious'].includes(v.impact));

        await page.goto(`${BASE_URL}/cardapio`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);
        const axeCardapio = await new AxeBuilder({ page }).analyze();
        const criticalOrSeriousCardapio = axeCardapio.violations.filter(v => ['critical', 'serious'].includes(v.impact));

        const totalCritical = criticalOrSeriousHome.length + criticalOrSeriousCardapio.length;
        envResult.axeViolations = axeHome.violations.length + axeCardapio.violations.length;
        envResult.axeCriticalSerious = totalCritical;

        console.log('  [Acessibilidade Home Violations]:', JSON.stringify(criticalOrSeriousHome.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) }))));
        console.log('  [Acessibilidade Cardapio Violations]:', JSON.stringify(criticalOrSeriousCardapio.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) }))));

        axeResultsSummary = {
          totalViolations: envResult.axeViolations,
          criticalOrSerious: totalCritical,
          homeViolations: axeHome.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
          cardapioViolations: axeCardapio.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })),
        };
        console.log(`  [Acessibilidade] Violações críticas/sérias encontradas: ${totalCritical}`);
      }

    } catch (err) {
      envResult.errors.push(err.message);
      console.error(`  [ERRO em ${env.name}]:`, err.message);
    } finally {
      await context.close();
      await browser.close();
    }

    results.push(envResult);
  }

  console.log('\n=== RESUMO DOS TESTES E2E ===');
  console.table(results.map(r => ({
    Ambiente: r.name,
    Home: r.homepageStatus === 200 ? 'OK' : 'ERRO',
    ReservaSheet: r.reservaSheetFlow ? 'PASS' : 'FAIL',
    ReservaInline: r.reservaInlineFlow ? 'PASS' : 'FAIL',
    Cardapio: r.cardapioNavFlow ? 'PASS' : 'FAIL',
    iFood: r.ifoodLinkValid ? 'PASS' : 'FAIL',
    Maps: r.mapsLinkValid ? 'PASS' : 'FAIL',
    Erros: r.errors.length,
  })));

  // Grava resultados estruturados
  const auditoriaDir = path.resolve('auditoria');
  if (!fs.existsSync(auditoriaDir)) {
    fs.mkdirSync(auditoriaDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(auditoriaDir, 'e2e-results.json'),
    JSON.stringify({ date: new Date().toISOString(), results, axeResultsSummary }, null, 2)
  );

  console.log('\nResultados salvos em auditoria/e2e-results.json\n');
}

runE2EAndAudit().catch(err => {
  console.error('Falha geral no runner E2E:', err);
  process.exit(1);
});
