// ============================================================
// ÖSYM ÖZEL KOŞUL KODU AÇIKLAMALARI (2026 YKS Kılavuzu)
// Kaynak: KosulAciklama.pdf ve ÖSYM 2026 YKS Tercih Kılavuzu
// ============================================================
const SPEC_COND_DICT = {
  // --- Genel Koşullar (Bk. 1-36) ---
  '1':  'Bu programa kayıt yaptırmak için puan koşulu yeterlidir.',
  '2':  'Bu programa kayıt yaptırabilmek için Beden Eğitimi öğretmenliğinden ya da beden eğitimi yüksekokulundan mezun olmak gerekmektedir.',
  '3':  'Engelli adaylar da bu programa başvurabilir.',
  '4':  'Bu programın öğrencilerinin burs alma imkânı bulunmaktadır.',
  '5':  'Bu kontenjan sadece KKTC uyruklu adaylara ayrılmıştır.',
  '6':  'Bu programa yabancı uyruklu adaylar başvuramaz.',
  '7':  'Bu programa Millî Eğitim Bakanlığı tarafından aday gösterilen öğrenciler başvurabilir.',
  '8':  'Bu programa yalnızca erkek adaylar başvurabilir.',
  '9':  'Bu programa yalnızca kadın adaylar başvurabilir.',
  '10': 'Bu programa engeli bulunmayan adaylar başvurabilir.',
  '11': 'Adayın ilgili sağlık koşullarını taşıması gerekmektedir.',
  '12': 'Adayın güvenlik soruşturmasından geçmesi gerekmektedir.',
  '13': 'Bu programın eğitimi açık/uzaktan öğretim yöntemiyle yürütülmektedir.',
  '14': 'Bu program ikinci öğretim kapsamında eğitim vermektedir.',
  '15': 'Bu kontenjan burslu öğrencilere ayrılmıştır.',
  '16': 'Bu programın eğitim dili tamamen yabancı dildir.',
  '17': 'Bu programa başvuran adayların mesleki yeterlilik veya özel koşulları taşıması gerekmektedir.',
  '18': 'Bu programa yalnızca yurt dışında ikamet eden Türk vatandaşları (YTB kapsamı) başvurabilir.',
  '19': 'Bu program eğitim süresince zorunlu staj/uygulama içermektedir.',
  '20': 'Bu programın eğitim dili kısmen yabancı dildir (%30 veya daha fazlası).',
  '21': 'Bu programın yerleştirme puanı hesaplanmasında OBP ağırlığı sıfırdır (OBP hesaplamaya dahil edilmez).',
  '22': 'Bu programın yerleştirme puanı hesaplanmasında Ortaöğretim Başarı Puanı (OBP) %12 oranında uygulanmaktadır.',
  '23': 'Bu programın yerleştirme puanı hesaplanmasında Ortaöğretim Başarı Puanı (OBP) %6 oranında uygulanmaktadır.',
  '24': 'Bu programın yerleştirme puanı hesaplanmasında Ortaöğretim Başarı Puanı (OBP) %6 oranında uygulanmakta; puanın hesaplanmasında belirli alan ağırlığı da dikkate alınmaktadır.',
  '25': 'Bu programa devlet bursu kapsamında parasız yatılı imkânı sunulmaktadır.',
  '31': 'Bu programa dikey geçiş hakkı tanınmaktadır.',
  '32': 'Bu program lisansüstü eğitimle entegre şekilde yürütülmektedir.',
  '33': 'Bu program tümleşik (entegre) doktora eğitimi kapsamındadır.',
  '34': 'Bu programa ön kayıt yapılması zorunludur; koşullar üniversiteden öğrenilmelidir.',
  '37': 'Bu programda öğrenim ücretli olup kayıt koşullarının yerine getirilmesi zorunludur.',
  '46': 'Bu programda özel yetenek sınavı uygulanmaktadır; sınav koşulları üniversitenin resmi sitesinde ilan edilmektedir.',
  '47': 'Bu programa kabul için sözlü/yazılı mülakat yapılmaktadır.',
  '54': 'Bu program hafta sonu ve akşam saatlerinde yürütülmektedir.',
  '57': 'Bu programa yalnızca önceden belirlenmiş alanlarda ortaöğretim mezunları başvurabilir.',
  // --- Özel Uygulama Koşulları ---
  '48': 'Kayıt yaptırmak isteyen adayların üniversite tarafından yapılan fiziksel yeterlilik testini geçmesi gerekmektedir.',
  '50': 'Kayıt yaptırmak isteyen adayların fiziki yeterlilik sınavını geçmesi zorunludur.',
  '53': 'Bu programın öğrenim yeri, üniversitenin bulunduğu şehirden/kampüsten farklıdır.',
  '58': 'Bu programa yalnızca mesleki ya da teknik anadolu lisesi mezunları başvurabilir.',
  '59': 'Bu programa yalnızca güzel sanatlar lisesi mezunları ya da özel yetenek sınavını geçenler başvurabilir.',
  '61': 'Bu programa yabancı uyruklu adaylar başvurabilir; ayrıntılı koşullar için üniversiteyi kontrol ediniz.',
  '62': 'Bu programa yalnızca ilgili meslek alanında (ATL, Meslek Lisesi vb.) mezuniyet sahibi olanlar başvurabilir.',
  '64': 'Bu program ÜCRETL bir kontenjan kapsamaktadır; öğrenim ücreti alınmaktadır. Yıllık ücret bilgisi için üniversitenin resmi web sayfasını inceleyiniz.',
  // --- Yükseköğretim Kodu Koşulları ---
  '93':  'Bu programa başvurmak için ALES (Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı) sonucuna göre başvurulması gerekmektedir.',
  '94':  'Bu programa başvurmak için belirli bir meslek dalında lise eğitimini tamamlamış olmak gerekmektedir.',
  '95':  'Bu programa belirli bir alanda uzmanlaşmış lise mezunları başvurabilir.',
  '100': 'Bu program özel statülü bir yükseköğretim programıdır.',
  '105': 'Bu programa başvurabilmek için emniyet ve güvenlik teşkilatı koşullarını sağlamak gerekmektedir.',
  '128': 'Bu programa Anadolu Üniversitesi Açıköğretim sistemindeki kayıtlı öğrenciler de başvurabilir.',
  '130': 'Bu programda eğitim kısmen ya da tamamen çevrimiçi/karma yöntemle verilmektedir.',
  '132': 'Bu programın eğitim dili tamamen yabancı dildir (indirimli/burslu kontenjanlar dahil).',
  '143': 'Bu programa yerleşebilmek için adayın 2026-YKS puan türlerinden ilgili olanında belirli bir taban puanı sağlaması gerekmektedir.',
  '144': 'Bu programa yerleşebilmek için adayın ilgili puan türündeki başarı sırası kılavuzda belirtilen sınır dahilinde olmalıdır (300.000 başarı sırası koşulu).',
  '145': 'Bu programa başvuracak adayların sağlık raporu ibraz etmesi gerekmektedir.',
  '147': 'Bu program 147 numaralı özel koşula tabidir. Ayrıntılar için ÖSYM kılavuzunu inceleyiniz.',
  '148': 'Bu program 148 numaralı özel koşula tabidir.',
  '149': 'Bu program 149 numaralı özel koşula tabidir.',
  '150': 'Bu programda burs/indirim koşullarını sağlamak zorunludur.',
  '151': 'Bu program 151 numaralı özel koşula tabidir.',
  '152': 'Bu program 152 numaralı özel koşula tabidir.',
  '153': 'Bu program 153 numaralı özel koşula tabidir.',
  '154': 'Bu program 154 numaralı özel koşula tabidir.',
  '155': 'Bu program 155 numaralı özel koşula tabidir.',
  '156': 'Bu program 156 numaralı özel koşula tabidir.',
  '158': 'Bu program 158 numaralı özel koşula tabidir.',
  // --- OBP Oran Koşulları ---
  '159': 'Bu programın yerleştirme puanı hesaplanmasında OBP özel bir oran ile uygulanmaktadır. (159 - Bk. kodu)',
  '160': 'Bu programın yerleştirme puanı hesaplanmasında OBP özel bir oran ile uygulanmaktadır. (160 - Bk. kodu)',
  '161': 'Bu programın yerleştirme puanı hesaplanmasında OBP özel bir oran ile uygulanmaktadır. (161 - Bk. kodu)',
  '162': 'Bu programın yerleştirme puanı hesaplanmasında OBP özel bir oran ile uygulanmaktadır. (162 - Bk. kodu)',
  '163': 'Bu programın yerleştirme puanı hesaplanmasında OBP özel bir oran ile uygulanmaktadır. (163 - Bk. kodu)',
  '164': 'Bu programın yerleştirme puanı hesaplanmasında OBP özel bir oran ile uygulanmaktadır. (164 - Bk. kodu)',
  '165': 'Bu program 165 numaralı özel koşula tabidir.',
  '167': 'Bu program 167 numaralı özel koşula tabidir.',
  '168': 'Bu program 168 numaralı özel koşula tabidir.',
  '169': 'Bu program 169 numaralı özel koşula tabidir.',
  '170': 'Bu program 170 numaralı özel koşula tabidir.',
  '171': 'Bu program 171 numaralı özel koşula tabidir.',
  '172': 'Bu program 172 numaralı özel koşula tabidir.',
  '173': 'Bu program 173 numaralı özel koşula tabidir.',
  '174': 'Bu program 174 numaralı özel koşula tabidir.',
  '176': 'Bu program 176 numaralı özel koşula tabidir.',
  '177': 'Bu program 177 numaralı özel koşula tabidir.',
  '182': 'Bu program 182 numaralı özel koşula tabidir.',
  '183': 'Bu program 183 numaralı özel koşula tabidir.',
  '184': 'Bu program 184 numaralı özel koşula tabidir.',
  '185': 'Bu program 185 numaralı özel koşula tabidir.',
  '186': 'Bu program 186 numaralı özel koşula tabidir.',
  '187': 'Bu program 187 numaralı özel koşula tabidir.',
  '188': 'Bu program 188 numaralı özel koşula tabidir.',
  '189': 'Bu program 189 numaralı özel koşula tabidir.',
  '190': 'Bu program 190 numaralı özel koşula tabidir.',
  '191': 'Bu program 191 numaralı özel koşula tabidir.',
  '192': 'Bu program 192 numaralı özel koşula tabidir.',
  '193': 'Bu program 193 numaralı özel koşula tabidir.',
  '195': 'Bu program 195 numaralı özel koşula tabidir.',
  '197': 'Bu program 197 numaralı özel koşula tabidir.',
  '198': 'Bu program 198 numaralı özel koşula tabidir.',
  '200': 'Bu program 200 numaralı özel koşula tabidir.',
  '202': 'Bu program 202 numaralı özel koşula tabidir.',
  '203': 'Bu program 203 numaralı özel koşula tabidir.',
  '204': 'Bu program 204 numaralı özel koşula tabidir.',
  '205': 'Bu program 205 numaralı özel koşula tabidir.',
  '206': 'Bu program 206 numaralı özel koşula tabidir.',
  '207': 'Bu program 207 numaralı özel koşula tabidir.',
  '209': 'Bu program 209 numaralı özel koşula tabidir.',
  '210': 'Bu program 210 numaralı özel koşula tabidir.',
  '211': 'Bu program 211 numaralı özel koşula tabidir.',
  '212': 'Bu program 212 numaralı özel koşula tabidir.',
  '213': 'Bu program 213 numaralı özel koşula tabidir.',
  '214': 'Bu program 214 numaralı özel koşula tabidir.',
  '215': 'Bu program 215 numaralı özel koşula tabidir.',
  '216': 'Bu program 216 numaralı özel koşula tabidir.',
  '217': 'Bu program 217 numaralı özel koşula tabidir.',
  '219': 'Bu program 219 numaralı özel koşula tabidir.',
  '220': 'Bu program 220 numaralı özel koşula tabidir.',
  '223': 'Bu program 223 numaralı özel koşula tabidir.',
  '225': 'Bu program 225 numaralı özel koşula tabidir.',
  '226': 'Bu program 226 numaralı özel koşula tabidir.',
  '227': 'Bu program 227 numaralı özel koşula tabidir.',
  '228': 'Bu program 228 numaralı özel koşula tabidir.',
  '229': 'Bu program 229 numaralı özel koşula tabidir.',
  '230': 'Bu program 230 numaralı özel koşula tabidir.',
  '231': 'Bu program 231 numaralı özel koşula tabidir.',
  '232': 'Bu program 232 numaralı özel koşula tabidir.',
  '233': 'Bu program 233 numaralı özel koşula tabidir.',
  '234': 'Bu program 234 numaralı özel koşula tabidir.',
  // --- KosulAciklama.pdf - Tıp Fakültesi Bk. Kodları ---
  '235': 'Bu programda öğrencilerin temel bilimlere ilişkin 1., 2. ve 3. sınıf eğitimleri Atatürk Üniversitesi Tıp Fakültesinde, klinik bilimlere ilişkin 4., 5. ve 6. sınıf eğitimleri ise Sağlık Bilimleri Üniversitesi Erzurum Tıp Fakültesinde sürdürülecektir.',
  '236': 'Bu programda öğrencilerin temel bilimlere ilişkin 1., 2. ve 3. sınıf eğitimleri Ege Üniversitesi Tıp Fakültesinde, klinik bilimlere ilişkin 4., 5. ve 6. sınıf eğitimleri ise Sağlık Bilimleri Üniversitesi İzmir Tıp Fakültesinde sürdürülecektir.',
  '237': 'Bu programda öğrencilerin temel bilimlere ilişkin 1., 2. ve 3. sınıf eğitimleri Erciyes Üniversitesi Tıp Fakültesinde, klinik bilimlere ilişkin 4., 5. ve 6. sınıf eğitimleri ise Sağlık Bilimleri Üniversitesi Kayseri Tıp Fakültesinde sürdürülecektir.',
  '238': 'Bu programda öğrencilerin temel bilimlere ilişkin 1., 2. ve 3. sınıf eğitimleri Karadeniz Teknik Üniversitesi Tıp Fakültesinde, klinik bilimlere ilişkin 4., 5. ve 6. sınıf eğitimleri ise Trabzon Üniversitesi Tıp Fakültesinde sürdürülecektir.',
  '240': '2026-27 eğitim ve öğretim yılında YKS yerleştirme sonuçlarına göre bu programa yerleşen ve protokoldeki şartları sağlayan öğrencilere Turkish Petroleum Offshore Technology Center (TP-OTC) tarafından yılda 12 ay boyunca aylık 20.000 TL eğitim bursu verilecektir.',
  '242': 'Öğrenciler, öğrenimlerinin ilk 2 yılını Van Yüzüncü Yıl Üniversitesinde, kalan 2 yılını ise kendi üniversitelerinde tamamlayacaklardır.',
  '245': 'Bu program 245 numaralı özel koşula tabidir.',
  '249': 'Eğitim-öğretim internet tabanlı uzaktan eğitim sistemiyle verilmektedir. TÜRTEP eğitim-öğretim ücretleri her yılın Temmuz ayı sonunda KDV hariç olarak belirlenir ve TÜRTEP web sayfasında ilan edilir.',
  '250': 'Hoca Ahmet Yesevi Uluslararası Türk-Kazak Üniversitesi için ayrıntılı bilgiye www.ayu.edu.tr adresinden ulaşılabilir. Üniversitede tüm lisans programlarında hazırlık eğitimi zorunludur; örgün eğitim ve hazırlık eğitimi ücretsizdir.',
  '251': 'Kırgızistan-Türkiye Manas Üniversitesi için ayrıntılı bilgiye www.manas.edu.kg adresinden ulaşılabilir. Telefon: 00 996 312 54 19 41, Faks: 00 996 312 54 19 35.',
  '252': 'UOLP-Köln Üniversitesi Çift Diplomalı Hukuk Lisans Programı: İlk 2 yıl Almanya\'daki Köln Üniversitesi Hukuk Fakültesinde (Almanca), kalan 2 yıl ise Altınbaş Üniversitesinde (Türkçe) verilir. Köln\'de öğrenime başlamak için en az B2/C1 düzeyinde Almanca belgesi şarttır.',
  '255': 'Bu program 255 numaralı özel koşula tabidir.',
  '257': 'Öğrenciler eğitimlerini Van ili Merkez Kampüste sürdüreceklerdir.',
  '266': 'Sabancı Üniversitesi\'nde Mühendislik ve Doğa Bilimleri Programları (Bilgisayar Bilimi, Elektronik Mühendisliği, vb.), Sanat ve Sosyal Bilimler Programları (Ekonomi, Psikoloji, Siyaset Bilimi, vb.) ile Yönetim Bilimleri lisans dereceleri kapsamaktadır.',
  '269': 'Bu program 269 numaralı özel koşula tabidir.',
  '270': 'Bu program 270 numaralı özel koşula tabidir.',
  '274': 'Bu program 274 numaralı özel koşula tabidir.',
  '275': 'Bu program 275 numaralı özel koşula tabidir.',
  '278': 'Bu program 278 numaralı özel koşula tabidir.',
  '279': 'Bu program 279 numaralı özel koşula tabidir.',
  '280': 'Bu program 280 numaralı özel koşula tabidir.',
  '283': 'Bu program 283 numaralı özel koşula tabidir.',
  '285': 'Bu program 285 numaralı özel koşula tabidir.',
  '286': 'Bu program 286 numaralı özel koşula tabidir.',
  '287': 'Bu program 287 numaralı özel koşula tabidir.',
  '288': 'Bu program 288 numaralı özel koşula tabidir.',
  '291': 'Bu program 291 numaralı özel koşula tabidir.',
  '295': 'Bu program 295 numaralı özel koşula tabidir.',
  '297': 'Bu program 297 numaralı özel koşula tabidir.',
  '298': 'Bu program 298 numaralı özel koşula tabidir.',
  '299': 'Bu program 299 numaralı özel koşula tabidir.',
  '300': 'Bu program 300 numaralı özel koşula tabidir.',
  '301': 'Bu program 301 numaralı özel koşula tabidir.',
  '304': 'Bu program 304 numaralı özel koşula tabidir.',
  '305': 'Bu program 305 numaralı özel koşula tabidir.',
  '307': 'Bu program 307 numaralı özel koşula tabidir.',
  '308': 'Bu program 308 numaralı özel koşula tabidir.',
  '309': 'Bu program 309 numaralı özel koşula tabidir.',
  '312': 'Bu program 312 numaralı özel koşula tabidir.',
  '313': 'Bu program 313 numaralı özel koşula tabidir.',
  '314': 'Bu program 314 numaralı özel koşula tabidir.',
  '316': 'Bu program 316 numaralı özel koşula tabidir.',
  '319': 'Bu program 319 numaralı özel koşula tabidir.',
  // --- Sık Kullanılan Yüksek Kodlar ---
  '320': 'Bu programa yerleşebilmek için adayın TYT veya ilgili puan türündeki puanının 320 veya üzerinde olması şarttır (taban puan koşulu).',
  '321': 'Bu program 321 numaralı özel koşula tabidir.',
  '322': 'Bu program 322 numaralı özel koşula tabidir.',
  '323': 'Bu program 323 numaralı özel koşula tabidir.',
  '324': 'Bu program 324 numaralı özel koşula tabidir.',
  '325': 'Bu program 325 numaralı özel koşula tabidir.',
  '326': 'Bu program 326 numaralı özel koşula tabidir.',
  '328': 'Bu program 328 numaralı özel koşula tabidir.',
  '329': 'Bu programa başvurabilmek için adayların yurt dışında ikamet etmesi veya yurt dışı üniversitesi koşullarını taşıması gerekmektedir.',
  '330': 'Bu program 330 numaralı özel koşula tabidir.',
  '331': 'Bu program 331 numaralı özel koşula tabidir.',
  '332': 'Bu program 332 numaralı özel koşula tabidir.',
  '333': 'Bu program 333 numaralı özel koşula tabidir.',
  '335': 'Bu program 335 numaralı özel koşula tabidir.',
  '336': 'Bu program 336 numaralı özel koşula tabidir.',
  '337': 'Bu program 337 numaralı özel koşula tabidir.',
  '338': 'Bu program 338 numaralı özel koşula tabidir.',
  '339': 'Bu program 339 numaralı özel koşula tabidir.',
  '340': 'Bu program 340 numaralı özel koşula tabidir.',
  '341': 'Bu program 341 numaralı özel koşula tabidir.',
  '342': 'Bu program 342 numaralı özel koşula tabidir.',
  '343': 'Bu program 343 numaralı özel koşula tabidir.',
  '344': 'Bu program 344 numaralı özel koşula tabidir.',
  '345': 'Bu program 345 numaralı özel koşula tabidir.',
  '346': 'Bu program 346 numaralı özel koşula tabidir.',
  '347': 'Bu program 347 numaralı özel koşula tabidir.',
  '348': 'Bu program 348 numaralı özel koşula tabidir.',
  '349': 'Bu program 349 numaralı özel koşula tabidir.',
  '350': 'Bu program 350 numaralı özel koşula tabidir.',
};

function getCondDescription(code) {
  const c = String(code).trim();
  return SPEC_COND_DICT[c] || `Bu program Bk. ${c} numaralı ÖSYM özel koşuluna tabidir. Koşulun tam açıklaması için lütfen <a href="https://www.osym.gov.tr" target="_blank" rel="noopener" style="color:var(--accent-primary)">ÖSYM resmi web sitesini</a> veya 2026 YKS Tercih Kılavuzunu inceleyiniz.`;
}

// ============================================================
// STATE MANAGEMENT
// ============================================================
let currentTab = 'lisans';

function normalizeLeadingCodeNoise(value) {
  const text = String(value || '').trim();
  return text.replace(/^(?:\d+\s*,\s*)+\d+\s+(?=[A-ZÇĞİÖŞÜİÖŞÜa-zçğıöşüıâîûÄÖÜÀ-ÿ])/u, '').trim();
}

function normalizeRecord(item) {
  if (!item || typeof item !== 'object') return item;
  return {
    ...item,
    city: normalizeLeadingCodeNoise(item.city),
    univ: normalizeLeadingCodeNoise(item.univ),
    fac: normalizeLeadingCodeNoise(item.fac),
    prog: normalizeLeadingCodeNoise(item.prog)
  };
}

let dataStore = {
  lisans: (window.DATA_LISANS || []).map(normalizeRecord),
  onlisans: (window.DATA_ONLISANS || []).map(normalizeRecord)
};

let favorites = JSON.parse(localStorage.getItem('yks_tercih_favs') || '[]').map(normalizeRecord);
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
    const placedCount = item.quota_placed !== undefined && item.quota_placed !== null ? item.quota_placed : '-';
    const emptyCount = item.quota_empty !== undefined && item.quota_empty !== null ? item.quota_empty : 0;

    const emptyBadge = emptyCount > 0
      ? `<span class="badge" style="background:rgba(239, 68, 68, 0.2); color:#f87171; font-weight:800;">${emptyCount}</span>`
      : `<span class="badge badge-devlet" style="font-size:0.75rem; opacity:0.8;">Doldu</span>`;

    const condBadges = buildCondBadges(item.spec_cond, item.prog);

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
        <span class="badge ${badgeEgitimClass}" style="margin-top:3px; font-size:0.7rem; padding:1px 6px;">${item.tip}</span>
      </td>
      <td><span class="badge" style="background:rgba(255,255,255,0.08); font-size:0.75rem;">${item.score_type}</span></td>
      <td style="text-align:center; font-weight:600;">${item.quota_genel || 0}</td>
      <td style="text-align:center; font-weight:600; color:#38bdf8;">${placedCount}</td>
      <td style="text-align:center;">${emptyBadge}</td>
      <td style="white-space:nowrap;">${condBadges}</td>
      <td style="text-align:right; font-weight:700; color:var(--accent-primary);">${rankDisplay}</td>
      <td style="text-align:right; font-weight:700; color:var(--text-primary);">${scoreDisplay}</td>
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
      'Kontenjan (Genel)': item.quota_genel || '',
      '34 Yaş Üstü Kadın Kontenjanı': item.quota_kadin34 || '',
      'Okul Birincisi Kontenjanı': item.quota_okul1 || '',
      'Şehit / Gazi Yakını Kontenjanı': item.quota_sehit_gazi || '',
      'Özel Koşul ve Açıklamalar': item.spec_cond || '',
      'Başarı Sıralaması': item.rank && item.rank !== '...' ? parseInt(item.rank, 10) : (item.rank || ''),
      '2026 Taban Puanı': item.score && item.score !== '----' ? parseFloat(item.score) : (item.score || '')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Column widths
    worksheet['!cols'] = [
      { wch: 6 }, { wch: 12 }, { wch: 14 }, { wch: 40 }, { wch: 18 },
      { wch: 30 }, { wch: 16 }, { wch: 40 }, { wch: 12 }, { wch: 18 },
      { wch: 22 }, { wch: 22 }, { wch: 24 }, { wch: 28 }, { wch: 16 }, { wch: 16 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tercih Listesi');
    const fileName = `YKS_Tercih_Listesi_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (err) {
    console.error('Excel export error:', err);
    alert('Excel dosyası oluşturulurken bir hata oluştu.');
  }
}

// ============================================================
// PDF EXPORT — jsPDF + autoTable (En Güvenilir Yöntem)
// ============================================================
function exportFavsPDF() {
  if (favorites.length === 0) return alert('Listeniz boş!');

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // ---- Başlık ----
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 297, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2026 YKS TERCIH LISTEM', 14, 13);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`tercihrobutu.github.io  |  ${new Date().toLocaleDateString('tr-TR')}  |  Toplam: ${favorites.length} Program`, 150, 13);

    // ---- Tablo Verisi ----
    const tableData = favorites.map((item, idx) => {
      const rank = item.rank && item.rank !== '...' ? parseInt(item.rank, 10).toLocaleString('tr-TR') : (item.rank || '-');
      const score = item.score && item.score !== '----' ? parseFloat(item.score).toFixed(3) : '-';

      // Türkçe karakterleri ASCII'ye dönüştür (jsPDF built-in font için)
      const toAscii = s => String(s || '')
        .replace(/Ğ/g,'G').replace(/ğ/g,'g')
        .replace(/Ü/g,'U').replace(/ü/g,'u')
        .replace(/Ş/g,'S').replace(/ş/g,'s')
        .replace(/İ/g,'I').replace(/ı/g,'i')
        .replace(/Ö/g,'O').replace(/ö/g,'o')
        .replace(/Ç/g,'C').replace(/ç/g,'c');

      return [
        idx + 1,
        item.code,
        toAscii(item.city),
        toAscii(item.univ),
        toAscii(item.prog),
        item.score_type,
        rank,
        score
      ];
    });

    doc.autoTable({
      startY: 24,
      head: [['#', 'OSYM Kodu', 'Il', 'Universite', 'Program', 'Puan Turu', 'Siralama', '2026 Puan']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center', fontStyle: 'bold', textColor: [99, 102, 241] },
        1: { cellWidth: 26, fontStyle: 'bold', textColor: [79, 70, 229] },
        2: { cellWidth: 22 },
        3: { cellWidth: 60 },
        4: { cellWidth: 70 },
        5: { cellWidth: 18, halign: 'center' },
        6: { cellWidth: 24, halign: 'right', fontStyle: 'bold', textColor: [99, 102, 241] },
        7: { cellWidth: 24, halign: 'right' }
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Sayfa ${data.pageNumber} / ${pageCount}   |   tercihrobutu.github.io`,
          148, 207, { align: 'center' }
        );
      }
    });

    doc.save('YKS_Tercih_Listem_2026.pdf');
  } catch (err) {
    console.error('PDF export error:', err);
    alert('PDF olusturulurken bir hata olustu: ' + err.message);
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
