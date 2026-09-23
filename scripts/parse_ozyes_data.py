import os
import sys
import re
import json
import pypdf
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OSYES_DIR = r"C:\Users\Dell\Downloads\Compressed\TercihRobutu\OSYES"
F_2026 = os.path.join(OSYES_DIR, "2026-ozyes-tercih-kilavuzu-on-bilgi-joy4tt-22144107.pdf")
F_2025 = os.path.join(OSYES_DIR, "2025-ozyes-yerlestirme-sonuclarina-liskin-sayisal-bilgiler-en-kucuk-puanlar-ve-basari-sirasi-au3tu3-22151121.pdf")

DATA_DIR = os.path.join(REPO_ROOT, "data")
OUT_PROGRAMS_JS = os.path.join(DATA_DIR, "ozyes_programs.js")
OUT_CONDITIONS_JS = os.path.join(DATA_DIR, "ozyes_conditions.js")

CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
    "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
    "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
    "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
    "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul",
    "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale",
    "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
    "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye",
    "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
]

def turkish_normalize(text):
    if not text:
        return ""
    return (text.replace("İ", "i").replace("I", "ı").lower()
            .replace("ı", "i").replace("ğ", "g").replace("ü", "u")
            .replace("ş", "s").replace("ö", "o").replace("ç", "c"))

NORM_CITIES = {turkish_normalize(c): c for c in CITIES}

def find_city(univ_name):
    u_norm = turkish_normalize(univ_name)
    m = re.search(r'\((.*?)\)', univ_name)
    if m:
        in_norm = turkish_normalize(m.group(1))
        for nc, c in NORM_CITIES.items():
            if nc in in_norm or in_norm in nc:
                return c
        if 'kktc' in in_norm or 'kibris' in in_norm:
            return 'KKTC'
        if 'kirgizistan' in in_norm:
            return 'Kırgızistan'
    for nc, c in NORM_CITIES.items():
        if nc in u_norm:
            return c
    if any(k in u_norm for k in ['kibris', 'kktc', 'dogu akdeniz', 'girne', 'lefke', 'yakin dogu']):
        return 'KKTC'
    return 'Diğer'

def parse_float_tr(val_str):
    if not val_str or val_str in ['--', '----', '-', '']:
        return None
    try:
        return round(float(val_str.replace('.', '').replace(',', '.')), 5)
    except:
        try:
            return round(float(val_str.replace(',', '.')), 5)
        except:
            return None

def parse_int_safe(val_str):
    if not val_str or val_str in ['--', '----', '-', '']:
        return 0
    try:
        return int(val_str.replace('.', '').strip())
    except:
        return 0

def extract_2025_results(pdf_path):
    print("Extracting 2025 ÖZYES results...")
    reader = pypdf.PdfReader(pdf_path)
    res = {}
    
    for page in reader.pages:
        for line in page.extract_text().splitlines():
            line = line.strip()
            m = re.match(r'^(\d{8,9})\s+(DEVLET|VAKIF|KKTC)\s+(.*)$', line)
            if not m:
                continue
            code = m.group(1)
            utype = m.group(2)
            rest = m.group(3)
            tokens = rest.split()
            if len(tokens) < 25:
                continue
            
            nums = tokens[-24:]
            res[code] = {
                'utype_2025': utype.capitalize(),
                # Genel Erkek
                'kont_2025_e': parse_int_safe(nums[0]),
                'yer_2025_e': parse_int_safe(nums[1]),
                'puan_2025_e': nums[2],
                'puan_2025_e_val': parse_float_tr(nums[2]),
                'sira_2025_e': nums[3],
                'sira_2025_e_val': parse_int_safe(nums[3]),
                # Genel Kadın
                'kont_2025_k': parse_int_safe(nums[4]),
                'yer_2025_k': parse_int_safe(nums[5]),
                'puan_2025_k': nums[6],
                'puan_2025_k_val': parse_float_tr(nums[6]),
                'sira_2025_k': nums[7],
                'sira_2025_k_val': parse_int_safe(nums[7]),
                # Milli Erkek
                'kont_2025_milli_e': parse_int_safe(nums[8]),
                'yer_2025_milli_e': parse_int_safe(nums[9]),
                'puan_2025_milli_e': nums[10],
                'sira_2025_milli_e': nums[11],
                # Milli Kadın
                'kont_2025_milli_k': parse_int_safe(nums[12]),
                'yer_2025_milli_k': parse_int_safe(nums[13]),
                'puan_2025_milli_k': nums[14],
                'sira_2025_milli_k': nums[15],
                # Engelli Erkek
                'kont_2025_eng_e': parse_int_safe(nums[16]),
                'yer_2025_eng_e': parse_int_safe(nums[17]),
                'puan_2025_eng_e': nums[18],
                'sira_2025_eng_e': nums[19],
                # Engelli Kadın
                'kont_2025_eng_k': parse_int_safe(nums[20]),
                'yer_2025_eng_k': parse_int_safe(nums[21]),
                'puan_2025_eng_k': nums[22],
                'sira_2025_eng_k': nums[23]
            }
            
    print(f"Total 2025 records parsed: {len(res)}")
    return res

def extract_2026_guide(pdf_path):
    print("Extracting 2026 ÖZYES Guide table...")
    programs = []
    current_univ = ""
    current_fac = ""

    with pdfplumber.open(pdf_path) as pdf:
        for pno in range(2, 9): # pages 3 to 9
            table = pdf.pages[pno].extract_table()
            if not table:
                continue
            for row in table:
                if not row or len(row) < 10:
                    continue
                code = (row[0] or "").strip()
                col1 = (row[1] or "").strip().replace("\n", " ")
                if not code:
                    col1_up = col1.upper()
                    if ("ÜNİVERSİTESİ" in col1_up or "AKADEMİSİ" in col1_up or "ENSTİTÜSÜ" in col1_up) and ("FAKÜLTESİ" not in col1_up and "YÜKSEKOKULU" not in col1_up):
                        current_univ = col1.strip()
                        current_fac = ""
                    elif any(w in col1_up for w in ["FAKÜLTESİ", "YÜKSEKOKULU", "BÖLÜMÜ"]):
                        current_fac = col1.strip()
                elif code.isdigit():
                    programs.append({
                        'code': code,
                        'univ': current_univ,
                        'fac': current_fac,
                        'prog': col1.strip(),
                        'sure': (row[2] or "4").strip(),
                        'kont_genel_e': parse_int_safe(row[3]),
                        'kont_genel_k': parse_int_safe(row[4]),
                        'kont_milli_e': parse_int_safe(row[5]),
                        'kont_milli_k': parse_int_safe(row[6]),
                        'kont_engelli_e': parse_int_safe(row[7]),
                        'kont_engelli_k': parse_int_safe(row[8]),
                        'kosul': (row[9] or "").strip().replace('\n', ' '),
                        'akreditasyon': (row[10] or "").strip() if len(row) > 10 else "",
                        'tyc': (row[11] or "").strip() if len(row) > 11 else ""
                    })

    print(f"Total 2026 programs parsed: {len(programs)}")
    return programs

def extract_conditions(pdf_path):
    print("Extracting 2026 ÖZYES Conditions...")
    reader = pypdf.PdfReader(pdf_path)
    cond_text = ""
    for pno in range(9, 18): # pages 10 to 18 (including Bk. 202 on page 18)
        cond_text += reader.pages[pno].extract_text() + "\n"

    matches = re.findall(r'Bk\.\s*(\d+)\s+(.*?)(?=(?:Bk\.\s*\d+|$))', cond_text, re.DOTALL)
    conditions = {}
    for num, text in matches:
        cleaned = " ".join(text.split()).strip()
        conditions[num] = cleaned

    print(f"Total conditions extracted: {len(conditions)}")
    return conditions

def main():
    res_2025 = extract_2025_results(F_2025)
    progs_2026 = extract_2026_guide(F_2026)
    conditions = extract_conditions(F_2026)

    final_programs = []
    for p in progs_2026:
        code = p['code']
        univ = p['univ']
        city = find_city(univ)
        
        # Univ type
        if 'VAKIF' in univ.upper():
            utype = 'Vakıf'
        elif 'KKTC' in univ.upper() or 'KIBRIS' in univ.upper():
            utype = 'KKTC'
        elif 'KIRGIZİSTAN' in univ.upper():
            utype = 'Yurtdışı'
        else:
            utype = 'Devlet'
            
        tot_kont = (p['kont_genel_e'] + p['kont_genel_k'] + 
                    p['kont_milli_e'] + p['kont_milli_k'] + 
                    p['kont_engelli_e'] + p['kont_engelli_k'])
        
        item = {
            'code': code,
            'univ': univ,
            'city': city,
            'univ_type': utype,
            'fac': p['fac'],
            'prog': p['prog'],
            'sure': p['sure'],
            # 2026 Kontenjanları
            'kont_toplam': tot_kont,
            'kont_genel_e': p['kont_genel_e'],
            'kont_genel_k': p['kont_genel_k'],
            'kont_milli_e': p['kont_milli_e'],
            'kont_milli_k': p['kont_milli_k'],
            'kont_engelli_e': p['kont_engelli_e'],
            'kont_engelli_k': p['kont_engelli_k'],
            'kosul': p['kosul'],
            'akreditasyon': p['akreditasyon'],
            'tyc': p['tyc']
        }
        
        # Merge 2025 Results
        if code in res_2025:
            r = res_2025[code]
            item['has_2025'] = True
            item['puan_2025_e'] = r['puan_2025_e']
            item['puan_2025_e_val'] = r['puan_2025_e_val']
            item['sira_2025_e'] = r['sira_2025_e']
            item['sira_2025_e_val'] = r['sira_2025_e_val']
            
            item['puan_2025_k'] = r['puan_2025_k']
            item['puan_2025_k_val'] = r['puan_2025_k_val']
            item['sira_2025_k'] = r['sira_2025_k']
            item['sira_2025_k_val'] = r['sira_2025_k_val']
            
            item['yer_2025_e'] = r['yer_2025_e']
            item['yer_2025_k'] = r['yer_2025_k']
            
            # Milli / Engelli
            item['puan_2025_milli_e'] = r['puan_2025_milli_e']
            item['sira_2025_milli_e'] = r['sira_2025_milli_e']
            item['puan_2025_milli_k'] = r['puan_2025_milli_k']
            item['sira_2025_milli_k'] = r['sira_2025_milli_k']
            item['puan_2025_eng_e'] = r['puan_2025_eng_e']
            item['sira_2025_eng_e'] = r['sira_2025_eng_e']
            item['puan_2025_eng_k'] = r['puan_2025_eng_k']
            item['sira_2025_eng_k'] = r['sira_2025_eng_k']
        else:
            item['has_2025'] = False
            item['puan_2025_e'] = '--'
            item['puan_2025_e_val'] = None
            item['sira_2025_e'] = '--'
            item['sira_2025_e_val'] = None
            
            item['puan_2025_k'] = '--'
            item['puan_2025_k_val'] = None
            item['sira_2025_k'] = '--'
            item['sira_2025_k_val'] = None
            
            item['yer_2025_e'] = 0
            item['yer_2025_k'] = 0
            item['puan_2025_milli_e'] = '--'
            item['sira_2025_milli_e'] = '--'
            item['puan_2025_milli_k'] = '--'
            item['sira_2025_milli_k'] = '--'
            item['puan_2025_eng_e'] = '--'
            item['sira_2025_eng_e'] = '--'
            item['puan_2025_eng_k'] = '--'
            item['sira_2025_eng_k'] = '--'
            
        final_programs.append(item)

    print(f"Saving {len(final_programs)} programs to {OUT_PROGRAMS_JS}...")
    with open(OUT_PROGRAMS_JS, 'w', encoding='utf-8') as f:
        f.write(f"window.DATA_OZYES_PROGRAMS={json.dumps(final_programs, ensure_ascii=False, separators=(',', ':'))};\n")

    print(f"Saving {len(conditions)} conditions to {OUT_CONDITIONS_JS}...")
    with open(OUT_CONDITIONS_JS, 'w', encoding='utf-8') as f:
        f.write(f"window.DATA_OZYES_CONDITIONS={json.dumps(conditions, ensure_ascii=False, indent=2)};\n")

    print("SUCCESS: Both data/ozyes_programs.js and data/ozyes_conditions.js generated successfully!")

if __name__ == '__main__':
    main()
