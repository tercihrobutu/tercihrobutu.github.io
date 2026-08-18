import json
import re

with open('data/lisans.js', 'r', encoding='utf-8') as f:
    lisans_text = f.read()
    lisans = json.loads(re.search(r'=\s*(\[.*?\]);?\s*$', lisans_text, re.DOTALL).group(1))

with open('data/onlisans.js', 'r', encoding='utf-8') as f:
    onlisans_text = f.read()
    onlisans = json.loads(re.search(r'=\s*(\[.*?\]);?\s*$', onlisans_text, re.DOTALL).group(1))

def tr_norm(s):
    if not s:
        return ''
    s = s.replace('İ', 'i').replace('I', 'ı').lower()
    s = s.replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    return s.strip()

test_urls = [
    ('https://tercihrobutu.github.io/?tab=lisans&puan=EA', {'tab': 'lisans', 'puan': 'EA'}),
    ('https://tercihrobutu.github.io/?tab=lisans&amp;puan=SAY', {'tab': 'lisans', 'puan': 'SAY'}),
    ('https://tercihrobutu.github.io/?tab=onlisans&puan=TYT', {'tab': 'onlisans', 'puan': 'TYT'}),
    ('https://tercihrobutu.github.io/?tab=lisans&q=Çankırı%20Karatekin%20Üniversitesi', {'tab': 'lisans', 'q': 'Çankırı Karatekin Üniversitesi'}),
    ('https://tercihrobutu.github.io/?tab=lisans&q=Bilgisayar%20Mühendisliği', {'tab': 'lisans', 'q': 'Bilgisayar Mühendisliği'}),
    ('https://tercihrobutu.github.io/?tab=onlisans&q=İlk%20ve%20Acil%20Yardım', {'tab': 'onlisans', 'q': 'İlk ve Acil Yardım'}),
    ('https://tercihrobutu.github.io/?tab=onlisans&tur=AÖF', {'tab': 'onlisans', 'tur': 'AÖF'}),
    ('https://tercihrobutu.github.io/?tab=lisans&sehir=İstanbul&puan=SAY', {'tab': 'lisans', 'sehir': 'İstanbul', 'puan': 'SAY'}),
    ('https://tercihrobutu.github.io/?tab=lisans&q=İstanbul%20Üniversitesi-Cerrahpaşa', {'tab': 'lisans', 'q': 'İstanbul Üniversitesi-Cerrahpaşa'}),
    ('https://tercihrobutu.github.io/?sehir=Ankara,İzmir', {'sehir': 'Ankara,İzmir'})
]

print('=== SITEMAP SAMPLE URL TEST RESULTS ===\n')

for i, (raw_url, p) in enumerate(test_urls):
    tab = p.get('tab', 'lisans')
    dataset = lisans if tab == 'lisans' else onlisans
    q = tr_norm(p.get('q', ''))
    puan = p.get('puan', '')
    tur = p.get('tur', '')
    cities = p.get('sehir', '').split(',') if p.get('sehir') else []

    matches = []
    for item in dataset:
        if q:
            target = tr_norm(item.get('univ', '') + ' ' + item.get('prog', '') + ' ' + item.get('fac', ''))
            if q not in target:
                continue
        if puan and item.get('score_type') != puan:
            continue
        if tur and item.get('tip') != tur:
            continue
        if cities and item.get('city') not in cities:
            continue
        matches.append(item)

    print(f'Test #{i+1}: {raw_url}')
    print(f'  [Sekme]: {tab.upper()}')
    print(f'  [Sonuc]: {len(matches)} program bulundu')
    if matches:
        first = matches[0]
        code = first.get("code")
        univ = first.get("univ")
        prog = first.get("prog")
        city = first.get("city")
        score_type = first.get("score_type")
        print(f'  [Ornek Program]: [{code}] {univ} - {prog} ({city}) | Puan: {score_type}')
    print('-' * 60)
