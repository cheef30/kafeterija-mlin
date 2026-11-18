// Screenshotovi celih strana na 390 px i 1440 px.
// Upotreba: node scripts/screenshots.mjs <baseUrl> <izlazniFolder> [strane...]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const [base = 'http://localhost:4321/kafeterija-mlin', out = 'screenshots', ...rest] = process.argv.slice(2);
const pages = rest.length ? rest : ['/', '/meni/', '/shop/', '/404.html'];
const widths = [390, 1440];
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}).catch(() => chromium.launch({ channel: 'chrome' }));
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    // skrol kroz stranu da se učitaju lazy slike i pokrenu kredne ilustracije
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(1600);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const name = (p === '/' ? 'pocetna' : p.replace(/[/.]/g, '').replace('html', '')) + `-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`${name}  bočni overflow: ${overflow}px`);
  }
  if (errors.length) console.log('Greške u konzoli:', errors);
  await ctx.close();
}
await browser.close();
