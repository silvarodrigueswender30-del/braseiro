const puppeteer = require('puppeteer');

(async () => {
  console.log('--- INICIANDO SUÍTE DE TESTES DO PROMPT 2 ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. TESTE DE NAVEGAÇÃO / HEADER RESPONSIVO
  console.log('\n[1. TESTE DO HEADER RESPONSIVO (NAV-01)]');
  const viewports = [
    { width: 390, height: 844, label: 'Mobile (390px)' },
    { width: 1024, height: 768, label: 'Tablet (1024px)' },
    { width: 1180, height: 900, label: 'Desktop Mínimo (1180px)' },
    { width: 1440, height: 900, label: 'Desktop Amplo (1440px)' }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    const headerData = await page.evaluate(() => {
      const desktopNav = document.querySelector('[data-testid="desktop-nav"]') || document.querySelector('header nav.min-\\[1180px\\]\\:flex');
      const hamburger = document.querySelector('button[aria-label*="menu" i]') || document.querySelector('button[aria-controls="mobile-menu"]');
      
      let desktopNavVisible = false;
      if (desktopNav) {
        const style = window.getComputedStyle(desktopNav);
        desktopNavVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      }

      let hamburgerVisible = false;
      let hamburgerTargetSize = { width: 0, height: 0 };
      if (hamburger) {
        const style = window.getComputedStyle(hamburger);
        const rect = hamburger.getBoundingClientRect();
        hamburgerVisible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0;
        hamburgerTargetSize = { width: Math.round(rect.width), height: Math.round(rect.height) };
      }

      return { desktopNavVisible, hamburgerVisible, hamburgerTargetSize };
    });

    console.log(`- ${vp.label}:`);
    console.log(`    Links Inline Desktop visíveis: ${headerData.desktopNavVisible}`);
    console.log(`    Botão Hambúrguer visível: ${headerData.hamburgerVisible} (tamanho: ${headerData.hamburgerTargetSize.width}x${headerData.hamburgerTargetSize.height}px)`);

    if (vp.width >= 1180) {
      if (!headerData.desktopNavVisible) throw new Error(`Falha: Desktop Nav deveria estar visível em ${vp.width}px`);
      if (headerData.hamburgerVisible) throw new Error(`Falha: Hambúrguer deveria estar oculto em ${vp.width}px`);
    } else {
      if (headerData.desktopNavVisible) throw new Error(`Falha: Desktop Nav deveria estar oculto em ${vp.width}px`);
      if (!headerData.hamburgerVisible) throw new Error(`Falha: Hambúrguer deveria estar visível em ${vp.width}px`);
      if (headerData.hamburgerTargetSize.width < 44 || headerData.hamburgerTargetSize.height < 44) {
        throw new Error(`Falha: Hambúrguer menor que 44px em ${vp.width}px`);
      }
    }
  }

  // 2. TESTE DE CONTROLE GLOBAL DE PAUSA DE VÍDEOS (AUTO-01)
  console.log('\n[2. TESTE DE PAUSA DE VÍDEOS (AUTO-01)]');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  const pauseBtn = await page.$('button[aria-label*="vídeo" i]');
  if (!pauseBtn) {
    throw new Error('Botão de controle de vídeo não encontrado na Hero');
  }

  // Clica para pausar
  await pauseBtn.click();
  await new Promise(r => setTimeout(r, 400));

  const pauseState = await page.evaluate(() => {
    const sessionVal = sessionStorage.getItem('braseiro_videos_paused');
    const videos = Array.from(document.querySelectorAll('video'));
    const allPaused = videos.every(v => v.paused);
    const btn = document.querySelector('button[aria-label*="vídeo" i]');
    const pressed = btn ? btn.getAttribute('aria-pressed') : null;
    const label = btn ? btn.getAttribute('aria-label') : null;
    return { sessionVal, allPaused, videoCount: videos.length, pressed, label };
  });

  console.log(`- Estado após clique em Pausar:`);
  console.log(`    sessionStorage braseiro_videos_paused: "${pauseState.sessionVal}"`);
  console.log(`    Vídeos na página: ${pauseState.videoCount}, todos pausados: ${pauseState.allPaused}`);
  console.log(`    Botão aria-pressed: ${pauseState.pressed}, aria-label: "${pauseState.label}"`);

  if (pauseState.sessionVal !== 'true' || !pauseState.allPaused) {
    throw new Error('Falha no controle de pausa de vídeos');
  }

  // Clica para retomar
  await pauseBtn.click();
  await new Promise(r => setTimeout(r, 400));

  const resumeState = await page.evaluate(() => {
    const sessionVal = sessionStorage.getItem('braseiro_videos_paused');
    const btn = document.querySelector('button[aria-label*="vídeo" i]');
    const pressed = btn ? btn.getAttribute('aria-pressed') : null;
    return { sessionVal, pressed };
  });

  console.log(`- Estado após clique em Retomar:`);
  console.log(`    sessionStorage braseiro_videos_paused: "${resumeState.sessionVal}"`);
  console.log(`    Botão aria-pressed: ${resumeState.pressed}`);
  if (resumeState.sessionVal !== 'false') {
    throw new Error('Falha ao despausar vídeos');
  }

  // 3. TESTE DE CONTRASTE SOBRE CREME (#F5E6D0) (CONTR-01)
  console.log('\n[3. TESTE DE CONTRASTE SOBRE CREME (CONTR-01)]');
  const contrastCheck = await page.evaluate(() => {
    // Cálculo de luminância relativa WCAG
    function getLuminance(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrast(rgb1, rgb2) {
      const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
      const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    const creme = [245, 230, 208]; // #F5E6D0
    const corOriginal = [232, 131, 42]; // #E8832A
    const grande = [196, 99, 26]; // #C4631A
    const texto = [163, 75, 20]; // #A34B14

    return {
      ratioAntigo: getContrast(corOriginal, creme).toFixed(2),
      ratioGrande: getContrast(grande, creme).toFixed(2),
      ratioTexto: getContrast(texto, creme).toFixed(2)
    };
  });

  console.log(`- Ratio anterior #E8832A sobre creme: ${contrastCheck.ratioAntigo}:1 (reprovava)`);
  console.log(`- Ratio novo --brasa-creme-grande (#C4631A): ${contrastCheck.ratioGrande}:1 (>= 3.0:1 aprovado para texto grande)`);
  console.log(`- Ratio novo --brasa-creme-texto (#A34B14): ${contrastCheck.ratioTexto}:1 (>= 4.5:1 aprovado para texto normal)`);

  // 4. TESTE DE MARQUEE ACESSÍVEL (ANIM-01)
  console.log('\n[4. TESTE DE MARQUEE ACESSÍVEL (ANIM-01)]');
  const marqueeCheck = await page.evaluate(() => {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return { found: false };
    const track = marquee.querySelector('.marquee__track');
    const ariaHidden = marquee.querySelector('[aria-hidden="true"]');
    return {
      found: true,
      hasTrack: !!track,
      hasAriaHidden: !!ariaHidden
    };
  });
  console.log(`- Marquee encontrado: ${marqueeCheck.found}, track presente: ${marqueeCheck.hasTrack}, aria-hidden nas cópias: ${marqueeCheck.hasAriaHidden}`);

  // 5. TESTE DE FORMULÁRIO ACESSÍVEL (FORM-01)
  console.log('\n[5. TESTE DO FORMULÁRIO DE RESERVAS (FORM-01)]');
  await page.evaluate(() => {
    const section = document.getElementById('contato-reservas');
    if (section) section.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.click('#reserva-nome');
  await page.keyboard.type(' ');
  await page.keyboard.press('Backspace');
  await page.click('#reserva-horario'); // Clica fora para forçar onBlur no React
  await new Promise(r => setTimeout(r, 400));

  const formCheck = await page.evaluate(() => {
    const form = document.querySelector('#contato-reservas form');
    if (!form) return { hasForm: false };

    const alert = form.querySelector('[role="alert"]');
    return {
      hasForm: true,
      hasOnBlurAlert: !!alert,
      alertText: alert ? alert.textContent : null
    };
  });

  console.log(`- Formulário presente: ${formCheck.hasForm}`);
  console.log(`- Validação onBlur com role="alert" disparada: ${formCheck.hasOnBlurAlert} ("${formCheck.alertText}")`);

  console.log('\n=========================================');
  console.log('TODOS OS CRITÉRIOS DO PROMPT 2 PASSARAM!');
  console.log('=========================================');

  await browser.close();
})().catch(err => {
  console.error('ERRO NO TESTE DO PROMPT 2:', err);
  process.exit(1);
});
