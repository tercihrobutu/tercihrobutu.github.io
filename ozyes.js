// ============================================================
// 2026 ÖZYES (Spor Bilimleri Özel Yetenek Sınavı) Tercih Robotu Engine
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
const programsData = window.DATA_OZYES_PROGRAMS || [];
const conditionsData = window.DATA_OZYES_CONDITIONS || {};

let selectedCities = [];
let currentCategory = 'tum'; // 'tum' | 'erkek' | 'kadin' | 'milli' | 'engelli'
let currentPage = 1;
const itemsPerPage = 50;
let favorites = JSON.parse(localStorage.getItem('ozyes_tercih_favs') || '[]');

// DOM Elements
const searchInput = document.getElementById('searchInput');
const filterUnivType = document.getElementById('filterUnivType');
const filterProgramType = document.getElementById('filterProgramType');
const filterAkreditasyon = document.getElementById('filterAkreditasyon');
const filterStatus = document.getElementById('filterStatus');
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
const themeToggle = document.getElementById('themeToggle');

// Category tab buttons
const catTabs = document.querySelectorAll('.cat-tab-btn');

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  populateProgramOptions();
  populateCityFilter();
  updateFavBadge();
  setupEventListeners();
  setupMultiSelectEvents();
  checkURLParams();
  updateSortOptions();
  render();
});

// Category Switcher
function setCategory(cat) {
  currentCategory = cat;
  catTabs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  updateSortOptions();
  currentPage = 1;
  render();
}

function updateSortOptions() {
  const currentVal = sortBySelect.value;
  let optionsHtml = '';

  if (currentCategory === 'erkek') {
    optionsHtml = `
      <option value="min26_e_desc">2026 Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_e_asc">2026 Erkek Taban Puanı (Düşük -> Yüksek)</option>
      <option value="yer26_e_desc">2026 Erkek Yerleşen (Çoktan Aza)</option>
      <option value="bos26_tot_desc">2026 Boş Kontenjan (Çoktan Aza)</option>
      <option value="kont_e_desc">2026 Erkek Kontenjanı (Çoktan Aza)</option>
      <option value="puan_e_desc">2025 Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="sira_e_asc">2025 Erkek Başarı Sırası (En İyi -> Son)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  } else if (currentCategory === 'kadin') {
    optionsHtml = `
      <option value="min26_k_desc">2026 Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_k_asc">2026 Kadın Taban Puanı (Düşük -> Yüksek)</option>
      <option value="yer26_k_desc">2026 Kadın Yerleşen (Çoktan Aza)</option>
      <option value="bos26_tot_desc">2026 Boş Kontenjan (Çoktan Aza)</option>
      <option value="kont_k_desc">2026 Kadın Kontenjanı (Çoktan Aza)</option>
      <option value="puan_k_desc">2025 Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="sira_k_asc">2025 Kadın Başarı Sırası (En İyi -> Son)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  } else if (currentCategory === 'milli') {
    optionsHtml = `
      <option value="min26_milli_e_desc">2026 Millî Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_milli_k_desc">2026 Millî Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="yer26_tot_desc">2026 Toplam Yerleşen (Çoktan Aza)</option>
      <option value="kont_tot_desc">2026 Toplam Kontenjan (Çoktan Aza)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  } else if (currentCategory === 'engelli') {
    optionsHtml = `
      <option value="min26_eng_e_desc">2026 Engelli Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_eng_k_desc">2026 Engelli Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="yer26_tot_desc">2026 Toplam Yerleşen (Çoktan Aza)</option>
      <option value="kont_tot_desc">2026 Toplam Kontenjan (Çoktan Aza)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  } else {
    // 'tum'
    optionsHtml = `
      <option value="min26_e_desc">2026 Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_k_desc">2026 Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="yer26_tot_desc">2026 Toplam Yerleşen (Çoktan Aza)</option>
      <option value="bos26_tot_desc">2026 Boş Kontenjan (Çoktan Aza)</option>
      <option value="kont_tot_desc">2026 Toplam Kontenjan (Çoktan Aza)</option>
      <option value="puan_e_desc">2025 Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="puan_k_desc">2025 Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  }

  sortBySelect.innerHTML = optionsHtml;
  // Retain selection if available in new options
  if (Array.from(sortBySelect.options).some(o => o.value === currentVal)) {
    sortBySelect.value = currentVal;
  }
}

// Populate Program options
function populateProgramOptions() {
  const progs = Array.from(new Set(programsData.map(p => {
    let name = p.prog;
    name = name.replace(/\(%50 İndirimli\)/g, '')
               .replace(/\(Burslu\)/g, '')
               .replace(/\(Ücretli\)/g, '')
               .replace(/\(%25 İndirimli\)/g, '')
               .trim();
    return name;
  }))).sort((a, b) => a.localeCompare(b, 'tr'));

  progs.forEach(prog => {
    const opt = document.createElement('option');
    opt.value = prog;
    opt.textContent = prog;
    filterProgramType.appendChild(opt);
  });
}

// Multi-select City Filter
function populateCityFilter() {
  const cities = Array.from(new Set(programsData.map(p => p.city).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'tr'));
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

function updateCityMultiLabel() {
  if (selectedCities.length === 0) {
    cityMultiLabel.textContent = 'Tüm Şehirler';
  } else if (selectedCities.length <= 2) {
    cityMultiLabel.textContent = selectedCities.join(', ');
  } else {
    cityMultiLabel.textContent = `${selectedCities.length} İl Seçildi`;
  }
}

function setupMultiSelectEvents() {
  cityMultiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cityDropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!document.getElementById('cityMultiContainer').contains(e.target)) {
      cityDropdown.classList.remove('active');
    }
  });

  cityOptionsList.addEventListener('change', (e) => {
    if (e.target.tagName === 'INPUT') {
      const city = e.target.value;
      if (e.target.checked) {
        if (!selectedCities.includes(city)) selectedCities.push(city);
      } else {
        selectedCities = selectedCities.filter(c => c !== city);
      }
      updateCityMultiLabel();
      currentPage = 1;
      render();
    }
  });

  btnClearCities.addEventListener('click', () => {
    selectedCities = [];
    cityOptionsList.querySelectorAll('input').forEach(i => i.checked = false);
    updateCityMultiLabel();
    currentPage = 1;
    render();
  });

  citySearchInput.addEventListener('input', () => {
    const q = turkishNormalize(citySearchInput.value);
    cityOptionsList.querySelectorAll('.multi-select-option').forEach(opt => {
      const text = turkishNormalize(opt.textContent);
      opt.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });
}

// Event Listeners
function setupEventListeners() {
  searchInput.addEventListener('input', () => { currentPage = 1; render(); });
  filterUnivType.addEventListener('change', () => { currentPage = 1; render(); });
  filterProgramType.addEventListener('change', () => { currentPage = 1; render(); });
  filterAkreditasyon.addEventListener('change', () => { currentPage = 1; render(); });
  if (filterStatus) filterStatus.addEventListener('change', () => { currentPage = 1; render(); });
  sortBySelect.addEventListener('change', () => { currentPage = 1; render(); });

  catTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.cat);
    });
  });

  btnResetFilters.addEventListener('click', () => {
    searchInput.value = '';
    filterUnivType.value = '';
    filterProgramType.value = '';
    filterAkreditasyon.value = '';
    if (filterStatus) filterStatus.value = '';
    selectedCities = [];
    cityOptionsList.querySelectorAll('input').forEach(i => i.checked = false);
    updateCityMultiLabel();
    setCategory('tum');
    sortBySelect.value = sortBySelect.options[0].value;
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      render();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      render();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  });

  btnOpenList.addEventListener('click', openFavModal);
  btnCloseModal.addEventListener('click', () => listModal.classList.remove('active'));
  listModal.addEventListener('click', (e) => {
    if (e.target === listModal) listModal.classList.remove('active');
  });

  btnCloseCondModal.addEventListener('click', () => condModal.classList.remove('active'));
  condModal.addEventListener('click', (e) => {
    if (e.target === condModal) condModal.classList.remove('active');
  });

  btnClearFavs.addEventListener('click', () => {
    if (confirm('Tercih listenizdeki tüm programlar temizlenecek. Onaylıyor musunuz?')) {
      favorites = [];
      saveFavs();
      updateFavBadge();
      renderFavModal();
      render();
    }
  });

  btnExportPDF.addEventListener('click', exportFavsPDF);
  btnExportXLSX.addEventListener('click', exportFavsExcel);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  if (themeToggle) themeToggle.textContent = saved === 'dark' ? '🌙' : '☀️';
}

// Filtering & Sorting
function getFilteredData() {
  const query = turkishNormalize(searchInput.value);
  const univType = filterUnivType.value;
  const progFilter = filterProgramType.value;
  const akred = filterAkreditasyon.value;
  const statusVal = filterStatus ? filterStatus.value : '';
  const sortBy = sortBySelect.value;

  let filtered = programsData.filter(item => {
    // 1. Text search
    if (query) {
      const targetStr = turkishNormalize(item.univ + ' ' + item.prog + ' ' + item.fac + ' ' + item.code);
      if (!targetStr.includes(query)) return false;
    }

    // 2. City
    if (selectedCities.length > 0 && !selectedCities.includes(item.city)) return false;

    // 3. Univ Type
    if (univType && item.univ_type !== univType) return false;

    // 4. Program Filter
    if (progFilter && !item.prog.includes(progFilter)) return false;

    // 5. Akreditasyon
    if (akred === 'SPORAK' && !item.akreditasyon) return false;
    if (akred === 'TYC' && !item.tyc) return false;

    // 6. Kontenjan Durumu
    if (statusVal === 'placed2026' && (item.yer_2026_toplam || 0) <= 0) return false;
    if (statusVal === 'full2026' && (item.bos_2026_toplam !== 0)) return false;
    if (statusVal === 'empty2026' && (item.bos_2026_toplam || 0) <= 0) return false;

    // 7. Category specific minimum filter (e.g. must have quota in selected category)
    if (currentCategory === 'erkek' && item.kont_genel_e <= 0) return false;
    if (currentCategory === 'kadin' && item.kont_genel_k <= 0) return false;
    if (currentCategory === 'milli' && (item.kont_milli_e + item.kont_milli_k) <= 0) return false;
    if (currentCategory === 'engelli' && (item.kont_engelli_e + item.kont_engelli_k) <= 0) return false;

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    // 2026 Yerleştirme Taban Puanları & Sıralamaları
    if (sortBy === 'min26_e_desc') return (b.min_2026_e_val || 0) - (a.min_2026_e_val || 0);
    if (sortBy === 'min26_e_asc') {
      const va = a.min_2026_e_val != null ? a.min_2026_e_val : 9999;
      const vb = b.min_2026_e_val != null ? b.min_2026_e_val : 9999;
      return va - vb;
    }
    if (sortBy === 'min26_k_desc') return (b.min_2026_k_val || 0) - (a.min_2026_k_val || 0);
    if (sortBy === 'min26_k_asc') {
      const va = a.min_2026_k_val != null ? a.min_2026_k_val : 9999;
      const vb = b.min_2026_k_val != null ? b.min_2026_k_val : 9999;
      return va - vb;
    }
    if (sortBy === 'yer26_e_desc') return (b.yer_2026_e || 0) - (a.yer_2026_e || 0);
    if (sortBy === 'yer26_k_desc') return (b.yer_2026_k || 0) - (a.yer_2026_k || 0);
    if (sortBy === 'yer26_tot_desc') return (b.yer_2026_toplam || 0) - (a.yer_2026_toplam || 0);
    if (sortBy === 'bos26_tot_desc') return (b.bos_2026_toplam || 0) - (a.bos_2026_toplam || 0);
    if (sortBy === 'min26_milli_e_desc') return (b.min_2026_milli_e_val || 0) - (a.min_2026_milli_e_val || 0);
    if (sortBy === 'min26_milli_k_desc') return (b.min_2026_milli_k_val || 0) - (a.min_2026_milli_k_val || 0);
    if (sortBy === 'min26_eng_e_desc') return (b.min_2026_eng_e_val || 0) - (a.min_2026_eng_e_val || 0);
    if (sortBy === 'min26_eng_k_desc') return (b.min_2026_eng_k_val || 0) - (a.min_2026_eng_k_val || 0);

    // 2025 Taban Puanları
    if (sortBy === 'puan_e_desc') return (b.puan_2025_e_val || 0) - (a.puan_2025_e_val || 0);
    if (sortBy === 'puan_e_asc') {
      const va = a.puan_2025_e_val || 9999;
      const vb = b.puan_2025_e_val || 9999;
      return va - vb;
    }
    if (sortBy === 'sira_e_asc') {
      const sa = a.sira_2025_e_val || 9999999;
      const sb = b.sira_2025_e_val || 9999999;
      return sa - sb;
    }
    if (sortBy === 'kont_e_desc') return (b.kont_genel_e || 0) - (a.kont_genel_e || 0);

    if (sortBy === 'puan_k_desc') return (b.puan_2025_k_val || 0) - (a.puan_2025_k_val || 0);
    if (sortBy === 'puan_k_asc') {
      const va = a.puan_2025_k_val || 9999;
      const vb = b.puan_2025_k_val || 9999;
      return va - vb;
    }
    if (sortBy === 'sira_k_asc') {
      const sa = a.sira_2025_k_val || 9999999;
      const sb = b.sira_2025_k_val || 9999999;
      return sa - sb;
    }
    if (sortBy === 'kont_k_desc') return (b.kont_genel_k || 0) - (a.kont_genel_k || 0);

    // Genel
    if (sortBy === 'kont_tot_desc') return (b.kont_toplam || 0) - (a.kont_toplam || 0);
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
    `<span class="cond-badge" onclick="showConditions('${safeCodesStr}', '${safeProgName}')" title="Bk. ${code}">${code}</span>`
  ).join('');
}

// Render Main Table
function render() {
  const filtered = getFilteredData();
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;

  filteredCountEl.textContent = totalItems.toLocaleString('tr-TR');
  pageInfoEl.textContent = `Sayfa ${currentPage} / ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Update Dynamic Table Header based on Category
  updateTableHeaders();

  tableBody.innerHTML = '';
  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:40px; color:var(--text-muted);">Aramanıza uygun ÖZYES programı bulunamadı.</td></tr>`;
    return;
  }

  pageItems.forEach(item => {
    const isFav = favorites.some(f => f.code === item.code);
    const tr = document.createElement('tr');

    const badgeUnivClass = item.univ_type.includes('Vakıf') ? 'badge-vakif' : (item.univ_type.includes('KKTC') ? 'badge-kktc' : 'badge-devlet');
    const condBadges = buildCondBadges(item.kosul, item.prog);

    // Accreditation tag
    let akredTag = '';
    if (item.akreditasyon) {
      akredTag = `<span class="badge" style="background:rgba(16,185,129,0.15); color:#10b981; font-size:0.7rem; padding:1px 6px;">${item.akreditasyon}</span>`;
    }
    if (item.tyc) {
      akredTag += `<span class="badge" style="background:rgba(59,130,246,0.15); color:#60a5fa; font-size:0.7rem; padding:1px 6px; margin-left:3px;">TYÇ</span>`;
    }

    let qE, qK, pE, sE, pK, sK;

    let qCellHtml = '';
    let scoreCol1Html = '';
    let scoreCol2Html = '';

    if (currentCategory === 'erkek') {
      qCellHtml = `
        <span class="badge-kont" style="background:rgba(59,130,246,0.18); color:#60a5fa; font-weight:800; font-size:0.85rem; padding:3px 7px;">${item.kont_genel_e} Kont.</span>
        <div style="font-size:0.75rem; margin-top:3px; font-weight:700; color:#10b981;">${item.yer_2026_e || 0} Yerleşen</div>
      `;
      scoreCol1Html = `
        <div style="font-weight:700; color:#60a5fa; font-size:0.88rem;">${item.min_2026_e && item.min_2026_e !== '--' ? item.min_2026_e : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">
          ${item.max_2026_e && item.max_2026_e !== '--' ? `Tavan: ${item.max_2026_e}` : '—'}
        </div>
      `;
      scoreCol2Html = `
        <div style="font-weight:600; color:var(--text-primary); font-size:0.85rem;">${item.puan_2025_e && item.puan_2025_e !== '--' ? item.puan_2025_e : '<span style="color:var(--text-muted);">—</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${item.sira_2025_e && item.sira_2025_e !== '--' ? `Sıra: ${item.sira_2025_e}` : '—'}</div>
      `;
    } else if (currentCategory === 'kadin') {
      qCellHtml = `
        <span class="badge-kont" style="background:rgba(236,72,153,0.18); color:#f472b6; font-weight:800; font-size:0.85rem; padding:3px 7px;">${item.kont_genel_k} Kont.</span>
        <div style="font-size:0.75rem; margin-top:3px; font-weight:700; color:#10b981;">${item.yer_2026_k || 0} Yerleşen</div>
      `;
      scoreCol1Html = `
        <div style="font-weight:700; color:#f472b6; font-size:0.88rem;">${item.min_2026_k && item.min_2026_k !== '--' ? item.min_2026_k : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">
          ${item.max_2026_k && item.max_2026_k !== '--' ? `Tavan: ${item.max_2026_k}` : '—'}
        </div>
      `;
      scoreCol2Html = `
        <div style="font-weight:600; color:var(--text-primary); font-size:0.85rem;">${item.puan_2025_k && item.puan_2025_k !== '--' ? item.puan_2025_k : '<span style="color:var(--text-muted);">—</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${item.sira_2025_k && item.sira_2025_k !== '--' ? `Sıra: ${item.sira_2025_k}` : '—'}</div>
      `;
    } else if (currentCategory === 'milli') {
      qCellHtml = `
        <div style="font-size:0.8rem; font-weight:700; color:#60a5fa;">♂ ${item.kont_milli_e} (Yer: ${item.yer_2026_milli_e || 0})</div>
        <div style="font-size:0.8rem; font-weight:700; color:#f472b6; margin-top:2px;">♀ ${item.kont_milli_k} (Yer: ${item.yer_2026_milli_k || 0})</div>
      `;
      scoreCol1Html = `
        <div style="font-weight:700; color:#60a5fa; font-size:0.88rem;">${item.min_2026_milli_e && item.min_2026_milli_e !== '--' ? item.min_2026_milli_e : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${item.puan_2025_milli_e && item.puan_2025_milli_e !== '--' ? `25: ${item.puan_2025_milli_e}` : '—'}</div>
      `;
      scoreCol2Html = `
        <div style="font-weight:700; color:#f472b6; font-size:0.88rem;">${item.min_2026_milli_k && item.min_2026_milli_k !== '--' ? item.min_2026_milli_k : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${item.puan_2025_milli_k && item.puan_2025_milli_k !== '--' ? `25: ${item.puan_2025_milli_k}` : '—'}</div>
      `;
    } else if (currentCategory === 'engelli') {
      qCellHtml = `
        <div style="font-size:0.8rem; font-weight:700; color:#60a5fa;">♂ ${item.kont_engelli_e} (Yer: ${item.yer_2026_eng_e || 0})</div>
        <div style="font-size:0.8rem; font-weight:700; color:#f472b6; margin-top:2px;">♀ ${item.kont_engelli_k} (Yer: ${item.yer_2026_eng_k || 0})</div>
      `;
      scoreCol1Html = `
        <div style="font-weight:700; color:#60a5fa; font-size:0.88rem;">${item.min_2026_eng_e && item.min_2026_eng_e !== '--' ? item.min_2026_eng_e : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${item.puan_2025_eng_e && item.puan_2025_eng_e !== '--' ? `25: ${item.puan_2025_eng_e}` : '—'}</div>
      `;
      scoreCol2Html = `
        <div style="font-weight:700; color:#f472b6; font-size:0.88rem;">${item.min_2026_eng_k && item.min_2026_eng_k !== '--' ? item.min_2026_eng_k : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${item.puan_2025_eng_k && item.puan_2025_eng_k !== '--' ? `25: ${item.puan_2025_eng_k}` : '—'}</div>
      `;
    } else {
      // 'tum' (Tüm Kontenjanlar)
      qCellHtml = `
        <div style="font-weight:800; font-size:0.85rem; color:var(--text-primary);">${item.kont_2026_toplam} Kont.</div>
        <div style="font-size:0.75rem; margin-top:2px;">
          <span style="color:#10b981; font-weight:700;">${item.yer_2026_toplam} Yer.</span>
          ${item.bos_2026_toplam > 0 ? `<span style="color:#ef4444; font-weight:700; margin-left:3px;">(${item.bos_2026_toplam} Boş)</span>` : `<span style="color:#10b981; font-weight:700; margin-left:3px;">(Doldu)</span>`}
        </div>
      `;
      scoreCol1Html = `
        <div style="font-weight:700; color:#60a5fa; font-size:0.88rem;">${item.min_2026_e && item.min_2026_e !== '--' ? item.min_2026_e : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">
          ${item.max_2026_e && item.max_2026_e !== '--' ? `Tavan: ${item.max_2026_e}` : ''}
          ${item.puan_2025_e && item.puan_2025_e !== '--' ? ` <span style="color:var(--text-muted);">(25: ${item.puan_2025_e})</span>` : ''}
        </div>
      `;
      scoreCol2Html = `
        <div style="font-weight:700; color:#f472b6; font-size:0.88rem;">${item.min_2026_k && item.min_2026_k !== '--' ? item.min_2026_k : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">
          ${item.max_2026_k && item.max_2026_k !== '--' ? `Tavan: ${item.max_2026_k}` : ''}
          ${item.puan_2025_k && item.puan_2025_k !== '--' ? ` <span style="color:var(--text-muted);">(25: ${item.puan_2025_k})</span>` : ''}
        </div>
      `;
    }

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
        <div style="margin-top:3px;">${akredTag}</div>
      </td>
      <td style="text-align:center;">${qCellHtml}</td>
      <td style="text-align:center;">${condBadges}</td>
      <td style="text-align:right;">${scoreCol1Html}</td>
      <td style="text-align:right;">${scoreCol2Html}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function updateTableHeaders() {
  const theadEl = document.querySelector('#mainTable thead');
  if (!theadEl) return;

  if (currentCategory === 'erkek') {
    theadEl.innerHTML = `
      <tr>
        <th style="width:30px;">⭐</th>
        <th style="width:75px;">ÖSYM Kodu</th>
        <th class="col-city" style="width:70px;">İl</th>
        <th>Üniversite / Fakülte</th>
        <th>Program Adı</th>
        <th style="text-align:center; width:85px; color:#60a5fa;" title="2026 Erkek Kontenjanı ve Yerleşen Sayısı">♂ Kont. / Yer.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:115px; color:#60a5fa;" title="2026 Yerleştirme Taban & Tavan Puanı">2026 Erkek Taban (Tavan)</th>
        <th style="text-align:right; width:95px; color:var(--text-secondary);" title="2025 Yerleştirme Taban Puanı ve Sırası">2025 Erkek Taban</th>
      </tr>
    `;
  } else if (currentCategory === 'kadin') {
    theadEl.innerHTML = `
      <tr>
        <th style="width:30px;">⭐</th>
        <th style="width:75px;">ÖSYM Kodu</th>
        <th class="col-city" style="width:70px;">İl</th>
        <th>Üniversite / Fakülte</th>
        <th>Program Adı</th>
        <th style="text-align:center; width:85px; color:#f472b6;" title="2026 Kadın Kontenjanı ve Yerleşen Sayısı">♀ Kont. / Yer.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:115px; color:#f472b6;" title="2026 Yerleştirme Taban & Tavan Puanı">2026 Kadın Taban (Tavan)</th>
        <th style="text-align:right; width:95px; color:var(--text-secondary);" title="2025 Yerleştirme Taban Puanı ve Sırası">2025 Kadın Taban</th>
      </tr>
    `;
  } else if (currentCategory === 'milli') {
    theadEl.innerHTML = `
      <tr>
        <th style="width:30px;">⭐</th>
        <th style="width:75px;">ÖSYM Kodu</th>
        <th class="col-city" style="width:70px;">İl</th>
        <th>Üniversite / Fakülte</th>
        <th>Program Adı</th>
        <th style="text-align:center; width:95px;" title="Millî Sporcu Kontenjan ve Yerleşen">Millî Kont. / Yer.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:110px; color:#60a5fa;" title="2026 Millî Erkek Taban Puanı">♂ 2026 Millî Erkek</th>
        <th style="text-align:right; width:110px; color:#f472b6;" title="2026 Millî Kadın Taban Puanı">♀ 2026 Millî Kadın</th>
      </tr>
    `;
  } else if (currentCategory === 'engelli') {
    theadEl.innerHTML = `
      <tr>
        <th style="width:30px;">⭐</th>
        <th style="width:75px;">ÖSYM Kodu</th>
        <th class="col-city" style="width:70px;">İl</th>
        <th>Üniversite / Fakülte</th>
        <th>Program Adı</th>
        <th style="text-align:center; width:95px;" title="Engelli Aday Kontenjan ve Yerleşen">Engelli Kont. / Yer.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:110px; color:#60a5fa;" title="2026 Engelli Erkek Taban Puanı">♂ 2026 Engelli Erkek</th>
        <th style="text-align:right; width:110px; color:#f472b6;" title="2026 Engelli Kadın Taban Puanı">♀ 2026 Engelli Kadın</th>
      </tr>
    `;
  } else {
    // 'tum'
    theadEl.innerHTML = `
      <tr>
        <th style="width:30px;">⭐</th>
        <th style="width:75px;">ÖSYM Kodu</th>
        <th class="col-city" style="width:70px;">İl</th>
        <th>Üniversite / Fakülte</th>
        <th>Program Adı</th>
        <th style="text-align:center; width:95px;" title="2026 Toplam Kontenjan, Yerleşen ve Boş">2026 Kont. / Yer.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:110px; color:#60a5fa;" title="2026 Erkek Yerleştirme Taban ve Tavan Puanı">♂ 2026 Erkek Taban</th>
        <th style="text-align:right; width:110px; color:#f472b6;" title="2026 Kadın Yerleştirme Taban ve Tavan Puanı">♀ 2026 Kadın Taban</th>
      </tr>
    `;
  }
}

// Special Condition Modal
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
      const desc = conditionsData[code] || `ÖSYM 2026-ÖZYES Kılavuzu Koşul ve Açıklamalar bölümünde yer alan Bk. ${code} numaralı özel şart geçerlidir.`;
      html += `
        <div style="display:flex; gap:14px; align-items:flex-start; padding:14px; border:1px solid var(--border-color); border-radius:10px; margin-bottom:12px; background:rgba(15,23,42,0.4);">
          <div style="min-width:54px; height:38px; background:var(--accent-gradient); border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; color:white; font-size:0.8rem; flex-shrink:0;">Bk. ${code}</div>
          <div style="color:var(--text-primary); font-size:0.9rem; line-height:1.6;">${desc}</div>
        </div>`;
    });
  }

  condModalBody.innerHTML = html;
  condModal.classList.add('active');
}

// Favorites Management
function toggleFav(code) {
  const item = programsData.find(p => p.code === code);
  if (!item) return;

  const idx = favorites.findIndex(f => f.code === code);
  if (idx > -1) {
    favorites.splice(idx, 1);
  } else {
    if (favorites.length >= 30) {
      alert('ÖSYM kılavuzuna göre en fazla 30 tercih hakkınız bulunmaktadır.');
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
  localStorage.setItem('ozyes_tercih_favs', JSON.stringify(favorites));
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
      <td style="text-align:center; font-weight:600;">
        ${item.kont_2026_toplam || item.kont_toplam} / <span style="color:#10b981;">${item.yer_2026_toplam || 0}</span>
      </td>
      <td style="text-align:right; font-weight:700; color:#60a5fa;">${item.min_2026_e || item.puan_2025_e || '--'}</td>
      <td style="text-align:right; font-weight:700; color:#f472b6;">${item.min_2026_k || item.puan_2025_k || '--'}</td>
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
  doc.setTextColor(16, 185, 129);
  doc.text('2026 OZYES SPOR BILIMLERI TERCIH & SONUC LISTEM', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`tercihrobutu.github.io  |  ${new Date().toLocaleDateString('tr-TR')}  |  Toplam: ${favorites.length}/30 Program`, 14, 22);

  const head = [['Sira', 'OSYM Kodu', 'Universite', 'Program', 'Il', 'Kont/Yer', '26 E.Taban', '26 K.Taban', '25 E.Taban', '25 K.Taban']];
  const body = favorites.map((item, idx) => [
    idx + 1,
    item.code,
    toAscii(item.univ),
    toAscii(item.prog),
    toAscii(item.city),
    `${item.kont_2026_toplam || item.kont_toplam}/${item.yer_2026_toplam || 0}`,
    item.min_2026_e || '--',
    item.min_2026_k || '--',
    item.puan_2025_e || '--',
    item.puan_2025_k || '--'
  ]);

  doc.autoTable({
    startY: 26,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 24, halign: 'center' },
      2: { cellWidth: 60 },
      3: { cellWidth: 55 },
      4: { cellWidth: 24 },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 24, halign: 'right' },
      7: { cellWidth: 24, halign: 'right' },
      8: { cellWidth: 22, halign: 'right' },
      9: { cellWidth: 22, halign: 'right' }
    }
  });

  doc.save('2026_OZYES_Tercih_Listem.pdf');
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
    'Program': item.prog,
    'Şehir': item.city,
    'Üniversite Türü': item.univ_type,
    '2026 Toplam Kontenjan': item.kont_2026_toplam || item.kont_toplam,
    '2026 Toplam Yerleşen': item.yer_2026_toplam || 0,
    '2026 Boş Kontenjan': item.bos_2026_toplam || 0,
    '2026 Erkek Taban Puanı': item.min_2026_e || '--',
    '2026 Erkek Tavan Puanı': item.max_2026_e || '--',
    '2026 Kadın Taban Puanı': item.min_2026_k || '--',
    '2026 Kadın Tavan Puanı': item.max_2026_k || '--',
    '2025 Erkek Taban Puanı': item.puan_2025_e || '--',
    '2025 Kadın Taban Puanı': item.puan_2025_k || '--',
    'Akreditasyon': item.akreditasyon || '',
    'TYÇ': item.tyc || '',
    'Özel Koşullar': item.kosul || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ÖZYES Tercihlerim');
  XLSX.writeFile(workbook, '2026_OZYES_Tercih_Listem.xlsx');
}

// URL Parameters
function checkURLParams() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) searchInput.value = decodeURIComponent(q);

  const sehir = params.get('sehir');
  if (sehir) {
    selectedCities = decodeURIComponent(sehir).split(',').filter(Boolean);
    updateCityMultiLabel();
  }

  const cat = params.get('kategori') || params.get('cinsiyet');
  if (cat && ['erkek', 'kadin', 'milli', 'engelli', 'tum'].includes(cat)) {
    setCategory(cat);
  }
}
