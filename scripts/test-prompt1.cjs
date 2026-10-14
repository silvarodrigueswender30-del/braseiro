const puppeteer = require('C:/Users/Teste/node_modules/puppeteer');

const PREVIEW_URL = 'http://localhost:4173/';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('--- INICIANDO TESTES DO PROMPT 1 ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = {};

  // -------------------------------------------------------------
  // TESTE (i): CPU 6x mais lenta + rede Slow 3G
  // -------------------------------------------------------------
  console.log('Executando Teste (i): CPU 6x lenta + Slow 3G...');
  const page1 = await browser.newPage();
  const client1 = await page1.target().createCDPSession();
  await client1.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  await client1.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (500 * 1024) / 8, // ~500 kbps (Slow 3G)
    uploadThroughput: (500 * 1024) / 8,
    latency: 400, // 400ms RTT
  });

  await page1.setViewport({ width: 1440, height: 900 });
  await page1.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });
  await sleep(4000); // aguarda 4s para simular carga lenta

  const test1Stats = await page1.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
    const hiddenInViewport = reveals.filter((el) => {
      const rect = el.getBoundingClientRect();
      const inVp = rect.top <= window.innerHeight && rect.bottom >= 0;
      const cs = window.getComputedStyle(el);
      return inVp && (cs.opacity === '0' || cs.visibility === 'hidden');
    });
    return {
      totalReveals: reveals.length,
      hiddenInViewportCount: hiddenInViewport.length,
    };
  });
  results.test1_slow3G = test1Stats;
  await page1.close();

  // -------------------------------------------------------------
  // TESTE (ii): ScrollTrigger desativado de propósito
  // após 4s tudo que está na viewport aparece
  // -------------------------------------------------------------
  console.log('Executando Teste (ii): ScrollTrigger desativado de propósito...');
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1440, height: 900 });
  // Injeta script para desativar ScrollTrigger antes do carregamento
  await page2.evaluateOnNewDocument(() => {
    // Intercepta e congela ScrollTrigger
    window.__disableScrollTrigger = true;
  });
  await page2.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });
  // Simula falha do ScrollTrigger forçando opacity 0 em todos os data-reveal
  await page2.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = '0';
    });
  });
  console.log('Aguardando 4 segundos pelo failsafe central...');
  await sleep(4200);

  const test2Stats = await page2.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
    const hiddenInViewport = reveals.filter((el) => {
      const rect = el.getBoundingClientRect();
      const inVp = rect.top <= window.innerHeight && rect.bottom >= 0;
      const cs = window.getComputedStyle(el);
      return inVp && (cs.opacity === '0' || cs.visibility === 'hidden');
    });
    return {
      totalReveals: reveals.length,
      hiddenInViewportCount: hiddenInViewport.length,
    };
  });
  results.test2_disabledScrollTrigger = test2Stats;
  await page2.close();

  // -------------------------------------------------------------
  // TESTE (iii): Abrir direto em /#contato-reservas e em /#pratos
  // nada acima nem abaixo fica invisível
  // -------------------------------------------------------------
  console.log('Executando Teste (iii): Abrir direto em /#contato-reservas e /#pratos...');
  const page3 = await browser.newPage();
  await page3.setViewport({ width: 1440, height: 900 });

  // 1. Abrir direto em /#contato-reservas
  await page3.goto(PREVIEW_URL + '#contato-reservas', { waitUntil: 'networkidle2' });
  await sleep(1500);
  const test3Reservas = await page3.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
    const hiddenAboveOrInVp = reveals.filter((el) => {
      const rect = el.getBoundingClientRect();
      const isAboveOrInVp = rect.top <= window.innerHeight;
      const cs = window.getComputedStyle(el);
      return isAboveOrInVp && (cs.opacity === '0' || cs.visibility === 'hidden');
    });
    return {
      totalReveals: reveals.length,
      hiddenAboveOrInVpCount: hiddenAboveOrInVp.length,
    };
  });

  // 2. Abrir direto em /#pratos
  await page3.goto(PREVIEW_URL + '#pratos', { waitUntil: 'networkidle2' });
  await sleep(1500);
  const test3Pratos = await page3.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
    const hiddenAboveOrInVp = reveals.filter((el) => {
      const rect = el.getBoundingClientRect();
      const isAboveOrInVp = rect.top <= window.innerHeight;
      const cs = window.getComputedStyle(el);
      return isAboveOrInVp && (cs.opacity === '0' || cs.visibility === 'hidden');
    });
    return {
      totalReveals: reveals.length,
      hiddenAboveOrInVpCount: hiddenAboveOrInVp.length,
    };
  });
  results.test3_directAnchors = { test3Reservas, test3Pratos };
  await page3.close();

  // -------------------------------------------------------------
  // TESTE (iv): Rolagem rápida até o fim da página
  // nenhum [data-reveal] fica com opacity 0
  // -------------------------------------------------------------
  console.log('Executando Teste (iv): Rolagem rápida até o fim da página...');
  const page4 = await browser.newPage();
  await page4.setViewport({ width: 1440, height: 900 });
  await page4.goto(PREVIEW_URL, { waitUntil: 'networkidle2' });
  await sleep(500);

  // Rolagem rápida instantânea até o rodapé
  await page4.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  });
  await sleep(600); // aguarda evento de fim de scroll

  const test4Stats = await page4.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
    const hiddenElements = reveals.filter((el) => {
      const cs = window.getComputedStyle(el);
      return cs.opacity === '0' || cs.visibility === 'hidden' || el.style.opacity === '0';
    });
    return {
      totalReveals: reveals.length,
      hiddenCountAfterFastScroll: hiddenElements.length,
    };
  });
  results.test4_fastScroll = test4Stats;
  await page4.close();

  // -------------------------------------------------------------
  // TESTE DOCK: getBoundingClientRect sobre reservas e rodapé (390 e 1440px)
  // -------------------------------------------------------------
  console.log('Testando Dock com getBoundingClientRect em 390px e 1440px...');
  for (const vpWidth of [390, 1440]) {
    const pageDock = await browser.newPage();
    const vpHeight = vpWidth === 390 ? 844 : 900;
    await pageDock.setViewport({ width: vpWidth, height: vpHeight });
    await pageDock.goto(PREVIEW_URL, { waitUntil: 'networkidle2' });
    await sleep(500);

    // 0. Rolar para o meio da página para confirmar que o dock aparece após hero CTA sair
    await pageDock.evaluate(() => {
      window.scrollTo({ top: 3000, behavior: 'instant' });
    });
    await sleep(400);

    const dockOverMid = await pageDock.evaluate(() => {
      const dock = document.querySelector('[role="group"][aria-label="Atalhos de contato"]');
      const cs = dock ? window.getComputedStyle(dock) : null;
      return {
        dockVisible: cs ? cs.visibility === 'visible' && cs.opacity !== '0' : false,
        dockOpacity: cs ? cs.opacity : null,
      };
    });

    // 1. Rolar até #contato-reservas
    await pageDock.evaluate(() => {
      const s = document.getElementById('contato-reservas');
      if (s) {
        const top = s.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'instant' });
      }
    });
    await sleep(600);

    const dockOverReservas = await pageDock.evaluate(() => {
      const dock = document.querySelector('[role="group"][aria-label="Atalhos de contato"]');
      const reservas = document.getElementById('contato-reservas');
      const cs = dock ? window.getComputedStyle(dock) : null;
      return {
        dockVisible: cs ? cs.visibility === 'visible' && cs.opacity !== '0' : false,
        dockOpacity: cs ? cs.opacity : null,
        dockVisibility: cs ? cs.visibility : null,
        dockIsInert: dock ? dock.hasAttribute('inert') : null,
        dockRect: dock ? { top: dock.getBoundingClientRect().top, bottom: dock.getBoundingClientRect().bottom, height: dock.getBoundingClientRect().height } : null,
        reservasRect: reservas ? { top: reservas.getBoundingClientRect().top, bottom: reservas.getBoundingClientRect().bottom, height: reservas.getBoundingClientRect().height } : null,
      };
    });

    // 2. Rolar até #rodape
    await pageDock.evaluate(() => {
      const s = document.getElementById('rodape');
      if (s) {
        const top = s.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'instant' });
      }
    });
    await sleep(600);

    const dockOverRodape = await pageDock.evaluate(() => {
      const dock = document.querySelector('[role="group"][aria-label="Atalhos de contato"]');
      const rodape = document.getElementById('rodape');
      const cs = dock ? window.getComputedStyle(dock) : null;
      return {
        dockVisible: cs ? cs.visibility === 'visible' && cs.opacity !== '0' : false,
        dockOpacity: cs ? cs.opacity : null,
        dockVisibility: cs ? cs.visibility : null,
        dockIsInert: dock ? dock.hasAttribute('inert') : null,
        dockRect: dock ? { top: dock.getBoundingClientRect().top, bottom: dock.getBoundingClientRect().bottom, height: dock.getBoundingClientRect().height } : null,
        rodapeRect: rodape ? { top: rodape.getBoundingClientRect().top, bottom: rodape.getBoundingClientRect().bottom, height: rodape.getBoundingClientRect().height } : null,
      };
    });

    results[`dock_${vpWidth}px`] = {
      dockOverMid,
      dockOverReservas,
      dockOverRodape,
    };

    await pageDock.close();
  }

  await browser.close();
  console.log('\n--- RESULTADOS FINAIS ---');
  console.log(JSON.stringify(results, null, 2));
}

runTests().catch((err) => {
  console.error('Erro nos testes:', err);
  process.exit(1);
});
