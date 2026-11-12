const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const projectRoot = path.join(__dirname, '..');
const cssDir = path.join(projectRoot, 'css');
const fontsDir = path.join(projectRoot, 'fonts');
const imagesDir = path.join(projectRoot, 'images');

// Download file helper
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return resolve(); // Skip failed downloads
      }
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', () => { resolve(); });
    }).on('error', () => { resolve(); });
  });
}

// Extract all URLs from a file
function extractUrlsFromContent(content) {
  const urls = new Set();

  // @import url(...)
  const importMatches = content.match(/@import\s+(?:url\()?['"](https?:\/\/[^'"]+)['"]\)?/g) || [];
  importMatches.forEach(match => {
    const url = match.match(/https?:\/\/[^'"]+/)[0];
    urls.add(url);
  });

  // url(...) in CSS
  const urlMatches = content.match(/url\(['"]?(https?:\/\/[^'")]+)['"]?\)/g) || [];
  urlMatches.forEach(match => {
    const url = match.match(/https?:\/\/[^'")]+/)[0];
    urls.add(url);
  });

  return Array.from(urls);
}

(async () => {
  console.log('Extracting external URLs from all files...\n');

  let allUrls = new Set();

  // Scan all HTML and CSS files
  const files = [
    ...fs.readdirSync(projectRoot).filter(f => f.endsWith('.html')),
    ...fs.readdirSync(cssDir).filter(f => f.endsWith('.css'))
  ];

  for (const file of files) {
    const filePath = fs.existsSync(path.join(projectRoot, file))
      ? path.join(projectRoot, file)
      : path.join(cssDir, file);

    const content = fs.readFileSync(filePath, 'utf8');
    const urls = extractUrlsFromContent(content);
    urls.forEach(u => {
      if (u.includes('zyrosite') || u.includes('cdn.zyro') || u.includes('fonts.googleapis')) {
        allUrls.add(u);
      }
    });
  }

  console.log(`Found ${allUrls.size} external URLs\n`);

  // Download each URL
  let count = 0;
  for (const url of allUrls) {
    try {
      let filename = url.split('/').pop().split('?')[0];
      if (!filename) continue;

      let targetDir = imagesDir;
      if (url.includes('fonts')) targetDir = fontsDir;
      if (url.endsWith('.css') || filename.endsWith('.css')) targetDir = cssDir;

      const filepath = path.join(targetDir, filename);

      if (!fs.existsSync(filepath)) {
        await downloadFile(url, filepath);
        console.log(`✓ ${filename}`);
        count++;
      }
    } catch (e) {
      // Skip errors
    }
  }

  console.log(`\nDownloaded ${count} files`);

  // Now rewrite all URLs
  console.log('\nRewriting URLs in HTML and CSS files...\n');

  const allFiles = [
    ...fs.readdirSync(projectRoot).filter(f => f.endsWith('.html')),
    ...fs.readdirSync(cssDir).filter(f => f.endsWith('.css'))
  ];

  let rewriteCount = 0;

  for (const file of allFiles) {
    const filePath = fs.existsSync(path.join(projectRoot, file))
      ? path.join(projectRoot, file)
      : path.join(cssDir, file);

    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;

    // Rewrite Google Fonts CSS @imports
    content = content.replace(
      /url\('https:\/\/fonts\.googleapis\.com\/css[^']+'\)/g,
      "url('css/font-faces')"
    );
    content = content.replace(
      /url\("https:\/\/fonts\.googleapis\.com\/css[^"]+"\)/g,
      "url('css/font-faces')"
    );

    // Rewrite @import with zyrosite
    content = content.replace(
      /@import\s+(?:url\()?['"]https:\/\/[^'"]*\/([^'"\/]+)['"\)]/g,
      (match, filename) => {
        if (filename.endsWith('.css') || match.includes('fonts')) {
          return `@import url('${filename}')`;
        }
        return match;
      }
    );

    // Rewrite url() with zyrosite/hostinger/fonts
    content = content.replace(
      /url\(['"]?(https:\/\/[^'")]*(?:zyrosite|hostinger|fonts\.gstatic)[^'")]*)['"]\)/g,
      (match, url) => {
        const filename = url.split('/').pop().split('?')[0];
        let dir = 'images';
        if (url.includes('fonts') || filename.endsWith('.woff') || filename.endsWith('.woff2')) {
          dir = 'fonts';
        }
        if (filename.endsWith('.css')) {
          dir = 'css';
        }
        return `url('${dir}/${filename}')`;
      }
    );

    // Rewrite full URLs in CSS @font-face
    content = content.replace(
      /https:\/\/fonts\.gstatic\.com\/s\/[^\/]+\/v\d+\/([^'")]+)/g,
      'fonts/$1'
    );

    if (content !== originalLength) {
      fs.writeFileSync(filePath, content);
      rewriteCount++;
    }
  }

  console.log(`Rewrote ${rewriteCount} files\n✓ Cleanup complete!`);
})();
