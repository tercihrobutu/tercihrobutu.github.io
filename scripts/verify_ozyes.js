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
console.log('Conditions count:', Object.keys(conds).length);

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

// 4. Sample verification of programs
console.log('Sample program 1 (Adıyaman):', JSON.stringify(progs[0], null, 2));
console.log('Sample program 2:', JSON.stringify(progs[10], null, 2));
console.log('Sample program 3:', JSON.stringify(progs[100], null, 2));
