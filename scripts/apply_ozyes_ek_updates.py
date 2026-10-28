# -*- coding: utf-8 -*-
"""
apply_ozyes_ek_updates.py
Applies all 2026-ÖZYES Ek Tercih updates to ozyes.html, ozyes.js, index.html, verify_ozyes.js, and build_sitemap.py.
"""
import os
import re

REPO_DIR = r"C:\Users\yakupcontarli\Documents\GitHub\tercihrobutu.github.io"

def update_ozyes_html():
    file_path = os.path.join(REPO_DIR, "ozyes.html")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Title and meta tags
    content = re.sub(
        r"<title>.*?</title>",
        "<title>2026 ÖZYES Spor Bilimleri Ek Tercih Robotu & Kontenjanları | ÖSYM 2.519 Ek Kontenjan ve Taban Puanları</title>",
        content
    )
    content = re.sub(
        r'<meta name="title" content=".*?">',
        '<meta name="title" content="2026 ÖZYES Spor Bilimleri Ek Tercih Robotu & Kontenjanları | ÖSYM 2.519 Ek Kontenjan ve Taban Puanları">',
        content
    )
    content = re.sub(
        r'<meta name="description" content=".*?">',
        '<meta name="description" content="ÖSYM 2026-ÖZYES Ek Tercih Kılavuzu: 325 Spor Bilimleri programında toplam 2.519 ek kontenjan (1.006 Erkek, 951 Kadın, 327 Engelli Erkek, 235 Engelli Kadın), oluşan taban puanlar ve kılavuz koşullarıyla 0 ms\'de keşfedin.">',
        content
    )
    content = re.sub(
        r'<meta name="keywords" content=".*?">',
        '<meta name="keywords" content="2026 ozyes ek tercih, ozyes ek yerlestirme, ozyes ek kontenjanlari 2026, besyo ek tercih 2026, spor bilimleri ek kontenjan, ozyes taban puanlari 2026, antrenorluk ek kontenjan, beden egitimi ek tercih, spor yoneticiligi ek kontenjan, rekreasyon ek kontenjan, engelli spor bilimleri ek kontenjan">',
        content
    )

    # Open Graph & Twitter
    content = re.sub(
        r'<meta property="og:title" content=".*?">',
        '<meta property="og:title" content="2026 ÖZYES Spor Bilimleri Ek Tercih Robotu & Kontenjanları | ÖSYM">',
        content
    )
    content = re.sub(
        r'<meta property="og:description" content=".*?">',
        '<meta property="og:description" content="ÖSYM 2026-ÖZYES resmi ek tercih kılavuzu: 325 programda 2.519 ek kontenjan ve oluşan taban puanlar 0 ms\'de elinizin altında.">',
        content
    )
    content = re.sub(
        r'<meta name="twitter:title" content=".*?">',
        '<meta name="twitter:title" content="2026 ÖZYES Spor Bilimleri Ek Tercih Robotu & Kontenjanları">',
        content
    )
    content = re.sub(
        r'<meta name="twitter:description" content=".*?">',
        '<meta name="twitter:description" content="325 Spor Bilimleri programı, 2.519 ek kontenjan (1.006 Erkek, 951 Kadın, 562 Engelli) ve resmi taban puanları.">',
        content
    )

    # JSON-LD description update
    content = re.sub(
        r'"name": "ÖZYES Yerleştirme Robotu 2026"',
        '"name": "ÖZYES Ek Tercih Robotu 2026"',
        content
    )
    content = re.sub(
        r'"name": "ÖSYM 2026 ÖZYES Spor Bilimleri Yerleştirme Sonuçları ve Taban Puanları"',
        '"name": "ÖSYM 2026 ÖZYES Spor Bilimleri Ek Yerleştirme Kontenjanları ve Taban Puanları"',
        content
    )
    content = re.sub(
        r'"description": "384 Spor Bilimleri lisans programının ÖSYM 2026 resmi yerleştirme sonuçları, en küçük \(taban\) ve en büyük puanları, yerleşen aday ve boş kontenjan sayıları\."',
        '"description": "325 Spor Bilimleri lisans programında 2.519 ek kontenjan (1.006 Erkek, 951 Kadın, 327 Engelli Erkek, 235 Engelli Kadın), ÖSYM 2026 resmi yerleştirme taban puanları ve özel koşullar."',
        content
    )

    # Logo Text
    content = re.sub(
        r'<div>ÖZYES Robotu <span style="font-size:0\.75rem; color:var\(--accent-primary\); font-weight:700;">2026</span></div>',
        '<div>ÖZYES Ek Tercih <span style="font-size:0.75rem; color:var(--accent-primary); font-weight:700;">2026</span></div>',
        content
    )

    # Nav link
    content = re.sub(
        r'<a href="ozyes\.html" class="btn btn-primary"[^>]*>🏃 ÖZYES Robotu <span[^>]*>2026 Sonuç</span></a>',
        '<a href="ozyes.html" class="btn btn-primary" style="padding:0.4rem 0.75rem; font-size:0.82rem; text-decoration:none; background:#10b981; border-color:#10b981;">🏃 ÖZYES Ek Tercih <span style="font-size:0.68rem; background:#047857; color:#fff; padding:1px 5px; border-radius:10px; margin-left:2px;">2.519 Ek Kont.</span></a>',
        content
    )

    # Notice banner
    old_banner_pattern = r'<!-- Notice Switcher Banner -->.*?<div style="display:flex; gap:8px;">.*?</div>\s*</div>'
    new_banner = """<!-- Notice Switcher Banner -->
    <div style="background:linear-gradient(90deg, rgba(16,185,129,0.18), rgba(59,130,246,0.18)); border:1.5px solid rgba(16,185,129,0.45); border-radius:12px; padding:12px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:1.6rem;">📢</span>
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:3px; flex-wrap:wrap;">
            <span style="background:#10b981; color:#fff; font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:6px;">2026 EK TERCİH BAŞLADI</span>
            <strong style="color:var(--text-primary); font-size:0.95rem;">2026-ÖZYES Ek Yerleştirme Tercihleri Başladı! Resmi ÖSYM Kılavuzu Açıklandı</strong>
          </div>
          <div style="font-size:0.83rem; color:var(--text-secondary); margin-top:2px;">
            ÖSYM 2026-ÖZYES Ek Tercih Kılavuzuna göre <strong>325 Spor Bilimleri programında toplam 2.519 ek kontenjan</strong> (1.006 Genel Erkek, 951 Genel Kadın, 327 Engelli Erkek, 235 Engelli Kadın) açıldı. İlk yerleştirmede oluşan taban/tavan puanlarla ek kontenjanları anında filtreleyin.
          </div>
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <a href="https://ais.osym.gov.tr" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:6px 14px; font-size:0.82rem; text-decoration:none; background:#10b981; border-color:#10b981; color:#fff; font-weight:700;">
          ÖSYM Tercih Ekranı (AİS) ↗
        </a>
      </div>
    </div>"""
    content = re.sub(old_banner_pattern, new_banner, content, flags=re.DOTALL)

    # Hero section & stats
    old_hero_pattern = r'<!-- Hero Section -->.*?<div class="stats-grid">.*?</div>\s*</section>'
    new_hero = """<!-- Hero Section -->
    <section class="hero">
      <h1>2026 ÖZYES Spor Bilimleri Ek Tercih Robotu & Kontenjanları</h1>
      <p>ÖSYM 2026 Özel Yetenek Sınavı (ÖZYES) Ek Tercih Kılavuzu: 325 Spor Bilimleri lisans programında açılan 2.519 ek kontenjan, ilk yerleştirmede oluşan resmi erkek ve kadın taban puanları, boş kontenjanlar ve kılavuz koşulları 0 ms gecikmeyle analiz motorunda.</p>

      <div class="stats-grid">
        <div class="stat-card" style="border:1.5px solid rgba(16,185,129,0.4); background:rgba(16,185,129,0.08);">
          <div class="stat-number" style="color:#10b981;">2.519</div>
          <div class="stat-label">Toplam 2026 Ek Kontenjan</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" style="color:#60a5fa;">1.333</div>
          <div class="stat-label">Erkek Ek Kontenjan (1.006+327)</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" style="color:#f472b6;">1.186</div>
          <div class="stat-label">Kadın Ek Kontenjan (951+235)</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" style="color:var(--accent-primary);">325</div>
          <div class="stat-label">Ek Kontenjanlı Program (384)</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" style="color:var(--text-secondary);">13.119</div>
          <div class="stat-label">İlk Yerleştirme Kontenjanı</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" style="color:#10b981;">11.410</div>
          <div class="stat-label">İlk Yerleşen Aday (%87)</div>
        </div>
      </div>
    </section>"""
    content = re.sub(old_hero_pattern, new_hero, content, flags=re.DOTALL)

    # Category Switcher Tabs
    old_tabs_pattern = r'<!-- Category / Candidate Type Switcher Tabs -->.*?<div class="cat-tabs-container">.*?</div>\s*</div>'
    new_tabs = """<!-- Category / Candidate Type Switcher Tabs -->
    <div class="cat-tabs-wrap">
      <div class="cat-tabs-container">
        <button class="cat-tab-btn active" data-cat="tum" title="Tüm Kontenjan Dağılımı (2.519 Ek Kontenjan)">
          <span>🌐 Tüm Kontenjanlar (2.519 Ek Kont.)</span>
        </button>
        <button class="cat-tab-btn" data-cat="erkek" title="Erkek Aday Kontenjanları ve Taban Puanları">
          <span>👨 Erkek Aday Kontenjanları (1.333 Ek Kont.)</span>
        </button>
        <button class="cat-tab-btn" data-cat="kadin" title="Kadın Aday Kontenjanları ve Taban Puanları">
          <span>👩 Kadın Aday Kontenjanları (1.186 Ek Kont.)</span>
        </button>
        <button class="cat-tab-btn" data-cat="engelli" title="Engelli Aday Kontenjanları (Erkek / Kadın)">
          <span>♿ Engelli Aday Kontenjanları (562 Ek Kont.)</span>
        </button>
        <button class="cat-tab-btn" data-cat="milli" title="Millî Sporcu Kontenjanları (Erkek / Kadın)">
          <span>🥇 Millî Sporcular</span>
        </button>
      </div>
    </div>"""
    content = re.sub(old_tabs_pattern, new_tabs, content, flags=re.DOTALL)

    # Filter status dropdown
    old_filter_status = r'<!-- Kontenjan Durumu Filter -->.*?<select id="filterStatus" class="filter-select">.*?</select>'
    new_filter_status = """<!-- Kontenjan Durumu Filter -->
        <div class="filter-group">
          <label class="filter-label" for="filterStatus">📌 Kontenjan Durumu</label>
          <select id="filterStatus" class="filter-select">
            <option value="only_ek" selected>🔥 Sadece Ek Kontenjanı Olan Programlar (325 Program / 2.519 Ek Kont.)</option>
            <option value="all">Tüm Programlar (384 Program)</option>
            <option value="placed2026">İlk Yerleştirmede Yerleşeni Olanlar (Taban Oluşan)</option>
            <option value="full2026">İlk Yerleştirmede Tam Dolanlar (Boş: 0)</option>
            <option value="no_ek">Ek Kontenjanı Olmayan Programlar (59 Program)</option>
          </select>
        </div>"""
    content = re.sub(old_filter_status, new_filter_status, content, flags=re.DOTALL)

    # SEO Guide section
    old_seo_pattern = r'<!-- Comprehensive SEO Text & ÖZYES Guide Section -->.*?<!-- FAQ Section -->'
    new_seo = """<!-- Comprehensive SEO Text & ÖZYES Guide Section -->
    <article class="seo-section">
      <h2>2026 ÖZYES Spor Bilimleri Ek Tercih Rehberi ve ÖSYM Kılavuzu</h2>
      <p>ÖSYM 2026 Özel Yetenek Sınavı (ÖZYES) Ek Yerleştirme Tercih Kılavuzu resmi olarak ilan edildi. Spor Bilimleri Fakülteleri ile Beden Eğitimi ve Spor Yüksekokulları (BESYO) bünyesindeki <strong>Beden Eğitimi ve Spor Öğretmenliği</strong>, <strong>Antrenörlük Eğitimi</strong>, <strong>Spor Yöneticiliği</strong> ve <strong>Rekreasyon</strong> lisans programlarında toplam <strong>325 programda 2.519 ek kontenjan</strong> açılmıştır.</p>

      <h3>2026-ÖZYES Ek Yerleştirmede Kimler Tercih Yapabilir?</h3>
      <p>2026-ÖZYES ek yerleştirmeye; 2026 Özel Yetenek Sınavı puanı hesaplanmış olup merkezi yerleştirmede herhangi bir yükseköğretim programına yerleştirilemeyen adaylar başvurabilir. 2026-ÖZYES merkezi yerleştirmede bir programa yerleşen adaylar (kayıt yaptırmış olsun veya olmasın) ek yerleştirmede tercih yapma hakkına sahip değildir.</p>

      <h3>Ek Yerleştirmede Taban Puan Kuralı Nedir?</h3>
      <p>ÖSYM ek yerleştirme kuralları gereğince:</p>
      <ul>
        <li><strong>Merkezi Yerleştirmede Kontenjanı Dolan Programlar:</strong> Adayların tercih edebilmesi için 2026-ÖZYES yerleştirme puanının, o programın ilgili cinsiyet kategorisindeki (erkek/kadın) genel yerleştirme en küçük (taban) puanına eşit veya bu puandan yüksek olması zorunludur.</li>
        <li><strong>Merkezi Yerleştirmede Kontenjanı Dolmayan veya Hiç Yerleşeni Olmayan Programlar:</strong> Bu programlarda taban puan oluşmadığı için, ilgili puan türünde puanı hesaplanmış tüm adaylar taban puan şartı aranmaksızın tercih listelerine ekleyebilirler.</li>
      </ul>

      <h3>2026-ÖZYES Ek Kontenjan Dağılımı ve Sayısal Veriler</h3>
      <div style="overflow-x:auto; margin:16px 0;">
        <table style="width:100%; font-size:0.9rem; border-collapse:collapse; text-align:left;">
          <thead>
            <tr style="border-bottom:2px solid var(--border-color);">
              <th style="padding:8px 12px;">Kontenjan Türü</th>
              <th style="padding:8px 12px; text-align:right;">Erkek Ek Kont.</th>
              <th style="padding:8px 12px; text-align:right;">Kadın Ek Kont.</th>
              <th style="padding:8px 12px; text-align:right;">Toplam Ek Kont.</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border-color);">
              <td style="padding:8px 12px; font-weight:600;">Genel Kontenjan</td>
              <td style="padding:8px 12px; text-align:right; color:#60a5fa; font-weight:700;">1.006</td>
              <td style="padding:8px 12px; text-align:right; color:#f472b6; font-weight:700;">951</td>
              <td style="padding:8px 12px; text-align:right; font-weight:800; color:#10b981;">1.957</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-color);">
              <td style="padding:8px 12px; font-weight:600;">Engelli Aday Kontenjanı</td>
              <td style="padding:8px 12px; text-align:right; color:#60a5fa; font-weight:700;">327</td>
              <td style="padding:8px 12px; text-align:right; color:#f472b6; font-weight:700;">235</td>
              <td style="padding:8px 12px; text-align:right; font-weight:800; color:#10b981;">562</td>
            </tr>
            <tr style="background:rgba(16,185,129,0.1); font-weight:800;">
              <td style="padding:10px 12px; color:var(--text-primary);">TOPLAM 2026 EK KONTENJAN</td>
              <td style="padding:10px 12px; text-align:right; color:#60a5fa;">1.333</td>
              <td style="padding:10px 12px; text-align:right; color:#f472b6;">1.186</td>
              <td style="padding:10px 12px; text-align:right; color:#10b981; font-size:1.05rem;">2.519</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>ÖSYM Özel Koşulları ve Açıklamaları (Tablo-1)</h3>
      <p>ÖZYES ek tercih işlemlerinde program kodlarının yanında yer alan özel şartlar (Örn: Bk. 1, Bk. 2, Bk. 199, Bk. 201 vb.) yürürlüktedir. Programların gerektirdiği heyet sağlık raporu, yaş şartı veya sporcu lisansı gibi kriterleri karşılamayan adayların yerleştirilseler dahi kayıtları yapılmaz. Tablomuzdaki özel koşul rozetlerine tıklayarak ÖSYM'nin resmi açıklama metinlerini görüntüleyebilirsiniz.</p>

      <!-- FAQ Section -->"""
    content = re.sub(old_seo_pattern, new_seo, content, flags=re.DOTALL)

    # FAQ items
    old_faq_pattern = r'<!-- FAQ Section -->.*?<div class="faq-grid">.*?</div>\s*</article>'
    new_faq = """<!-- FAQ Section -->
      <div class="faq-grid">
        <div class="faq-item">
          <div class="faq-question">ÖZYES ek tercihinde kaç tercih hakkım var? <span>+</span></div>
          <div class="faq-answer">ÖSYM ÖZYES ek tercih kılavuzuna göre adaylar en fazla 30 programı tercih listelerine ekleyebilirler. Robotumuzdaki ⭐ butonunu kullanarak 30'a kadar programı listenize kaydedebilir, Excel veya PDF olarak indirebilirsiniz.</div>
        </div>
        <div class="faq-item">
          <div class="faq-question">İlk yerleştirmede bir programa yerleşen aday ek tercih yapabilir mi? <span>+</span></div>
          <div class="faq-answer">Hayır. 2026-ÖZYES merkezi yerleştirmede herhangi bir programa yerleştirilen adaylar, kayıt yaptırsınlar veya yaptırmasınlar, ek yerleştirme için tercih bildiriminde bulunamazlar.</div>
        </div>
        <div class="faq-item">
          <div class="faq-question">Ek tercihte taban puanı oluşmayan programları kimler tercih edebilir? <span>+</span></div>
          <div class="faq-answer">Merkezi yerleştirmede kontenjanı dolmayan veya hiç adayın yerleşmediği lisans programlarında taban puan oluşmamıştır. Bu programları ilgili alanda 2026-ÖZYES puanı hesaplanmış olan tüm adaylar puan kısıtlaması olmadan tercih listesine ekleyebilir.</div>
        </div>
        <div class="faq-item">
          <div class="faq-question">SPORAK Akreditasyonu nedir? <span>+</span></div>
          <div class="faq-answer">SPORAK (Spor Bilimleri Eğitim Programları Değerlendirme ve Akreditasyon Kurulu), spor bilimleri alanındaki lisans programlarının eğitim kalitesini ulusal ve uluslararası standartlara göre denetleyen yetkili kurumdur. Akredite programlar mezunlarına diplomada uluslararası tanınırlık avantajı sağlar.</div>
        </div>
      </div>
    </article>"""
    content = re.sub(old_faq_pattern, new_faq, content, flags=re.DOTALL)

    # Modal Header
    content = re.sub(
        r'⭐ 2026 ÖZYES Tercih Listem',
        '⭐ 2026 ÖZYES Ek Tercih Listem',
        content
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated ozyes.html successfully.")

def update_ozyes_js():
    file_path = os.path.join(REPO_DIR, "ozyes.js")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update updateSortOptions()
    sort_options_fn = """function updateSortOptions() {
  const currentVal = sortBySelect.value;
  let optionsHtml = '';

  if (currentCategory === 'erkek') {
    optionsHtml = `
      <option value="ek_e_desc">🔥 2026 Erkek Ek Kontenjan (Çoktan Aza)</option>
      <option value="min26_e_desc">2026 Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_e_asc">2026 Erkek Taban Puanı (Düşük -> Yüksek)</option>
      <option value="yer26_e_desc">İlk Erkek Yerleşen (Çoktan Aza)</option>
      <option value="kont_e_desc">İlk Erkek Kontenjanı (Çoktan Aza)</option>
      <option value="puan_e_desc">2025 Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="sira_e_asc">2025 Erkek Başarı Sırası (En İyi -> Son)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  } else if (currentCategory === 'kadin') {
    optionsHtml = `
      <option value="ek_k_desc">🔥 2026 Kadın Ek Kontenjan (Çoktan Aza)</option>
      <option value="min26_k_desc">2026 Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_k_asc">2026 Kadın Taban Puanı (Düşük -> Yüksek)</option>
      <option value="yer26_k_desc">İlk Kadın Yerleşen (Çoktan Aza)</option>
      <option value="kont_k_desc">İlk Kadın Kontenjanı (Çoktan Aza)</option>
      <option value="puan_k_desc">2025 Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="sira_k_asc">2025 Kadın Başarı Sırası (En İyi -> Son)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  } else if (currentCategory === 'engelli') {
    optionsHtml = `
      <option value="ek_eng_desc">🔥 2026 Engelli Ek Kontenjan (Çoktan Aza)</option>
      <option value="min26_eng_e_desc">2026 Engelli Erkek Taban (Yüksek -> Düşük)</option>
      <option value="min26_eng_k_desc">2026 Engelli Kadın Taban (Yüksek -> Düşük)</option>
      <option value="yer26_tot_desc">İlk Toplam Yerleşen (Çoktan Aza)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  } else if (currentCategory === 'milli') {
    optionsHtml = `
      <option value="min26_milli_e_desc">2026 Millî Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_milli_k_desc">2026 Millî Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="yer26_tot_desc">İlk Toplam Yerleşen (Çoktan Aza)</option>
      <option value="kont_tot_desc">İlk Toplam Kontenjan (Çoktan Aza)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  } else {
    // 'tum'
    optionsHtml = `
      <option value="ek_tot_desc">🔥 2026 Ek Kontenjan (Çoktan Aza)</option>
      <option value="min26_e_desc">2026 Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_e_asc">2026 Erkek Taban Puanı (Düşük -> Yüksek)</option>
      <option value="min26_k_desc">2026 Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="min26_k_asc">2026 Kadın Taban Puanı (Düşük -> Yüksek)</option>
      <option value="yer26_tot_desc">İlk Yerleşen Sayısı (Çoktan Aza)</option>
      <option value="bos26_tot_desc">İlk Boş Kontenjan (Çoktan Aza)</option>
      <option value="kont_tot_desc">İlk Kontenjan (Çoktan Aza)</option>
      <option value="puan_e_desc">2025 Erkek Taban Puanı (Yüksek -> Düşük)</option>
      <option value="puan_k_desc">2025 Kadın Taban Puanı (Yüksek -> Düşük)</option>
      <option value="prog_asc">Program Adı (A-Z)</option>
      <option value="univ_asc">Üniversite Adı (A-Z)</option>
    `;
  }

  sortBySelect.innerHTML = optionsHtml;
  if (Array.from(sortBySelect.options).some(o => o.value === currentVal)) {
    sortBySelect.value = currentVal;
  }
}"""
    content = re.sub(r'function updateSortOptions\(\) \{.*?\n\}', sort_options_fn, content, flags=re.DOTALL)

    # 2. Reset filters function
    content = re.sub(
        r"if \(filterStatus\) filterStatus\.value = '';",
        "if (filterStatus) filterStatus.value = 'only_ek';",
        content
    )

    # 3. getFilteredData()
    old_filtered_fn_pattern = r'function getFilteredData\(\) \{.*?\n  return filtered;\n\}'
    new_filtered_fn = """function getFilteredData() {
  const query = turkishNormalize(searchInput.value);
  const univType = filterUnivType.value;
  const progFilter = filterProgramType.value;
  const akred = filterAkreditasyon.value;
  const statusVal = filterStatus ? filterStatus.value : 'only_ek';
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
    if (statusVal === 'only_ek') {
      if (!item.has_ek_2026 || (item.ek_kont_toplam || 0) <= 0) return false;
    } else if (statusVal === 'no_ek') {
      if (item.has_ek_2026 && (item.ek_kont_toplam || 0) > 0) return false;
    } else if (statusVal === 'placed2026') {
      if ((item.yer_2026_toplam || 0) <= 0) return false;
    } else if (statusVal === 'full2026') {
      if (item.bos_2026_toplam !== 0) return false;
    } else if (statusVal === 'empty2026') {
      if ((item.bos_2026_toplam || 0) <= 0) return false;
    }

    // 7. Category specific quota filter
    if (currentCategory === 'erkek') {
      if (statusVal === 'only_ek') {
        const maleEk = (item.ek_kont_genel_e || 0) + (item.ek_kont_engelli_e || 0);
        if (maleEk <= 0) return false;
      } else {
        if (item.kont_genel_e <= 0 && (item.ek_kont_genel_e || 0) <= 0) return false;
      }
    } else if (currentCategory === 'kadin') {
      if (statusVal === 'only_ek') {
        const femEk = (item.ek_kont_genel_k || 0) + (item.ek_kont_engelli_k || 0);
        if (femEk <= 0) return false;
      } else {
        if (item.kont_genel_k <= 0 && (item.ek_kont_genel_k || 0) <= 0) return false;
      }
    } else if (currentCategory === 'engelli') {
      if (statusVal === 'only_ek') {
        const engEk = (item.ek_kont_engelli_e || 0) + (item.ek_kont_engelli_k || 0);
        if (engEk <= 0) return false;
      } else {
        if ((item.kont_engelli_e + item.kont_engelli_k) <= 0 && ((item.ek_kont_engelli_e || 0) + (item.ek_kont_engelli_k || 0)) <= 0) return false;
      }
    } else if (currentCategory === 'milli') {
      if ((item.kont_milli_e + item.kont_milli_k) <= 0) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    // 2026 Ek Kontenjan Sıralamaları
    if (sortBy === 'ek_tot_desc') return (b.ek_kont_toplam || 0) - (a.ek_kont_toplam || 0);
    if (sortBy === 'ek_e_desc') {
      const eb = (b.ek_kont_genel_e || 0) + (b.ek_kont_engelli_e || 0);
      const ea = (a.ek_kont_genel_e || 0) + (a.ek_kont_engelli_e || 0);
      return eb - ea;
    }
    if (sortBy === 'ek_k_desc') {
      const kb = (b.ek_kont_genel_k || 0) + (b.ek_kont_engelli_k || 0);
      const ka = (a.ek_kont_genel_k || 0) + (a.ek_kont_engelli_k || 0);
      return kb - ka;
    }
    if (sortBy === 'ek_eng_desc') {
      const engB = (b.ek_kont_engelli_e || 0) + (b.ek_kont_engelli_k || 0);
      const engA = (a.ek_kont_engelli_e || 0) + (a.ek_kont_engelli_k || 0);
      return engB - engA;
    }

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
}"""
    content = re.sub(old_filtered_fn_pattern, new_filtered_fn, content, flags=re.DOTALL)

    # 4. updateTableHeaders()
    old_headers_pattern = r'function updateTableHeaders\(\) \{.*?\n\}'
    new_headers = """function updateTableHeaders() {
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
        <th style="text-align:center; width:100px; color:#60a5fa;" title="2026 Erkek Ek Kontenjanı">🔥 2026 Erkek Ek</th>
        <th style="text-align:center; width:85px;" title="İlk Yerleştirme Erkek Kontenjanı ve Yerleşen">♂ İlk Kont./Yer.</th>
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
        <th style="text-align:center; width:100px; color:#f472b6;" title="2026 Kadın Ek Kontenjanı">🔥 2026 Kadın Ek</th>
        <th style="text-align:center; width:85px;" title="İlk Yerleştirme Kadın Kontenjanı ve Yerleşen">♀ İlk Kont./Yer.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:115px; color:#f472b6;" title="2026 Yerleştirme Taban & Tavan Puanı">2026 Kadın Taban (Tavan)</th>
        <th style="text-align:right; width:95px; color:var(--text-secondary);" title="2025 Yerleştirme Taban Puanı ve Sırası">2025 Kadın Taban</th>
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
        <th style="text-align:center; width:100px; color:#c084fc;" title="2026 Engelli Aday Ek Kontenjanı">🔥 2026 Engelli Ek</th>
        <th style="text-align:center; width:85px;" title="İlk Engelli Kontenjan ve Yerleşen">Engelli İlk Kont.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:110px; color:#60a5fa;" title="2026 Engelli Erkek Taban Puanı">♂ 2026 Engelli Erkek</th>
        <th style="text-align:right; width:110px; color:#f472b6;" title="2026 Engelli Kadın Taban Puanı">♀ 2026 Engelli Kadın</th>
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
        <th style="text-align:center; width:95px;" title="Millî Sporcu Kontenjan ve Yerleşen">Millî İlk Kont./Yer.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:110px; color:#60a5fa;" title="2026 Millî Erkek Taban Puanı">♂ 2026 Millî Erkek</th>
        <th style="text-align:right; width:110px; color:#f472b6;" title="2026 Millî Kadın Taban Puanı">♀ 2026 Millî Kadın</th>
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
        <th style="text-align:center; width:105px; color:#10b981;" title="2026 Toplam Ek Kontenjan">🔥 2026 Ek Kont.</th>
        <th style="text-align:center; width:90px;" title="İlk Merkezi Yerleştirme Kontenjan ve Yerleşen">İlk Kont./Yer.</th>
        <th style="width:70px; text-align:center;">Özel Koşullar</th>
        <th style="text-align:right; width:110px; color:#60a5fa;" title="2026 Erkek Yerleştirme Taban ve Tavan Puanı">♂ 2026 Erkek Taban</th>
        <th style="text-align:right; width:110px; color:#f472b6;" title="2026 Kadın Yerleştirme Taban ve Tavan Puanı">♀ 2026 Kadın Taban</th>
      </tr>
    `;
  }
}"""
    content = re.sub(old_headers_pattern, new_headers, content, flags=re.DOTALL)

    # 5. render() table rows
    old_render_pattern = r'// Render Main Table\s*function render\(\) \{.*?\n  pageItems\.forEach\(item => \{.*?\n  \}\);\n\}'
    new_render = """// Render Main Table
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
    tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:40px; color:var(--text-muted);">Aramanıza uygun ÖZYES ek tercih programı bulunamadı.</td></tr>`;
    return;
  }

  pageItems.forEach(item => {
    const isFav = favorites.some(f => f.code === item.code);
    const tr = document.createElement('tr');

    const badgeUnivClass = item.univ_type.includes('Vakıf') ? 'badge-vakif' : (item.univ_type.includes('KKTC') ? 'badge-kktc' : 'badge-devlet');
    const condCodes = item.kosul_ek || item.kosul;
    const condBadges = buildCondBadges(condCodes, item.prog);

    // Accreditation tag
    let akredTag = '';
    if (item.akreditasyon) {
      akredTag = `<span class="badge" style="background:rgba(16,185,129,0.15); color:#10b981; font-size:0.7rem; padding:1px 6px;">${item.akreditasyon}</span>`;
    }
    if (item.tyc) {
      akredTag += `<span class="badge" style="background:rgba(59,130,246,0.15); color:#60a5fa; font-size:0.7rem; padding:1px 6px; margin-left:3px;">TYÇ</span>`;
    }

    let ekCellHtml = '';
    let qCellHtml = '';
    let scoreCol1Html = '';
    let scoreCol2Html = '';

    if (currentCategory === 'erkek') {
      const totMaleEk = (item.ek_kont_genel_e || 0) + (item.ek_kont_engelli_e || 0);
      if (totMaleEk > 0) {
        ekCellHtml = `
          <span class="badge" style="background:rgba(59,130,246,0.18); color:#60a5fa; font-weight:800; font-size:0.86rem; padding:3px 8px; border-radius:6px; border:1px solid rgba(59,130,246,0.3);">${totMaleEk} Erkek Ek</span>
          <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">Genel: ${item.ek_kont_genel_e || 0} | Eng: ${item.ek_kont_engelli_e || 0}</div>
        `;
      } else {
        ekCellHtml = '<span style="color:var(--text-muted); font-size:0.8rem;">—</span>';
      }

      qCellHtml = `
        <div style="font-weight:700; color:#60a5fa; font-size:0.82rem;">${item.kont_genel_e} Kont.</div>
        <div style="font-size:0.74rem; margin-top:2px; font-weight:700; color:#10b981;">${item.yer_2026_e || 0} Yerleşen</div>
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
      const totFemEk = (item.ek_kont_genel_k || 0) + (item.ek_kont_engelli_k || 0);
      if (totFemEk > 0) {
        ekCellHtml = `
          <span class="badge" style="background:rgba(236,72,153,0.18); color:#f472b6; font-weight:800; font-size:0.86rem; padding:3px 8px; border-radius:6px; border:1px solid rgba(236,72,153,0.3);">${totFemEk} Kadın Ek</span>
          <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">Genel: ${item.ek_kont_genel_k || 0} | Eng: ${item.ek_kont_engelli_k || 0}</div>
        `;
      } else {
        ekCellHtml = '<span style="color:var(--text-muted); font-size:0.8rem;">—</span>';
      }

      qCellHtml = `
        <div style="font-weight:700; color:#f472b6; font-size:0.82rem;">${item.kont_genel_k} Kont.</div>
        <div style="font-size:0.74rem; margin-top:2px; font-weight:700; color:#10b981;">${item.yer_2026_k || 0} Yerleşen</div>
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
    } else if (currentCategory === 'engelli') {
      const totEngEk = (item.ek_kont_engelli_e || 0) + (item.ek_kont_engelli_k || 0);
      if (totEngEk > 0) {
        ekCellHtml = `
          <span class="badge" style="background:rgba(168,85,247,0.18); color:#c084fc; font-weight:800; font-size:0.86rem; padding:3px 8px; border-radius:6px; border:1px solid rgba(168,85,247,0.3);">${totEngEk} Engelli Ek</span>
          <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">♂ ${item.ek_kont_engelli_e || 0} &bull; ♀ ${item.ek_kont_engelli_k || 0}</div>
        `;
      } else {
        ekCellHtml = '<span style="color:var(--text-muted); font-size:0.8rem;">—</span>';
      }

      qCellHtml = `
        <div style="font-size:0.75rem; font-weight:700; color:#60a5fa;">♂ ${item.kont_engelli_e} (Yer: ${item.yer_2026_eng_e || 0})</div>
        <div style="font-size:0.75rem; font-weight:700; color:#f472b6; margin-top:2px;">♀ ${item.kont_engelli_k} (Yer: ${item.yer_2026_eng_k || 0})</div>
      `;
      scoreCol1Html = `
        <div style="font-weight:700; color:#60a5fa; font-size:0.88rem;">${item.min_2026_eng_e && item.min_2026_eng_e !== '--' ? item.min_2026_eng_e : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${item.puan_2025_eng_e && item.puan_2025_eng_e !== '--' ? `25: ${item.puan_2025_eng_e}` : '—'}</div>
      `;
      scoreCol2Html = `
        <div style="font-weight:700; color:#f472b6; font-size:0.88rem;">${item.min_2026_eng_k && item.min_2026_eng_k !== '--' ? item.min_2026_eng_k : '<span style="color:var(--text-muted); font-size:0.8rem;">Dolmadı</span>'}</div>
        <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${item.puan_2025_eng_k && item.puan_2025_eng_k !== '--' ? `25: ${item.puan_2025_eng_k}` : '—'}</div>
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
    } else {
      // 'tum' (Tüm Kontenjanlar)
      if (item.has_ek_2026 && item.ek_kont_toplam > 0) {
        ekCellHtml = `
          <span class="badge" style="background:rgba(16,185,129,0.18); color:#10b981; font-weight:800; font-size:0.86rem; padding:3px 8px; border:1px solid rgba(16,185,129,0.35); border-radius:6px;">${item.ek_kont_toplam} Ek Kont.</span>
          <div style="font-size:0.74rem; margin-top:3px; color:var(--text-secondary);">
            <span style="color:#60a5fa; font-weight:700;">♂ ${item.ek_kont_genel_e + item.ek_kont_engelli_e}</span> &bull; <span style="color:#f472b6; font-weight:700;">♀ ${item.ek_kont_genel_k + item.ek_kont_engelli_k}</span>
          </div>
        `;
      } else {
        ekCellHtml = '<span style="color:var(--text-muted); font-size:0.8rem;">—</span>';
      }

      qCellHtml = `
        <div style="font-weight:700; font-size:0.82rem; color:var(--text-primary);">${item.kont_2026_toplam} Kont.</div>
        <div style="font-size:0.74rem; margin-top:2px; color:var(--text-secondary);">
          <span style="color:#10b981; font-weight:600;">${item.yer_2026_toplam} Yer.</span>
          ${item.bos_2026_toplam > 0 ? `<span style="color:#ef4444; font-weight:600;">(${item.bos_2026_toplam} Boş)</span>` : `<span style="color:#10b981; font-weight:600;">(Doldu)</span>`}
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

    if (currentCategory === 'milli') {
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
    } else {
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
        <td style="text-align:center;">${ekCellHtml}</td>
        <td style="text-align:center;">${qCellHtml}</td>
        <td style="text-align:center;">${condBadges}</td>
        <td style="text-align:right;">${scoreCol1Html}</td>
        <td style="text-align:right;">${scoreCol2Html}</td>
      `;
    }
    tableBody.appendChild(tr);
  });
}"""
    content = re.sub(old_render_pattern, new_render, content, flags=re.DOTALL)

    # 6. Export PDF
    old_pdf_fn_pattern = r'function exportFavsPDF\(\) \{.*?\n  doc\.save\(\'2026_OZYES_Tercih_Listem\.pdf\'\);\n\}'
    new_pdf_fn = """function exportFavsPDF() {
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
  doc.text('2026 OZYES SPOR BILIMLERI EK TERCIH LISTEM', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`tercihrobutu.github.io  |  ${new Date().toLocaleDateString('tr-TR')}  |  Toplam: ${favorites.length}/30 Program`, 14, 22);

  const head = [['Sira', 'OSYM Kodu', 'Universite', 'Program', 'Il', 'Ek Kont', 'Ilk Kont/Yer', '26 E.Taban', '26 K.Taban']];
  const body = favorites.map((item, idx) => [
    idx + 1,
    item.code,
    toAscii(item.univ),
    toAscii(item.prog),
    toAscii(item.city),
    item.has_ek_2026 ? `${item.ek_kont_toplam || 0}` : '0',
    `${item.kont_2026_toplam || item.kont_toplam}/${item.yer_2026_toplam || 0}`,
    item.min_2026_e || '--',
    item.min_2026_k || '--'
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
      2: { cellWidth: 62 },
      3: { cellWidth: 58 },
      4: { cellWidth: 24 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 24, halign: 'center' },
      7: { cellWidth: 25, halign: 'right' },
      8: { cellWidth: 25, halign: 'right' }
    }
  });

  doc.save('2026_OZYES_Ek_Tercih_Listem.pdf');
}"""
    content = re.sub(old_pdf_fn_pattern, new_pdf_fn, content, flags=re.DOTALL)

    # 7. Export Excel
    old_excel_fn_pattern = r'function exportFavsExcel\(\) \{.*?\n  XLSX\.writeFile\(workbook, \'2026_OZYES_Tercih_Listem\.xlsx\'\);\n\}'
    new_excel_fn = """function exportFavsExcel() {
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
    '2026 Ek Kontenjan Toplam': item.has_ek_2026 ? (item.ek_kont_toplam || 0) : 0,
    'Genel Erkek Ek': item.ek_kont_genel_e || 0,
    'Genel Kadın Ek': item.ek_kont_genel_k || 0,
    'Engelli Erkek Ek': item.ek_kont_engelli_e || 0,
    'Engelli Kadın Ek': item.ek_kont_engelli_k || 0,
    '2026 İlk Toplam Kontenjan': item.kont_2026_toplam || item.kont_toplam,
    '2026 İlk Toplam Yerleşen': item.yer_2026_toplam || 0,
    '2026 İlk Boş Kontenjan': item.bos_2026_toplam || 0,
    '2026 Erkek Taban Puanı': item.min_2026_e || '--',
    '2026 Erkek Tavan Puanı': item.max_2026_e || '--',
    '2026 Kadın Taban Puanı': item.min_2026_k || '--',
    '2026 Kadın Tavan Puanı': item.max_2026_k || '--',
    '2025 Erkek Taban Puanı': item.puan_2025_e || '--',
    '2025 Kadın Taban Puanı': item.puan_2025_k || '--',
    'Akreditasyon': item.akreditasyon || '',
    'TYÇ': item.tyc || '',
    'Ek Tercih Özel Koşulları': item.kosul_ek || item.kosul || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ÖZYES Ek Tercihlerim');
  XLSX.writeFile(workbook, '2026_OZYES_Ek_Tercih_Listem.xlsx');
}"""
    content = re.sub(old_excel_fn_pattern, new_excel_fn, content, flags=re.DOTALL)

    # 8. checkURLParams()
    old_params_pattern = r'function checkURLParams\(\) \{.*?\n\}'
    new_params = """function checkURLParams() {
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

  const durum = params.get('durum') || params.get('ek') || params.get('status');
  if (durum && filterStatus) {
    if (['only_ek', 'all', 'placed2026', 'full2026', 'no_ek'].includes(durum)) {
      filterStatus.value = durum;
    }
  }
}"""
    content = re.sub(old_params_pattern, new_params, content, flags=re.DOTALL)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated ozyes.js successfully.")

def update_index_html():
    file_path = os.path.join(REPO_DIR, "index.html")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Nav link
    content = re.sub(
        r'<a href="ozyes\.html" class="btn btn-primary"[^>]*>🏃 ÖZYES Robotu <span[^>]*>2026 Sonuç</span></a>',
        '<a href="ozyes.html" class="btn btn-primary" style="padding:0.45rem 0.85rem; font-size:0.85rem; text-decoration:none; background:#10b981; border-color:#10b981; color:#fff; font-weight:700;">🏃 ÖZYES Ek Tercih <span style="font-size:0.7rem; background:#047857; color:#fff; padding:1px 5px; border-radius:10px; margin-left:2px;">2.519 Ek Kont.</span></a>',
        content
    )

    # Spotlight banner button
    content = re.sub(
        r'<a href="ozyes\.html" class="btn btn-primary"[^>]*>\s*🏃 ÖZYES Sonuç\s*</a>',
        """<a href="ozyes.html" class="btn btn-primary" style="padding: 10px 18px; font-size: 0.92rem; font-weight: 700; text-decoration: none; background: #10b981; color: #fff; border-color: #10b981; white-space: nowrap; box-shadow: 0 4px 14px rgba(16,185,129,0.35);">
          🏃 ÖZYES Ek Tercih (2.519 Kont.) →
        </a>""",
        content
    )

    # ÖZYES Card (Card 1)
    old_card_pattern = r'<!-- Card 1: ÖZYES Robotu \(2026 Yerleştirme Sonuçları\) -->.*?<a href="ozyes\.html" class="btn btn-primary"[^>]*>.*?ÖZYES Sonuçları →\s*</a>\s*</div>'
    new_card = """<!-- Card 1: ÖZYES Robotu (2026 Ek Tercih ve Taban Puanları) -->
      <div style="background: var(--bg-card); border: 2px solid #10b981; border-radius: 18px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(16,185,129,0.18); position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #10b981, #06b6d4);"></div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem;">
            <div style="font-size: 2.5rem; background: rgba(16,185,129,0.15); width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
              🏃
            </div>
            <span style="background: #10b981; color: #fff; font-weight: 800; font-size: 0.78rem; padding: 4px 10px; border-radius: 8px;">
              2026 EK TERCİH AÇILDI
            </span>
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.6rem;">
            2026 ÖZYES Spor Bilimleri Ek Tercih Robotu
          </h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.4rem;">
            ÖSYM 2026-ÖZYES Ek Tercih Kılavuzu: 325 Spor Bilimleri lisans programında 2.519 ek kontenjan (1.006 Erkek, 951 Kadın, 327 Engelli Erkek, 235 Engelli Kadın) ve resmi taban puanları.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; background: var(--bg-primary); padding: 1rem; border-radius: 12px;">
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #10b981;">2.519</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Toplam Ek Kontenjan</div>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-primary);">325</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Ek Kontenjanlı Program</div>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #60a5fa;">1.333</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Erkek Ek (1.006+327)</div>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #f472b6;">1.186</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Kadın Ek (951+235)</div>
            </div>
          </div>
        </div>

        <a href="ozyes.html" class="btn btn-primary" style="padding: 12px 20px; font-size: 1rem; font-weight: 700; text-decoration: none; text-align: center; border-radius: 10px; background: #10b981; box-shadow: 0 4px 14px rgba(16,185,129,0.35);">
          ÖZYES Ek Tercih Robotuna Git →
        </a>
      </div>"""
    content = re.sub(old_card_pattern, new_card, content, flags=re.DOTALL)

    # Footer link
    content = re.sub(
        r'<a href="ozyes\.html" style="color: var\(--text-secondary\); text-decoration: none;">🏃 ÖZYES Robotu</a>',
        '<a href="ozyes.html" style="color: var(--text-secondary); text-decoration: none;">🏃 ÖZYES Ek Tercih</a>',
        content
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated index.html successfully.")

def update_verify_script():
    file_path = os.path.join(REPO_DIR, "scripts", "verify_ozyes.js")
    code = """const fs = require('fs');
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
    const codes = cStr.split(/[\\s,]+/).map(c => c.trim()).filter(c => c && /^\\d+$/.test(c));
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
const idMatches = Array.from(ozyesJs.matchAll(/document\\.getElementById\\(['"]([^'"]+)['"]\\)/g)).map(m => m[1]);
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

console.log('\\n=== ALL 2026 ÖZYES EK TERCİH VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated scripts/verify_ozyes.js successfully.")

def update_sitemap_builder():
    file_path = os.path.join(REPO_DIR, "scripts", "build_sitemap.py")
    if not os.path.exists(file_path):
        print("build_sitemap.py does not exist, skipping.")
        return
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'ozyes.html?durum=only_ek' not in content:
        content = content.replace(
            'urls.add((f"{BASE_URL}ozyes.html", \'0.9\', \'daily\'))',
            'urls.add((f"{BASE_URL}ozyes.html", \'0.95\', \'daily\'))\n    urls.add((f"{BASE_URL}ozyes.html?durum=only_ek", \'0.95\', \'daily\'))'
        )
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated scripts/build_sitemap.py successfully.")

if __name__ == "__main__":
    update_ozyes_html()
    update_ozyes_js()
    update_index_html()
    update_verify_script()
    update_sitemap_builder()
