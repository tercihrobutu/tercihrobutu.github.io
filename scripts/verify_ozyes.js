const fs = require('fs');

// 1. Evaluate datasets
const progContent = fs.readFileSync('data/ozyes_programs.js', 'utf8');
const condContent = fs.readFileSync('data/ozyes_conditions.js', 'utf8');
const ozyesJs = fs.readFileSync('ozyes.js', 'utf8');
const ozyesHtml = fs.readFileSync('ozyes.html', 'utf8');

const sandbox = { window: {} };
eval(progContent.replace('window.', 'sandbox.window.'));
eval(condContent.replace('window.', 'sandbox.window.'));

const progs = sandbox.window.DATA_OZYES_PROGRAMS;
const conds = sandbox.window.DATA_OZYES_CONDITIONS;

console.log('Programs count:', progs.length);
console.assert(progs.length === 384, 'Expected exactly 384 programs');
console.log('Conditions count:', Object.keys(conds).length);

// 2026 Placement Metrics Assertions
const totalKont26 = progs.reduce((acc, p) => acc + (p.kont_2026_toplam || p.kont_toplam || 0), 0);
const totalYer26 = progs.reduce((acc, p) => acc + (p.yer_2026_toplam || 0), 0);
const totalBos26 = progs.reduce((acc, p) => acc + (p.bos_2026_toplam || 0), 0);
const tabanECount26 = progs.filter(p => p.has_2026 && p.min_2026_e && p.min_2026_e !== '--').length;
const tabanKCount26 = progs.filter(p => p.has_2026 && p.min_2026_k && p.min_2026_k !== '--').length;

console.log(`Total 2026 Quota: ${totalKont26}`);
console.assert(totalKont26 === 13119, `Expected 13119 quota, got ${totalKont26}`);
console.log(`Total 2026 Placed: ${totalYer26}`);
console.assert(totalYer26 === 11410, `Expected 11410 placed, got ${totalYer26}`);
console.log(`Total 2026 Vacant: ${totalBos26}`);
console.assert(totalBos26 === 1709, `Expected 1709 vacant, got ${totalBos26}`);
console.log(`Programs with 2026 Erkek Taban Score: ${tabanECount26}`);
console.assert(tabanECount26 === 380, `Expected 380 male taban scores, got ${tabanECount26}`);
console.log(`Programs with 2026 Kadın Taban Score: ${tabanKCount26}`);
console.assert(tabanKCount26 === 362, `Expected 362 female taban scores, got ${tabanKCount26}`);

// 2. Validate condition codes referenced in programs
let missingConds = new Set();
let allProgConds = 0;
progs.forEach(p => {
  if (p.kosul) {
    const codes = p.kosul.split(/[\s,]+/).map(c => c.trim()).filter(c => c && /^\d+$/.test(c));
    codes.forEach(c => {
      allProgConds++;
      if (!conds[c]) missingConds.add(c);
    });
  }
});
console.log('Total condition references in programs:', allProgConds);
console.log('Missing condition codes in dictionary:', Array.from(missingConds));
console.assert(missingConds.size === 0, 'No missing condition codes allowed');

// 3. Check DOM IDs referenced in ozyes.js exist in ozyes.html
const idMatches = Array.from(ozyesJs.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)).map(m => m[1]);
const uniqueIds = Array.from(new Set(idMatches));
console.log('Checking DOM IDs referenced in ozyes.js (total ' + uniqueIds.length + '):');
let missingIds = [];
uniqueIds.forEach(id => {
  if (!ozyesHtml.includes('id="' + id + '"') && !ozyesHtml.includes("id='" + id + "'")) {
    missingIds.push(id);
  }
});
if (missingIds.length > 0) {
  console.error('MISSING IDs in ozyes.html:', missingIds);
  process.exit(1);
} else {
  console.log('ALL DOM IDs VERIFIED IN ozyes.html! SUCCESS!');
}

console.log('\n=== ALL 2026 ÖZYES VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
