const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');
console.log('Verifying DGS Ek Yerleştirme Implementation in:', repoDir);

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
console.log('\n--- Test Suite 1: data/dgs_programs.js Integrity ---');
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

const ekPrograms = programs.filter(p => p.has_ek_sonuc_2026 === true);
assert(ekPrograms.length === 3398, `Exactly 3,398 programs participated in Ek Yerleştirme (got ${ekPrograms.length})`);

const totKont = ekPrograms.reduce((sum, p) => sum + (p.ek_kont_2026 || 0), 0);
assert(totKont === 21389, `Total Ek Kontenjan is 21,389 (got ${totKont})`);

const totYer = ekPrograms.reduce((sum, p) => sum + (p.ek_yerlesen_2026 || 0), 0);
assert(totYer === 5175, `Total Ek Yerleşen is 5,175 (got ${totYer})`);

const totBos = ekPrograms.reduce((sum, p) => sum + (p.ek_bos_2026 || 0), 0);
assert(totBos === 16214, `Total Ek Boş is 16,214 (got ${totBos})`);

const withScore = ekPrograms.filter(p => p.ek_min_2026 && p.ek_min_2026 !== '--');
assert(withScore.length === 1402, `Programs with formed ek taban puan is 1,402 (got ${withScore.length})`);

const emptyScore = ekPrograms.filter(p => !p.ek_min_2026 || p.ek_min_2026 === '--');
assert(emptyScore.length === 1996, `Programs without formed ek taban puan (--) is 1,996 (got ${emptyScore.length})`);

// Internal math check: kont === yer + bos
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
console.log('\n--- Test Suite 3: dgs.html Markup & IDs ---');
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

assert(html.includes('2026 DGS Ek Yerleştirme Sonuçları & Taban Puanları'), 'dgs.html has updated title');
assert(html.includes('21,389'), 'dgs.html contains total ek kontenjan 21,389');
assert(html.includes('5,175'), 'dgs.html contains total yerleşen 5,175');
assert(html.includes('16,214'), 'dgs.html contains total boş 16,214');
assert(html.includes('1,402'), 'dgs.html contains formed taban count 1,402');

// 4. Verify index.html portal updates
console.log('\n--- Test Suite 4: index.html Portal Updates ---');
const indexHtmlPath = path.join(repoDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

assert(indexHtml.includes('2026 DGS Ek Yerleştirme Sonuçları Açıklandı!'), 'index.html banner updated');
assert(indexHtml.includes('2026 DGS Ek Yerleştirme Sonuçları'), 'index.html card updated');
assert(indexHtml.includes('2026 EK SONUÇ AÇIKLANDI'), 'index.html card badge updated');

console.log(`\n========================================`);
console.log(`VERIFICATION SUMMARY: ${passedTests} / ${totalTests} assertions passed.`);
if (passedTests === totalTests) {
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
} else {
  console.error('SOME CHECKS FAILED!');
  process.exit(1);
}
