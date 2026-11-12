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

const sourceDir = path.join(__dirname, '..', 'source');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  for (const page of pages) {
    console.log(`Capturing ${page.name}...`);
    const browser_page = await browser.newPage();

    // Set viewport to 1440px
    await browser_page.setViewport({ width: 1440, height: 900 });

    // Navigate and wait for network idle
    await browser_page.goto(page.url, { waitUntil: 'networkidle2' });

    // Scroll to bottom to load lazy images
    await browser_page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
      return new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    });

    // Get the fully rendered HTML
    const html = await browser_page.evaluate(() => {
      return document.documentElement.outerHTML;
    });

    // Save to file
    const filePath = path.join(sourceDir, `${page.name}.html`);
    fs.writeFileSync(filePath, html);
    console.log(`✓ ${page.name}.html (${html.length} bytes)`);

    await browser_page.close();
  }

  await browser.close();
  console.log('\n✓ All pages captured!');
})();
