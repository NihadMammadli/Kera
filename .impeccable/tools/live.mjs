import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1 });
const p = await ctx.newPage();
const bad = [];
p.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
p.on('pageerror', e => bad.push('JS ' + String(e).slice(0,120)));
await p.goto('https://nihadmammadli.github.io/Kera/', { waitUntil:'networkidle', timeout: 60000 });
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(3000);
await p.screenshot({ path: '.impeccable/review/live-hero.png' });
// walk the page so the lazy images below the fold actually request
await p.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 140));
  }
  window.scrollTo(0, 0);
});
await p.waitForTimeout(2500);
const info = await p.evaluate(() => ({
  title: document.title,
  sections: [...document.querySelectorAll('section[id]')].map(s=>s.id).join(','),
  imagesLoaded: [...document.images].filter(i=>i.naturalWidth>0).length + '/' + document.images.length,
  displayFont: getComputedStyle(document.querySelector('.hero__word')).fontFamily.split(',')[0],
  ground: getComputedStyle(document.body).backgroundColor,
}));
console.log(JSON.stringify(info, null, 1));
console.log('failed requests / errors:', bad.length ? bad : 'none');
await b.close();
