import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const VIDEOS = [
  { id: 'vid01', url: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/vid01.mp4' },
  { id: 'vid2',  url: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/vid2.mp4' },
  { id: 'vid3',  url: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/vid3.mp4' },
  { id: 'drink', url: 'https://jszueizwowynhekpsfii.supabase.co/storage/v1/object/public/braseiro/drink.mp4' },
];

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status} fetching ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

async function main() {
  const origDir = path.resolve('auditoria/videos-originais');
  const optDir = path.resolve('auditoria/videos-otimizados');

  if (!fs.existsSync(origDir)) fs.mkdirSync(origDir, { recursive: true });
  if (!fs.existsSync(optDir)) fs.mkdirSync(optDir, { recursive: true });

  console.log('=== AUDITORIA E ANÁLISE DE VÍDEOS ===\n');
  const results = [];

  for (const item of VIDEOS) {
    const origPath = path.join(origDir, `${item.id}.mp4`);
    const optPath = path.join(optDir, `${item.id}-otimizado.mp4`);

    console.log(`Baixando ${item.id} (${item.url})...`);
    const origBytes = await downloadFile(item.url, origPath);
    const origKb = (origBytes / 1024).toFixed(1);
    console.log(`  Tamanho original: ${origKb} KB`);

    // Compressão com ffmpeg: H.264 CRF 26, sem áudio (an - muted background), faststart para streaming imediato
    console.log(`  Comprimindo com ffmpeg (CRF 26, preset slow, an, movflags +faststart)...`);
    try {
      execSync(`ffmpeg -y -i "${origPath}" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart "${optPath}"`, { stdio: 'pipe' });
    } catch (err) {
      console.error(`Erro ao comprimir ${item.id}:`, err.message);
      continue;
    }

    const optBytes = fs.statSync(optPath).size;
    const optKb = (optBytes / 1024).toFixed(1);
    const savingsPercent = (((origBytes - optBytes) / origBytes) * 100).toFixed(1);

    // Medição de SSIM
    console.log(`  Calculando SSIM...`);
    let ssim = 'N/A';
    try {
      const ssimOut = execSync(`ffmpeg -i "${optPath}" -i "${origPath}" -lavfi "ssim=stats_file=-" -f null -`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      // Extrair All: 0.xxxxx da saída
      const match = ssimOut.match(/All:([0-9.]+)/);
      if (match) ssim = match[1];
    } catch (ssimErr) {
      const match = (ssimErr.stderr || '').match(/All:([0-9.]+)/);
      if (match) ssim = match[1];
    }

    console.log(`  Resultado ${item.id}: Original ${origKb} KB -> Otimizado ${optKb} KB (-${savingsPercent}%) | SSIM: ${ssim}\n`);

    results.push({
      id: item.id,
      url: item.url,
      origKb: parseFloat(origKb),
      optKb: parseFloat(optKb),
      savingsPercent: parseFloat(savingsPercent),
      ssim: parseFloat(ssim) || ssim,
    });
  }

  const totalOrigKb = results.reduce((acc, r) => acc + r.origKb, 0).toFixed(1);
  const totalOptKb = results.reduce((acc, r) => acc + r.optKb, 0).toFixed(1);
  const totalSavings = (((totalOrigKb - totalOptKb) / totalOrigKb) * 100).toFixed(1);

  console.log('=== RESUMO FINAL DE VÍDEOS ===');
  console.log(`Total original: ${(totalOrigKb / 1024).toFixed(2)} MB (${totalOrigKb} KB)`);
  console.log(`Total otimizado: ${(totalOptKb / 1024).toFixed(2)} MB (${totalOptKb} KB)`);
  console.log(`Economia potencial total: ${totalSavings}%`);

  fs.writeFileSync('auditoria/video-results.json', JSON.stringify({ results, totalOrigKb, totalOptKb, totalSavings }, null, 2));
}

main().catch(console.error);
