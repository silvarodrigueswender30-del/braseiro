const fs = require('fs');
const path = require('path');

function getFiles(dir, exts) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const res = path.join(dir, d.name);
    if (d.isDirectory()) {
      if (
        d.name !== 'node_modules' &&
        d.name !== 'dist' &&
        d.name !== '.agent' &&
        d.name !== 'auditoria' &&
        d.name !== '.git'
      ) {
        files = files.concat(getFiles(res, exts));
      }
    } else {
      if (exts.includes(path.extname(d.name))) files.push(res);
    }
  });
  return files;
}

const sourceFiles = getFiles('src', ['.ts', '.tsx', '.js', '.jsx', '.css']).concat(['index.html']);
const regex = /['"`](\/images\/[^'"`]+|\/videos\/[^'"`]+)['"`]/g;
const foundPaths = new Set();

sourceFiles.forEach((f) => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    let clean = match[1].split('?')[0].split('#')[0];
    foundPaths.add(clean);
  }
});

const missing = [];
const existing = [];

foundPaths.forEach((p) => {
  const localPath = path.join('public', p);
  if (fs.existsSync(localPath)) {
    existing.push(p);
  } else {
    missing.push(p);
  }
});

console.log('TOTAL DE CAMINHOS ENCONTRADOS:', foundPaths.size);
console.log('EXISTENTES:', existing.length);
console.log('FALTANDO:', missing);
