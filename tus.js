// ============================================================
// 2026 TUS 2. Dönem Tercih Robotu Engine (Client-Side Jamstack)
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
const programsData = window.DATA_TUS_PROGRAMS || [];
const conditionsData = window.DATA_TUS_CONDITIONS || {};

let selectedPuanType = ''; // '' = all, 'K', 'T'
let selectedBrans = '';
let selectedTur = '';
let selectedCities = [];
let minScore = null;
let maxScore = null;
let selectedKontType = '';
let searchQuery = '';
let sortBy = 'score_26_1_desc';
let currentPage = 1;
const itemsPerPage = 50;
let favorites = JSON.parse(localStorage.getItem('tus_favs_2026') || '[]');

// DOM Elements
const searchInput = document.getElementById('searchInput');
const filterBrans = document.getElementById('filterBrans');
const filterTur = document.getElementById('filterTur');
const filterMinScore = document.getElementById('filterMinScore');
const filterMaxScore = document.getElementById('filterMaxScore');
const filterKontType = document.getElementById('filterKontType');
const sortBySelect = document.getElementById('sortBy');
const btnResetFilters = document.getElementById('btnResetFilters');
const filteredCountEl = document.getElementById('filteredCount');

const cityMultiBtn = document.getElementById('cityMultiBtn');
const cityDropdown = document.getElementById('cityDropdown');
const citySearchInput = document.getElementById('citySearchInput');
const cityOptionsList = document.getElementById('cityOptionsList');
const btnClearCities = document.getElementById('btnClearCities');
const cityMultiLabel = document.getElementById('cityMultiLabel');
const cityCountLabel = document.getElementById('cityCountLabel');

const tableBody = document.getElementById('tableBody');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfoEl = document.getElementById('pageInfo');

const btnOpenList = document.getElementById('btnOpenList');
const btnTriggerFavs = document.getElementById('btnTriggerFavs');
const favCountBadge = document.getElementById('favCountBadge');
const favCountBadgeBottom = document.getElementById('favCountBadgeBottom');
const listModal = document.getElementById('listModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const favTableBody = document.getElementById('favTableBody');
const btnClearFavs = document.getElementById('btnClearFavs');
const btnExportXLSX = document.getElementById('btnExportXLSX');
const btnExportPDF = document.getElementById('btnExportPDF');
const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');
const btnCopyLink = document.getElementById('btnCopyLink');
const btnShareFavsWA = document.getElementById('btnShareFavsWA');

const condModal = document.getElementById('condModal');
const btnCloseCondModal = document.getElementById('btnCloseCondModal');
const condModalTitle = document.getElementById('condModalTitle');
const condModalBody = document.getElementById('condModalBody');

const trendModal = document.getElementById('trendModal');
const btnCloseTrendModal = document.getElementById('btnCloseTrendModal');
const trendModalTitle = document.getElementById('trendModalTitle');
const trendModalSub = document.getElementById('trendModalSub');
const trendContent = document.getElementById('trendContent');
const themeToggle = document.getElementById('themeToggle');

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  populateBransFilter();
  populateCityFilter();
  updateFavBadge();
  setupEventListeners();
  setupMultiSelectEvents();
  checkURLParams();
  render();
});

// Theme Initialization
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }
}

// Populate Branş Filter
function populateBransFilter() {
  if (!filterBrans) return;
  const branches = [...new Set(programsData.map(p => p.brans).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr'));
  
  filterBrans.innerHTML = '<option value="">Tüm Uzmanlık Alanları (42 Branş)</option>';
  branches.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    filterBrans.appendChild(opt);
  });
}

// Populate Cities Filter (Multi-select)
function populateCityFilter() {
  if (!cityOptionsList) return;
  const cities = [...new Set(programsData.map(p => p.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr'));

  cityOptionsList.innerHTML = '';
  cities.forEach(city => {
    const label = document.createElement('label');
    label.className = 'multi-select-option';
    label.innerHTML = `
      <input type="checkbox" value="${city}">
      <span>${city}</span>
    `;
    cityOptionsList.appendChild(label);
  });
}

// Multi-select Dropdown Events
function setupMultiSelectEvents() {
  if (!cityMultiBtn || !cityDropdown) return;

  cityMultiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cityDropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!cityDropdown.contains(e.target) && e.target !== cityMultiBtn) {
      cityDropdown.classList.remove('active');
    }
  });

  if (citySearchInput) {
    citySearchInput.addEventListener('input', (e) => {
      const q = turkishNormalize(e.target.value);
      const options = cityOptionsList.querySelectorAll('.multi-select-option');
      options.forEach(opt => {
        const text = turkishNormalize(opt.textContent);
        opt.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  if (cityOptionsList) {
    cityOptionsList.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const val = e.target.value;
        if (e.target.checked) {
          if (!selectedCities.includes(val)) selectedCities.push(val);
        } else {
          selectedCities = selectedCities.filter(c => c !== val);
        }
        updateCityLabel();
        currentPage = 1;
        render();
      }
    });
  }

  if (btnClearCities) {
    btnClearCities.addEventListener('click', () => {
      selectedCities = [];
      const checkboxes = cityOptionsList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
      updateCityLabel();
      currentPage = 1;
      render();
    });
  }
}

function updateCityLabel() {
  if (selectedCities.length === 0) {
    cityMultiLabel.textContent = 'Tüm Şehirler';
    if (cityCountLabel) cityCountLabel.textContent = 'Tümü';
  } else if (selectedCities.length === 1) {
    cityMultiLabel.textContent = selectedCities[0];
    if (cityCountLabel) cityCountLabel.textContent = '1 Şehir';
  } else {
    cityMultiLabel.textContent = `${selectedCities.length} Şehir Seçildi`;
    if (cityCountLabel) cityCountLabel.textContent = `${selectedCities.length} İl`;
  }
}

// Switch Puan Type Tabs (Klinik / Temel / Tümü)
function switchPuanType(type) {
  selectedPuanType = type;
  document.querySelectorAll('.cat-tab-btn').forEach(btn => btn.classList.remove('active'));
  
  if (type === 'K') {
    document.getElementById('tabKlinik').classList.add('active');
  } else if (type === 'T') {
    document.getElementById('tabTemel').classList.add('active');
  } else {
    document.getElementById('tabAll').classList.add('active');
  }

  currentPage = 1;
  render();
}

// URL Params Checking
function checkURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  const brans = urlParams.get('brans');
  const pt = urlParams.get('puan');

  if (q && searchInput) {
    searchInput.value = q;
    searchQuery = turkishNormalize(q);
  }
  if (brans && filterBrans) {
    filterBrans.value = brans;
    selectedBrans = brans;
  }
  if (pt) {
    switchPuanType(pt.toUpperCase());
  }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function setupEventListeners() {
  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = turkishNormalize(e.target.value);
      currentPage = 1;
      render();
    });
  }

  // Branş filter
  if (filterBrans) {
    filterBrans.addEventListener('change', (e) => {
      selectedBrans = e.target.value;
      currentPage = 1;
      render();
    });
  }

  // Kadro Türü filter
  if (filterTur) {
    filterTur.addEventListener('change', (e) => {
      selectedTur = e.target.value;
      currentPage = 1;
      render();
    });
  }

  // Min / Max Score
  if (filterMinScore) {
    filterMinScore.addEventListener('input', (e) => {
      minScore = e.target.value ? parseFloat(e.target.value) : null;
      currentPage = 1;
      render();
    });
  }

  if (filterMaxScore) {
    filterMaxScore.addEventListener('input', (e) => {
      maxScore = e.target.value ? parseFloat(e.target.value) : null;
      currentPage = 1;
      render();
    });
  }

  // Kontenjan Type
  if (filterKontType) {
    filterKontType.addEventListener('change', (e) => {
      selectedKontType = e.target.value;
      currentPage = 1;
      render();
    });
  }

  // Sort By
  if (sortBySelect) {
    sortBySelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      currentPage = 1;
      render();
    });
  }

  // Reset Filters
  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      selectedPuanType = '';
      switchPuanType('');
      selectedBrans = '';
      if (filterBrans) filterBrans.value = '';
      selectedTur = '';
      if (filterTur) filterTur.value = '';
      selectedCities = [];
      if (cityOptionsList) {
        cityOptionsList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
      }
      updateCityLabel();
      minScore = null;
      if (filterMinScore) filterMinScore.value = '';
      maxScore = null;
      if (filterMaxScore) filterMaxScore.value = '';
      selectedKontType = '';
      if (filterKontType) filterKontType.value = '';
      sortBy = 'score_26_1_desc';
      if (sortBySelect) sortBySelect.value = 'score_26_1_desc';
      currentPage = 1;
      render();
    });
  }

  // Pagination
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        render();
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      render();
      window.scrollTo({ top: 380, behavior: 'smooth' });
    });
  }

  // Favorites Modal
  if (btnOpenList) btnOpenList.addEventListener('click', openFavModal);
  if (btnTriggerFavs) btnTriggerFavs.addEventListener('click', openFavModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeFavModal);
  if (btnClearFavs) btnClearFavs.addEventListener('click', clearFavs);
  if (btnExportXLSX) btnExportXLSX.addEventListener('click', exportFavsXLSX);
  if (btnExportPDF) btnExportPDF.addEventListener('click', exportFavsPDF);
  if (btnShareWhatsApp) btnShareWhatsApp.addEventListener('click', shareSiteWhatsApp);
  if (btnCopyLink) btnCopyLink.addEventListener('click', copySiteLink);
  if (btnShareFavsWA) btnShareFavsWA.addEventListener('click', shareFavsWhatsApp);

  // Conditions Modal
  if (btnCloseCondModal) {
    btnCloseCondModal.addEventListener('click', () => condModal.classList.remove('active'));
  }

  // Trend Modal
  if (btnCloseTrendModal) {
    btnCloseTrendModal.addEventListener('click', () => trendModal.classList.remove('active'));
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === listModal) closeFavModal();
    if (e.target === condModal) condModal.classList.remove('active');
    if (e.target === trendModal) trendModal.classList.remove('active');
  });
}

// ============================================================
// FILTER & SORT ENGINE
// ============================================================
function getFilteredData() {
  let filtered = programsData.filter(item => {
    // Puan Türü (Klinik / Temel)
    if (selectedPuanType && item.puan_turu !== selectedPuanType) return false;

    // Branş
    if (selectedBrans && item.brans !== selectedBrans) return false;

    // Kadro Türü
    if (selectedTur && item.tur_tag !== selectedTur) return false;

    // Şehir
    if (selectedCities.length > 0 && !selectedCities.includes(item.city)) return false;

    // Kontenjan Type
    if (selectedKontType === 'genel_var' && (item.kont_genel || 0) <= 0) return false;
    if (selectedKontType === 'yabanci_var' && (item.kont_yabanci || 0) <= 0) return false;

    // Score Range
    const scoreVal = item.min_2026_1_val !== null ? item.min_2026_1_val : item.latest_score_val;
    if (minScore !== null && (scoreVal === null || scoreVal < minScore)) return false;
    if (maxScore !== null && (scoreVal === null || scoreVal > maxScore)) return false;

    // Search Query
    if (searchQuery) {
      const fullText = turkishNormalize(
        item.kurum + ' ' + item.brans + ' ' + item.city + ' ' + item.code + ' ' + item.birlikte_univ + ' ' + item.birlikte_fac
      );
      if (!fullText.includes(searchQuery)) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'score_26_1_desc') return (b.min_2026_1_val || 0) - (a.min_2026_1_val || 0);
    if (sortBy === 'score_26_1_asc') return (a.min_2026_1_val || 999) - (b.min_2026_1_val || 999);
    if (sortBy === 'kont_26_2_desc') return (b.kont_total || 0) - (a.kont_total || 0);
    if (sortBy === 'score_25_2_desc') return (b.min_2025_2_val || 0) - (a.min_2025_2_val || 0);
    if (sortBy === 'score_25_1_desc') return (b.min_2025_1_val || 0) - (a.min_2025_1_val || 0);
    if (sortBy === 'kurum_asc') return a.kurum.localeCompare(b.kurum, 'tr');
    if (sortBy === 'brans_asc') return a.brans.localeCompare(b.brans, 'tr');
    if (sortBy === 'city_asc') return a.city.localeCompare(b.city, 'tr');
    return 0;
  });

  return filtered;
}

// ============================================================
// RENDER FUNCTION
// ============================================================
function render() {
  const filtered = getFilteredData();
  if (filteredCountEl) filteredCountEl.textContent = filtered.length.toLocaleString('tr-TR');

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  if (pageInfoEl) pageInfoEl.textContent = `Sayfa ${currentPage} / ${totalPages}`;
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="13" style="text-align:center; padding:40px; color:var(--text-muted);">Aramanıza uygun TUS uzmanlık programı bulunamadı.</td></tr>`;
    return;
  }

  pageItems.forEach(item => {
    const isFav = favorites.some(f => f.code === item.code);
    const tr = document.createElement('tr');

    // Kadro Türü Badge
    let turBadgeClass = 'badge-uni';
    if (item.tur_tag.includes('SB-EAH') || item.tur_tag.includes('Şehir')) turBadgeClass = 'badge-vakif';
    else if (item.tur_tag.includes('Yabancı')) turBadgeClass = 'badge-aof';
    else if (item.tur_tag.includes('Askeri') || item.tur_tag.includes('Jandarma')) turBadgeClass = 'badge-uzaktan';
    else if (item.tur_tag.includes('KKTC')) turBadgeClass = 'badge-kktc';
    else if (item.tur_tag.includes('Adli Tıp')) turBadgeClass = 'badge-devlet';

    // Puan Türü Badge
    const ptBadge = item.puan_turu === 'K'
      ? `<span class="badge" style="background:rgba(56,189,248,0.18); color:#38bdf8; font-size:0.72rem; padding:2px 6px;">Klinik</span>`
      : `<span class="badge" style="background:rgba(16,185,129,0.18); color:#34d399; font-size:0.72rem; padding:2px 6px;">Temel</span>`;

    // Kontenjan Display
    let kontDisplay = `<div style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">${item.kont_total}</div>`;
    if (item.kont_yabanci > 0) {
      kontDisplay += `<div style="font-size:0.68rem; color:#f472b6;" title="Yabancı Uyruklu Kontenjanı">Yab: ${item.kont_yabanci}</div>`;
    }

    // 2026/1 Taban Puanı Display
    let score26_1_Display = '';
    if (item.has_2026_1 && item.min_2026_1 !== '--') {
      score26_1_Display = `
        <div style="font-weight:800; color:#34d399; font-size:0.92rem;">${item.min_2026_1}</div>
        <div style="font-size:0.68rem; color:var(--text-muted);" title="Yerleşen / Kontenjan">${item.yer_2026_1}/${item.kont_2026_1} Yerleşti</div>
      `;
    } else if (item.has_2026_1 && item.bos_2026_1 > 0 && item.yer_2026_1 === 0) {
      score26_1_Display = `<span class="badge" style="background:rgba(239,68,68,0.12); color:#f87171; font-size:0.7rem; padding:2px 5px;">Yerleşen Yok</span>`;
    } else {
      score26_1_Display = `<div style="color:var(--text-muted); font-size:0.85rem;">—</div>`;
    }

    // 2025/2 Taban Puanı Display
    let score25_2_Display = item.has_2025_2 && item.min_2025_2 !== '--'
      ? `<div style="font-weight:600; color:var(--text-secondary); font-size:0.88rem;">${item.min_2025_2}</div>`
      : `<div style="color:var(--text-muted); font-size:0.85rem;">—</div>`;

    // 2025/1 Taban Puanı Display
    let score25_1_Display = item.has_2025_1 && item.min_2025_1 !== '--'
      ? `<div style="font-weight:600; color:var(--text-secondary); font-size:0.88rem;">${item.min_2025_1}</div>`
      : `<div style="color:var(--text-muted); font-size:0.85rem;">—</div>`;

    // Birlikte Kullanım Tag
    let protokolHtml = '';
    if (item.birlikte_univ) {
      protokolHtml = `<div style="font-size:0.74rem; color:var(--accent-primary); margin-top:2px;" title="Birlikte Kullanım Protokolü">🤝 ${item.birlikte_univ} ${item.birlikte_fac}</div>`;
    }

    // Special Condition Badges
    const condBadges = buildCondBadges(item.kosullar, item.brans);

    tr.innerHTML = `
      <td>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav('${item.code}')" title="Tercih Listenize Ekleyin">
          ${isFav ? '★' : '☆'}
        </button>
      </td>
      <td class="code-cell">${item.code}</td>
      <td class="cell-city"><strong>${item.city}</strong></td>
      <td class="cell-univ">
        <div style="font-weight:700; color:var(--text-primary); font-size:0.88rem; line-height:1.3;">${item.kurum}</div>
        ${protokolHtml}
      </td>
      <td class="cell-prog">
        <div style="font-weight:700; color:#38bdf8; font-size:0.88rem; line-height:1.3;">${item.brans}</div>
      </td>
      <td style="text-align:center;">${ptBadge}</td>
      <td style="text-align:center;"><span class="badge ${turBadgeClass}" style="font-size:0.7rem; padding:2px 6px;">${item.tur}</span></td>
      <td style="text-align:center;">${kontDisplay}</td>
      <td style="text-align:right;">${score26_1_Display}</td>
      <td style="text-align:right;">${score25_2_Display}</td>
      <td style="text-align:right;">${score25_1_Display}</td>
      <td style="text-align:center; white-space:nowrap;">${condBadges}</td>
      <td style="text-align:center;">
        <button class="btn-trend" onclick="showTrendModal('${item.code}')" title="Dönemsel Puan ve Branş Analizi">📈 Analiz</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Build Condition Badges (Bk. X)
function buildCondBadges(codesStr, progName) {
  if (!codesStr || !codesStr.trim()) return '<span style="color:var(--text-muted); font-size:0.8rem;">—</span>';
  const codes = codesStr.split(/[\s,]+/).map(c => c.trim()).filter(c => c && /^\d+$/.test(c));
  if (codes.length === 0) return '<span style="color:var(--text-muted); font-size:0.8rem;">—</span>';

  return codes.map(code => 
    `<span class="cond-badge" onclick="showCondModal('${code}', '${(progName||'').replace(/'/g, "\\'")}')" title="Bk. ${code} Açıklamasını Gör">Bk. ${code}</span>`
  ).join('');
}

// ============================================================
// MODALS MANAGEMENT
// ============================================================

// 1. Condition Modal
function showCondModal(condCode, progName) {
  const explanation = conditionsData[condCode] || 'Bu koşula ait detaylı açıklama genel ilkeler kılavuzunda yer almaktadır.';
  if (condModalTitle) condModalTitle.innerHTML = `📋 ÖSYM Özel Koşul: Bk. ${condCode}`;
  if (condModalBody) {
    condModalBody.innerHTML = `
      <div style="font-weight:700; color:var(--text-primary); margin-bottom:8px;">${progName}</div>
      <div style="background:rgba(2,132,199,0.08); border-left:3px solid #38bdf8; padding:12px 14px; border-radius:6px; line-height:1.6;">
        ${explanation}
      </div>
    `;
  }
  if (condModal) condModal.classList.add('active');
}

// 2. Trend & Historical Analysis Modal
function showTrendModal(code) {
  const item = programsData.find(p => p.code === code);
  if (!item) return;

  if (trendModalTitle) trendModalTitle.innerHTML = `📈 ${item.brans} - ${item.kurum}`;
  if (trendModalSub) trendModalSub.innerHTML = `ÖSYM Kodu: <strong>${item.code}</strong> | İl: <strong>${item.city}</strong> | Puan Türü: <strong>${item.puan_turu_tag}</strong>`;

  let trendRowsHtml = `
    <div style="background:var(--bg-primary); border-radius:12px; padding:16px; margin-bottom:16px;">
      <h4 style="color:#38bdf8; margin-bottom:12px; font-size:0.95rem;">📊 Dönemsel Taban / Tavan Puan ve Kontenjan Değişimi</h4>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px;">
        
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">2026/2 (Aktif Kılavuz)</div>
          <div style="font-size:1.3rem; font-weight:800; color:#38bdf8; margin:4px 0;">${item.kont_total} Kont.</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">Genel: ${item.kont_genel} | Yab: ${item.kont_yabanci}</div>
        </div>

        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">2026 1. Dönem</div>
          <div style="font-size:1.3rem; font-weight:800; color:#34d399; margin:4px 0;">${item.min_2026_1}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${item.has_2026_1 ? `Yerleşen: ${item.yer_2026_1}/${item.kont_2026_1}` : 'Veri Yok'}</div>
        </div>

        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">2025 2. Dönem</div>
          <div style="font-size:1.3rem; font-weight:800; color:#a78bfa; margin:4px 0;">${item.min_2025_2}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${item.has_2025_2 ? `Yerleşen: ${item.yer_2025_2}/${item.kont_2025_2}` : 'Veri Yok'}</div>
        </div>

        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:10px; padding:12px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">2025 1. Dönem</div>
          <div style="font-size:1.3rem; font-weight:800; color:#fbbf24; margin:4px 0;">${item.min_2025_1}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${item.has_2025_1 ? `Yerleşen: ${item.yer_2025_1}/${item.kont_2025_1}` : 'Veri Yok'}</div>
        </div>

      </div>
    </div>
  `;

  // Department / Specialty Benchmark comparison
  if (item.branch_avg_26_1) {
    const diff = item.min_2026_1_val ? (item.min_2026_1_val - item.branch_avg_26_1).toFixed(2) : null;
    const diffLabel = diff !== null
      ? (diff >= 0 ? `+${diff} Puan (Branş Ortalamasının Üstünde)` : `${diff} Puan (Branş Ortalamasının Altında)`)
      : 'Eşleşme Yok';
    const diffColor = diff !== null ? (diff >= 0 ? '#34d399' : '#f87171') : 'var(--text-muted)';

    trendRowsHtml += `
      <div style="background:rgba(2,132,199,0.06); border:1px solid rgba(2,132,199,0.25); border-radius:10px; padding:14px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:0.82rem; color:var(--text-secondary);">Türkiye Geneli <strong>${item.brans}</strong> Ortalaması (2026/1):</div>
            <div style="font-size:1.2rem; font-weight:800; color:#38bdf8;">${item.branch_avg_26_1} Puan</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.82rem; color:var(--text-secondary);">Bu Programın Konumu:</div>
            <div style="font-size:1.05rem; font-weight:700; color:${diffColor};">${diffLabel}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (trendContent) trendContent.innerHTML = trendRowsHtml;
  if (trendModal) trendModal.classList.add('active');
}

// ============================================================
// FAVORITES MANAGEMENT
// ============================================================
function toggleFav(code) {
  const item = programsData.find(p => p.code === code);
  if (!item) return;

  const idx = favorites.findIndex(f => f.code === code);
  if (idx >= 0) favorites.splice(idx, 1);
  else favorites.push(item);

  localStorage.setItem('tus_favs_2026', JSON.stringify(favorites));
  updateFavBadge();
  render();
  if (listModal && listModal.classList.contains('active')) renderFavModal();
}

function updateFavBadge() {
  const count = favorites.length;
  if (favCountBadge) favCountBadge.textContent = count;
  if (favCountBadgeBottom) favCountBadgeBottom.textContent = count;
}

function openFavModal() {
  renderFavModal();
  if (listModal) listModal.classList.add('active');
}

function closeFavModal() {
  if (listModal) listModal.classList.remove('active');
}

function renderFavModal() {
  if (!favTableBody) return;
  favTableBody.innerHTML = '';

  if (favorites.length === 0) {
    favTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--text-muted);">Henüz tercih listenize program eklemediniz. Yıldız butonuna basarak ekleyebilirsiniz.</td></tr>`;
    return;
  }

  favorites.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:#38bdf8;">${idx + 1}</td>
      <td class="code-cell">${item.code}</td>
      <td><strong>${item.kurum}</strong></td>
      <td style="color:#38bdf8; font-weight:700;">${item.brans}</td>
      <td>${item.city}</td>
      <td style="text-align:center;">${item.puan_turu}</td>
      <td style="text-align:center; font-weight:700;">${item.kont_total}</td>
      <td style="text-align:right; font-weight:700; color:#34d399;">${item.min_2026_1}</td>
      <td style="text-align:right;">${item.min_2025_1}</td>
      <td><button class="btn" style="color:#f87171; padding:4px 8px;" onclick="toggleFav('${item.code}')">✕</button></td>
    `;
    favTableBody.appendChild(tr);
  });
}

function clearFavs() {
  if (confirm('Tercih listenizdeki tüm uzmanlık programları silinecek. Emin misiniz?')) {
    favorites = [];
    localStorage.removeItem('tus_favs_2026');
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
      'Kurum / Hastane': item.kurum,
      'Birlikte Kullanım Fakültesi': [item.birlikte_univ, item.birlikte_fac].filter(Boolean).join(' '),
      'Uzmanlık Branşı': item.brans,
      'Puan Türü': item.puan_turu_tag,
      'Kadro Türü': item.tur_tag,
      '2026/2 Genel Kontenjan': item.kont_genel,
      '2026/2 Yabancı Uyruklu Kontenjanı': item.kont_yabanci,
      '2026/2 Toplam Kontenjan': item.kont_total,
      '2026 1. Dönem Taban Puanı': item.min_2026_1,
      '2026 1. Dönem Tavan Puanı': item.max_2026_1,
      '2025 2. Dönem Taban Puanı': item.min_2025_2,
      '2025 1. Dönem Taban Puanı': item.min_2025_1,
      'Özel Koşul Açıklamaları': item.kosullar ? item.kosullar.split(',').map(c => `Bk. ${c.trim()}: ${conditionsData[c.trim()] || ''}`).join(' | ') : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = [
      { wch: 6 }, { wch: 12 }, { wch: 14 }, { wch: 38 }, { wch: 32 },
      { wch: 28 }, { wch: 16 }, { wch: 24 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 40 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TUS 2026-2 Tercihlerim');
    const fileName = `TUS_2026_2_Donem_Tercih_Listem_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (err) {
    console.error('Excel export error:', err);
    alert('Excel dosyası oluşturulurken bir hata oluştu: ' + err.message);
  }
}

// ============================================================
// PDF EXPORT — jsPDF + autoTable
// ============================================================
function exportFavsPDF() {
  if (favorites.length === 0) return alert('Listeniz boş!');

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Başlık
    doc.setFillColor(2, 132, 199);
    doc.rect(0, 0, 297, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2026 TUS 2. DONEM TERCIH LISTEM', 14, 13);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`tercihrobutu.github.io  |  ${new Date().toLocaleDateString('tr-TR')}  |  Toplam: ${favorites.length} Uzmanlık Kadrosu`, 150, 13);

    // ASCII normalizer for jsPDF default fonts
    const toAscii = s => String(s || '')
      .replace(/Ğ/g,'G').replace(/ğ/g,'g')
      .replace(/Ü/g,'U').replace(/ü/g,'u')
      .replace(/Ş/g,'S').replace(/ş/g,'s')
      .replace(/İ/g,'I').replace(/ı/g,'i')
      .replace(/Ö/g,'O').replace(/ö/g,'o')
      .replace(/Ç/g,'C').replace(/ç/g,'c');

    const tableData = favorites.map((item, idx) => [
      idx + 1,
      item.code,
      toAscii(item.city),
      toAscii(item.kurum),
      toAscii(item.brans),
      item.puan_turu,
      String(item.kont_total),
      item.min_2026_1 !== '--' ? item.min_2026_1 : '-',
      item.min_2025_2 !== '--' ? item.min_2025_2 : '-',
      item.min_2025_1 !== '--' ? item.min_2025_1 : '-'
    ]);

    doc.autoTable({
      startY: 24,
      head: [['#', 'OSYM Kodu', 'Il', 'Kurum / Hastane', 'Uzmanlik Bransi', 'Puan', '2026/2 Kont.', '2026/1 Taban', '2025/2 Taban', '2025/1 Taban']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [2, 132, 199],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 7.5,
        cellPadding: 2.5
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center', fontStyle: 'bold', textColor: [2, 132, 199] },
        1: { cellWidth: 22, fontStyle: 'bold' },
        2: { cellWidth: 20 },
        3: { cellWidth: 85 },
        4: { cellWidth: 55, fontStyle: 'bold' },
        5: { cellWidth: 14, halign: 'center' },
        6: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
        7: { cellWidth: 24, halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] },
        8: { cellWidth: 22, halign: 'right' },
        9: { cellWidth: 22, halign: 'right' }
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Sayfa ${data.pageNumber} / ${pageCount}   |   tercihrobutu.github.io`,
          148, 207, { align: 'center' }
        );
      }
    });

    doc.save('TUS_2026_2_Donem_Tercih_Listem.pdf');
  } catch (err) {
    console.error('PDF export error:', err);
    alert('PDF oluşturulurken bir hata oluştu: ' + err.message);
  }
}

// ============================================================
// SHARE & COPY FUNCTIONS
// ============================================================
function shareSiteWhatsApp() {
  const text = `🩺 2026 TUS 2. Dönem Tercih Robotu: ÖSYM resmi kontenjanları (2.941 kadro, 8.637 kontenjan, 42 branş) ve son 3 dönemin resmi taban puanları ışık hızında ve reklamsız burada:\n\n👉 https://tercihrobutu.github.io/tus.html`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function copySiteLink() {
  const url = 'https://tercihrobutu.github.io/tus.html';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      if (btnCopyLink) {
        const orig = btnCopyLink.innerHTML;
        btnCopyLink.innerHTML = '✓ Kopyalandı!';
        btnCopyLink.style.color = '#10b981';
        btnCopyLink.style.borderColor = '#10b981';
        setTimeout(() => {
          btnCopyLink.innerHTML = orig;
          btnCopyLink.style.color = '';
          btnCopyLink.style.borderColor = '';
        }, 2200);
      }
    });
  } else {
    prompt('Sayfa bağlantısı:', url);
  }
}

function shareFavsWhatsApp() {
  if (!favorites || favorites.length === 0) {
    alert('Lütfen önce tercih listenize en az bir uzmanlık programı ekleyiniz.');
    return;
  }

  let text = `🩺 2026 TUS 2. Dönem Tercih Listem (${favorites.length} Program):\n\n`;
  favorites.forEach((fav, i) => {
    const score = fav.min_2026_1 && fav.min_2026_1 !== '--' ? `(26/1 Taban: ${fav.min_2026_1})` : '';
    text += `${i + 1}. ${fav.code} - ${fav.kurum} | ${fav.brans} [${fav.city}] ${score}\n`;
  });
  text += `\n🔗 Tercih Robotu: https://tercihrobutu.github.io/tus.html`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

