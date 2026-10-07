// ============================================================
// 2026 Teknik Öğretmenler İçin Mühendislik Tamamlama Tercih Robotu Engine
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
const programsData = window.DATA_MUHENDISLIK_PROGRAMS || [];
const mezuniyetData = window.DATA_MUHENDISLIK_MEZUNIYET || [];
const conditionsData = window.DATA_MUHENDISLIK_CONDITIONS || {};

let selectedMezuniyet = '';
let selectedDiscipline = '';
let selectedCities = [];
let selectedUniv = '';
let selectedStatus = '';
let searchQuery = '';
let sortBy = 'min26_desc';
let currentPage = 1;
const itemsPerPage = 50;
let favorites = JSON.parse(localStorage.getItem('muhendislik_favs') || '[]');

// DOM Elements
const searchInput = document.getElementById('searchInput');
const filterMezuniyet = document.getElementById('filterMezuniyet');
const filterDiscipline = document.getElementById('filterDiscipline');
const filterUniv = document.getElementById('filterUniv');
const filterStatus = document.getElementById('filterStatus');
const sortBySelect = document.getElementById('sortBy');
const btnResetFilters = document.getElementById('btnResetFilters');
const filteredCountEl = document.getElementById('filteredCount');
const mezuniyetInfoBanner = document.getElementById('mezuniyetInfoBanner');

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
const btnExportExcel = document.getElementById('btnExportExcel');
const btnExportCSV = document.getElementById('btnExportCSV');
const btnPrintList = document.getElementById('btnPrintList');

const condModal = document.getElementById('condModal');
const btnCloseCondModal = document.getElementById('btnCloseCondModal');
const btnCloseCondModalBtn = document.getElementById('btnCloseCondModalBtn');
const condModalTitle = document.getElementById('condModalTitle');
const condModalBody = document.getElementById('condModalBody');
const themeToggle = document.getElementById('themeToggle');

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  populateMezuniyetFilter();
  populateDisciplineFilter();
  populateUnivFilter();
  populateCityFilter();
  updateFavBadge();
  setupEventListeners();
  setupMultiSelectEvents();
  setupFaqAccordion();
  checkURLParams();
  render();
});

// Theme Initialization
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const target = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem('theme', target);
      updateThemeIcon(target);
    });
  }
}

function updateThemeIcon(theme) {
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Populate Mezuniyet Dropdown (Tablo-2)
function populateMezuniyetFilter() {
  if (!filterMezuniyet) return;
  filterMezuniyet.innerHTML = '<option value="">Tüm Mezuniyetler (Filtresiz)</option>';

  const sortedMezuniyet = [...mezuniyetData].sort((a, b) => 
    a.mezuniyet_adi.localeCompare(b.mezuniyet_adi, 'tr')
  );

  sortedMezuniyet.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.mezuniyet_kodu;
    opt.textContent = `${m.mezuniyet_adi} (Kod: ${m.mezuniyet_kodu})`;
    filterMezuniyet.appendChild(opt);
  });
}

// Populate Discipline Dropdown
function populateDisciplineFilter(allowedDisciplines = null) {
  if (!filterDiscipline) return;
  const prevVal = filterDiscipline.value;
  filterDiscipline.innerHTML = '<option value="">Tüm Mühendislik Branşları</option>';

  let disciplines = [];
  if (allowedDisciplines && allowedDisciplines.length > 0) {
    disciplines = [...new Set(allowedDisciplines)].sort((a, b) => a.localeCompare(b, 'tr'));
  } else {
    disciplines = [...new Set(programsData.map(p => p.prog))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'tr'));
  }

  disciplines.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    filterDiscipline.appendChild(opt);
  });

  if (disciplines.includes(prevVal)) {
    filterDiscipline.value = prevVal;
  } else {
    selectedDiscipline = '';
    filterDiscipline.value = '';
  }
}

// Populate Universities Dropdown
function populateUnivFilter() {
  if (!filterUniv) return;
  const unis = [...new Set(programsData.map(p => p.univ))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'tr'));
  unis.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u;
    opt.textContent = u;
    filterUniv.appendChild(opt);
  });
}

// Populate City Multi-Select
function populateCityFilter() {
  if (!cityOptionsList) return;
  cityOptionsList.innerHTML = '';

  const cities = [...new Set(programsData.map(p => p.city))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'tr'));

  cities.forEach(c => {
    const label = document.createElement('label');
    label.className = 'multi-select-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = c;
    checkbox.checked = selectedCities.includes(c);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        if (!selectedCities.includes(c)) selectedCities.push(c);
      } else {
        selectedCities = selectedCities.filter(x => x !== c);
      }
      updateCityLabel();
      currentPage = 1;
      render();
    });

    const span = document.createElement('span');
    span.textContent = c;

    label.appendChild(checkbox);
    label.appendChild(span);
    cityOptionsList.appendChild(label);
  });
}

function updateCityLabel() {
  if (!cityMultiLabel) return;
  if (selectedCities.length === 0) {
    cityMultiLabel.textContent = 'Tüm Şehirler';
  } else if (selectedCities.length === 1) {
    cityMultiLabel.textContent = selectedCities[0];
  } else {
    cityMultiLabel.textContent = `${selectedCities.length} Şehir Seçili`;
  }
}

function setupMultiSelectEvents() {
  if (!cityMultiBtn || !cityDropdown) return;

  cityMultiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cityDropdown.classList.toggle('show');
    if (cityDropdown.classList.contains('show') && citySearchInput) {
      citySearchInput.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!cityDropdown.contains(e.target) && !cityMultiBtn.contains(e.target)) {
      cityDropdown.classList.remove('show');
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

// Check URL query parameters (e.g. ?mezuniyet=3125 or ?q=Gazi)
function checkURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  const mParam = urlParams.get('mezuniyet');
  const dParam = urlParams.get('brans');

  if (qParam && searchInput) {
    searchInput.value = qParam;
    searchQuery = qParam;
  }
  if (mParam && filterMezuniyet) {
    filterMezuniyet.value = mParam;
    onMezuniyetChange(mParam);
  }
  if (dParam && filterDiscipline) {
    filterDiscipline.value = dParam;
    selectedDiscipline = dParam;
  }
}

// Event Listeners Setup
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      currentPage = 1;
      render();
    });
  }

  if (filterMezuniyet) {
    filterMezuniyet.addEventListener('change', (e) => {
      onMezuniyetChange(e.target.value);
    });
  }

  if (filterDiscipline) {
    filterDiscipline.addEventListener('change', (e) => {
      selectedDiscipline = e.target.value;
      currentPage = 1;
      render();
    });
  }

  if (filterUniv) {
    filterUniv.addEventListener('change', (e) => {
      selectedUniv = e.target.value;
      currentPage = 1;
      render();
    });
  }

  if (filterStatus) {
    filterStatus.addEventListener('change', (e) => {
      selectedStatus = e.target.value;
      currentPage = 1;
      render();
    });
  }

  if (sortBySelect) {
    sortBySelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      currentPage = 1;
      render();
    });
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', resetAllFilters);
  }

  // Pagination
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        render();
        scrollToTable();
      }
    });
  }
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      render();
      scrollToTable();
    });
  }

  // Modals
  if (btnOpenList) btnOpenList.addEventListener('click', openFavoritesModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeFavoritesModal);
  if (listModal) {
    listModal.addEventListener('click', (e) => {
      if (e.target === listModal) closeFavoritesModal();
    });
  }

  if (btnClearFavs) btnClearFavs.addEventListener('click', clearAllFavorites);
  if (btnExportExcel) btnExportExcel.addEventListener('click', exportToExcel);
  if (btnExportCSV) btnExportCSV.addEventListener('click', exportToCSV);
  if (btnPrintList) btnPrintList.addEventListener('click', () => window.print());

  // Condition Modal
  if (btnCloseCondModal) btnCloseCondModal.addEventListener('click', closeConditionModal);
  if (btnCloseCondModalBtn) btnCloseCondModalBtn.addEventListener('click', closeConditionModal);
  if (condModal) {
    condModal.addEventListener('click', (e) => {
      if (e.target === condModal) closeConditionModal();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFavoritesModal();
      closeConditionModal();
    }
  });
}

function onMezuniyetChange(mezuniyetKodu) {
  selectedMezuniyet = mezuniyetKodu;
  currentPage = 1;

  if (!mezuniyetKodu) {
    if (mezuniyetInfoBanner) mezuniyetInfoBanner.style.display = 'none';
    populateDisciplineFilter();
  } else {
    const rule = mezuniyetData.find(m => m.mezuniyet_kodu === mezuniyetKodu);
    if (rule && mezuniyetInfoBanner) {
      mezuniyetInfoBanner.style.display = 'block';
      mezuniyetInfoBanner.innerHTML = `
        <strong>🎓 ${rule.mezuniyet_adi} (Kod: ${rule.mezuniyet_kodu})</strong> mezunları Tablo-2 uyarınca şu lisans tamamlama programlarını tercih edebilir:
        <span style="font-weight:700; color:var(--accent-primary); margin-left:4px;">
          ${rule.lisans_programlari.join(', ')}
        </span> (Lisans Alan Kodları: ${rule.lisans_kodlari.join(', ')})
      `;
      populateDisciplineFilter(rule.lisans_programlari);
    }
  }

  render();
}

function resetAllFilters() {
  selectedMezuniyet = '';
  selectedDiscipline = '';
  selectedCities = [];
  selectedUniv = '';
  selectedStatus = '';
  searchQuery = '';
  sortBy = 'min26_desc';
  currentPage = 1;

  if (searchInput) searchInput.value = '';
  if (filterMezuniyet) filterMezuniyet.value = '';
  if (filterDiscipline) filterDiscipline.value = '';
  if (filterUniv) filterUniv.value = '';
  if (filterStatus) filterStatus.value = '';
  if (sortBySelect) sortBySelect.value = 'min26_desc';
  if (mezuniyetInfoBanner) mezuniyetInfoBanner.style.display = 'none';

  populateDisciplineFilter();

  const checkboxes = cityOptionsList ? cityOptionsList.querySelectorAll('input[type="checkbox"]') : [];
  checkboxes.forEach(cb => cb.checked = false);
  updateCityLabel();

  render();
}

function scrollToTable() {
  const table = document.getElementById('mainTable');
  if (table) {
    table.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============================================================
// FILTER & SORT ENGINE
// ============================================================
function getFilteredAndSortedData() {
  let rule = null;
  if (selectedMezuniyet) {
    rule = mezuniyetData.find(m => m.mezuniyet_kodu === selectedMezuniyet);
  }

  const q = turkishNormalize(searchQuery);

  const filtered = programsData.filter(p => {
    // 1. Mezuniyet filter (Tablo-2 Lisans Alan Kodu match)
    if (rule && rule.lisans_kodlari) {
      if (!rule.lisans_kodlari.includes(p.lisans_kodu)) {
        return false;
      }
    }

    // 2. Discipline filter
    if (selectedDiscipline && p.prog !== selectedDiscipline) {
      return false;
    }

    // 3. University filter
    if (selectedUniv && p.univ !== selectedUniv) {
      return false;
    }

    // 4. City filter
    if (selectedCities.length > 0 && !selectedCities.includes(p.city)) {
      return false;
    }

    // 5. Status filter
    if (selectedStatus === 'placed2026' && !(p.has_2026 && p.yer_2026 > 0)) {
      return false;
    }
    if (selectedStatus === 'empty2026' && !(p.has_2026 && p.bos_2026 > 0)) {
      return false;
    }
    if (selectedStatus === 'empty2025' && !(p.has_2025 && p.bos_2025 > 0)) {
      return false;
    }
    if (selectedStatus === 'placed2025' && !(p.has_2025 && p.yer_2025 > 0)) {
      return false;
    }

    // 6. Search query
    if (q) {
      const matchText = turkishNormalize(`${p.code} ${p.univ} ${p.fac} ${p.prog} ${p.city} ${p.lisans_kodu}`);
      if (!matchText.includes(q)) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'min26_desc':
        if (a.min_2026_val === null && b.min_2026_val === null) return (b.yer_2026 || 0) - (a.yer_2026 || 0);
        if (a.min_2026_val === null) return 1;
        if (b.min_2026_val === null) return -1;
        return b.min_2026_val - a.min_2026_val;
      case 'min26_asc':
        if (a.min_2026_val === null && b.min_2026_val === null) return (b.yer_2026 || 0) - (a.yer_2026 || 0);
        if (a.min_2026_val === null) return 1;
        if (b.min_2026_val === null) return -1;
        return a.min_2026_val - b.min_2026_val;
      case 'yer26_desc':
        return (b.yer_2026 || 0) - (a.yer_2026 || 0);
      case 'kont_desc':
        return b.kont_2026 - a.kont_2026;
      case 'kont_asc':
        return a.kont_2026 - b.kont_2026;
      case 'min25_desc':
        if (a.min_2025_val === null && b.min_2025_val === null) return 0;
        if (a.min_2025_val === null) return 1;
        if (b.min_2025_val === null) return -1;
        return b.min_2025_val - a.min_2025_val;
      case 'min25_asc':
        if (a.min_2025_val === null && b.min_2025_val === null) return 0;
        if (a.min_2025_val === null) return 1;
        if (b.min_2025_val === null) return -1;
        return a.min_2025_val - b.min_2025_val;
      case 'min24_desc':
        if (a.min_2024_val === null && b.min_2024_val === null) return 0;
        if (a.min_2024_val === null) return 1;
        if (b.min_2024_val === null) return -1;
        return b.min_2024_val - a.min_2024_val;
      case 'min24_asc':
        if (a.min_2024_val === null && b.min_2024_val === null) return 0;
        if (a.min_2024_val === null) return 1;
        if (b.min_2024_val === null) return -1;
        return a.min_2024_val - b.min_2024_val;
      case 'univ_asc':
        return a.univ.localeCompare(b.univ, 'tr');
      case 'prog_asc':
        return a.prog.localeCompare(b.prog, 'tr');
      default:
        return b.kont_2026 - a.kont_2026;
    }
  });

  return filtered;
}

// ============================================================
// RENDER TABLE
// ============================================================
function render() {
  const data = getFilteredAndSortedData();

  if (filteredCountEl) {
    filteredCountEl.textContent = data.length.toLocaleString('tr-TR');
  }

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = data.slice(startIdx, startIdx + itemsPerPage);

  if (pageInfoEl) {
    pageInfoEl.textContent = `Sayfa ${currentPage} / ${totalPages}`;
  }
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;

  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (pageData.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align:center; padding:40px; color:var(--text-muted);">
          🔍 Arama kriterlerinize uygun mühendislik programı bulunamadı.<br>
          <button class="btn" style="margin-top:10px; padding:6px 14px; font-size:0.85rem;" onclick="resetAllFilters()">Filtreleri Sıfırla</button>
        </td>
      </tr>
    `;
    return;
  }

  pageData.forEach((item, index) => {
    const rowNum = startIdx + index + 1;
    const isFav = favorites.includes(item.code);

    // Condition badges
    let condHtml = '<span style="color:var(--text-muted);">-</span>';
    if (item.kosul) {
      const condList = item.kosul.split(',').map(s => s.trim()).filter(Boolean);
      condHtml = condList.map(c => 
        `<button type="button" class="cond-badge" onclick="openConditionModal('${c}')" title="Bk. ${c} koşulunu gör">Bk.${c}</button>`
      ).join(' ');
    }

    // 2026 Placement Status
    let res26Html = '';
    if (item.has_2026) {
      if (item.yer_2026 > 0) {
        res26Html = `
          <div style="font-weight:800; color:#10b981; font-size:0.88rem;">${item.yer_2026} Yerleşen</div>
          ${item.bos_2026 > 0 ? `<div style="font-size:0.75rem; color:#ef4444;">${item.bos_2026} Boş</div>` : `<div style="font-size:0.72rem; color:#10b981; font-weight:600;">Doldu ✓</div>`}
        `;
      } else {
        res26Html = `<span style="color:#ef4444; font-size:0.8rem; font-weight:600;">Dolmadı (${item.bos_2026} Boş)</span>`;
      }
    } else {
      res26Html = '<span style="color:var(--text-muted);">-</span>';
    }

    // 2026 Taban Score formatting
    let score26Html = '<span style="color:var(--text-muted); font-size:0.82rem;">-- (Oluşmadı)</span>';
    if (item.has_2026 && item.min_2026 && item.min_2026 !== '--') {
      score26Html = `
        <div style="font-weight:800; color:#f59e0b; font-size:0.92rem;">${item.min_2026}</div>
        <div style="font-size:0.72rem; color:var(--text-muted);" title="En Büyük Puan: ${item.max_2026}">Tavan: ${item.max_2026}</div>
      `;
    }

    // 2025 Taban Score formatting
    let score25Html = '<span style="color:var(--text-muted); font-size:0.82rem;">-- (Boş)</span>';
    if (item.has_2025 && item.min_2025 && item.min_2025 !== '--') {
      score25Html = `
        <div style="font-weight:700; color:#10b981;">${item.min_2025}</div>
        <div style="font-size:0.72rem; color:var(--text-muted);" title="Yerleşen: ${item.yer_2025}, Kontenjan: ${item.kont_2025}">${item.yer_2025}/${item.kont_2025} Yerleşen</div>
      `;
    } else if (item.has_2025 && item.bos_2025 > 0) {
      score25Html = `
        <span style="color:#ef4444; font-size:0.8rem; font-weight:600;">Dolmadı (${item.bos_2025} Boş)</span>
      `;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center; color:var(--text-muted); font-size:0.85rem;">${rowNum}</td>
      <td style="font-family:monospace; font-weight:700; color:var(--text-primary); font-size:0.88rem;">${item.code}</td>
      <td>
        <div style="font-weight:700; color:var(--text-primary); font-size:0.92rem;">${item.univ}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${item.fac}</div>
      </td>
      <td>
        <div style="font-weight:700; color:var(--accent-primary); font-size:0.95rem;">${item.prog}</div>
        <div style="font-size:0.75rem; color:var(--text-secondary);">Alan Kodu: <strong>${item.lisans_kodu}</strong> • ${item.puan_turu}</div>
      </td>
      <td>
        <span style="font-size:0.85rem; color:var(--text-primary);">📍 ${item.city}</span>
      </td>
      <td style="text-align:center;">
        <span style="display:inline-block; background:rgba(245,158,11,0.18); color:#f59e0b; border:1px solid rgba(245,158,11,0.4); border-radius:8px; padding:2px 8px; font-weight:800; font-size:0.9rem;">
          ${item.kont_2026}
        </span>
      </td>
      <td style="text-align:center;">${res26Html}</td>
      <td style="text-align:right;">${score26Html}</td>
      <td style="text-align:right;">${score25Html}</td>
      <td style="text-align:center;">${condHtml}</td>
      <td style="text-align:center;">
        <button type="button" class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFavorite('${item.code}')" title="${isFav ? 'Tercih listesinden çıkar' : 'Tercih listesine ekle'}">
          ${isFav ? '⭐' : '☆'}
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ============================================================
// FAVORITES / PREFERENCE LIST MANAGEMENT
// ============================================================
function toggleFavorite(code) {
  const index = favorites.indexOf(code);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    if (favorites.length >= 30) {
      alert('Tercih listenize en fazla 30 program ekleyebilirsiniz.');
      return;
    }
    favorites.push(code);
  }
  localStorage.setItem('muhendislik_favs', JSON.stringify(favorites));
  updateFavBadge();
  render();
  if (listModal && listModal.classList.contains('show')) {
    renderFavoritesTable();
  }
}

function updateFavBadge() {
  if (favCountBadge) {
    favCountBadge.textContent = favorites.length;
    favCountBadge.style.display = favorites.length > 0 ? 'inline-flex' : 'none';
  }
}

function openFavoritesModal() {
  if (!listModal) return;
  listModal.classList.add('show');
  renderFavoritesTable();
}

function closeFavoritesModal() {
  if (listModal) listModal.classList.remove('show');
}

function renderFavoritesTable() {
  if (!favTableBody) return;
  favTableBody.innerHTML = '';

  if (modalFavCount) modalFavCount.textContent = `${favorites.length}/30`;

  if (favorites.length === 0) {
    if (favEmptyState) favEmptyState.style.display = 'block';
    if (favTableWrap) favTableWrap.style.display = 'none';
    return;
  }

  if (favEmptyState) favEmptyState.style.display = 'none';
  if (favTableWrap) favTableWrap.style.display = 'block';

  favorites.forEach((code, index) => {
    const item = programsData.find(p => p.code === code);
    if (!item) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center; font-weight:700; color:var(--text-muted);">${index + 1}</td>
      <td style="font-family:monospace; font-weight:700;">${item.code}</td>
      <td>
        <div style="font-weight:700; font-size:0.9rem;">${item.univ}</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${item.fac}</div>
      </td>
      <td>
        <div style="font-weight:700; color:var(--accent-primary);">${item.prog}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Alan: ${item.lisans_kodu}</div>
      </td>
      <td>${item.city}</td>
      <td style="text-align:center; font-weight:700; color:#f59e0b;">${item.kont_2026}</td>
      <td style="text-align:right; font-weight:600;">${item.min_2025 || '--'}</td>
      <td style="text-align:right; font-weight:600;">${item.min_2024 || '--'}</td>
      <td style="text-align:center;">
        <button type="button" class="btn-sm-danger" onclick="toggleFavorite('${item.code}')" title="Listeden çıkar">🗑️</button>
      </td>
    `;
    favTableBody.appendChild(tr);
  });
}

function clearAllFavorites() {
  if (favorites.length === 0) return;
  if (confirm('Tercih listenizdeki tüm programları silmek istediğinizden emin misiniz?')) {
    favorites = [];
    localStorage.setItem('muhendislik_favs', JSON.stringify(favorites));
    updateFavBadge();
    render();
    renderFavoritesTable();
  }
}

// ============================================================
// EXPORT TO EXCEL & CSV
// ============================================================
function getExportData() {
  return favorites.map((code, idx) => {
    const p = programsData.find(x => x.code === code);
    if (!p) return null;
    return {
      "Tercih Sırası": idx + 1,
      "ÖSYM Kodu": p.code,
      "Üniversite": p.univ,
      "Fakülte": p.fac,
      "Program": p.prog,
      "Lisans Alan Kodu": p.lisans_kodu,
      "Şehir": p.city,
      "2026 Kontenjan": p.kont_2026,
      "2025 Taban Puan": p.min_2025 || '--',
      "2025 Yerleşen": p.yer_2025 || 0,
      "2025 Boş": p.bos_2025 || 0,
      "2024 Taban Puan": p.min_2024 || '--',
      "Özel Koşullar": p.kosul || '--'
    };
  }).filter(Boolean);
}

function exportToExcel() {
  if (favorites.length === 0) {
    alert('Dışa aktarmak için önce tercih listenize en az bir program eklemelisiniz.');
    return;
  }
  const data = getExportData();
  if (typeof XLSX === 'undefined') {
    exportToCSV();
    return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Muhendislik_Tercih_Listem");
  XLSX.writeFile(wb, "2026_Muhendislik_Tamamlama_Tercih_Listem.xlsx");
}

function exportToCSV() {
  if (favorites.length === 0) {
    alert('Dışa aktarmak için önce tercih listenize en az bir program eklemelisiniz.');
    return;
  }
  const data = getExportData();
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','));
  const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '2026_Muhendislik_Tamamlama_Tercih_Listem.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ============================================================
// CONDITION MODAL
// ============================================================
function openConditionModal(code) {
  if (!condModal || !condModalTitle || !condModalBody) return;
  const desc = conditionsData[code];
  condModalTitle.textContent = `Özel Koşul: Bk. ${code}`;
  if (desc) {
    condModalBody.innerHTML = `<p>${desc}</p>`;
  } else {
    condModalBody.innerHTML = `<p>Resmi kılavuzda Bk. ${code} koşulu için açıklama aranıyor...</p>`;
  }
  condModal.classList.add('show');
}

function closeConditionModal() {
  if (condModal) condModal.classList.remove('show');
}

// ============================================================
// FAQ ACCORDION
// ============================================================
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        item.classList.toggle('active');
        const span = question.querySelector('span');
        if (span) {
          span.textContent = item.classList.contains('active') ? '−' : '+';
        }
      });
    }
  });
}
