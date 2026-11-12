const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const sourceDir = path.join(__dirname, '..', 'source');
const assetsDir = path.join(__dirname, '..');
const cssDir = path.join(assetsDir, 'css');
const fontDir = path.join(assetsDir, 'fonts');
const imgDir = path.join(assetsDir, 'images');

// Create directories
[cssDir, fontDir, imgDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Download file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`${response.statusCode}: ${url}`));
      }
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Extract URLs from HTML
function extractUrls(html) {
  const urls = {
    stylesheets: [],
    fonts: [],
    images: []
  };

  // Link rel=stylesheet
  const linkMatch = html.match(/<link[^>]+rel="stylesheet"[^>]+>/g) || [];
  linkMatch.forEach(link => {
    const href = link.match(/href="([^"]+)"/);
    if (href && href[1]) {
      const url = href[1];
      if (url.includes('fonts.googleapis') || url.includes('fonts.gstatic')) {
        urls.fonts.push(url);
      } else {
        urls.stylesheets.push(url);
      }
    }
  });

  // Style tags and background-images
  const styleMatch = html.match(/<style[^>]*>[^<]+<\/style>/g) || [];
  const styleContent = styleMatch.join('');
  const urlRegex = /url\(['"]?([^'")]+)['"]?\)/g;
  let match;
  while ((match = urlRegex.exec(styleContent)) !== null) {
    urls.images.push(match[1]);
  }

  // Img src and srcset
  const imgMatch = html.match(/<img[^>]+>/g) || [];
  imgMatch.forEach(img => {
    const src = img.match(/src="([^"]+)"/);
    const srcset = img.match(/srcset="([^"]+)"/);
    if (src && src[1]) urls.images.push(src[1]);
    if (srcset && srcset[1]) {
      srcset[1].split(',').forEach(s => {
        const url = s.trim().split(/\s+/)[0];
        if (url) urls.images.push(url);
      });
    }
  });

  // Picture source srcset
  const sourceMatch = html.match(/<source[^>]+>/g) || [];
  sourceMatch.forEach(source => {
    const srcset = source.match(/srcset="([^"]+)"/);
    if (srcset && srcset[1]) {
      srcset[1].split(',').forEach(s => {
        const url = s.trim().split(/\s+/)[0];
        if (url) urls.images.push(url);
      });
    }
  });

  // Background images in inline styles
  const styleAttrMatch = html.match(/style="([^"]+)"/g) || [];
  styleAttrMatch.forEach(attr => {
    const bgMatch = attr.match(/background(?:-image)?:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (bgMatch && bgMatch[1]) urls.images.push(bgMatch[1]);
  });

  return urls;
}

(async () => {
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.html'));
  let allUrls = { stylesheets: new Set(), fonts: new Set(), images: new Set() };

  // Extract URLs from all HTML files
  console.log('Extracting asset URLs...');
  for (const file of files) {
    const html = fs.readFileSync(path.join(sourceDir, file), 'utf8');
    const urls = extractUrls(html);
    urls.stylesheets.forEach(u => allUrls.stylesheets.add(u));
    urls.fonts.forEach(u => allUrls.fonts.add(u));
    urls.images.forEach(u => allUrls.images.add(u));
  }

  // Download stylesheets
  console.log(`\nDownloading ${allUrls.stylesheets.size} stylesheets...`);
  for (const url of allUrls.stylesheets) {
    try {
      const filename = url.split('/').pop().split('?')[0] || 'style.css';
      const filepath = path.join(cssDir, filename);
      await downloadFile(url, filepath);
      console.log(`✓ ${filename}`);
    } catch (e) {
      console.log(`✗ ${url}: ${e.message}`);
    }
  }

  // Download fonts
  console.log(`\nDownloading ${allUrls.fonts.size} font URLs...`);
  for (const url of allUrls.fonts) {
    try {
      const filename = url.split('/').pop().split('?')[0] || 'fonts.css';
      const filepath = path.join(fontDir, filename);
      await downloadFile(url, filepath);
      console.log(`✓ ${filename}`);
    } catch (e) {
      console.log(`✗ ${url}: ${e.message}`);
    }
  }

  // Download images
  console.log(`\nDownloading ${allUrls.images.size} images...`);
  let imgCount = 0;
  for (const url of allUrls.images) {
    if (url.startsWith('data:') || !url || url.includes('blob:')) continue;
    try {
      let filename = decodeURIComponent(url).split('/').pop().split('?')[0];
      if (!filename || filename.length < 3) continue;
      const filepath = path.join(imgDir, filename);

      // Skip if already downloaded
      if (fs.existsSync(filepath)) {
        console.log(`⊘ ${filename} (exists)`);
        continue;
      }

      await downloadFile(url, filepath);
      console.log(`✓ ${filename}`);
      imgCount++;
    } catch (e) {
      // Silently skip failed downloads
    }
  }

  console.log(`\n✓ Downloaded ${imgCount} images`);
  console.log('✓ Asset download complete!');
})();
