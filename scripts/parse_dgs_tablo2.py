import fitz
import json
import re
import os
import unicodedata

PDF2_PATH = r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project\2026_DGS-tablo-2-on-lisans-mezuniyet-alanlarina-gore-dikey-gecis-yapilabilecek-lisans-programlari-yme5f7-27090615.pdf'
OUTPUT_MAPPING_JS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'dgs_mapping.js')

def clean_tr(text):
    if not text:
        return ''
    norm = unicodedata.normalize('NFC', str(text))
    norm = norm.replace('\u0307', '').replace('\u200b', '')
    return ' '.join(norm.split()).strip()

def parse_tablo2():
    print(f"Opening Tablo-2 PDF: {PDF2_PATH}")
    doc = fitz.open(PDF2_PATH)
    print(f"Total pages: {len(doc)}")

    # Mapping structure:
    # 1. onlisans_to_lisans: { 'Adalet': { 'codes': ['1102', '9339', ...], 'lisans_kodlari': ['3209'], 'lisans_programlari': ['Hukuk'] } }
    # 2. onlisans_fields: sorted list of { 'name': 'Adalet', 'kod': '1102', 'lisans_count': 1 } for dropdown
    # 3. lisans_alan_kodu_to_name: { '3209': 'Hukuk', ... }

    onlisans_map = {}
    lisans_kod_to_name = {}
    total_associations = 0

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        tab_finder = page.find_tables()
        if not tab_finder.tables:
            continue

        for table in tab_finder.tables:
            rows = table.extract()
            for r in rows:
                if not r or len(r) < 4:
                    continue
                
                c0 = r[0] # Alan Kodu (Önlisans)
                c1 = r[1] # Ön Lisans Mezuniyet Alanı
                c2 = r[2] # Tercih Yapılabilecek Lisans Programları
                c3 = r[3] # Lisans Alan Kodu
                c4 = r[4] if len(r) > 4 else '' # Puan Türü

                # Skip header rows
                if not c0 or 'Alan' in str(c0) or 'TABLO-2' in str(c0) or not c1 or not c2 or not c3:
                    continue

                onlisans_codes = [clean_tr(x) for x in str(c0).split('\n') if clean_tr(x)]
                onlisans_names = [clean_tr(x) for x in str(c1).split('\n') if clean_tr(x)]
                lisans_progs = [clean_tr(x) for x in str(c2).split('\n') if clean_tr(x)]
                lisans_codes = [clean_tr(x) for x in str(c3).split('\n') if re.match(r'^\d{4}$', clean_tr(x))]
                puan_types = [clean_tr(x) for x in str(c4).split('\n') if clean_tr(x)]

                if not onlisans_names or not lisans_codes:
                    continue

                # Map lisans codes to prog names
                for i, l_kod in enumerate(lisans_codes):
                    l_prog = lisans_progs[i] if i < len(lisans_progs) else (lisans_progs[-1] if lisans_progs else '')
                    if l_kod and l_prog:
                        lisans_kod_to_name[l_kod] = l_prog

                # Pair each onlisans program with these lisans codes
                for j, o_name in enumerate(onlisans_names):
                    o_code = onlisans_codes[j] if j < len(onlisans_codes) else ''
                    if not o_name:
                        continue

                    if o_name not in onlisans_map:
                        onlisans_map[o_name] = {
                            'name': o_name,
                            'codes': set(),
                            'lisans_kodlari': set(),
                            'lisans_programlari': set()
                        }
                    
                    if o_code:
                        onlisans_map[o_name]['codes'].add(o_code)

                    for l_kod in lisans_codes:
                        onlisans_map[o_name]['lisans_kodlari'].add(l_kod)
                        if l_kod in lisans_kod_to_name:
                            onlisans_map[o_name]['lisans_programlari'].add(lisans_kod_to_name[l_kod])

                    for l_prog in lisans_progs:
                        onlisans_map[o_name]['lisans_programlari'].add(l_prog)

                    total_associations += len(lisans_codes)

    # Convert sets to sorted lists for JSON serialization
    serialized_map = {}
    dropdown_list = []

    for name, item in onlisans_map.items():
        codes_list = sorted(list(item['codes']))
        lisans_codes_list = sorted(list(item['lisans_kodlari']))
        lisans_progs_list = sorted(list(item['lisans_programlari']))
        
        serialized_map[name] = {
            'name': name,
            'codes': codes_list,
            'lisans_kodlari': lisans_codes_list,
            'lisans_programlari': lisans_progs_list
        }

        dropdown_list.append({
            'name': name,
            'kod': codes_list[0] if codes_list else '',
            'count': len(lisans_codes_list)
        })

    # Sort dropdown list alphabetically in Turkish
    dropdown_list.sort(key=lambda x: x['name'].replace('İ', 'i').replace('I', 'ı').lower())

    print(f"Extracted {len(serialized_map)} unique Önlisans Mezuniyet Alanları.")
    print(f"Extracted {len(lisans_kod_to_name)} unique Lisans Alan Kodları.")

    # Save to data/dgs_mapping.js
    os.makedirs(os.path.dirname(OUTPUT_MAPPING_JS), exist_ok=True)
    with open(OUTPUT_MAPPING_JS, 'w', encoding='utf-8') as f:
        f.write('// 2026 DGS Tablo-2 Ön Lisans Mezuniyet Alanlarına Göre Dikey Geçiş Eşleştirme Verisi\n')
        f.write('window.DATA_DGS_MAPPING = ')
        json.dump(serialized_map, f, ensure_ascii=False, indent=2)
        f.write(';\n\n')
        f.write('window.DATA_DGS_MEZUNIYET_ALANLARI = ')
        json.dump(dropdown_list, f, ensure_ascii=False, indent=2)
        f.write(';\n')

    print(f"Successfully saved to {OUTPUT_MAPPING_JS} ({os.path.getsize(OUTPUT_MAPPING_JS) / 1024:.1f} KB)")
    return serialized_map

if __name__ == '__main__':
    parse_tablo2()
