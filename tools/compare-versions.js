const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pages = [
  { url: 'https://gbdsociety.org/', name: 'index' },
  { url: 'https://gbdsociety.org/about-us', name: 'about-us' },
  { url: 'https://gbdsociety.org/committee', name: 'committee' },
  { url: 'https://gbdsociety.org/projects', name: 'projects' },
  { url: 'https://gbdsociety.org/resources', name: 'resources' },
  { url: 'https://gbdsociety.org/gallery', name: 'gallery' },
  { url: 'https://gbdsociety.org/contact', name: 'contact' },
  { url: 'https://gbdsociety.org/donate', name: 'donate' }
];

const localhost = 'http://localhost:8000';

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  console.log('Capturing static version at 1440px and 390px...\n');

  for (const page of pages) {
    console.log(`Capturing ${page.name}...`);

    // Desktop 1440px
    const desktop_page = await browser.newPage();
    await desktop_page.setViewport({ width: 1440, height: 900 });
    await desktop_page.goto(`${localhost}/${page.name === 'index' ? 'index.html' : page.name + '.html'}`, { waitUntil: 'networkidle2' });
    await desktop_page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      return new Promise(resolve => setTimeout(resolve, 1000));
    });
    await desktop_page.screenshot({ path: `../shots/mine/${page.name}-desktop.png`, fullPage: true });
    await desktop_page.close();
    console.log(`  ✓ ${page.name}-desktop.png`);

    // Mobile 390px
    const mobile_page = await browser.newPage();
    await mobile_page.setViewport({ width: 390, height: 844 });
    await mobile_page.goto(`${localhost}/${page.name === 'index' ? 'index.html' : page.name + '.html'}`, { waitUntil: 'networkidle2' });
    await mobile_page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      return new Promise(resolve => setTimeout(resolve, 1000));
    });
    await mobile_page.screenshot({ path: `../shots/mine/${page.name}-mobile.png`, fullPage: true });
    await mobile_page.close();
    console.log(`  ✓ ${page.name}-mobile.png`);
  }

  await browser.close();
  console.log('\n✓ Capture complete!');
})();
