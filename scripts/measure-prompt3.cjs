const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const measurements = await page.evaluate(() => {
    // 1. Seções e paddings verticais
    const sectionIds = ['hero', 'casa', 'fogo', 'pratos', 'eventos', 'ambiente', 'avaliacoes', 'contato-reservas', 'rodape'];
    const sections = sectionIds.map(id => {
      const el = document.getElementById(id) || document.querySelector(id === 'rodape' ? 'footer' : `#${id}`);
      if (!el) return { id, exists: false };
      const style = window.getComputedStyle(el);
      return {
        id,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        height: Math.round(el.getBoundingClientRect().height) + 'px'
      };
    });

    // 2. Palavras itálicas display
    const italicSignatures = [
      { label: 'Hero "brasa"', selector: '.hero-title-fraunces .brasa, .rotating-word__word' },
      { label: 'About "mesa"', selector: '#casa span.font-display.italic, #casa span[style*="SOFT"]' },
      { label: 'Features "diferente"', selector: '#fogo span.font-display.italic, #fogo span[style*="SOFT"]' },
      { label: 'Dishes "da casa"', selector: '#pratos span.font-display.italic, #pratos span[style*="SOFT"]' },
      { label: 'Events "mais um"', selector: '#eventos span.font-display.italic, #eventos span[style*="SOFT"]' },
      { label: 'Ambiance "caiçara"', selector: '#ambiente span.font-display.italic, #ambiente span[style*="SOFT"]' },
      { label: 'Reservations "acesa"', selector: '#contato-reservas span.font-display.italic, #contato-reservas span[style*="SOFT"]' },
      { label: 'Footer "sente à mesa"', selector: 'footer span.font-display.italic, footer span[style*="SOFT"]' }
    ].map(item => {
      const el = document.querySelector(item.selector);
      if (!el) return { label: item.label, found: false };
      const style = window.getComputedStyle(el);
      return {
        label: item.label,
        found: true,
        text: el.textContent.trim().substring(0, 15),
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing
      };
    });

    // 3. Botões e raios de borda
    const buttons = [
      { label: 'Hero Reservar (Desktop)', selector: 'a[data-hero-cta="true"]' },
      { label: 'Dock Cardápio', selector: '.dock-btn[href="#pratos"]' },
      { label: 'Dock WhatsApp', selector: '.dock-btn[href*="wa.me"]' },
      { label: 'Formulário Submit', selector: '#contato-reservas button[type="submit"]' },
      { label: 'Footer Reservar Mesa', selector: 'footer a[href*="reservas"]' }
    ].map(item => {
      const el = document.querySelector(item.selector);
      if (!el) return { label: item.label, found: false };
      const style = window.getComputedStyle(el);
      return {
        label: item.label,
        found: true,
        borderRadius: style.borderRadius,
        minHeight: style.minHeight,
        padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`
      };
    });

    // 4. Rodapé estrutura e alinhamento
    const footer = document.querySelector('footer');
    let footerInfo = null;
    if (footer) {
      const style = window.getComputedStyle(footer);
      const bottomBar = footer.querySelector('.border-t') || footer.querySelector('div:last-child');
      const bottomStyle = bottomBar ? window.getComputedStyle(bottomBar) : null;
      footerInfo = {
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        bottomBarTextAlign: bottomStyle ? bottomStyle.textAlign : null,
        bottomBarJustify: bottomStyle ? bottomStyle.justifyContent : null
      };
    }

    return { sections, italicSignatures, buttons, footerInfo };
  });

  console.log(JSON.stringify(measurements, null, 2));
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
