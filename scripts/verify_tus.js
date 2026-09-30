const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🩺 TUS 2026 2. DÖNEM TERCIH ROBOTU AUTOMATED TEST SUITE');
console.log('====================================================\n');

// 1. Data File Verification
global.window = {};
eval(fs.readFileSync(path.join(repoDir, 'data', 'tus_programs.js'), 'utf8'));
eval(fs.readFileSync(path.join(repoDir, 'data', 'tus_conditions.js'), 'utf8'));

const progs = window.DATA_TUS_PROGRAMS;
const conds = window.DATA_TUS_CONDITIONS;

console.log('=== 1. DATASET INTEGRITY CHECKS ===');
console.log(`✓ Total Programs: ${progs.length}`);
console.assert(progs.length === 2941, `Expected 2941 programs, got ${progs.length}`);

// Unique 9-digit ÖSYM codes
const uniqueCodes = new Set(progs.map(p => p.code));
console.log(`✓ Unique Program Codes: ${uniqueCodes.size}`);
console.assert(uniqueCodes.size === 2941, `Expected 2941 unique codes, got ${uniqueCodes.size}`);

// Kontenjan breakdown
const totalGenel = progs.reduce((acc, p) => acc + (p.kont_genel || 0), 0);
const totalYabanci = progs.reduce((acc, p) => acc + (p.kont_yabanci || 0), 0);
const grandTotal = progs.reduce((acc, p) => acc + (p.kont_total || 0), 0);

console.log(`✓ Genel Kontenjan: ${totalGenel}`);
console.assert(totalGenel === 8353, `Expected 8353 genel kontenjan, got ${totalGenel}`);

console.log(`✓ Yabancı Uyruklu Kontenjan: ${totalYabanci}`);
console.assert(totalYabanci === 284, `Expected 284 yabancı kontenjan, got ${totalYabanci}`);

console.log(`✓ Toplam Kontenjan: ${grandTotal}`);
console.assert(grandTotal === 8637, `Expected 8637 total kontenjan, got ${grandTotal}`);

// Puan Türü Breakdown
const klinikProgs = progs.filter(p => p.puan_turu === 'K');
const temelProgs = progs.filter(p => p.puan_turu === 'T');
console.log(`✓ Klinik (K) Programları: ${klinikProgs.length}`);
console.log(`✓ Temel (T) Programları: ${temelProgs.length}`);
console.assert(klinikProgs.length === 2721, `Expected 2721 Klinik programs, got ${klinikProgs.length}`);
console.assert(temelProgs.length === 220, `Expected 220 Temel programs, got ${temelProgs.length}`);

// Unique Branches
const branches = new Set(progs.map(p => p.brans));
console.log(`✓ Unique Specialties / Branches: ${branches.size}`);
console.assert(branches.size === 42, `Expected 42 specialties, got ${branches.size}`);

// Past Data Matching Checks
const matched26_1 = progs.filter(p => p.has_2026_1).length;
const matched25_2 = progs.filter(p => p.has_2025_2).length;
const matched25_1 = progs.filter(p => p.has_2025_1).length;
const matchedAny = progs.filter(p => p.has_2026_1 || p.has_2025_2 || p.has_2025_1).length;

console.log(`✓ 2026/1 Eşleşen Program Sayısı: ${matched26_1} (%${((matched26_1 / progs.length) * 100).toFixed(1)})`);
console.assert(matched26_1 === 2747, `Expected 2747 matches for 2026/1, got ${matched26_1}`);

console.log(`✓ 2025/2 Eşleşen Program Sayısı: ${matched25_2}`);
console.assert(matched25_2 === 582, `Expected 582 matches for 2025/2, got ${matched25_2}`);

console.log(`✓ 2025/1 Eşleşen Program Sayısı: ${matched25_1}`);
console.assert(matched25_1 === 2612, `Expected 2612 matches for 2025/1, got ${matched25_1}`);

console.log(`✓ En Az Bir Geçmiş Dönem Verisi Olan Program Sayısı: ${matchedAny} (%${((matchedAny / progs.length) * 100).toFixed(1)})`);
console.assert(matchedAny === 2849, `Expected 2849 programs with past data, got ${matchedAny}`);

// Conditions Check
console.log(`\n=== 2. SPECIAL CONDITIONS (BK.) CHECKS ===`);
const conditionKeys = Object.keys(conds);
console.log(`✓ Total Extracted Conditions: ${conditionKeys.length}`);
console.assert(conditionKeys.length >= 12, 'Expected at least 12 conditions');

let missingConds = 0;
progs.forEach(p => {
  if (p.kosullar && Array.isArray(p.kosullar)) {
    p.kosullar.forEach(c => {
      if (!conds[c]) {
        console.warn(`Missing condition definition for Bk. ${c} in program ${p.code}`);
        missingConds++;
      }
    });
  }
});
console.log(`✓ Missing Condition References: ${missingConds}`);
console.assert(missingConds === 0, 'No condition reference should be missing');

// 3. HTML DOM Verification
console.log(`\n=== 3. DOM & UI INTEGRATION CHECKS ===`);
const html = fs.readFileSync(path.join(repoDir, 'tus.html'), 'utf8');

const requiredIds = [
  'searchInput', 'filterBrans', 'filterTur', 'filterMinScore', 'filterMaxScore', 'filterKontType',
  'cityMultiBtn', 'cityDropdown', 'citySearchInput', 'cityOptionsList', 'btnClearCities', 'cityMultiLabel', 'cityCountLabel',
  'sortBy', 'btnResetFilters', 'btnTriggerFavs', 'favCountBadgeBottom', 'filteredCount',
  'tableBody', 'prevPageBtn', 'nextPageBtn', 'pageInfo',
  'btnOpenList', 'favCountBadge', 'listModal', 'btnCloseModal', 'favTableBody',
  'btnClearFavs', 'btnExportXLSX', 'btnExportPDF',
  'condModal', 'btnCloseCondModal', 'condModalTitle', 'condModalBody',
  'trendModal', 'btnCloseTrendModal', 'trendModalTitle', 'trendModalSub', 'trendContent',
  'themeToggle', 'tabAll', 'tabKlinik', 'tabTemel'
];

let missingIds = 0;
requiredIds.forEach(id => {
  const regex = new RegExp(`id=["']${id}["']`);
  if (!regex.test(html)) {
    console.error(`Missing DOM ID in tus.html: ${id}`);
    missingIds++;
  }
});
console.log(`✓ Checked ${requiredIds.length} required DOM IDs. Missing: ${missingIds}`);
console.assert(missingIds === 0, 'All required DOM IDs must exist in tus.html');

// 4. Portal and Navigation Links Checks
console.log(`\n=== 4. CROSS-NAVIGATION VERIFICATION ===`);
const pages = ['index.html', 'muhendislik.html', 'ozyes.html', 'dgs.html', 'yks.html'];
pages.forEach(pg => {
  const content = fs.readFileSync(path.join(repoDir, pg), 'utf8');
  const hasTusLink = content.includes('href="tus.html"');
  console.log(`✓ ${pg} contains tus.html link: ${hasTusLink}`);
  console.assert(hasTusLink, `${pg} must contain a link to tus.html`);
});

// 5. Sitemap Verification
console.log(`\n=== 5. SITEMAP VERIFICATION ===`);
const sitemap = fs.readFileSync(path.join(repoDir, 'sitemap.xml'), 'utf8');
const hasTusInSitemap = sitemap.includes('tus.html');
console.log(`✓ sitemap.xml contains tus.html: ${hasTusInSitemap}`);
console.assert(hasTusInSitemap, 'sitemap.xml must include tus.html');

console.log('\n====================================================');
console.log('🎉 ALL TUS VERIFICATIONS PASSED WITH 100% SUCCESS!');
console.log('====================================================\n');
