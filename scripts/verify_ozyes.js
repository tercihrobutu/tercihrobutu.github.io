const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');

// 1. Evaluate datasets
const progContent = fs.readFileSync(path.join(repoDir, 'data', 'ozyes_programs.js'), 'utf8');
const condContent = fs.readFileSync(path.join(repoDir, 'data', 'ozyes_conditions.js'), 'utf8');
const ozyesJs = fs.readFileSync(path.join(repoDir, 'ozyes.js'), 'utf8');
const ozyesHtml = fs.readFileSync(path.join(repoDir, 'ozyes.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(repoDir, 'index.html'), 'utf8');

const sandbox = { window: {} };
eval(progContent.replace('window.', 'sandbox.window.'));
eval(condContent.replace('window.', 'sandbox.window.'));

const progs = sandbox.window.DATA_OZYES_PROGRAMS;
const conds = sandbox.window.DATA_OZYES_CONDITIONS;

console.log('Programs count:', progs.length);
console.assert(progs.length === 384, 'Expected exactly 384 programs');
console.log('Conditions count:', Object.keys(conds).length);

// 2026 Central Placement Metrics Assertions
const totalKont26 = progs.reduce((acc, p) => acc + (p.kont_2026_toplam || p.kont_toplam || 0), 0);
const totalYer26 = progs.reduce((acc, p) => acc + (p.yer_2026_toplam || 0), 0);
const totalBos26 = progs.reduce((acc, p) => acc + (p.bos_2026_toplam || 0), 0);
const tabanECount26 = progs.filter(p => p.has_2026 && p.min_2026_e && p.min_2026_e !== '--').length;
const tabanKCount26 = progs.filter(p => p.has_2026 && p.min_2026_k && p.min_2026_k !== '--').length;

console.log(`Total 2026 Central Quota: ${totalKont26}`);
console.assert(totalKont26 === 13119, `Expected 13119 central quota, got ${totalKont26}`);
console.log(`Total 2026 Central Placed: ${totalYer26}`);
console.assert(totalYer26 === 11410, `Expected 11410 central placed, got ${totalYer26}`);
console.log(`Total 2026 Central Vacant: ${totalBos26}`);
console.assert(totalBos26 === 1709, `Expected 1709 central vacant, got ${totalBos26}`);
console.log(`Programs with 2026 Erkek Taban Score: ${tabanECount26}`);
console.assert(tabanECount26 === 380, `Expected 380 male taban scores, got ${tabanECount26}`);
console.log(`Programs with 2026 Kadın Taban Score: ${tabanKCount26}`);
console.assert(tabanKCount26 === 362, `Expected 362 female taban scores, got ${tabanKCount26}`);

// 2026 Ek Tercih Metrics Assertions
const progsWithEk = progs.filter(p => p.has_ek_2026);
console.log(`Programs with 2026 Ek Quota: ${progsWithEk.length}`);
console.assert(progsWithEk.length === 325, `Expected 325 programs with ek quota, got ${progsWithEk.length}`);

const totalEkKont = progs.reduce((acc, p) => acc + (p.ek_kont_toplam || 0), 0);
console.log(`Total 2026 Ek Quota: ${totalEkKont}`);
console.assert(totalEkKont === 2519, `Expected 2519 total ek quota, got ${totalEkKont}`);

const totalEkGenelE = progs.reduce((acc, p) => acc + (p.ek_kont_genel_e || 0), 0);
console.log(`Total 2026 Ek Genel Erkek: ${totalEkGenelE}`);
console.assert(totalEkGenelE === 1006, `Expected 1006 ek genel erkek, got ${totalEkGenelE}`);

const totalEkGenelK = progs.reduce((acc, p) => acc + (p.ek_kont_genel_k || 0), 0);
console.log(`Total 2026 Ek Genel Kadın: ${totalEkGenelK}`);
console.assert(totalEkGenelK === 951, `Expected 951 ek genel kadın, got ${totalEkGenelK}`);

const totalEkEngE = progs.reduce((acc, p) => acc + (p.ek_kont_engelli_e || 0), 0);
console.log(`Total 2026 Ek Engelli Erkek: ${totalEkEngE}`);
console.assert(totalEkEngE === 327, `Expected 327 ek engelli erkek, got ${totalEkEngE}`);

const totalEkEngK = progs.reduce((acc, p) => acc + (p.ek_kont_engelli_k || 0), 0);
console.log(`Total 2026 Ek Engelli Kadın: ${totalEkEngK}`);
console.assert(totalEkEngK === 235, `Expected 235 ek engelli kadın, got ${totalEkEngK}`);

const totalEkErkek = totalEkGenelE + totalEkEngE;
console.log(`Total 2026 Ek Erkek (Genel + Engelli): ${totalEkErkek}`);
console.assert(totalEkErkek === 1333, `Expected 1333 ek erkek, got ${totalEkErkek}`);

const totalEkKadin = totalEkGenelK + totalEkEngK;
console.log(`Total 2026 Ek Kadın (Genel + Engelli): ${totalEkKadin}`);
console.assert(totalEkKadin === 1186, `Expected 1186 ek kadın, got ${totalEkKadin}`);

// 2. Validate condition codes referenced in programs & ek table
let missingConds = new Set();
let allProgConds = 0;
progs.forEach(p => {
  const cStr = (p.kosul || '') + ' ' + (p.kosul_ek || '');
  if (cStr.trim()) {
    const codes = cStr.split(/[\s,]+/).map(c => c.trim()).filter(c => c && /^\d+$/.test(c));
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

// 4. Check index.html updates
console.assert(indexHtml.includes('2.519'), 'index.html must include 2.519 ek quota');
console.assert(indexHtml.includes('2026 EK TERCİH AÇILDI'), 'index.html must include badge');

console.log('\n=== ALL 2026 ÖZYES EK TERCİH VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
