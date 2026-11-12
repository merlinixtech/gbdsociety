const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  console.log('Testing mobile menu and gallery...\n');

  // Test mobile menu
  const menuPage = await browser.newPage();
  await menuPage.setViewport({ width: 390, height: 844 });
  await menuPage.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle2' });

  const hasMenu = await menuPage.evaluate(() => {
    return document.querySelector('[aria-label="Toggle menu"]') !== null ||
           document.querySelector('button[aria-label*="menu"]') !== null;
  });
  console.log(`Mobile menu button exists: ${hasMenu ? 'Yes' : 'No'}`);

  await menuPage.close();

  // Test gallery
  const galleryPage = await browser.newPage();
  await galleryPage.setViewport({ width: 390, height: 844 });
  await galleryPage.goto('http://localhost:8000/gallery.html', { waitUntil: 'networkidle2' });

  const galleryImages = await galleryPage.evaluate(() => {
    return document.querySelectorAll('img').length;
  });
  console.log(`Gallery has ${galleryImages} images`);

  const hasLightbox = await galleryPage.evaluate(() => {
    return !!document.querySelector('.lightbox');
  });
  console.log(`Lightbox JS initialized: ${hasLightbox ? 'Yes' : 'No'}`);

  await galleryPage.close();
  await browser.close();

  console.log('\n✓ Feature tests complete');
})();
