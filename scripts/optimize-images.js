/* ============================================================
   HeavyWeight — Optimización de imágenes reales (PNG -> WebP)
   Convierte las fotos de Camisetas/REALES a WebP (1x + @2x)
   Uso: node scripts/optimize-images.js
   ============================================================ */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.join(__dirname, '..', 'Camisetas', 'REALES');
const OUT = path.join(__dirname, '..', 'assets', 'img');

const PRODUCTS = [
  ['Again Trasera.png', 'again-back'],
  ['Again Delantera.png', 'again-front'],
  ['Discipline trasera.png', 'discipline-back'],
  ['Discipline delantera.png', 'discipline-front'],
  ['Focus trasera.png', 'focus-back'],
  ['Focus Delantera.png', 'focus-front'],
  ['Focus Vinotinto trasera.png', 'focus-vinotinto-back'],
  ['Focus Vinotinto delantera.png', 'focus-vinotinto-front'],
  ['One More Rep trasera.png', 'one-more-rep-back'],
  ['One More Rep delantera.png', 'one-more-rep-front'],
  ['Toji Fushiguro Trasera.png', 'toji-fushiguro-back'],
  ['Toji Fushiguro Delantera.png', 'toji-fushiguro-front']
];

const WIDE = [['Modelo.png', 'lookbook']];

async function run() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  // Imágenes de producto (retrato 1122x1402): 1x=600px, @2x=nativo
  for (const [file, name] of PRODUCTS) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) {
      console.error('FALTA:', file);
      continue;
    }
    await sharp(src).resize({ width: 600 }).webp({ quality: 82 })
      .toFile(path.join(OUT, name + '.webp'));
    await sharp(src).webp({ quality: 82 })
      .toFile(path.join(OUT, name + '@2x.webp'));
    console.log('OK', name);
  }

  // Lookbook (apaisada 1536x1024): 1x=1200px, @2x=nativo
  for (const [file, name] of WIDE) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) {
      console.error('FALTA:', file);
      continue;
    }
    await sharp(src).resize({ width: 1200 }).webp({ quality: 82 })
      .toFile(path.join(OUT, name + '.webp'));
    await sharp(src).webp({ quality: 82 })
      .toFile(path.join(OUT, name + '@2x.webp'));
    console.log('OK', name);
  }

  console.log('Listo.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
