import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';

function computeMedian(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function runSingleLighthouse(chromePath, port, formFactor) {
  const flags = {
    port,
    output: 'json',
    logLevel: 'error',
    formFactor: formFactor, // 'mobile' | 'desktop'
    screenEmulation: formFactor === 'mobile'
      ? { mobile: true, width: 390, height: 844, deviceScaleFactor: 3, disabled: false }
      : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttlingMethod: 'provided', // ou simule
  };

  const runnerResult = await lighthouse(TARGET_URL, flags);
  const report = runnerResult.lhr;

  const perf = Math.round(report.categories.performance.score * 100);
  const a11y = Math.round(report.categories.accessibility.score * 100);
  const bp = Math.round(report.categories['best-practices'].score * 100);
  const seo = Math.round(report.categories.seo.score * 100);

  const lcpMetric = report.audits['largest-contentful-paint'];
  const lcpVal = lcpMetric?.numericValue ? (lcpMetric.numericValue / 1000).toFixed(2) + 's' : 'N/A';
  const lcpElemAudit = report.audits['largest-contentful-paint-element'];
  const lcpElement = lcpElemAudit?.details?.items?.[0]?.node?.snippet || lcpElemAudit?.details?.items?.[0]?.node?.nodeLabel || 'N/A';

  return {
    perf,
    a11y,
    bp,
    seo,
    lcp: lcpVal,
    lcpNum: lcpMetric?.numericValue || 0,
    lcpElement,
  };
}

async function runLighthouseSuite() {
  console.log(`=== INICIANDO AUDITORIA LIGHTHOUSE (3x Mobile, 3x Desktop) ===`);
  console.log(`Alvo: ${TARGET_URL}\n`);

  const chromePath = chromium.executablePath();
  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  const mobileRuns = [];
  const desktopRuns = [];

  try {
    // 3 Rodadas Mobile
    console.log('--- Executando 3 Rodadas Mobile ---');
    for (let i = 1; i <= 3; i++) {
      console.log(`  [Mobile Rodada ${i}/3]...`);
      const res = await runSingleLighthouse(chromePath, chrome.port, 'mobile');
      console.log(`    Perf: ${res.perf} | A11y: ${res.a11y} | BP: ${res.bp} | SEO: ${res.seo} | LCP: ${res.lcp}`);
      mobileRuns.push(res);
    }

    // 3 Rodadas Desktop
    console.log('\n--- Executando 3 Rodadas Desktop ---');
    for (let i = 1; i <= 3; i++) {
      console.log(`  [Desktop Rodada ${i}/3]...`);
      const res = await runSingleLighthouse(chromePath, chrome.port, 'desktop');
      console.log(`    Perf: ${res.perf} | A11y: ${res.a11y} | BP: ${res.bp} | SEO: ${res.seo} | LCP: ${res.lcp}`);
      desktopRuns.push(res);
    }
  } finally {
    await chrome.kill();
  }

  // Cálculo das Medianas
  const mobileMedians = {
    performance: computeMedian(mobileRuns.map(r => r.perf)),
    accessibility: computeMedian(mobileRuns.map(r => r.a11y)),
    bestPractices: computeMedian(mobileRuns.map(r => r.bp)),
    seo: computeMedian(mobileRuns.map(r => r.seo)),
    lcp: (computeMedian(mobileRuns.map(r => r.lcpNum)) / 1000).toFixed(2) + 's',
    lcpElement: mobileRuns[0].lcpElement,
  };

  const desktopMedians = {
    performance: computeMedian(desktopRuns.map(r => r.perf)),
    accessibility: computeMedian(desktopRuns.map(r => r.a11y)),
    bestPractices: computeMedian(desktopRuns.map(r => r.bp)),
    seo: computeMedian(desktopRuns.map(r => r.seo)),
    lcp: (computeMedian(desktopRuns.map(r => r.lcpNum)) / 1000).toFixed(2) + 's',
    lcpElement: desktopRuns[0].lcpElement,
  };

  const summary = {
    date: new Date().toISOString(),
    targetUrl: TARGET_URL,
    mobile: {
      runs: mobileRuns,
      median: mobileMedians,
    },
    desktop: {
      runs: desktopRuns,
      median: desktopMedians,
    },
  };

  console.log('\n=== RESULTADOS FINAIS LIGHTHOUSE (MEDIANAS) ===');
  console.log('MOBILE:');
  console.log(`  Performance:    ${mobileMedians.performance}`);
  console.log(`  Accessibility:  ${mobileMedians.accessibility}`);
  console.log(`  Best Practices: ${mobileMedians.bestPractices}`);
  console.log(`  SEO:            ${mobileMedians.seo}`);
  console.log(`  LCP:            ${mobileMedians.lcp}`);
  console.log(`  LCP Element:    ${mobileMedians.lcpElement}`);

  console.log('\nDESKTOP:');
  console.log(`  Performance:    ${desktopMedians.performance}`);
  console.log(`  Accessibility:  ${desktopMedians.accessibility}`);
  console.log(`  Best Practices: ${desktopMedians.bestPractices}`);
  console.log(`  SEO:            ${desktopMedians.seo}`);
  console.log(`  LCP:            ${desktopMedians.lcp}`);
  console.log(`  LCP Element:    ${desktopMedians.lcpElement}`);

  const auditoriaDir = path.resolve('auditoria');
  if (!fs.existsSync(auditoriaDir)) {
    fs.mkdirSync(auditoriaDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(auditoriaDir, 'lighthouse-results.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\nResultados salvos em auditoria/lighthouse-results.json\n');
}

runLighthouseSuite().catch(err => {
  console.error('Erro na suíte Lighthouse:', err);
  process.exit(1);
});
