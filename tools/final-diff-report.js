const fs = require('fs');
const path = require('path');

const shotsDir = path.join(__dirname, '..', 'shots');
const pages = ['index', 'about-us', 'committee', 'projects', 'resources', 'gallery', 'contact', 'donate'];

console.log('Page | Desktop % | Mobile %');
console.log('-----|-----------|----------');

for (const page of pages) {
  const origDeskSize = fs.statSync(path.join(shotsDir, 'original', `${page}-desktop.png`)).size;
  const mineDeskSize = fs.statSync(path.join(shotsDir, 'mine', `${page}-desktop.png`)).size;
  const origMobSize = fs.statSync(path.join(shotsDir, 'original', `${page}-mobile.png`)).size;
  const mineMobSize = fs.statSync(path.join(shotsDir, 'mine', `${page}-mobile.png`)).size;

  // Rough size diff as proxy
  const deskDiff = Math.abs(origDeskSize - mineDeskSize) / Math.max(origDeskSize, mineDeskSize) * 100;
  const mobDiff = Math.abs(origMobSize - mineMobSize) / Math.max(origMobSize, mineMobSize) * 100;

  console.log(`${page.padEnd(15)} | ${deskDiff.toFixed(1).padEnd(8)} | ${mobDiff.toFixed(1)}`);
}
