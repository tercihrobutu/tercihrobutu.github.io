const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');
console.log('Verifying DGS Comprehensive Implementation in:', repoDir);

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify data/dgs_programs.js
console.log('\n--- Test Suite 1: data/dgs_programs.js Comprehensive Stats ---');
const programsJsPath = path.join(repoDir, 'data', 'dgs_programs.js');
assert(fs.existsSync(programsJsPath), 'dgs_programs.js exists');

const programsContent = fs.readFileSync(programsJsPath, 'utf-8');
const prefix = 'window.DATA_DGS_PROGRAMS=';
const idx = programsContent.indexOf(prefix);
assert(idx !== -1, 'window.DATA_DGS_PROGRAMS prefix found');

const rawJson = programsContent.slice(idx + prefix.length).trim().replace(/;$/, '');
let programs = [];
try {
  programs = JSON.parse(rawJson);
  assert(true, 'dgs_programs.js parsed as valid JSON');
} catch (e) {
  assert(false, `JSON parse error: ${e.message}`);
}

assert(programs.length === 7060, `Total programs in database is 7,060 (got ${programs.length})`);

// Central / İlk Yerleştirme Stats
const totInitialKont = programs.reduce((sum, p) => sum + (p.kont || 0), 0);
assert(totInitialKont === 72693, `Tercih Kılavuzu Toplam Kontenjan is 72,693 (got ${totInitialKont})`);

const totInitialYer = programs.reduce((sum, p) => sum + (p.yerlesen || 0), 0);
assert(totInitialYer === 56820, `İlk Yerleşen Aday is 56,820 (got ${totInitialYer})`);

const withInitialScore = programs.filter(p => p.puan_2026 && p.puan_2026 !== '--');
assert(withInitialScore.length === 5842, `Merkezi Yerleştirmede Taban Puanı Oluşan Program Sayısı is 5,842 (got ${withInitialScore.length})`);

// Ek Yerleştirme Stats
const ekPrograms = programs.filter(p => p.has_ek_sonuc_2026 === true);
assert(ekPrograms.length === 3398, `Exactly 3,398 programs participated in Ek Yerleştirme (got ${ekPrograms.length})`);

const totEkKont = ekPrograms.reduce((sum, p) => sum + (p.ek_kont_2026 || 0), 0);
assert(totEkKont === 21389, `Total Ek Kontenjan is 21,389 (got ${totEkKont})`);

const totEkYer = ekPrograms.reduce((sum, p) => sum + (p.ek_yerlesen_2026 || 0), 0);
assert(totEkYer === 5175, `Total Ek Yerleşen is 5,175 (got ${totEkYer})`);

const totEkBos = ekPrograms.reduce((sum, p) => sum + (p.ek_bos_2026 || 0), 0);
assert(totEkBos === 16214, `Total Ek Boş (Kalan Boş) is 16,214 (got ${totEkBos})`);

const withEkScore = ekPrograms.filter(p => p.ek_min_2026 && p.ek_min_2026 !== '--');
assert(withEkScore.length === 1402, `Programs with formed ek taban puan is 1,402 (got ${withEkScore.length})`);

// Math consistency
let mathErrors = 0;
ekPrograms.forEach(p => {
  if (p.ek_kont_2026 !== p.ek_yerlesen_2026 + p.ek_bos_2026) {
    mathErrors++;
  }
});
assert(mathErrors === 0, `Ek Kontenjan = Ek Yerleşen + Ek Boş for all 3,398 programs (errors: ${mathErrors})`);

// 2. Verify data/dgs_trend.js
console.log('\n--- Test Suite 2: data/dgs_trend.js Integrity ---');
const trendJsPath = path.join(repoDir, 'data', 'dgs_trend.js');
assert(fs.existsSync(trendJsPath), 'dgs_trend.js exists');

const trendContent = fs.readFileSync(trendJsPath, 'utf-8');
const tPrefix = 'window.DATA_DGS_TREND=';
const tIdx = trendContent.indexOf(tPrefix);
assert(tIdx !== -1, 'window.DATA_DGS_TREND prefix found');

const rawTrendJson = trendContent.slice(tIdx + tPrefix.length).trim().replace(/;$/, '');
let trendDb = {};
try {
  trendDb = JSON.parse(rawTrendJson);
  assert(true, 'dgs_trend.js parsed as valid JSON');
} catch (e) {
  assert(false, `Trend JSON parse error: ${e.message}`);
}

const trendEkKeys = Object.keys(trendDb).filter(code => trendDb[code]?.ek_history?.['2026_ek']);
assert(trendEkKeys.length === 3398, `Exactly 3,398 programs have 2026_ek in trend DB (got ${trendEkKeys.length})`);

// 3. Verify dgs.html DOM Elements & SEO
console.log('\n--- Test Suite 3: dgs.html Markup, Metrics & IDs ---');
const htmlPath = path.join(repoDir, 'dgs.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

const requiredIds = [
  'searchInput',
  'filterMezuniyet',
  'btnClearMezuniyet',
  'filterUnivType',
  'filterPuanType',
  'filterEgitimType',
  'filterEk',
  'filterMinKont',
  'sortBy',
  'btnResetFilters',
  'filteredCount',
  'tableBody',
  'prevPageBtn',
  'nextPageBtn',
  'pageInfo',
  'listModal',
  'trendModal',
  'condModal'
];

requiredIds.forEach(id => {
  assert(html.includes(`id="${id}"`), `dgs.html contains id="${id}"`);
});

// Check metrics displayed in dgs.html
assert(html.includes('72,693'), 'dgs.html contains Tercih Kılavuzu Toplam Kontenjan 72,693');
assert(html.includes('56,820'), 'dgs.html contains İlk Yerleşen Aday 56,820');
assert(html.includes('21,389'), 'dgs.html contains Toplam Ek Kontenjan 21,389');
assert(html.includes('5,175'), 'dgs.html contains Ek Yerleşen Aday 5,175');
assert(html.includes('16,214'), 'dgs.html contains Kalan Boş Kontenjan 16,214');
assert(html.includes('[Kılavuz]'), 'dgs.html table header shows [Kılavuz] total quota');
assert(html.includes('İlk Yerl.'), 'dgs.html table header shows İlk Yerl.');
assert(html.includes('Ek Kont.'), 'dgs.html table header shows Ek Kont.');
assert(html.includes('Ek Yerl.'), 'dgs.html table header shows Ek Yerl.');
assert(html.includes('Kalan Boş'), 'dgs.html table header shows Kalan Boş');

// 4. Verify index.html Portal Updates
console.log('\n--- Test Suite 4: index.html Portal Updates ---');
const indexHtmlPath = path.join(repoDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

assert(indexHtml.includes('72.693'), 'index.html contains 72.693 Toplam Kontenjan');
assert(indexHtml.includes('56.820'), 'index.html contains 56.820 İlk Yerleşen');
assert(indexHtml.includes('21.389'), 'index.html contains 21.389 Toplam Ek Kontenjan');
assert(indexHtml.includes('16.214'), 'index.html contains 16.214 Kalan Boş Kontenjan');

console.log(`\n========================================`);
console.log(`VERIFICATION SUMMARY: ${passedTests} / ${totalTests} assertions passed.`);
if (passedTests === totalTests) {
  console.log('ALL COMPREHENSIVE CHECKS PASSED SUCCESSFULLY!');
} else {
  console.error('SOME CHECKS FAILED!');
  process.exit(1);
}
