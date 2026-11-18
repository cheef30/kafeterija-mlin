// Obrada fotografija: EXIF rotacija, uklanjanje EXIF/GPS, ujednačavanje tona,
// AVIF + WebP + JPG u više širina, manifest za komponente, logo fajlovi i og-image.
// Pokretanje: npm run images   (dodaj --force da ponovo generiše sve)
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import config from './images.config.mjs';
import { wordmarkSVG } from '../src/lib/wordmark.mjs';

import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'slike');
const OUT = path.join(ROOT, 'public', 'img');
const MANIFEST = path.join(ROOT, 'src', 'generated', 'images.json');
const force = process.argv.includes('--force');

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(path.dirname(MANIFEST), { recursive: true });

const exists = (p) => fs.access(p).then(() => true, () => false);

function base(file, item) {
  let img = sharp(file, { failOn: 'none' }).rotate(); // rotacija po EXIF-u; metapodaci se ne prenose
  return img;
}

async function prepared(item) {
  const file = path.join(SRC, item.src);
  const meta = await sharp(file).metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const W = swap ? meta.height : meta.width;
  const H = swap ? meta.width : meta.height;
  let pipeline = base(file, item);
  let w = W, h = H;
  if (item.crop) {
    const [x, y, cw, ch] = item.crop;
    const region = { left: Math.round(x * W), top: Math.round(y * H), width: Math.round(cw * W), height: Math.round(ch * H) };
    region.width = Math.min(region.width, W - region.left);
    region.height = Math.min(region.height, H - region.top);
    // posle rotate() mora u bafer da bi extract radio nad rotiranom slikom
    const buf = await pipeline.toBuffer();
    pipeline = sharp(buf).extract(region);
    w = region.width; h = region.height;
  }
  if (item.tone === 'telefon') {
    // Telefonske fotografije: malo manje zasićenja i topliji balans, bez filtera.
    pipeline = pipeline.modulate({ saturation: 0.9 }).recomb([
      [1.035, 0, 0],
      [0, 1.0, 0],
      [0, 0, 0.95],
    ]);
  }
  const buf = await pipeline.toBuffer();
  return { buf, w, h };
}

const manifest = {};
for (const item of config) {
  const { buf, w, h } = await prepared(item);
  const widths = item.widths.filter((x) => x <= w);
  if (!widths.length || widths[widths.length - 1] < Math.min(w, item.widths[item.widths.length - 1])) widths.push(Math.min(w, item.widths[item.widths.length - 1]));
  const uniq = [...new Set(widths)].sort((a, b) => a - b);
  const stats = await sharp(buf).resize(32).stats();
  const d = stats.dominant;
  for (const width of uniq) {
    const name = `${item.id}-${width}`;
    const targets = [
      [`${name}.avif`, (s) => s.avif({ quality: 50, effort: 4 })],
      [`${name}.webp`, (s) => s.webp({ quality: 72 })],
      [`${name}.jpg`, (s) => s.jpeg({ quality: 76, mozjpeg: true, progressive: true })],
    ];
    for (const [file, enc] of targets) {
      const p = path.join(OUT, file);
      if (!force && (await exists(p))) continue;
      await enc(sharp(buf).resize({ width })).toFile(p);
    }
  }
  manifest[item.id] = {
    w, h,
    widths: uniq,
    alt: item.alt,
    bg: `rgb(${d.r} ${d.g} ${d.b})`,
  };
  console.log(`✓ ${item.id} ${w}x${h} [${uniq.join(', ')}]`);
}
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

// Logo fajlovi u tri boje
const ASSETS = path.join(ROOT, 'public', 'assets');
await fs.mkdir(ASSETS, { recursive: true });
const colors = { grafit: '#1F1B17', papir: '#EFE7DA', bakar: '#B5714E' };
for (const [n, c] of Object.entries(colors)) {
  await fs.writeFile(path.join(ASSETS, `mlin-wordmark-${n}.svg`), wordmarkSVG({ color: c }));
}
// Favicon: samo okvir sa ručicom i slovom М, na grafitu
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1F1B17"/><g fill="none" stroke="#B5714E" stroke-width="3.4" stroke-linecap="square"><rect x="8" y="20" width="48" height="34" rx="2"/><path d="M24 20v-8h22v-5"/><path d="M41 7h10" stroke-width="4"/></g><path fill="#EFE7DA" d="M17 47V27h4.4l7.6 12 7.6-12H41v20h-4V34.5l-6.2 9.5h-3.6L21 34.5V47z"/></svg>`;
await fs.writeFile(path.join(ROOT, 'public', 'favicon.svg'), fav);
await sharp(Buffer.from(fav)).resize(180).png().toFile(path.join(ROOT, 'public', 'apple-touch-icon.png'));
await sharp(Buffer.from(fav)).resize(32).png().toFile(path.join(ROOT, 'public', 'favicon-32.png'));

// og-image 1200x630: grafit polje sa wordmarkom levo, fotografija desno
const hero = config.find((c) => c.id === 'hero');
const { buf: heroBuf } = await prepared(hero);
const photo = await sharp(heroBuf).resize(560, 630, { fit: 'cover', position: 'centre' }).toBuffer();
const mark = await sharp(Buffer.from(wordmarkSVG({ color: '#EFE7DA' }))).resize(470).png().toBuffer();
const label = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="630"><g font-family="Courier New, monospace" fill="#C98B63" font-size="22" letter-spacing="2"><text x="70" y="96">KAFETERIJA MLIN · EST. 2017</text><text x="70" y="548" fill="#EFE7DA">VOŽDOVAC · NOVI BEOGRAD · TERAZIJE</text></g><rect x="70" y="572" width="80" height="4" fill="#B5714E"/></svg>`
);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#1F1B17' } })
  .composite([
    { input: photo, left: 640, top: 0 },
    { input: label, left: 0, top: 0 },
    { input: mark, left: 70, top: 190 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(ROOT, 'public', 'og-image.jpg'));
console.log('✓ logo, favicon, og-image');
