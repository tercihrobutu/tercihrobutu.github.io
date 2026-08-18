import os
import re
import json
import urllib.parse
from datetime import datetime

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LISANS_JS = os.path.join(REPO_ROOT, 'data', 'lisans.js')
ONLISANS_JS = os.path.join(REPO_ROOT, 'data', 'onlisans.js')
OUTPUT_SITEMAP = os.path.join(REPO_ROOT, 'sitemap.xml')

BASE_URL = 'https://tercihrobutu.github.io/'
TODAY = datetime.now().strftime('%Y-%m-%d')

def load_data(filepath, var_name):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    json_match = re.search(r'window\.' + var_name + r'\s*=\s*(\[.*?\]);?\s*$', content, re.DOTALL)
    if not json_match:
        return []
    return json.loads(json_match.group(1))

def clean_noise(text):
    if not text:
        return ''
    return re.sub(r'^(?:\d+\s*,\s*)+\d+\s+(?=[A-ZÇĞİÖŞÜIİa-zçğıöşüıâîû])', '', str(text)).strip()

def to_tr_title(text):
    if not text:
        return ''
    # Remove parenthetical noise like (ANKARA), (MERSİN), (ADANA), (İNGİLİZCE)
    clean = re.sub(r'\s*\([^)]*\)', '', str(text)).strip()
    words = clean.split()
    title_words = []
    tr_map_lower = {'İ': 'i', 'I': 'ı', 'Ş': 'ş', 'Ğ': 'ğ', 'Ü': 'ü', 'Ö': 'ö', 'Ç': 'ç'}
    tr_map_upper = {'i': 'İ', 'ı': 'I', 'ş': 'Ş', 'ğ': 'Ğ', 'ü': 'Ü', 'ö': 'Ö', 'ç': 'Ç'}
    
    for w in words:
        if not w:
            continue
        # Convert word to lower first using TR rules
        w_low = ''
        for ch in w:
            w_low += tr_map_lower.get(ch, ch.lower())
        
        # Capitalize first char
        first = tr_map_upper.get(w_low[0], w_low[0].upper())
        rest = w_low[1:]
        title_words.append(first + rest)
    return ' '.join(title_words)

def build_sitemap():
    print("Loading data...")
    lisans_data = load_data(LISANS_JS, 'DATA_LISANS')
    onlisans_data = load_data(ONLISANS_JS, 'DATA_ONLISANS')
    all_items = lisans_data + onlisans_data
    print(f"Loaded {len(all_items)} total programs.")

    urls = set()

    # 1. Base URL & Tabs
    urls.add((BASE_URL, '1.0', 'daily'))
    urls.add((f"{BASE_URL}?tab=lisans", '0.9', 'daily'))
    urls.add((f"{BASE_URL}?tab=onlisans", '0.9', 'daily'))

    # 2. Education Types (AÖF, Uzaktan, Örgün)
    for tip in ['AÖF', 'Uzaktan', 'Örgün']:
        urls.add((f"{BASE_URL}?tur={tip}", '0.85', 'weekly'))
        urls.add((f"{BASE_URL}?tur={tip}&tab=onlisans", '0.85', 'weekly'))

    # 3. Score Types
    for puan in ['SAY', 'EA', 'SÖZ', 'DİL', 'TYT']:
        urls.add((f"{BASE_URL}?puan={puan}", '0.85', 'weekly'))

    # 4. Extract Unique Cities, Universities, and Departments
    cities = set()
    universities = set()
    departments = set()

    for item in all_items:
        c = clean_noise(item.get('city', ''))
        u = clean_noise(item.get('univ', ''))
        p = clean_noise(item.get('prog', ''))

        if c:
            cities.add(to_tr_title(c))
        if u and len(u) > 3:
            u_clean = to_tr_title(u)
            if len(u_clean) > 3:
                universities.add(u_clean)
        if p and len(p) > 2:
            p_clean = to_tr_title(p)
            if len(p_clean) > 2:
                departments.add(p_clean)

    print(f"Extracted: {len(cities)} cities, {len(universities)} universities, {len(departments)} departments.")

    # 5. Add all Cities (81 il + yurt dışı)
    for city in sorted(cities):
        q_city = city.replace(' ', '%20')
        urls.add((f"{BASE_URL}?sehir={q_city}", '0.8', 'weekly'))

    # 6. Add all Universities (200+ universities)
    for univ in sorted(universities):
        q_univ = univ.replace(' ', '%20')
        urls.add((f"{BASE_URL}?q={q_univ}", '0.8', 'weekly'))

    # 7. Add all Departments/Programs
    for dept in sorted(departments):
        q_dept = dept.replace(' ', '%20')
        urls.add((f"{BASE_URL}?q={q_dept}", '0.8', 'weekly'))

    # 8. City + Major Score Type Combinations for major metropolitan cities
    major_cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Eskişehir', 'Kocaeli', 'Gaziantep', 'Samsun', 'Trabzon', 'Kayseri', 'Osmaniye']
    for mc in major_cities:
        if mc in cities:
            q_mc = mc.replace(' ', '%20')
            for puan in ['SAY', 'EA', 'SÖZ', 'TYT']:
                urls.add((f"{BASE_URL}?sehir={q_mc}&puan={puan}", '0.75', 'weekly'))

    print(f"Total unique URLs generated in sitemap: {len(urls)}")

    # Write XML
    xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    sorted_urls = sorted(list(urls), key=lambda x: (0 if x[0] == BASE_URL else 1, -float(x[1]), x[0]))

    for loc, priority, changefreq in sorted_urls:
        xml_loc = loc.replace('&', '&amp;')
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{xml_loc}</loc>')
        xml_lines.append(f'    <lastmod>{TODAY}</lastmod>')
        xml_lines.append(f'    <changefreq>{changefreq}</changefreq>')
        xml_lines.append(f'    <priority>{priority}</priority>')
        xml_lines.append('  </url>')

    xml_lines.append('</urlset>\n')

    with open(OUTPUT_SITEMAP, 'w', encoding='utf-8') as f:
        f.write('\n'.join(xml_lines))

    print(f"Successfully generated {OUTPUT_SITEMAP} with {len(sorted_urls)} URLs!")

if __name__ == '__main__':
    build_sitemap()
