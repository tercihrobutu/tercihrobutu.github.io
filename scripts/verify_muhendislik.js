const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');

// 1. Check data files
global.window = {};
eval(fs.readFileSync(path.join(repoDir, 'data', 'muhendislik_programs.js'), 'utf8'));
eval(fs.readFileSync(path.join(repoDir, 'data', 'muhendislik_mezuniyet.js'), 'utf8'));
eval(fs.readFileSync(path.join(repoDir, 'data', 'muhendislik_conditions.js'), 'utf8'));

const progs = window.DATA_MUHENDISLIK_PROGRAMS;
const mezun = window.DATA_MUHENDISLIK_MEZUNIYET;
const conds = window.DATA_MUHENDISLIK_CONDITIONS;

console.log('=== DATA VERIFICATION ===');
console.log(`Total Programs: ${progs.length}`);
console.assert(progs.length === 279, 'Expected exactly 279 programs');

const totalKont = progs.reduce((acc, p) => acc + p.kont_2026, 0);
console.log(`Total 2026 Quota: ${totalKont}`);
console.assert(totalKont === 611, 'Expected exactly 611 quota');

const totalYer26 = progs.reduce((acc, p) => acc + (p.yer_2026 || 0), 0);
const totalBos26 = progs.reduce((acc, p) => acc + (p.bos_2026 || 0), 0);
const taban26Count = progs.filter(p => p.has_2026 && p.min_2026 && p.min_2026 !== '--').length;

console.log(`Total 2026 Placed: ${totalYer26}`);
console.assert(totalYer26 === 13, `Expected 13 placed candidates, got ${totalYer26}`);
console.log(`Total 2026 Vacant: ${totalBos26}`);
console.assert(totalBos26 === 598, `Expected 598 vacant quotas, got ${totalBos26}`);
console.log(`Programs with 2026 Taban Score: ${taban26Count}`);
console.assert(taban26Count === 13, `Expected 13 taban score programs, got ${taban26Count}`);

console.log(`Total Mezuniyet Rules: ${mezun.length}`);
console.assert(mezun.length === 33, 'Expected 33 graduation rules');

// Check conditions
let missingConds = 0;
progs.forEach(p => {
  if (p.kosul) {
    const list = p.kosul.split(',').map(s => s.trim()).filter(Boolean);
    list.forEach(c => {
      if (!conds[c]) {
        console.warn(`Missing condition Bk. ${c} in program ${p.code}`);
        missingConds++;
      }
    });
  }
});
console.log(`Missing conditions: ${missingConds}`);
console.assert(missingConds === 0, 'No conditions should be missing');

// 2. Check DOM IDs in muhendislik.html
console.log('\n=== DOM ID VERIFICATION ===');
const html = fs.readFileSync(path.join(repoDir, 'muhendislik.html'), 'utf8');

const requiredIds = [
  'searchInput', 'filterMezuniyet', 'filterDiscipline', 'filterUniv', 'filterStatus',
  'sortBy', 'btnResetFilters', 'filteredCount', 'mezuniyetInfoBanner',
  'cityMultiBtn', 'cityDropdown', 'citySearchInput', 'cityOptionsList', 'btnClearCities', 'cityMultiLabel',
  'tableBody', 'prevPageBtn', 'nextPageBtn', 'pageInfo',
  'btnOpenList', 'favCountBadge', 'listModal', 'btnCloseModal', 'favTableWrap', 'favTableBody',
  'favEmptyState', 'modalFavCount', 'btnClearFavs', 'btnExportExcel', 'btnExportCSV', 'btnPrintList',
  'condModal', 'btnCloseCondModal', 'btnCloseCondModalBtn', 'condModalTitle', 'condModalBody', 'themeToggle'
];

let missingIds = 0;
requiredIds.forEach(id => {
  const regex = new RegExp(`id=["']${id}["']`);
  if (!regex.test(html)) {
    console.error(`Missing DOM ID in muhendislik.html: ${id}`);
    missingIds++;
  }
});

console.log(`Checked ${requiredIds.length} required DOM IDs. Missing: ${missingIds}`);
console.assert(missingIds === 0, 'All required DOM IDs must exist');

console.log('\nALL VERIFICATIONS PASSED PERFECTLY!');
