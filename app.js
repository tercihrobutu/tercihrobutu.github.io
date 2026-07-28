// State Management
let currentTab = 'lisans'; // 'lisans' or 'onlisans'
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
  checkURLParams();

  populateCityFilter();
  render();
});

// Check URL Params for Search (SEO SearchAction support)
function checkURLParams() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    searchInput.value = q;
  }
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
  dataset.forEach(item => {
    if (item.city) cities.add(item.city);
  });
  
  const sortedCities = Array.from(cities).sort((a,b) => a.localeCompare(b, 'tr'));
  
  filterCity.innerHTML = '<option value="">Tüm İller (81 İl + Yurtdışı)</option>';
  sortedCities.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    filterCity.appendChild(opt);
  });
}

// Event Listeners Setup
function setupEventListeners() {
  [searchInput, filterCity, filterUnivType, filterPuanType, filterEgitimType, filterMaxRank, sortBySelect]
    .forEach(el => el.addEventListener('input', () => {
      currentPage = 1;
      render();
    }));

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      render();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  });

  nextPageBtn.addEventListener('click', () => {
    currentPage++;
    render();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  // Modal handlers
  document.getElementById('btnOpenList').addEventListener('click', openFavModal);
  document.getElementById('btnCloseModal').addEventListener('click', closeFavModal);
  document.getElementById('btnClearFavs').addEventListener('click', clearFavs);

  const btnExportXLSX = document.getElementById('btnExportXLSX');
  if (btnExportXLSX) {
    btnExportXLSX.addEventListener('click', exportFavsXLSX);
  }

  const btnExportPDF = document.getElementById('btnExportPDF');
  if (btnExportPDF) {
    btnExportPDF.addEventListener('click', exportFavsPDF);
  }
}

// FAQ Accordion Interactivity
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    q.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

// Core Filter & Render Engine
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
    // Search Text
    if (query) {
      const targetStr = (item.univ + ' ' + item.prog + ' ' + item.fac + ' ' + item.code).toLowerCase();
      if (!targetStr.includes(query)) return false;
    }

    // City
    if (city && item.city !== city) return false;

    // Univ Type
    if (univType && item.univ_type !== univType) return false;

    // Puan Type
    if (puanType && item.score_type !== puanType) return false;

    // Egitim Type
    if (egitimType && item.tip !== egitimType) return false;

    // Max Rank
    if (maxRank !== null) {
      const r = parseInt(item.rank, 10);
      if (isNaN(r) || r > maxRank) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'rank_asc') {
      const rA = parseInt(a.rank, 10) || 9999999;
      const rB = parseInt(b.rank, 10) || 9999999;
      return rA - rB;
    } else if (sortBy === 'rank_desc') {
      const rA = parseInt(a.rank, 10) || 0;
      const rB = parseInt(b.rank, 10) || 0;
      return rB - rA;
    } else if (sortBy === 'score_desc') {
      const sA = parseFloat(a.score) || 0;
      const sB = parseFloat(b.score) || 0;
      return sB - sA;
    } else if (sortBy === 'univ_asc') {
      return a.univ.localeCompare(b.univ, 'tr');
    }
    return 0;
  });

  return filtered;
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
    tableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding:40px; color:var(--text-muted);">Aramanıza uygun üniversite programı bulunamadı.</td></tr>`;
    return;
  }

  pageItems.forEach(item => {
    const isFav = favorites.some(f => f.code === item.code);
    const tr = document.createElement('tr');

    const badgeUnivClass = item.univ_type.includes('Vakıf') ? 'badge-vakif' : (item.univ_type.includes('KKTC') ? 'badge-kktc' : 'badge-devlet');
    const badgeEgitimClass = item.tip === 'Uzaktan' ? 'badge-uzaktan' : (item.tip === 'AÖF' ? 'badge-aof' : 'badge-orgun');

    const rankDisplay = item.rank && item.rank !== '...' ? parseInt(item.rank, 10).toLocaleString('tr-TR') : (item.rank || '-');
    const scoreDisplay = item.score && item.score !== '----' ? parseFloat(item.score).toFixed(5) : '-';

    tr.innerHTML = `
      <td>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav('${item.code}')" title="Tercih Listenize Ekleyin">
          ${isFav ? '★' : '☆'}
        </button>
      </td>
      <td class="code-cell">${item.code}</td>
      <td><strong>${item.city}</strong></td>
      <td>
        <div>${item.univ}</div>
        <span class="badge ${badgeUnivClass}">${item.univ_type}</span>
      </td>
      <td style="color:var(--text-secondary);">${item.fac}</td>
      <td><strong>${item.prog}</strong></td>
      <td><span class="badge ${badgeEgitimClass}">${item.tip}</span></td>
      <td><span class="badge" style="background:rgba(255,255,255,0.08);">${item.score_type}</span></td>
      <td style="text-align:center;">${item.quota_genel}</td>
      <td style="text-align:right; font-weight:700; color:var(--accent-primary);">${rankDisplay}</td>
      <td style="text-align:right; font-weight:600;">${scoreDisplay}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Favorite Management
function toggleFav(code) {
  const dataset = [...dataStore.lisans, ...dataStore.onlisans];
  const item = dataset.find(x => x.code === code);
  if (!item) return;

  const index = favorites.findIndex(f => f.code === code);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(item);
  }

  localStorage.setItem('yks_tercih_favs', JSON.stringify(favorites));
  updateFavBadge();
  render();
  if (document.getElementById('listModal').classList.contains('active')) {
    renderFavModal();
  }
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

// Real XLSX Excel Export using SheetJS
function exportFavsXLSX() {
  if (favorites.length === 0) return alert('Listeniz boş!');

  try {
    const data = favorites.map((item, idx) => ({
      'Sıra': idx + 1,
      'ÖSYM Kodu': item.code,
      'İl': item.city,
      'Üniversite': item.univ,
      'Üniversite Türü': item.univ_type,
      'Fakülte': item.fac,
      'Eğitim Tipi': item.tip,
      'Program': item.prog,
      'Puan Türü': item.score_type,
      'Kontenjan': item.quota_genel,
      '2025 Sıralama': item.rank && item.rank !== '...' ? parseInt(item.rank, 10) : item.rank,
      '2025 Puan': item.score
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tercih Listem");
    XLSX.writeFile(workbook, "YKS_Tercih_Listem_2026.xlsx");
  } catch (err) {
    console.error('XLSX export error:', err);
    alert('Excel dosyası oluşturulurken bir hata oluştu.');
  }
}

// Perfect PDF Export using html2pdf (100% Turkish Unicode Glyph Rendering)
function exportFavsPDF() {
  if (favorites.length === 0) return alert('Listeniz boş!');

  try {
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = "'Outfit', 'Inter', Arial, sans-serif";
    element.style.color = '#0f172a';
    element.style.background = '#ffffff';

    let tableRows = '';
    favorites.forEach((item, idx) => {
      const rankDisplay = item.rank && item.rank !== '...' ? parseInt(item.rank, 10).toLocaleString('tr-TR') : (item.rank || '-');
      tableRows += `
        <tr style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:10px; font-weight:bold; text-align:center; color:#6366f1;">${idx + 1}</td>
          <td style="padding:10px; font-family:monospace; font-weight:bold; color:#4f46e5;">${item.code}</td>
          <td style="padding:10px;">${item.city}</td>
          <td style="padding:10px;">${item.univ}</td>
          <td style="padding:10px; font-weight:bold;">${item.prog}</td>
          <td style="padding:10px; text-align:center;">${item.score_type}</td>
          <td style="padding:10px; text-align:right; font-weight:bold; color:#6366f1;">${rankDisplay}</td>
        </tr>
      `;
    });

    element.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:3px solid #6366f1; padding-bottom:12px;">
        <div>
          <h1 style="font-size:22px; color:#1e1b4b; margin:0; font-weight:800;">🎓 2026 YKS TERCIH LISTEM</h1>
          <p style="font-size:12px; color:#64748b; margin:6px 0 0;">Kaynak: tercihrobutu.github.io | Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
        </div>
        <div style="font-size:13px; font-weight:bold; background:#e0e7ff; color:#4338ca; padding:8px 16px; border-radius:8px;">
          Toplam: ${favorites.length} Program
        </div>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
        <thead>
          <tr style="background:#4f46e5; color:white;">
            <th style="padding:10px; width:35px; text-align:center;">#</th>
            <th style="padding:10px;">ÖSYM Kodu</th>
            <th style="padding:10px;">İl</th>
            <th style="padding:10px;">Üniversite</th>
            <th style="padding:10px;">Program</th>
            <th style="padding:10px; text-align:center;">Puan Türü</th>
            <th style="padding:10px; text-align:right;">2025 Sıralama</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <div style="margin-top:30px; border-top:1px solid #cbd5e1; padding-top:10px; font-size:10px; color:#94a3b8; text-align:center;">
        Bu tercih listesi tercihrobutu.github.io YKS Tercih Robotu sistemi üzerinden oluşturulmuştur.
      </div>
    `;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'YKS_Tercih_Listem_2026.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF export error:', err);
    alert('PDF oluşturulurken bir hata oluştu.');
  }
}

// Theme Switcher
function setupTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
  });
}
