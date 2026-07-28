// ============================================================
// ÖSYM NİTELİK KODU AÇIKLAMALARI (2026 YKS Kılavuzu)
// ============================================================
const SPEC_COND_DICT = {
  '1':  'Bu programa kayıt yaptırmak için puan koşulu yeterlidir.',
  '2':  'Bu programa kayıt yaptırabilmek için Beden Eğitimi öğretmenliğinden mezun olmak ya da beden eğitimi yüksekokulundan mezun olmak gerekmektedir.',
  '3':  'Engelli adaylar da bu programa başvurabilir.',
  '4':  'Bu programın öğrencilerinin burs alma imkânı bulunmaktadır.',
  '5':  'Bu programa sadece KKTC uyruklu adaylar başvurabilir.',
  '6':  'Bu programa yabancı uyruklu adaylar başvuramaz.',
  '7':  'Bu programa Millî Eğitim Bakanlığı tarafından aday gösterilen öğrenciler başvurabilir.',
  '8':  'Bu programa yalnızca erkek adaylar başvurabilir.',
  '9':  'Bu programa yalnızca kadın adaylar başvurabilir.',
  '10': 'Adayın boy ve kilo koşullarını sağlaması gerekmektedir.',
  '11': 'Bu programa başvuran adayların sağlık koşullarını taşıması gerekmektedir.',
  '12': 'Bu programa başvuran adayların güvenlik soruşturmasından geçmesi gerekmektedir.',
  '13': 'Bu program açıköğretim (uzaktan öğretim) yöntemiyle yürütülmektedir.',
  '14': 'Bu program ikinci öğretim kapsamındadır.',
  '15': 'Bu program burslu kontenjanı kapsamında öğrenci kabul etmektedir.',
  '16': 'Bu programda yabancı dille öğretim yapılmaktadır.',
  '17': 'Adayın mesleki yeterlilik veya özel koşul taşıması gerekmektedir.',
  '18': 'Bu programa sadece yurt dışında yaşayan Türk vatandaşları başvurabilir.',
  '19': 'Bu programda staj/uygulama zorunluluğu bulunmaktadır.',
  '20': 'Bu programın eğitim dili kısmen yabancı dildir.',
  '21': 'Bu programa kabul için mülakat/yetenek sınavı uygulanmaktadır.',
  '22': 'Bu programa Ortaöğretim Başarı Puanı (OBP) uygulanmaktadır.',
  '23': 'Adayın alanındaki ağırlıklı puan (OBP) değeri hesaba katılmaktadır.',
  '24': 'Sınav puanına ek olarak lise mezuniyet notu veya diploma notunun hesaplamaya dahil edildiği programdır.',
  '25': 'Bu program devlet bursu/parasız yatılı imkânı sunmaktadır.',
  '26': 'Bu programa başvurmak için Atatürk İlkeleri ve İnkılâp Tarihi koşulu aranmaktadır.',
  '27': 'Bu programa engelli adaylar başvuramaz.',
  '28': 'Bu programa en az lisans mezunu olanlar başvurabilir.',
  '29': 'Bu programda çift anadal veya yan dal imkânı sunulmaktadır.',
  '30': 'Bu programa Güzel Sanatlar / Müzik alanında lise mezunları başvurabilir.',
  '31': 'Bu programa lise mezuniyet alanı koşulu aranmaktadır.',
  '32': 'Bu programda yüksek lisans eğitimi birlikte yürütülmektedir.',
  '33': 'Bu programda bölünmüş/tümleşik (entegre) doktora imkânı sunulmaktadır.',
  '34': 'Bu programa kabul için ön kayıt formu doldurulması zorunludur.',
  '35': 'Bu programa kontenjanın tamamı burslu öğrenciler için ayrılmıştır.',
  '36': 'Bu programa din eğitimi almış adaylar başvurabilir.',
  '100': 'Bu program ÖSYM Yükseköğretim Kurulunca tanınan özel statülü bir programdır.',
  '101': 'Bu programın kontenjanı YÖK tarafından belirlenmiştir.',
  '102': 'Bu programa LYS/YGS geçmişindeki adaylar başvurabilir.',
  '103': 'Bu programda özel burs imkânı bulunmaktadır.',
  '104': 'Bu programa yalnızca askeri personel/subay adayları başvurabilir.',
  '105': 'Bu programa emniyet teşkilatı mensupları ve adayları başvurabilir.',
  '106': 'Bu programa yalnızca diyanet bursiyerleri başvurabilir.',
  '107': 'Bu program sağlık alanında uzmanlaşmış eğitim vermektedir.',
  '108': 'Bu programa engelli öğrenciler için kontenjan ayrılmıştır.',
  '109': 'Bu programa spor alanında başarı belgesi olanlar da başvurabilir.',
  '110': 'Bu programa ulusal/uluslararası yarışmalarda derece sahibi adaylar başvurabilir.',
  '111': 'Bu program akredite bir kurum tarafından denetlenmektedir.',
  '112': 'Bu program bağlı olduğu üniversiteden farklı bir şehirde öğretim yapmaktadır.',
  '113': 'Bu programda dönem arasında yurt dışı staj imkânı bulunmaktadır.',
  '114': 'Bu programa polis akademisi mezunları başvurabilir.',
  '115': 'Bu programa milli sporcular için kontenjan ayrılmıştır.',
  '116': 'Bu programa YKS haricinde ek sınavla öğrenci kabul edilmektedir.',
  '117': 'Bu programda özel yetenek sınavı gerektiren alanlar mevcuttur.',
  '118': 'Bu programa sadece lisans/önlisans mezunları başvurabilir.',
  '119': 'Bu programa yurt içi burslu yabancı adaylar başvurabilir.',
  '120': 'Bu program ortaöğretim başarı puanı ile ek puan hesaplar.',
  '159': 'OBP ağırlığı program için özel oran uygulanmaktadır (159 numaralı özel koşul).',
  '160': 'OBP ağırlığı program için özel oran uygulanmaktadır (160 numaralı özel koşul).',
  '161': 'OBP ağırlığı program için özel oran uygulanmaktadır (161 numaralı özel koşul).',
  '162': 'OBP ağırlığı program için özel oran uygulanmaktadır (162 numaralı özel koşul).',
  '163': 'OBP ağırlığı program için özel oran uygulanmaktadır (163 numaralı özel koşul).',
  '164': 'OBP ağırlığı program için özel oran uygulanmaktadır (164 numaralı özel koşul).',
};

function getCondDescription(code) {
  const c = String(code).trim();
  return SPEC_COND_DICT[c] || `ÖSYM Özel Koşul Kodu ${c} — Detaylı açıklama için ÖSYM kılavuzunu inceleyiniz.`;
}

// ============================================================
// STATE MANAGEMENT
// ============================================================
let currentTab = 'lisans';
let dataStore = {
  lisans: window.DATA_LISANS || [],
  onlisans: window.DATA_ONLISANS || []
};

let favorites = JSON.parse(localStorage.getItem('yks_tercih_favs') || '[]');
let currentPage = 1;
const itemsPerPage = 50;

// Element References
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const filterCity = document.getElementById('filterCity');
const filterUnivType = document.getElementById('filterUnivType');
const filterPuanType = document.getElementById('filterPuanType');
const filterEgitimType = document.getElementById('filterEgitimType');
const filterMaxRank = document.getElementById('filterMaxRank');
const sortBySelect = document.getElementById('sortBy');
const filteredCountEl = document.getElementById('filteredCount');
const pageInfoEl = document.getElementById('pageInfo');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const favCountBadge = document.getElementById('favCountBadge');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateFavBadge();
  setupTheme();
  setupEventListeners();
  setupFAQAccordion();
  setupCondModal();
  checkURLParams();
  populateCityFilter();
  render();
});

// Check URL Params for Search (SEO SearchAction support)
function checkURLParams() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) searchInput.value = q;
}

// Switch Tab
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tabLisans').classList.toggle('active', tab === 'lisans');
  document.getElementById('tabOnlisans').classList.toggle('active', tab === 'onlisans');
  filterPuanType.value = '';
  currentPage = 1;
  populateCityFilter();
  render();
}

// Populate Cities Dropdown
function populateCityFilter() {
  const dataset = dataStore[currentTab] || [];
  const cities = new Set();
  dataset.forEach(item => { if (item.city) cities.add(item.city); });
  const sortedCities = Array.from(cities).sort((a, b) => a.localeCompare(b, 'tr'));
  filterCity.innerHTML = '<option value="">Tüm İller (81 İl + Yurtdışı)</option>';
  sortedCities.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    filterCity.appendChild(opt);
  });
}

// Event Listeners
function setupEventListeners() {
  [searchInput, filterCity, filterUnivType, filterPuanType, filterEgitimType, filterMaxRank, sortBySelect]
    .forEach(el => el.addEventListener('input', () => { currentPage = 1; render(); }));

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; render(); window.scrollTo({ top: 400, behavior: 'smooth' }); }
  });
  nextPageBtn.addEventListener('click', () => {
    currentPage++; render(); window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  document.getElementById('btnOpenList').addEventListener('click', openFavModal);
  document.getElementById('btnCloseModal').addEventListener('click', closeFavModal);
  document.getElementById('btnClearFavs').addEventListener('click', clearFavs);

  const btnXLSX = document.getElementById('btnExportXLSX');
  if (btnXLSX) btnXLSX.addEventListener('click', exportFavsXLSX);

  const btnPDF = document.getElementById('btnExportPDF');
  if (btnPDF) btnPDF.addEventListener('click', exportFavsPDF);
}

// FAQ Accordion
function setupFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => item.classList.toggle('active'));
  });
}

// ============================================================
// NİTELİK KODU MODAL (Condition Code Explanation)
// ============================================================
function setupCondModal() {
  const modal = document.getElementById('condModal');
  const closeBtn = document.getElementById('btnCloseCondModal');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}

function showCondModal(codesStr, progName) {
  const modal = document.getElementById('condModal');
  const titleEl = document.getElementById('condModalTitle');
  const bodyEl = document.getElementById('condModalBody');
  if (!modal || !bodyEl) return;

  const codes = codesStr.split(/[\s,]+/).map(c => c.trim()).filter(c => c && /\d/.test(c));

  titleEl.innerHTML = '📋 ÖSYM Özel Koşul Açıklaması';
  
  let html = `<div style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); border-radius:10px; padding:12px 16px; margin-bottom:18px; font-size:0.9rem; color:var(--text-secondary);">
    <strong style="color:var(--text-primary);">Program:</strong> ${progName}
  </div>`;

  if (codes.length === 0) {
    html += '<p style="color:var(--text-muted);">Bu programa ait özel koşul bilgisi bulunmamaktadır.</p>';
  } else {
    html += `<p style="color:var(--text-secondary); margin-bottom:16px; font-size:0.9rem;">Bu programda <strong style="color:var(--accent-primary);">${codes.length} adet</strong> ÖSYM nitelik koşulu uygulanmaktadır:</p>`;
    codes.forEach(code => {
      const desc = getCondDescription(code);
      html += `
        <div style="display:flex; gap:14px; align-items:flex-start; padding:14px; border:1px solid var(--border-color); border-radius:10px; margin-bottom:10px; background:rgba(15,23,42,0.4);">
          <div style="min-width:36px; height:36px; background:var(--accent-gradient); border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; color:white; font-size:0.9rem; flex-shrink:0;">${code}</div>
          <div style="color:var(--text-primary); font-size:0.95rem; line-height:1.6;">${desc}</div>
        </div>`;
    });
  }

  bodyEl.innerHTML = html;
  modal.classList.add('active');
}

// ============================================================
// CORE FILTER & RENDER ENGINE
// ============================================================
function getFilteredData() {
  const dataset = dataStore[currentTab] || [];
  const query = searchInput.value.toLowerCase().trim();
  const city = filterCity.value;
  const univType = filterUnivType.value;
  const puanType = filterPuanType.value;
  const egitimType = filterEgitimType.value;
  const maxRank = filterMaxRank.value ? parseInt(filterMaxRank.value, 10) : null;
  const sortBy = sortBySelect.value;

  let filtered = dataset.filter(item => {
    if (query) {
      const targetStr = (item.univ + ' ' + item.prog + ' ' + item.fac + ' ' + item.code).toLowerCase();
      if (!targetStr.includes(query)) return false;
    }
    if (city && item.city !== city) return false;
    if (univType && item.univ_type !== univType) return false;
    if (puanType && item.score_type !== puanType) return false;
    if (egitimType && item.tip !== egitimType) return false;
    if (maxRank !== null) {
      const r = parseInt(item.rank, 10);
      if (isNaN(r) || r > maxRank) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'rank_asc') return (parseInt(a.rank, 10) || 9999999) - (parseInt(b.rank, 10) || 9999999);
    if (sortBy === 'rank_desc') return (parseInt(b.rank, 10) || 0) - (parseInt(a.rank, 10) || 0);
    if (sortBy === 'score_desc') return (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0);
    if (sortBy === 'univ_asc') return a.univ.localeCompare(b.univ, 'tr');
    return 0;
  });

  return filtered;
}

function buildCondBadges(codesStr, progName) {
  if (!codesStr || !codesStr.trim()) return '<span style="color:var(--text-muted); font-size:0.8rem;">—</span>';
  const codes = codesStr.split(/[\s,]+/).map(c => c.trim()).filter(c => c && /^\d+$/.test(c));
  if (codes.length === 0) return '<span style="color:var(--text-muted); font-size:0.8rem;">—</span>';
  const safeProgName = progName.replace(/'/g, "\\'");
  const safeCodesStr = codesStr.replace(/'/g, "\\'");
  return codes.map(code =>
    `<span class="cond-badge" onclick="showCondModal('${safeCodesStr}', '${safeProgName}')" title="${getCondDescription(code).substring(0, 80)}...">${code}</span>`
  ).join('');
}

function render() {
  const filtered = getFilteredData();
  filteredCountEl.textContent = filtered.length.toLocaleString('tr-TR');

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  pageInfoEl.textContent = `Sayfa ${currentPage} / ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  tableBody.innerHTML = '';

  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:40px; color:var(--text-muted);">Aramanıza uygun üniversite programı bulunamadı.</td></tr>`;
    return;
  }

  pageItems.forEach(item => {
    const isFav = favorites.some(f => f.code === item.code);
    const tr = document.createElement('tr');

    const badgeUnivClass = item.univ_type.includes('Vakıf') ? 'badge-vakif' : (item.univ_type.includes('KKTC') ? 'badge-kktc' : 'badge-devlet');
    const badgeEgitimClass = item.tip === 'Uzaktan' ? 'badge-uzaktan' : (item.tip === 'AÖF' ? 'badge-aof' : 'badge-orgun');

    const rankDisplay = item.rank && item.rank !== '...' ? parseInt(item.rank, 10).toLocaleString('tr-TR') : (item.rank || '-');
    const scoreDisplay = item.score && item.score !== '----' ? parseFloat(item.score).toFixed(5) : '-';

    const condBadges = buildCondBadges(item.spec_cond, item.prog);

    tr.innerHTML = `
      <td>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav('${item.code}')" title="Tercih Listenize Ekleyin">
          ${isFav ? '★' : '☆'}
        </button>
      </td>
      <td class="code-cell">${item.code}</td>
      <td><strong>${item.city}</strong></td>
      <td>
        <div style="font-size:0.9rem;">${item.univ}</div>
        <span class="badge ${badgeUnivClass}" style="margin-top:4px;">${item.univ_type}</span>
      </td>
      <td style="color:var(--text-secondary); font-size:0.85rem;">${item.fac}</td>
      <td><strong>${item.prog}</strong></td>
      <td><span class="badge ${badgeEgitimClass}">${item.tip}</span></td>
      <td><span class="badge" style="background:rgba(255,255,255,0.08);">${item.score_type}</span></td>
      <td style="text-align:center;">${item.quota_genel}</td>
      <td style="white-space:nowrap;">${condBadges}</td>
      <td style="text-align:right; font-weight:700; color:var(--accent-primary);">${rankDisplay}</td>
      <td style="text-align:right; font-weight:600;">${scoreDisplay}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// ============================================================
// FAVORITES MANAGEMENT
// ============================================================
function toggleFav(code) {
  const dataset = [...dataStore.lisans, ...dataStore.onlisans];
  const item = dataset.find(x => x.code === code);
  if (!item) return;

  const index = favorites.findIndex(f => f.code === code);
  if (index >= 0) favorites.splice(index, 1);
  else favorites.push(item);

  localStorage.setItem('yks_tercih_favs', JSON.stringify(favorites));
  updateFavBadge();
  render();
  if (document.getElementById('listModal').classList.contains('active')) renderFavModal();
}

function updateFavBadge() {
  favCountBadge.textContent = favorites.length;
}

function openFavModal() {
  renderFavModal();
  document.getElementById('listModal').classList.add('active');
}

function closeFavModal() {
  document.getElementById('listModal').classList.remove('active');
}

function renderFavModal() {
  const favBody = document.getElementById('favTableBody');
  favBody.innerHTML = '';

  if (favorites.length === 0) {
    favBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">Henüz tercih listenize program eklemediniz. Yıldız butonuna basarak ekleyebilirsiniz.</td></tr>`;
    return;
  }

  favorites.forEach((item, idx) => {
    const rankDisplay = item.rank && item.rank !== '...' ? parseInt(item.rank, 10).toLocaleString('tr-TR') : (item.rank || '-');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--accent-primary);">${idx + 1}</td>
      <td class="code-cell">${item.code}</td>
      <td>${item.univ}</td>
      <td><strong>${item.prog}</strong></td>
      <td>${item.city}</td>
      <td>${rankDisplay}</td>
      <td><button class="btn" style="color:#f87171; padding:4px 8px;" onclick="toggleFav('${item.code}')">✕</button></td>
    `;
    favBody.appendChild(tr);
  });
}

function clearFavs() {
  if (confirm('Tercih listenizdeki tüm programlar silinecek. Emin misiniz?')) {
    favorites = [];
    localStorage.removeItem('yks_tercih_favs');
    updateFavBadge();
    renderFavModal();
    render();
  }
}

// ============================================================
// EXCEL (.xlsx) EXPORT — SheetJS
// ============================================================
function exportFavsXLSX() {
  if (favorites.length === 0) return alert('Listeniz boş!');

  try {
    const data = favorites.map((item, idx) => ({
      'Sıra': idx + 1,
      'ÖSYM Kodu': item.code,
      'İl': item.city,
      'Üniversite': item.univ,
      'Üniversite Türü': item.univ_type,
      'Fakülte / MYO': item.fac,
      'Eğitim Tipi': item.tip,
      'Program': item.prog,
      'Puan Türü': item.score_type,
      'Kontenjan (Genel)': item.quota_genel,
      'Özel Koşul Kodları': item.spec_cond,
      '2025 Sıralama': item.rank && item.rank !== '...' ? parseInt(item.rank, 10) : item.rank,
      '2025 Taban Puan': item.score
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Column widths
    worksheet['!cols'] = [
      { wch: 6 }, { wch: 12 }, { wch: 14 }, { wch: 40 }, { wch: 18 },
      { wch: 30 }, { wch: 16 }, { wch: 40 }, { wch: 12 }, { wch: 18 },
      { wch: 22 }, { wch: 14 }, { wch: 16 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'YKS Tercih Listem 2026');
    XLSX.writeFile(workbook, 'YKS_Tercih_Listem_2026.xlsx');
  } catch (err) {
    console.error('XLSX export error:', err);
    alert('Excel dosyası oluşturulurken bir hata oluştu.');
  }
}

// ============================================================
// PDF EXPORT — html2pdf.js (Türkçe Karakter Sorunsuz)
// ============================================================
function exportFavsPDF() {
  if (favorites.length === 0) return alert('Listeniz boş!');

  try {
    const element = document.createElement('div');
    element.style.cssText = 'padding:20px; font-family:Arial,sans-serif; background:#fff; color:#0f172a;';

    let rows = '';
    favorites.forEach((item, idx) => {
      const rankDisplay = item.rank && item.rank !== '...' ? parseInt(item.rank, 10).toLocaleString('tr-TR') : (item.rank || '-');
      const scoreDisplay = item.score && item.score !== '----' ? parseFloat(item.score).toFixed(3) : '-';
      const bg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
      rows += `
        <tr style="background:${bg}; border-bottom:1px solid #e2e8f0;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:#6366f1; width:32px;">${idx + 1}</td>
          <td style="padding:8px; font-family:monospace; font-size:10px; color:#4f46e5;">${item.code}</td>
          <td style="padding:8px; font-size:10px;">${item.city}</td>
          <td style="padding:8px; font-size:10px;">${item.univ}</td>
          <td style="padding:8px; font-size:10px; font-weight:bold;">${item.prog}</td>
          <td style="padding:8px; text-align:center; font-size:10px;">${item.score_type}</td>
          <td style="padding:8px; text-align:right; font-weight:bold; color:#6366f1; font-size:10px;">${rankDisplay}</td>
          <td style="padding:8px; text-align:right; font-size:10px;">${scoreDisplay}</td>
        </tr>`;
    });

    element.innerHTML = `
      <div style="border-bottom:3px solid #6366f1; padding-bottom:14px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:20px; font-weight:900; color:#1e1b4b;">2026 YKS TERCIH LISTEM</div>
          <div style="font-size:11px; color:#64748b; margin-top:4px;">tercihrobutu.github.io | ${new Date().toLocaleDateString('tr-TR')}</div>
        </div>
        <div style="background:#ede9fe; color:#4338ca; padding:8px 16px; border-radius:8px; font-weight:bold; font-size:13px;">
          Toplam: ${favorites.length} Program
        </div>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:10px;">
        <thead>
          <tr style="background:#4f46e5; color:white;">
            <th style="padding:10px; text-align:center; width:32px;">#</th>
            <th style="padding:10px;">OSYM Kodu</th>
            <th style="padding:10px;">Il</th>
            <th style="padding:10px;">Universite</th>
            <th style="padding:10px;">Program</th>
            <th style="padding:10px; text-align:center;">Puan</th>
            <th style="padding:10px; text-align:right;">Siralama</th>
            <th style="padding:10px; text-align:right;">Puan</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:24px; border-top:1px solid #cbd5e1; padding-top:10px; text-align:center; font-size:9px; color:#94a3b8;">
        Bu liste tercihrobutu.github.io uzerinden olusturulmustur. Veriler OSYM 2026 YKS kilavuzuna dayanmaktadir.
      </div>
    `;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: 'YKS_Tercih_Listem_2026.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF export error:', err);
    alert('PDF olusturulurken bir hata olustu.');
  }
}

// ============================================================
// THEME SWITCHER
// ============================================================
function setupTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
  });
}
