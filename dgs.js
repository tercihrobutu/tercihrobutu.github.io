// ============================================================
// 2026 DGS (Dikey Geçiş Sınavı) Tercih Robotu Engine
// ============================================================

// 1. Turkish Character Normalization
function turkishNormalize(text) {
  if (!text) return '';
  return String(text)
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// 2. Data State
const programsData = window.DATA_DGS_PROGRAMS || [];
const mappingData = window.DATA_DGS_MAPPING || {};
const mezuniyetList = window.DATA_DGS_MEZUNIYET_ALANLARI || [];
const conditionsData = window.DATA_DGS_CONDITIONS || {};

// Trend data lazy loader
let trendLoadingPromise = null;
function loadTrendData() {
  if (window.DATA_DGS_TREND) return Promise.resolve(window.DATA_DGS_TREND);
  if (!trendLoadingPromise) {
    trendLoadingPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'data/dgs_trend.js';
      script.onload = () => resolve(window.DATA_DGS_TREND || {});
      script.onerror = () => resolve({});
      document.head.appendChild(script);
    });
  }
  return trendLoadingPromise;
}

// Background preload after initial render
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(loadTrendData, 1000);
  });
}

let selectedCities = [];
let currentPage = 1;
const itemsPerPage = 50;
let favorites = JSON.parse(localStorage.getItem('dgs_tercih_favs') || '[]');

// Trend Modal State
let trendChartInstance = null;
let activeTrendCode = null;
let activeTrendMetric = 'score';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const filterMezuniyet = document.getElementById('filterMezuniyet');
const btnClearMezuniyet = document.getElementById('btnClearMezuniyet');
const mezuniyetBadge = document.getElementById('mezuniyetBadge');
const mezuniyetInfoText = document.getElementById('mezuniyetInfoText');
const filterUnivType = document.getElementById('filterUnivType');
const filterPuanType = document.getElementById('filterPuanType');
const filterEgitimType = document.getElementById('filterEgitimType');
const filterMinKont = document.getElementById('filterMinKont');
const sortBySelect = document.getElementById('sortBy');
const btnResetFilters = document.getElementById('btnResetFilters');
const filteredCountEl = document.getElementById('filteredCount');

const cityMultiBtn = document.getElementById('cityMultiBtn');
const cityDropdown = document.getElementById('cityDropdown');
const citySearchInput = document.getElementById('citySearchInput');
const cityOptionsList = document.getElementById('cityOptionsList');
const btnClearCities = document.getElementById('btnClearCities');
const cityMultiLabel = document.getElementById('cityMultiLabel');

const tableBody = document.getElementById('tableBody');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfoEl = document.getElementById('pageInfo');

const btnOpenList = document.getElementById('btnOpenList');
const favCountBadge = document.getElementById('favCountBadge');
const listModal = document.getElementById('listModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const favTableWrap = document.getElementById('favTableWrap');
const favTableBody = document.getElementById('favTableBody');
const favEmptyState = document.getElementById('favEmptyState');
const modalFavCount = document.getElementById('modalFavCount');
const btnClearFavs = document.getElementById('btnClearFavs');
const btnExportPDF = document.getElementById('btnExportPDF');
const btnExportXLSX = document.getElementById('btnExportXLSX');

const condModal = document.getElementById('condModal');
const btnCloseCondModal = document.getElementById('btnCloseCondModal');
const condModalTitle = document.getElementById('condModalTitle');
const condModalBody = document.getElementById('condModalBody');

const trendModal = document.getElementById('trendModal');
const btnCloseTrendModal = document.getElementById('btnCloseTrendModal');
const themeToggle = document.getElementById('themeToggle');

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  populateMezuniyetOptions();
  populateCityFilter();
  updateFavBadge();
  setupEventListeners();
  setupMultiSelectEvents();
  setupTrendModal();
  checkURLParams();
  render();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
      if (activeTrendCode) renderTrendChart(activeTrendCode);
    });
  }
}

function updateThemeIcon(theme) {
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

// Populate Ön Lisans Mezuniyet Dropdown
function populateMezuniyetOptions() {
  if (!filterMezuniyet) return;
  filterMezuniyet.innerHTML = '<option value="">🎯 Tüm Ön Lisans Mezuniyet Alanları (Filtresiz Bütün Lisans Programları)</option>';
  
  mezuniyetList.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.name;
    const count = item.count || (mappingData[item.name]?.lisans_kodlari?.length) || 0;
    opt.textContent = count > 0 ? `${item.name} (${count} Lisans Alanı)` : item.name;
    filterMezuniyet.appendChild(opt);
  });
}

// Populate Cities Dropdown
function populateCityFilter() {
  const cities = new Set();
  programsData.forEach(p => {
    if (p.city && p.city.length > 1) cities.add(p.city);
  });
  
  const sortedCities = Array.from(cities).sort((a, b) => a.localeCompare(b, 'tr'));
  
  if (!cityOptionsList) return;
  cityOptionsList.innerHTML = '';
  sortedCities.forEach(city => {
    const isChecked = selectedCities.includes(city);
    const label = document.createElement('label');
    label.className = 'multi-select-option';
    const safeCity = city.replace(/'/g, "\\'");
    label.innerHTML = `
      <input type="checkbox" value="${city}" ${isChecked ? 'checked' : ''} onchange="toggleCitySelect('${safeCity}')">
      <span>${city}</span>
    `;
    cityOptionsList.appendChild(label);
  });

  updateCityMultiLabel();
}

function toggleCitySelect(city) {
  if (selectedCities.includes(city)) {
    selectedCities = selectedCities.filter(c => c !== city);
  } else {
    selectedCities.push(city);
  }
  updateCityMultiLabel();
  currentPage = 1;
  updateURLParams();
  render();
}

function updateCityMultiLabel() {
  if (!cityMultiLabel) return;
  if (selectedCities.length === 0) {
    cityMultiLabel.textContent = 'Tüm İller (81 İl + KKTC)';
  } else if (selectedCities.length === 1) {
    cityMultiLabel.textContent = selectedCities[0];
  } else {
    cityMultiLabel.textContent = `${selectedCities.length} İl Seçili`;
  }
}

function setupMultiSelectEvents() {
  if (!cityMultiBtn || !cityDropdown) return;

  cityMultiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cityDropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!cityMultiBtn.contains(e.target) && !cityDropdown.contains(e.target)) {
      cityDropdown.classList.remove('active');
    }
  });

  if (citySearchInput) {
    citySearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.multi-select-option').forEach(opt => {
        const txt = opt.textContent.toLowerCase();
        opt.style.display = txt.includes(q) ? 'flex' : 'none';
      });
    });
  }

  if (btnClearCities) {
    btnClearCities.addEventListener('click', () => {
      selectedCities = [];
      populateCityFilter();
      currentPage = 1;
      updateURLParams();
      render();
    });
  }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function setupEventListeners() {
  [searchInput, filterUnivType, filterPuanType, filterEgitimType, filterMinKont, sortBySelect]
    .filter(Boolean)
    .forEach(el => el.addEventListener('input', () => { currentPage = 1; updateURLParams(); render(); }));

  filterMezuniyet.addEventListener('change', () => {
    const val = filterMezuniyet.value;
    btnClearMezuniyet.style.display = val ? 'inline-block' : 'none';
    mezuniyetBadge.style.display = val ? 'inline-block' : 'none';
    
    if (val && mappingData[val]) {
      const allowedNames = mappingData[val].lisans_programlari || [];
      mezuniyetInfoText.style.display = 'block';
      mezuniyetInfoText.innerHTML = `<strong>Geçiş Yapılabilen Lisans Alanları (${allowedNames.length}):</strong> ${allowedNames.slice(0, 8).join(', ')}${allowedNames.length > 8 ? ' ... ve dahası' : ''}`;
    } else {
      mezuniyetInfoText.style.display = 'none';
    }

    currentPage = 1;
    updateURLParams();
    render();
  });

  btnClearMezuniyet.addEventListener('click', () => {
    filterMezuniyet.value = '';
    btnClearMezuniyet.style.display = 'none';
    mezuniyetBadge.style.display = 'none';
    mezuniyetInfoText.style.display = 'none';
    currentPage = 1;
    updateURLParams();
    render();
  });

  btnResetFilters.addEventListener('click', () => {
    searchInput.value = '';
    filterMezuniyet.value = '';
    btnClearMezuniyet.style.display = 'none';
    mezuniyetBadge.style.display = 'none';
    mezuniyetInfoText.style.display = 'none';
    filterUnivType.value = '';
    filterPuanType.value = '';
    filterEgitimType.value = '';
    filterMinKont.value = '';
    sortBySelect.value = 'kont_desc';
    selectedCities = [];
    populateCityFilter();
    currentPage = 1;
    updateURLParams();
    render();
  });

  // Pagination Events
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      render();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  });

  nextPageBtn.addEventListener('click', () => {
    currentPage++;
    render();
    window.scrollTo({ top: 350, behavior: 'smooth' });
  });

  // Fav Modal Events
  btnOpenList.addEventListener('click', openFavModal);
  btnCloseModal.addEventListener('click', () => listModal.classList.remove('active'));
  listModal.addEventListener('click', (e) => { if (e.target === listModal) listModal.classList.remove('active'); });

  btnClearFavs.addEventListener('click', () => {
    if (confirm('DGS Tercih listenizdeki tüm programları silmek istediğinize emin misiniz?')) {
      favorites = [];
      saveFavs();
      renderFavModal();
      render();
    }
  });

  if (btnExportPDF) btnExportPDF.addEventListener('click', exportFavsPDF);
  if (btnExportXLSX) btnExportXLSX.addEventListener('click', exportFavsExcel);

  // Conditions Modal Events
  btnCloseCondModal.addEventListener('click', () => condModal.classList.remove('active'));
  condModal.addEventListener('click', (e) => { if (e.target === condModal) condModal.classList.remove('active'); });
}

// ============================================================
// CORE FILTER & RENDER ENGINE
// ============================================================
function getFilteredData() {
  const query = turkishNormalize(searchInput.value);
  const mezuniyet = filterMezuniyet.value;
  const univType = filterUnivType.value;
  const puanType = filterPuanType.value;
  const egitimType = filterEgitimType.value;
  const minKont = filterMinKont && filterMinKont.value ? parseInt(filterMinKont.value, 10) : null;
  const sortBy = sortBySelect.value;

  let allowedCodes = null;
  if (mezuniyet && mappingData[mezuniyet]) {
    allowedCodes = new Set(mappingData[mezuniyet].lisans_kodlari || []);
  }

  let filtered = programsData.filter(item => {
    // 1. Ön Lisans Mezuniyet Alanı Filter (Tablo-2)
    if (allowedCodes && !allowedCodes.has(item.lisans_alan_kodu)) {
      return false;
    }

    // 2. Text Search
    if (query) {
      const targetStr = turkishNormalize(item.univ + ' ' + item.prog + ' ' + item.fac + ' ' + item.code);
      if (!targetStr.includes(query)) return false;
    }

    // 3. Multi-city Filter
    if (selectedCities.length > 0 && !selectedCities.includes(item.city)) return false;

    // 4. Univ Type Filter
    if (univType && !item.univ_type.includes(univType)) return false;

    // 5. Puan Type Filter
    if (puanType && item.puan !== puanType) return false;

    // 6. Eğitim Tipi Filter (Örgün / AÖF / Uzaktan / İkinci Öğretim)
    if (egitimType) {
      const pName = item.prog.toLowerCase();
      if (egitimType === 'AÖF' && !pName.includes('açıköğretim') && !pName.includes('aöf')) return false;
      if (egitimType === 'Uzaktan' && !pName.includes('uzaktan')) return false;
      if (egitimType === 'İkinci Öğretim' && !pName.includes('ikinci öğretim') && !pName.includes('i.ö.')) return false;
      if (egitimType === 'Örgün' && (pName.includes('açıköğretim') || pName.includes('uzaktan') || pName.includes('ikinci öğretim'))) return false;
    }

    // 7. Min Kontenjan Filter
    if (minKont !== null && !isNaN(minKont)) {
      if (item.kont < minKont) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'kont_desc') return (b.kont || 0) - (a.kont || 0);
    if (sortBy === 'puan25_desc') return (b.puan_2025_val || 0) - (a.puan_2025_val || 0);
    if (sortBy === 'puan25_asc') {
      const valA = a.puan_2025_val || 9999;
      const valB = b.puan_2025_val || 9999;
      return valA - valB;
    }
    if (sortBy === 'puan24_desc') return (b.puan_2024_val || 0) - (a.puan_2024_val || 0);
    if (sortBy === 'prog_asc') return a.prog.localeCompare(b.prog, 'tr');
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
    `<span class="cond-badge" onclick="showConditions('${safeCodesStr}', '${safeProgName}')" title="${(conditionsData[code] || '').substring(0, 80)}...">${code}</span>`
  ).join('');
}

function render() {
  const filtered = getFilteredData();
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;

  // Update Stats & Counter
  filteredCountEl.textContent = totalItems.toLocaleString('tr-TR');
  pageInfoEl.textContent = `Sayfa ${currentPage} / ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  // Slice items for current page
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  tableBody.innerHTML = '';
  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:40px; color:var(--text-muted);">Aramanıza uygun DGS üniversite programı bulunamadı.</td></tr>`;
    return;
  }

  pageItems.forEach(item => {
    const isFav = favorites.some(f => f.code === item.code);
    const tr = document.createElement('tr');

    const badgeUnivClass = item.univ_type.includes('Vakıf') ? 'badge-vakif' : (item.univ_type.includes('KKTC') ? 'badge-kktc' : 'badge-devlet');
    
    // Determine Eğitim Tipi Badge
    let tipName = 'Örgün';
    let badgeEgitimClass = 'badge-orgun';
    const pLower = item.prog.toLowerCase();
    if (pLower.includes('açıköğretim') || pLower.includes('aöf')) {
      tipName = 'AÖF';
      badgeEgitimClass = 'badge-aof';
    } else if (pLower.includes('uzaktan')) {
      tipName = 'Uzaktan';
      badgeEgitimClass = 'badge-uzaktan';
    } else if (pLower.includes('ikinci öğretim') || pLower.includes('i.ö.')) {
      tipName = 'İkinci Öğretim';
      badgeEgitimClass = 'badge-orgun';
    }

    // Kontenjan Difference Badge
    let diffBadge = '';
    if (item.kont_diff !== null && item.kont_diff !== undefined) {
      if (item.kont_diff > 0) {
        diffBadge = `<span class="badge-diff badge-diff-plus" title="2025'e göre ${item.kont_diff} kontenjan arttı">+${item.kont_diff}</span>`;
      } else if (item.kont_diff < 0) {
        diffBadge = `<span class="badge-diff badge-diff-minus" title="2025'e göre ${Math.abs(item.kont_diff)} kontenjan azaldı">${item.kont_diff}</span>`;
      } else {
        diffBadge = `<span class="badge-diff badge-diff-same" title="Kontenjan değişmedi">=</span>`;
      }
    } else {
      diffBadge = `<span class="badge-diff badge-diff-new" title="2026'da yeni açılan kontenjan">Yeni</span>`;
    }

    const condBadges = buildCondBadges(item.kosul, item.prog);
    const score25Display = item.puan_2025 && item.puan_2025 !== '--' ? item.puan_2025 : '-';
    const score24Display = item.puan_2024 && item.puan_2024 !== '--' ? item.puan_2024 : '-';
    const kont25Display = item.kont_2025 !== null && item.kont_2025 !== undefined ? item.kont_2025 : '-';

    const safeUniv = item.univ.replace(/'/g, "\\'");
    const safeProg = item.prog.replace(/'/g, "\\'");

    tr.innerHTML = `
      <td>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav('${item.code}')" title="Tercih Listenize Ekleyin">
          ${isFav ? '★' : '☆'}
        </button>
      </td>
      <td class="code-cell">${item.code}</td>
      <td class="cell-city"><strong>${item.city}</strong></td>
      <td class="cell-univ">
        <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem; line-height:1.3;">${item.univ}</div>
        <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">${item.fac}</div>
        <span class="badge ${badgeUnivClass}" style="margin-top:3px; font-size:0.7rem; padding:1px 6px;">${item.univ_type}</span>
      </td>
      <td class="cell-prog">
        <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem; line-height:1.3;">${item.prog}</div>
        <div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap; margin-top:3px;">
          <span class="badge ${badgeEgitimClass}" style="font-size:0.7rem; padding:1px 6px;">${tipName}</span>
          <button class="btn-trend" onclick="showTrendChartModal('${item.code}')" title="2024-2026 DGS 3 Yıllık Değişim Grafiği">📈 Grafik</button>
          <button class="btn-trend" style="background:rgba(52,211,153,0.12); color:#34d399; border-color:rgba(52,211,153,0.3);" onclick="openCurriculumSearch('${safeUniv}', '${safeProg}')" title="Google AI ile Ders Müfredatı & İntibak">📚 Dersler</button>
        </div>
      </td>
      <td><span class="badge" style="background:rgba(255,255,255,0.08); font-size:0.75rem;">${item.puan}</span></td>
      <td style="text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; gap:4px;">
          <span class="badge-kont">${item.kont}</span>
          ${diffBadge}
        </div>
      </td>
      <td style="text-align:center; font-weight:600; color:var(--text-secondary);">${kont25Display}</td>
      <td style="white-space:nowrap;">${condBadges}</td>
      <td style="text-align:right; font-weight:700; color:var(--accent-primary);">${score25Display}</td>
      <td style="text-align:right; font-weight:700; color:var(--text-primary);">${score24Display}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Google AI Curriculum Search
function openCurriculumSearch(univ, prog) {
  const query = `${univ} ${prog} DGS ders müfredatı intibak ve dönemlik ders planı nedir`;
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(url, '_blank');
}

// Conditions Modal (TYT / YKS Style with full ÖSYM official texts)
function showConditions(kosulCodes, progName) {
  condModalTitle.innerHTML = '📋 ÖSYM Özel Koşul Açıklamaları';
  const codes = kosulCodes.split(/[\s,]+/).map(c => c.trim()).filter(c => c && /\d/.test(c));
  
  let html = `<div style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); border-radius:10px; padding:12px 16px; margin-bottom:18px; font-size:0.9rem; color:var(--text-secondary);">
    <strong style="color:var(--text-primary);">Program:</strong> ${progName}
  </div>`;

  if (codes.length === 0) {
    html += '<p style="color:var(--text-muted);">Bu programa ait özel koşul bilgisi bulunmamaktadır.</p>';
  } else {
    html += `<p style="color:var(--text-secondary); margin-bottom:16px; font-size:0.9rem;">Bu programda <strong style="color:var(--accent-primary);">${codes.length} adet</strong> ÖSYM özel şartı uygulanmaktadır:</p>`;
    codes.forEach(code => {
      const desc = conditionsData[code] || `ÖSYM 2026-DGS Kılavuzu Tablo-1 Koşul ve Açıklamalar bölümünde yer alan ${code} numaralı özel şart geçerlidir.`;
      html += `
        <div style="display:flex; gap:14px; align-items:flex-start; padding:14px; border:1px solid var(--border-color); border-radius:10px; margin-bottom:12px; background:rgba(15,23,42,0.4);">
          <div style="min-width:44px; height:44px; background:var(--accent-gradient); border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; color:white; font-size:0.85rem; flex-shrink:0;">${code}</div>
          <div style="color:var(--text-primary); font-size:0.92rem; line-height:1.6;">${desc}</div>
        </div>`;
    });
  }
  
  condModalBody.innerHTML = html;
  condModal.classList.add('active');
}

// ============================================================
// 2024-2026 DGS TREND CHART ENGINE (Chart.js)
// ============================================================
function setupTrendModal() {
  if (btnCloseTrendModal) {
    btnCloseTrendModal.addEventListener('click', () => trendModal.classList.remove('active'));
  }
  if (trendModal) {
    trendModal.addEventListener('click', (e) => {
      if (e.target === trendModal) trendModal.classList.remove('active');
    });
  }
}

function setTrendMetric(metric) {
  activeTrendMetric = metric;
  const btnScore = document.getElementById('btnTrendTabScore');
  const btnKont = document.getElementById('btnTrendTabKont');
  if (btnScore) btnScore.className = metric === 'score' ? 'btn btn-primary' : 'btn';
  if (btnKont) btnKont.className = metric === 'kont' ? 'btn btn-primary' : 'btn';
  if (activeTrendCode) renderTrendChart(activeTrendCode);
}

function showTrendChartModal(code) {
  activeTrendCode = code;
  setTrendMetric('score');
  trendModal.classList.add('active');
  loadTrendData().then(() => {
    renderTrendChart(code);
  });
}

function renderTrendChart(code) {
  const trendDatabase = window.DATA_DGS_TREND || {};
  const item = programsData.find(x => x.code === code);
  const trendInfo = trendDatabase[code];
  const titleEl = document.getElementById('trendModalTitle');
  const subEl = document.getElementById('trendModalSub');
  const badgesEl = document.getElementById('trendBadges');
  const canvas = document.getElementById('trendChartCanvas');

  if (!trendModal || !canvas) return;

  const progTitle = item ? `${item.univ} - ${item.prog}` : (trendInfo ? `${trendInfo.univ} - ${trendInfo.prog}` : `DGS Program #${code}`);
  const puanType = item ? item.puan : (trendInfo ? trendInfo.puan : '');
  const alanKodu = item ? item.lisans_alan_kodu : '';

  titleEl.innerHTML = `📈 2024-2026 DGS Değişim & Trend Analizi`;
  subEl.innerHTML = `<strong style="color:var(--text-primary); font-size:1rem;">${progTitle}</strong> <span style="font-size:0.8rem; color:var(--text-muted);">(ÖSYM Kodu: ${code})</span>`;

  // Render Badges
  const h24 = trendInfo?.history?.['2024'];
  const h25 = trendInfo?.history?.['2025'];
  const h26 = trendInfo?.history?.['2026'] || (item ? { kont: item.kont } : null);
  const e24 = trendInfo?.ek_history?.['2024_ek'];
  const e25 = trendInfo?.ek_history?.['2025_ek'];

  let badgeHTML = `
    <span class="badge" style="background:rgba(99,102,241,0.15); color:#818cf8; border:1px solid rgba(99,102,241,0.3); font-weight:700;">${puanType} Puanı</span>
    ${alanKodu ? `<span class="badge" style="background:rgba(148,163,184,0.15); color:#cbd5e1; border:1px solid rgba(148,163,184,0.3); font-weight:700;">Alan Kodu: ${alanKodu}</span>` : ''}
    <span class="badge" style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); font-weight:700;">2026 Kont: ${h26?.kont ?? '-'}</span>
  `;

  if (h25?.min && h25.min !== '--') {
    badgeHTML += `<span class="badge" style="background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); font-weight:700;">2025 Taban: ${h25.min}</span>`;
  }
  if (h24?.min && h24.min !== '--') {
    badgeHTML += `<span class="badge" style="background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.3); font-weight:700;">2024 Taban: ${h24.min}</span>`;
  }
  badgesEl.innerHTML = badgeHTML;

  // Chart Rendering
  const ctx = canvas.getContext('2d');
  if (trendChartInstance) {
    trendChartInstance.destroy();
    trendChartInstance = null;
  }

  const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  if (activeTrendMetric === 'score') {
    // Score Trend: 2024 Merkezi, 2024 Ek, 2025 Merkezi, 2025 Ek
    const labels = ['2024 Merkezi', '2024 Ek Yerl.', '2025 Merkezi', '2025 Ek Yerl.'];
    const minScores = [
      h24?.min_val || null,
      e24?.min_val || null,
      h25?.min_val || null,
      e25?.min_val || null
    ];
    const maxScores = [
      h24?.max && h24.max !== '--' ? parseFloat(h24.max.replace(',', '.')) : null,
      e24?.max && e24.max !== '--' ? parseFloat(e24.max.replace(',', '.')) : null,
      h25?.max && h25.max !== '--' ? parseFloat(h25.max.replace(',', '.')) : null,
      e25?.max && e25.max !== '--' ? parseFloat(e25.max.replace(',', '.')) : null
    ];

    trendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'En Küçük (Taban) Puan',
            data: minScores,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderWidth: 3,
            pointBackgroundColor: '#818cf8',
            pointRadius: 6,
            pointHoverRadius: 9,
            tension: 0.25,
            fill: true,
            spanGaps: true
          },
          {
            label: 'En Büyük (Tavan) Puan',
            data: maxScores,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: '#34d399',
            pointRadius: 5,
            tension: 0.25,
            spanGaps: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: textColor, font: { weight: '600', size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw ? ctx.raw.toFixed(4) : 'Veri Yok'}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { weight: '600' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor }
          }
        }
      }
    });

  } else {
    // Quota & Placed Comparison: 2024, 2025, 2026
    const labels = ['2024', '2025', '2026'];
    const kontenjanData = [
      h24?.kont || 0,
      h25?.kont || 0,
      h26?.kont || (item ? item.kont : 0)
    ];
    const yerlesenData = [
      h24?.yer || 0,
      h25?.yer || 0,
      null // 2026 results not yet placed
    ];

    trendChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Kontenjan',
            data: kontenjanData,
            backgroundColor: 'rgba(56, 189, 248, 0.8)',
            borderColor: '#38bdf8',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: 'Yerleşen',
            data: yerlesenData,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: textColor, font: { weight: '600', size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw !== null ? ctx.raw : 'Henüz Açıklanmadı'}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { weight: '600' } }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor, stepSize: 1 }
          }
        }
      }
    });
  }
}

// ============================================================
// FAVORITES / TERCİH LİSTEM ENGINE
// ============================================================
function toggleFav(code) {
  const item = programsData.find(p => p.code === code);
  if (!item) return;

  const idx = favorites.findIndex(f => f.code === code);
  if (idx > -1) {
    favorites.splice(idx, 1);
  } else {
    if (favorites.length >= 30) {
      alert('DGS merkezi yerleştirmede en fazla 30 tercih hakkınız bulunmaktadır.');
      return;
    }
    favorites.push(item);
  }
  saveFavs();
  updateFavBadge();
  render();
  if (listModal.classList.contains('active')) renderFavModal();
}

function saveFavs() {
  localStorage.setItem('dgs_tercih_favs', JSON.stringify(favorites));
}

function updateFavBadge() {
  favCountBadge.textContent = favorites.length;
  if (modalFavCount) modalFavCount.textContent = favorites.length;
}

function openFavModal() {
  renderFavModal();
  listModal.classList.add('active');
}

function renderFavModal() {
  updateFavBadge();
  if (favorites.length === 0) {
    favEmptyState.style.display = 'block';
    favTableWrap.style.display = 'none';
    favTableBody.innerHTML = '';
    return;
  }

  favEmptyState.style.display = 'none';
  favTableWrap.style.display = 'block';
  favTableBody.innerHTML = '';

  favorites.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center; font-weight:700; color:var(--accent-primary);">${idx + 1}</td>
      <td class="code-cell">${item.code}</td>
      <td>
        <div style="font-weight:600;">${item.univ}</div>
        <div style="font-size:0.75rem; color:var(--text-secondary);">${item.fac || ''}</div>
      </td>
      <td>${item.prog}</td>
      <td><strong>${item.city}</strong></td>
      <td><span class="badge" style="background:rgba(255,255,255,0.08);">${item.puan}</span></td>
      <td style="text-align:center; font-weight:600;">${item.kont}</td>
      <td style="text-align:right; font-weight:700; color:var(--accent-primary);">${item.puan_2025 || '--'}</td>
      <td style="text-align:center;">
        <button class="fav-btn active" onclick="toggleFav('${item.code}')" title="Listeden Kaldır">★</button>
      </td>
    `;
    favTableBody.appendChild(tr);
  });
}

// Export Favorites to PDF
function exportFavsPDF() {
  if (favorites.length === 0) {
    alert('Tercih listeniz boş olduğu için PDF oluşturulamadı.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');

  const toAscii = s => String(s || '')
    .replace(/Ğ/g,'G').replace(/ğ/g,'g')
    .replace(/Ü/g,'U').replace(/ü/g,'u')
    .replace(/Ş/g,'S').replace(/ş/g,'s')
    .replace(/İ/g,'I').replace(/ı/g,'i')
    .replace(/Ö/g,'O').replace(/ö/g,'o')
    .replace(/Ç/g,'C').replace(/ç/g,'c');

  doc.setFontSize(16);
  doc.setTextColor(99, 102, 241);
  doc.text('2026 DGS TERCIH LISTEM', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`tercihrobutu.github.io  |  ${new Date().toLocaleDateString('tr-TR')}  |  Toplam: ${favorites.length}/30 Program`, 14, 22);

  const head = [['Sira', 'OSYM Kodu', 'Universite', 'Fakulte', 'Program', 'Puan', '2026 Kont.', '2025 Taban Puan', 'Kosullar']];
  const body = favorites.map((item, idx) => [
    idx + 1,
    item.code,
    toAscii(item.univ),
    toAscii(item.fac || '-'),
    toAscii(item.prog),
    item.puan,
    item.kont,
    item.puan_2025 || '--',
    item.kosul || '-'
  ]);

  doc.autoTable({
    startY: 26,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 50 },
      3: { cellWidth: 40 },
      4: { cellWidth: 60 },
      5: { cellWidth: 14, halign: 'center' },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 25, halign: 'center' },
      8: { cellWidth: 25 }
    }
  });

  doc.save('2026_DGS_Tercih_Listem.pdf');
}

// Export Favorites to Excel (.xlsx)
function exportFavsExcel() {
  if (favorites.length === 0) {
    alert('Tercih listeniz boş olduğu için Excel oluşturulamadı.');
    return;
  }

  const exportData = favorites.map((item, idx) => ({
    'Tercih Sırası': idx + 1,
    'ÖSYM Kodu': item.code,
    'Üniversite': item.univ,
    'Fakülte': item.fac || '',
    'Lisans Programı': item.prog,
    'Puan Türü': item.puan,
    '2026 Kontenjan': item.kont,
    '2025 Taban Puan': item.puan_2025 || '--',
    '2024 Taban Puan': item.puan_2024 || '--',
    'Şehir': item.city,
    'Özel Koşullar': item.kosul || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DGS Tercihlerim');
  XLSX.writeFile(workbook, '2026_DGS_Tercih_Listem.xlsx');
}

// ============================================================
// URL PARAMETERS & ROUTER
// ============================================================
function checkURLParams() {
  const params = new URLSearchParams(window.location.search);

  // 1. Smart redirect for past Google indexed YKS links (?tab=lisans / ?tab=onlisans)
  if (params.has('tab') || params.has('amp;tab')) {
    window.location.replace('yks.html' + window.location.search);
    return;
  }

  // Search
  const q = params.get('q');
  if (q) searchInput.value = decodeURIComponent(q);

  // Mezuniyet
  const mezuniyet = params.get('mezuniyet');
  if (mezuniyet) {
    const decodedMez = decodeURIComponent(mezuniyet);
    const found = Array.from(filterMezuniyet.options).find(o => turkishNormalize(o.value) === turkishNormalize(decodedMez));
    if (found) {
      filterMezuniyet.value = found.value;
      btnClearMezuniyet.style.display = 'inline-block';
      mezuniyetBadge.style.display = 'inline-block';
    }
  }

  // Sehir
  const sehir = params.get('sehir');
  if (sehir) {
    const decodedCity = decodeURIComponent(sehir);
    selectedCities = [decodedCity];
    populateCityFilter();
  }

  // Puan
  const puan = params.get('puan') || params.get('amp;puan');
  if (puan && ['SAY', 'EA', 'SÖZ'].includes(puan.toUpperCase())) {
    filterPuanType.value = puan.toUpperCase();
  }

  // Tur
  const tur = params.get('tur') || params.get('amp;tur');
  if (tur) {
    filterUnivType.value = tur;
  }
}

function updateURLParams() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('q', searchInput.value.trim());
  if (filterMezuniyet.value) params.set('mezuniyet', filterMezuniyet.value);
  if (selectedCities.length > 0) params.set('sehir', selectedCities.join(','));
  if (filterPuanType.value) params.set('puan', filterPuanType.value);
  if (filterUnivType.value) params.set('tur', filterUnivType.value);

  const str = params.toString();
  const newURL = window.location.pathname + (str ? '?' + str : '');
  window.history.replaceState({}, '', newURL);
}
