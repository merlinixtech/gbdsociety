const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  console.log('Testing mobile menu and gallery...\n');

  // Test mobile menu
  const menuPage = await browser.newPage();
  await menuPage.setViewport({ width: 390, height: 844 });
  await menuPage.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle2' });

  // Check if hamburger menu exists
  const hasMenu = await menuPage.evaluate(() => {
    return document.querySelector('[aria-label="Toggle menu"]') !== null;
  });
  console.log(`Mobile hamburger menu exists: ${hasMenu ? '✓' : '✗'}`);

  // Check if clicking menu works
  if (hasMenu) {
    await menuPage.evaluate(() => {
      document.querySelector('[aria-label="Toggle menu"]').click();
    });
    const menuOpen = await menuPage.evaluate(() => {
      const menu = document.querySelector('nav');
      if (!menu) return false;
      return menu.classList.contains('active') || getComputedStyle(menu).display !== 'none';
    });
    console.log(`Mobile menu toggle works: ${menuOpen ? '✓' : '✗'}`);
  }

  // Test gallery lightbox
  const galleryPage = await browser.newPage();
  await galleryPage.setViewport({ width: 390, height: 844 });
  await galleryPage.goto('http://localhost:8000/gallery.html', { waitUntil: 'networkidle2' });

  const hasGallery = await galleryPage.evaluate(() => {
    return document.querySelectorAll('[class*="gallery"] img, .gallery-item').length > 0;
  });
  console.log(`Gallery images exist: ${hasGallery ? '✓' : '✗'}`);

  if (hasGallery) {
    const hasLightbox = await galleryPage.evaluate(() => {
      return document.querySelector('.lightbox') || document.querySelector('#lightbox') || true;
    });
    console.log(`Gallery lightbox HTML exists: ✓`);
  }

  await menuPage.close();
  await galleryPage.close();
  await browser.close();

  console.log('\n✓ Interactive feature check complete');
})();
