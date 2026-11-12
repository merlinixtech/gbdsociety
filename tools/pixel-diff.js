const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const pages = [
  { url: 'https://gbdsociety.org/', name: 'index', local: 'http://localhost:8000/index.html' },
  { url: 'https://gbdsociety.org/about-us', name: 'about-us', local: 'http://localhost:8000/about-us.html' },
  { url: 'https://gbdsociety.org/committee', name: 'committee', local: 'http://localhost:8000/committee.html' },
  { url: 'https://gbdsociety.org/projects', name: 'projects', local: 'http://localhost:8000/projects.html' },
  { url: 'https://gbdsociety.org/resources', name: 'resources', local: 'http://localhost:8000/resources.html' },
  { url: 'https://gbdsociety.org/gallery', name: 'gallery', local: 'http://localhost:8000/gallery.html' },
  { url: 'https://gbdsociety.org/contact', name: 'contact', local: 'http://localhost:8000/contact.html' },
  { url: 'https://gbdsociety.org/donate', name: 'donate', local: 'http://localhost:8000/donate.html' }
];

const shotsDir = path.join(__dirname, '..', 'shots');
const diffDir = path.join(shotsDir, 'diff');

if (!fs.existsSync(diffDir)) fs.mkdirSync(diffDir, { recursive: true });

function compareImages(origPath, minePath) {
  if (!fs.existsSync(origPath) || !fs.existsSync(minePath)) {
    return null;
  }

  const img1 = PNG.sync.read(fs.readFileSync(origPath));
  const img2 = PNG.sync.read(fs.readFileSync(minePath));

  // Match dimensions (scale smaller one up)
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);

  const diff = new PNG({ width, height });
  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.1 });
  const totalPixels = width * height;
  const percentDiff = (numDiffPixels / totalPixels) * 100;

  return { percentDiff, numDiffPixels, totalPixels, diff };
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  console.log('Comparing original vs. static version...\n');

  for (const page of pages) {
    // Desktop 1440px
    console.log(`${page.name} - Desktop (1440px)`);
    const origDesktop = path.join(shotsDir, 'original', `${page.name}-desktop.png`);
    const mineDesktop = path.join(shotsDir, 'mine', `${page.name}-desktop.png`);

    // Capture static version if not exists
    if (!fs.existsSync(mineDesktop)) {
      const p = await browser.newPage();
      await p.setViewport({ width: 1440, height: 900 });
      await p.goto(page.local, { waitUntil: 'networkidle2' });
      await p.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
        return new Promise(r => setTimeout(r, 1000));
      });
      await p.screenshot({ path: mineDesktop, fullPage: true });
      await p.close();
    }

    const deskDiff = compareImages(origDesktop, mineDesktop);
    if (deskDiff) {
      console.log(`  Diff: ${deskDiff.percentDiff.toFixed(2)}%`);
      results.push({
        page: page.name,
        desktop: deskDiff.percentDiff.toFixed(2),
        mobile: '—'
      });

      // Save diff image if >0.5% difference
      if (deskDiff.percentDiff > 0.5) {
        const diffPath = path.join(diffDir, `${page.name}-desktop-diff.png`);
        fs.writeFileSync(diffPath, PNG.sync.write(deskDiff.diff));
      }
    }

    // Mobile 390px
    console.log(`${page.name} - Mobile (390px)`);
    const origMobile = path.join(shotsDir, 'original', `${page.name}-mobile.png`);
    const mineMobile = path.join(shotsDir, 'mine', `${page.name}-mobile.png`);

    if (!fs.existsSync(mineMobile)) {
      const p = await browser.newPage();
      await p.setViewport({ width: 390, height: 844 });
      await p.goto(page.local, { waitUntil: 'networkidle2' });
      await p.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
        return new Promise(r => setTimeout(r, 1000));
      });
      await p.screenshot({ path: mineMobile, fullPage: true });
      await p.close();
    }

    const mobDiff = compareImages(origMobile, mineMobile);
    if (mobDiff) {
      console.log(`  Diff: ${mobDiff.percentDiff.toFixed(2)}%\n`);
      results[results.length - 1].mobile = mobDiff.percentDiff.toFixed(2);

      if (mobDiff.percentDiff > 0.5) {
        const diffPath = path.join(diffDir, `${page.name}-mobile-diff.png`);
        fs.writeFileSync(diffPath, PNG.sync.write(mobDiff.diff));
      }
    }
  }

  await browser.close();

  // Print table
  console.log('\n=== PIXEL DIFF TABLE ===\n');
  console.log('Page | Desktop % | Mobile %');
  console.log('-----|-----------|----------');
  for (const r of results) {
    console.log(`${r.page.padEnd(15)} | ${r.desktop.padEnd(8)} | ${r.mobile}`);
  }

  console.log('\n✓ Pixel diff complete!');
})();
