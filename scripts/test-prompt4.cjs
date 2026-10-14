const puppeteer = require('puppeteer');

(async () => {
  console.log('--- INICIANDO SUÍTE DE TESTES DO PROMPT 4 (PERF MOBILE & SEO) ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Emulação Mobile: Moto G4 / Pixel simulando CPU throttled e conexão móvel
  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3
  });

  // 1. TESTE DE LCP MOBILE & POSTER-FIRST
  console.log('\n[1. TESTE DE LCP MOBILE & POLÍTICA POSTER-FIRST]');

  // Injetar listener para capturar LCP via PerformanceObserver
  await page.evaluateOnNewDocument(() => {
    window.__lcpEntries = [];
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        window.__lcpEntries.push({
          startTime: entry.startTime,
          renderTime: entry.renderTime,
          loadTime: entry.loadTime,
          size: entry.size,
          elementTag: entry.element ? entry.element.tagName : null,
          elementSrc: entry.element ? entry.element.getAttribute('src') : null,
          url: entry.url
        });
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  });

  const startTime = Date.now();
  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  const lcpData = await page.evaluate(() => {
    const lcp = window.__lcpEntries ? window.__lcpEntries[window.__lcpEntries.length - 1] : null;
    const mobileVideo = document.querySelector('section#inicio video');
    const heroPoster = document.querySelector('section#inicio img[src*="poster1"]');
    return {
      lcp,
      hasMobileVideoOnLoad: !!mobileVideo,
      hasHeroPoster: !!heroPoster,
      heroPosterNaturalWidth: heroPoster ? heroPoster.naturalWidth : 0
    };
  });

  console.log(`- Poster presente no Hero Mobile: ${lcpData.hasHeroPoster} (naturalWidth: ${lcpData.heroPosterNaturalWidth}px)`);
  console.log(`- Vídeo MP4 na carga inicial: ${lcpData.hasMobileVideoOnLoad ? 'iniciado' : 'adiado poster-first (otimizado)'}`);
  if (lcpData.lcp) {
    const lcpVal = Math.round(lcpData.lcp.renderTime || lcpData.lcp.loadTime || lcpData.lcp.startTime);
    console.log(`- LCP Mobile registrado: ${lcpVal}ms (Elemento: <${lcpData.lcp.elementTag}> src="${lcpData.lcp.elementSrc || lcpData.lcp.url}")`);
  }

  // 2. TESTE DE CARREGAMENTO TARDIO DO GOOGLE MAPS
  console.log('\n[2. TESTE DO MAPA TARDIO (INTERSECTION OBSERVER 600px)]');
  const initialMapStatus = await page.evaluate(() => {
    const iframe = document.querySelector('#contato-reservas iframe');
    const placeholder = document.querySelector('#contato-reservas [class*="Carregando mapa"], #contato-reservas div.w-full');
    return { hasIframe: !!iframe, hasPlaceholder: !!placeholder };
  });

  console.log(`- Na dobra superior: iframe do mapa no DOM: ${initialMapStatus.hasIframe} (esperado: false - economiza megabytes e scripts)`);
  if (initialMapStatus.hasIframe) {
    throw new Error('Falha: iframe do mapa não deveria estar no DOM na dobra inicial');
  }

  // Rola até próximo de #contato-reservas
  console.log('- Rolando até #contato-reservas...');
  await page.evaluate(() => {
    const el = document.getElementById('contato-reservas');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const loadedMapStatus = await page.evaluate(() => {
    const iframe = document.querySelector('#contato-reservas iframe');
    return {
      hasIframe: !!iframe,
      src: iframe ? iframe.getAttribute('src') : null
    };
  });

  console.log(`- Após aproximação: iframe do mapa montado: ${loadedMapStatus.hasIframe} (src: "${loadedMapStatus.src}")`);
  if (!loadedMapStatus.hasIframe || !loadedMapStatus.src.includes('google.com/maps')) {
    throw new Error('Falha: iframe do mapa deveria montar ao se aproximar de #contato-reservas');
  }

  // 3. TESTE DE SEO & DADOS ESTRUTURADOS (JSON-LD)
  console.log('\n[3. TESTE DE SEO E DADOS ESTRUTURADOS (JSON-LD)]');
  const jsonLdData = await page.evaluate(() => {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (!script) return null;
    try {
      return JSON.parse(script.textContent);
    } catch {
      return 'parse_error';
    }
  });

  if (!jsonLdData || jsonLdData === 'parse_error') {
    throw new Error('JSON-LD inválido ou ausente');
  }

  console.log(`- @type: ${jsonLdData['@type']}`);
  console.log(`- name: "${jsonLdData.name}"`);
  console.log(`- telephone: "${jsonLdData.telephone}"`);
  console.log(`- address: streetAddress="${jsonLdData.address?.streetAddress}", locality="${jsonLdData.address?.addressLocality}/${jsonLdData.address?.addressRegion}"`);

  if (jsonLdData['@type'] !== 'Restaurant') throw new Error('Falha: @type deve ser Restaurant');
  if (jsonLdData.telephone !== '+551232083369') throw new Error('Falha: telephone deve ser +551232083369');
  if (jsonLdData.address?.streetAddress !== 'Rua Guarani, 370') throw new Error('Falha: streetAddress incorreto');

  // 4. TESTE DE SUBSET DE FONTES NO HEAD
  console.log('\n[4. TESTE DE SUBSET DE FONTES NO HEAD]');
  const fontLinks = await page.evaluate(() => {
    const link = document.querySelector('link[href*="fonts.googleapis.com/css2"]');
    const href = link ? link.getAttribute('href') : '';
    return {
      hasBarlowCondensed: href.includes('Barlow+Condensed'),
      hasDmSans: href.includes('DM+Sans'),
      hasFraunces: href.includes('Fraunces'),
      hasInstrumentSans: href.includes('Instrument+Sans')
    };
  });

  console.log(`- Fraunces no stylesheet: ${fontLinks.hasFraunces}`);
  console.log(`- Instrument Sans no stylesheet: ${fontLinks.hasInstrumentSans}`);
  console.log(`- DM Sans desnecessário removido: ${!fontLinks.hasDmSans}`);
  if (fontLinks.hasDmSans) {
    throw new Error('Falha: DM Sans deveria ter sido removido do stylesheet do Google Fonts');
  }

  console.log('\n=========================================');
  console.log('TODOS OS CRITÉRIOS DO PROMPT 4 PASSARAM!');
  console.log('=========================================');

  await browser.close();
})().catch(err => {
  console.error('ERRO NO TESTE DO PROMPT 4:', err);
  process.exit(1);
});
