import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateOgImage() {
  console.log('Gerando public/og-image.jpg...');

  const width = 1200;
  const height = 630;

  // Carrega e redimensiona o logo carvao para ~280px de largura
  const logoBuffer = await sharp('public/images/logo/logo-carvao.png')
    .resize({ width: 280 })
    .toBuffer();

  const logoMeta = await sharp(logoBuffer).metadata();
  const logoWidth = logoMeta.width || 280;
  const logoHeight = logoMeta.height || 110;

  // Posição centralizada para o logo
  const logoTop = Math.round((height / 2) - logoHeight - 10);
  const logoLeft = Math.round((width / 2) - (logoWidth / 2));

  // SVG com moldura e tipografia
  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Fina moldura interna de elegância -->
      <rect x="36" y="36" width="${width - 72}" height="${height - 72}" fill="none" stroke="#14100D" stroke-opacity="0.18" stroke-width="1.5" rx="8" />
      <rect x="42" y="42" width="${width - 84}" height="${height - 84}" fill="none" stroke="#E8832A" stroke-opacity="0.22" stroke-width="1" rx="6" />

      <!-- Fio decorativo superior -->
      <line x1="${(width / 2) - 80}" y1="${logoTop - 36}" x2="${(width / 2) + 80}" y2="${logoTop - 36}" stroke="#D9741C" stroke-width="2" stroke-linecap="round" />

      <!-- Subtítulo em caixa alta elegante -->
      <text
        x="${width / 2}"
        y="${logoTop + logoHeight + 56}"
        text-anchor="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-size="21"
        font-weight="700"
        letter-spacing="5"
        fill="#14100D"
      >
        PARRILLA · FRUTOS DO MAR · UBATUBA
      </text>

      <!-- Lema caiçara em itálico acolhedor -->
      <text
        x="${width / 2}"
        y="${logoTop + logoHeight + 104}"
        text-anchor="middle"
        font-family="Georgia, Cambria, 'Times New Roman', serif"
        font-size="22"
        font-style="italic"
        fill="#8C3A14"
      >
        “Acende o fogo, senta à mesa.”
      </text>

      <!-- Selo de localização -->
      <text
        x="${width / 2}"
        y="${height - 70}"
        text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="13"
        font-weight="600"
        letter-spacing="2"
        fill="#14100D"
        opacity="0.65"
      >
        RUA GUARANI, 370 · ITAGUÁ · UBATUBA - SP
      </text>
    </svg>
  `;

  // Base sólida #F5E6D0
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: '#F5E6D0',
    },
  })
    .composite([
      {
        input: logoBuffer,
        top: logoTop,
        left: logoLeft,
      },
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({
      quality: 85,
      mozjpeg: true,
    })
    .toFile('public/og-image.jpg');

  const ogStat = fs.statSync('public/og-image.jpg');
  console.log(`public/og-image.jpg gerado com sucesso: ${(ogStat.size / 1024).toFixed(1)} KB (< 200 KB)`);
}

async function generateFavicons() {
  console.log('Gerando favicons...');
  const svgPath = 'public/favicon.svg';

  // 1. favicon-32x32.png
  const png32 = await sharp(svgPath)
    .resize(32, 32)
    .png()
    .toBuffer();
  fs.writeFileSync('public/favicon-32x32.png', png32);
  console.log('public/favicon-32x32.png gerado.');

  // 2. apple-touch-icon.png (180x180)
  const appleIcon = await sharp(svgPath)
    .resize(180, 180)
    .png()
    .toBuffer();
  fs.writeFileSync('public/apple-touch-icon.png', appleIcon);
  console.log('public/apple-touch-icon.png gerado.');

  // 3. favicon.ico (Container ICO padrão com imagem PNG 32x32 embutida)
  // Cabeçalho ICO: 6 bytes (Reserved 0, Type 1, Count 1)
  // Diretório de entrada: 16 bytes (Width 32, Height 32, Colors 0, Reserved 0, Planes 1, BPP 32, Size, Offset 22)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // Count 1 image

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0);  // Width (0 = 256, 32 = 32)
  icoEntry.writeUInt8(32, 1);  // Height
  icoEntry.writeUInt8(0, 2);   // Colors
  icoEntry.writeUInt8(0, 3);   // Reserved
  icoEntry.writeUInt16LE(1, 4); // Color planes
  icoEntry.writeUInt16LE(32, 6); // Bits per pixel
  icoEntry.writeUInt32LE(png32.length, 8); // Image size in bytes
  icoEntry.writeUInt32LE(22, 12); // Offset of image data (6 + 16 = 22)

  const icoFile = Buffer.concat([icoHeader, icoEntry, png32]);
  fs.writeFileSync('public/favicon.ico', icoFile);
  console.log('public/favicon.ico gerado.');
}

async function main() {
  await generateOgImage();
  await generateFavicons();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
