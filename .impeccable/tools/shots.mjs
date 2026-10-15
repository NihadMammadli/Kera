import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.URL || 'http://localhost:4123/';
const OUT = '.impeccable/review';
fs.mkdirSync(OUT, { recursive: true });

const SECTIONS = ['#top', '#about', '#cuisine', '#menu', '#spaces', '#visit'];

const browser = await chromium.launch({ channel: 'chrome' });

async function shoot(label, width, height, reduced) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: reduced ? 1 : 2,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const problems = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
  page.on('pageerror', (e) => problems.push(String(e)));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  if (reduced) {
    // walk the page so every lazy image decodes, then return to the top
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${label}.png`, fullPage: true });
  } else {
    for (const id of SECTIONS) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, id);
      await page.waitForTimeout(2400);
      await page.screenshot({ path: `${OUT}/${label}-${id.slice(1)}.png` });
    }
  }

  // measurements
  const audit = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflow = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > doc.clientWidth + 2 || r.left < -2)) {
        overflow.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} → ${Math.round(r.left)}..${Math.round(r.right)} of ${doc.clientWidth}`);
      }
    });
    return {
      scrollW: doc.scrollWidth,
      clientW: doc.clientWidth,
      horizontalScroll: doc.scrollWidth > doc.clientWidth + 1,
      overflow: [...new Set(overflow)].slice(0, 12),
    };
  });

  await ctx.close();
  return { label, problems: [...new Set(problems)].slice(0, 8), audit };
}

const results = [];
results.push(await shoot('desktop', 1440, 900, true));
results.push(await shoot('mobile', 390, 844, true));
results.push(await shoot('d', 1440, 900, false));
results.push(await shoot('m', 390, 844, false));

await browser.close();
console.log(JSON.stringify(results, null, 1));
