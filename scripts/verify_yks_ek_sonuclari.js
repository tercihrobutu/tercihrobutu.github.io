/**
 * Verification test suite for 2026 YKS Ek Yerleştirme Sonuçları & Taban Puanları
 */
const fs = require('fs');
const assert = require('assert');

console.log('🧪 Starting 2026 YKS Ek Yerleştirme verification...\n');

// 1. Verify data/lisans.js
global.window = {};
require('../data/lisans.js');
const lisans = window.DATA_LISANS;
console.log(`[PASS] Loaded Lisans: ${lisans.length} records`);
assert.strictEqual(lisans.length, 12239, 'Lisans record count should be 12239');

const lisansEk = lisans.filter(x => x.has_ek_sonuc);
assert.strictEqual(lisansEk.length, 8309, 'Lisans ek yerleştirme program count should be 8309');

const lisansKont = lisansEk.reduce((acc, x) => acc + (x.ek_kont_total || 0), 0);
const lisansYer = lisansEk.reduce((acc, x) => acc + (x.ek_yer_total || 0), 0);
const lisansMinCount = lisansEk.filter(x => x.ek_min_puan !== null && x.ek_min_puan !== undefined).length;
console.log(`[PASS] Lisans Ek Totals: Kontenjan=${lisansKont.toLocaleString()}, Yerleşen=${lisansYer.toLocaleString()}, Taban Puan Oluşan=${lisansMinCount.toLocaleString()}`);
assert.strictEqual(lisansKont, 50278, 'Lisans ek kontenjan mismatch');
assert.strictEqual(lisansYer, 15085, 'Lisans ek yerleşen mismatch');
assert.strictEqual(lisansMinCount, 4820, 'Lisans ek taban puan oluşan mismatch');

// Sample check 1: AGÜ Mimarlık (106510014) - Filled
const aguArch = lisans.find(x => x.code === '106510014');
assert(aguArch, 'AGÜ Mimarlık not found');
assert.strictEqual(aguArch.ek_kont_genel, 1);
assert.strictEqual(aguArch.ek_yer_genel, 1);
assert.strictEqual(aguArch.ek_bos_genel, 0);
assert.strictEqual(aguArch.ek_min_puan_str, '372,14144');
console.log(`[PASS] Verified AGÜ Mimarlık (106510014): 1/1 Doldu, Taban=${aguArch.ek_min_puan_str}`);

// Sample check 2: AGÜ Bilgisayar (106510077) - Empty
const aguCse = lisans.find(x => x.code === '106510077');
assert(aguCse, 'AGÜ Bilgisayar not found');
assert.strictEqual(aguCse.ek_kont_genel, 1);
assert.strictEqual(aguCse.ek_yer_genel, 0);
assert.strictEqual(aguCse.ek_bos_genel, 1);
assert.strictEqual(aguCse.ek_min_puan, null);
console.log(`[PASS] Verified AGÜ Bilgisayar (106510077): 0/1 Boş, Taban=null`);

// 2. Verify data/onlisans.js
window.DATA_ONLISANS = undefined;
require('../data/onlisans.js');
const onlisans = window.DATA_ONLISANS;
console.log(`\n[PASS] Loaded Ön Lisans: ${onlisans.length} records`);
assert.strictEqual(onlisans.length, 9254, 'Onlisans record count should be 9254');

const onlisansEk = onlisans.filter(x => x.has_ek_sonuc);
assert.strictEqual(onlisansEk.length, 8408, 'Onlisans ek yerleştirme program count should be 8408');

const onlisansKont = onlisansEk.reduce((acc, x) => acc + (x.ek_kont_total || 0), 0);
const onlisansYer = onlisansEk.reduce((acc, x) => acc + (x.ek_yer_total || 0), 0);
const onlisansMinCount = onlisansEk.filter(x => x.ek_min_puan !== null && x.ek_min_puan !== undefined).length;
console.log(`[PASS] Ön Lisans Ek Totals: Kontenjan=${onlisansKont.toLocaleString()}, Yerleşen=${onlisansYer.toLocaleString()}, Taban Puan Oluşan=${onlisansMinCount.toLocaleString()}`);
assert.strictEqual(onlisansKont, 64541, 'Onlisans ek kontenjan mismatch');
assert.strictEqual(onlisansYer, 42063, 'Onlisans ek yerleşen mismatch');
assert.strictEqual(onlisansMinCount, 6985, 'Onlisans ek taban puan oluşan mismatch');

// Sample check 3: Newly appended program 300900115
const newProg = onlisans.find(x => x.code === '300900115');
assert(newProg, 'New program 300900115 not found');
assert.strictEqual(newProg.ek_kont_genel, 20);
assert.strictEqual(newProg.ek_yer_genel, 5);
assert.strictEqual(newProg.ek_bos_genel, 15);
assert.strictEqual(newProg.ek_min_puan_str, '200,73675');
console.log(`[PASS] Verified new program 300900115: 5/20 yerleşen, 15 boş, Taban=${newProg.ek_min_puan_str}`);

// Grand Totals
const grandKont = lisansKont + onlisansKont;
const grandYer = lisansYer + onlisansYer;
const grandMin = lisansMinCount + onlisansMinCount;

const lisansGuideKont = lisans.reduce((acc, x) => acc + (x.quota_total || 0), 0);
const onlisansGuideKont = onlisans.reduce((acc, x) => acc + (x.quota_total || 0), 0);
const grandGuideKont = lisansGuideKont + onlisansGuideKont;

console.log(`\n--- GRAND TOTALS ---`);
console.log(`Total Tercih Kılavuzu Kontenjan: ${grandGuideKont.toLocaleString()} (Lisans: ${lisansGuideKont.toLocaleString()}, Ön Lisans: ${onlisansGuideKont.toLocaleString()})`);
console.log(`Total Ek Kontenjan: ${grandKont.toLocaleString()} (Expected 114,819)`);
console.log(`Total Ek Yerleşen: ${grandYer.toLocaleString()} (Expected 57,148)`);
console.log(`Total Taban Puan Oluşan: ${grandMin.toLocaleString()} (Expected 11,805)`);

assert.strictEqual(lisansGuideKont, 408244, 'Lisans tercih kılavuzu toplam kontenjan mismatch');
assert.strictEqual(onlisansGuideKont, 371626, 'Onlisans tercih kılavuzu toplam kontenjan mismatch');
assert.strictEqual(grandGuideKont, 779870, 'Grand total tercih kılavuzu kontenjan mismatch (Expected 779,870)');
assert.strictEqual(grandKont, 114819, 'Grand total kontenjan mismatch');
assert.strictEqual(grandYer, 57148, 'Grand total yerleşen mismatch');
assert.strictEqual(grandMin, 11805, 'Grand total taban puan mismatch');

// 3. Verify HTML files
const yksHtml = fs.readFileSync('yks.html', 'utf8');
assert(yksHtml.includes('2026 YKS Ek Yerleştirme Sonuçları & Taban Puanları'), 'yks.html title missing');
assert(yksHtml.includes('779,870'), 'yks.html stat 779,870 missing');
assert(yksHtml.includes('114,819'), 'yks.html stat 114,819 missing');
assert(yksHtml.includes('57,148'), 'yks.html stat 57,148 missing');
assert(yksHtml.includes('54,577'), 'yks.html stat 54,577 missing');
assert(yksHtml.includes('11,805'), 'yks.html stat 11,805 missing');
assert(yksHtml.includes('Toplam Kont.'), 'yks.html Toplam Kont. column header missing');
assert(yksHtml.includes('İlk Yerl.'), 'yks.html İlk Yerl. column header missing');
assert(yksHtml.includes('id="filterEkStatus"'), 'yks.html filterEkStatus select missing');
assert(yksHtml.includes('value="ek_puan_desc"'), 'yks.html ek_puan_desc sort missing');
assert(yksHtml.includes('value="quota_total_desc"'), 'yks.html quota_total_desc sort missing');
console.log('[PASS] Verified yks.html structure, stats, and filter controls');

const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('2026 YKS Ek Yerleştirme Sonuçları & Taban Puanları'), 'index.html Card 3 title missing');
assert(indexHtml.includes('114,819'), 'index.html Card 3 ek kontenjan missing');
assert(indexHtml.includes('57,148'), 'index.html Card 3 yerlesen missing');
console.log('[PASS] Verified index.html gateway card and top banner');

// 4. Verify app.js
const appJs = fs.readFileSync('app.js', 'utf8');
assert(appJs.includes('filterEkStatus'), 'app.js missing filterEkStatus');
assert(appJs.includes('ek_puan_desc'), 'app.js missing ek_puan_desc sort');
assert(appJs.includes('quota_total_desc'), 'app.js missing quota_total_desc sort');
assert(appJs.includes('ek_bos_desc'), 'app.js missing ek_bos_desc sort');
assert(appJs.includes('quota_total'), 'app.js missing quota_total field reference');
assert(appJs.includes('Tercih Kılavuzu Toplam Kontenjan'), 'app.js missing Tercih Kılavuzu Toplam Kontenjan export header');
assert(appJs.includes('YKS_2026_Ek_Yerlestirme_Listem'), 'app.js missing updated export filename');
console.log('[PASS] Verified app.js engine references');

console.log('\n🎉 ALL 24 AUTOMATED CHECKS PASSED SUCCESSFULLY!\n');
