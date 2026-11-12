const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const sourceDir = path.join(__dirname, '..', 'source');
const outDir = path.join(__dirname, '..');

// URL mapping
const urlMap = new Map();

// Build URL map from downloaded images
const imgDir = path.join(outDir, 'images');
if (fs.existsSync(imgDir)) {
  fs.readdirSync(imgDir).forEach(file => {
    // Map any URL containing this filename to the local path
  });
}

function rewriteUrls(html) {
  // Rewrite image URLs
  let result = html;

  // Handle img src and srcset
  result = result.replace(/src="(https:\/\/[^"]+)"/g, (match, url) => {
    return `src="${rewriteAssetUrl(url)}"`;
  });

  result = result.replace(/srcset="([^"]*)"/g, (match, srcset) => {
    const rewritten = srcset.split(',').map(s => {
      const [url, rest] = s.trim().split(/\s+(.+)/);
      return `${rewriteAssetUrl(url)}${rest ? ' ' + rest : ''}`;
    }).join(', ');
    return `srcset="${rewritten}"`;
  });

  // Handle style background-image URLs
  result = result.replace(/url\(['"]?(https:\/\/[^'")]+)['"]?\)/g, (match, url) => {
    return `url('${rewriteAssetUrl(url)}')`;
  });

  // Handle href attributes (stylesheets, links)
  result = result.replace(/href="(https:\/\/cdn\.zyrosite\.com\/[^"]+\.css[^"]*)"/g, (match, url) => {
    return `href="css/${extractFilename(url)}"`;
  });

  // Handle data attributes with URLs
  result = result.replace(/data-[\w-]*="(https:\/\/[^"]+)"/g, (match, url) => {
    return `data-src="${rewriteAssetUrl(url)}"`;
  });

  return result;
}

function rewriteAssetUrl(url) {
  if (url.startsWith('data:')) return url;
  if (!url) return url;

  const filename = decodeURIComponent(url).split('/').pop().split('?')[0];
  if (!filename || filename.length < 3) return url;

  return `images/${filename}`;
}

function extractFilename(url) {
  return decodeURIComponent(url).split('/').pop().split('?')[0];
}

function removeScripts(html) {
  // Remove all <script> tags
  let result = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  result = result.replace(/\s*on\w+="[^"]*"/g, '');

  // Remove nonce and other security attributes
  result = result.replace(/\s+nonce="[^"]*"/g, '');

  return result;
}

function fixInternalLinks(html, pageName) {
  let result = html;

  // Fix links to other pages
  const linkMap = {
    '/': 'index.html',
    '/about-us': 'about-us.html',
    '/committee': 'committee.html',
    '/projects': 'projects.html',
    '/resources': 'resources.html',
    '/gallery': 'gallery.html',
    '/contact': 'contact.html',
    '/donate': 'donate.html'
  };

  for (const [pathname, filename] of Object.entries(linkMap)) {
    // Match href="/path" or href="https://gbdsociety.org/path"
    result = result.replace(
      new RegExp(`href="(?:https:\\/\\/gbdsociety\\.org)?${pathname}(?:\\?[^"]*)?(?:#[^"]*)?(?="|\\'|$)`, 'g'),
      `href="${pathname === '/' ? 'index.html' : filename}"`
    );
  }

  // Ensure current page links to itself
  const currentFile = pageName === 'index' ? 'index.html' : `${pageName}.html`;
  const currentPath = pageName === 'index' ? '/' : `/${pageName}`;

  // Remove hash from current page if it's an anchor link
  result = result.replace(
    new RegExp(`href="${currentFile}#`, 'g'),
    `href="#`
  );

  return result;
}

function addBaseHtml(html) {
  // Ensure DOCTYPE exists
  if (!html.trim().toLowerCase().startsWith('<!doctype')) {
    html = '<!DOCTYPE html>\n' + html;
  }

  // Ensure <html> tag has lang attribute
  html = html.replace(/<html[^>]*>/i, '<html lang="en">');

  return html;
}

function cleanStyles(html) {
  // Remove inline Zyro/Hostinger specific styles that won't work
  html = html.replace(/style="([^"]*zyro[^"]*)"/gi, '');

  return html;
}

(async () => {
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.html'));

  console.log('Processing HTML files...\n');

  for (const file of files) {
    const pageName = file.replace('.html', '');
    const htmlPath = path.join(sourceDir, file);
    let html = fs.readFileSync(htmlPath, 'utf8');

    console.log(`Processing ${file}...`);

    // Process in order
    html = removeScripts(html);
    html = rewriteUrls(html);
    html = fixInternalLinks(html, pageName);
    html = addBaseHtml(html);
    html = cleanStyles(html);

    // Write to output
    const outPath = path.join(outDir, file);
    fs.writeFileSync(outPath, html);
    console.log(`✓ ${file} (${html.length} bytes)`);
  }

  console.log('\n✓ All HTML files processed!');
})();
