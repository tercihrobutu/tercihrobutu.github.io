import os
import re
import json
import fitz

BASE_DIR = r"C:\Users\yakupcontarli\Downloads\Documents\2026MuhendislikTamamlama"
REPO_DIR = r"C:\Users\yakupcontarli\Documents\GitHub\tercihrobutu.github.io"
DATA_DIR = os.path.join(REPO_DIR, "data")

GUIDE_PDF = os.path.join(BASE_DIR, "2026-teknik-ogretmenler-cin-muhendislik-tamamlama-programlari-tercih-kilavuzu-x3ihe9-23085953.pdf")
MINMAX_2026_PDF = r"C:\Users\yakupcontarli\Downloads\Compressed\OSYM\2026-teknik-ogretmenler-cin-muhendislik-tamamlama-programlari-yerlestirme-sonuclarina-liskin-en-kucuk-ve-en-buyuk-puanlar-1npqva-07104317.pdf"
MINMAX_2025_PDF = os.path.join(BASE_DIR, "minmax_mtyd30092025.pdf")
MINMAX_2024_PDF = os.path.join(BASE_DIR, "minmax_mtd08102024.pdf")

CITY_OVERRIDE = {
    "GEBZE TEKNİK ÜNİVERSİTESİ (Devlet Üniversitesi)": "Kocaeli",
    "İSTANBUL ÜNİVERSİTESİ-CERRAHPAŞA (Devlet Üniversitesi)": "İstanbul",
    "MARMARA ÜNİVERSİTESİ (İSTANBUL) (Devlet Üniversitesi)": "İstanbul",
    "DOKUZ EYLÜL ÜNİVERSİTESİ (İZMİR) (Devlet Üniversitesi)": "İzmir",
    "GAZİ ÜNİVERSİTESİ (ANKARA) (Devlet Üniversitesi)": "Ankara",
    "ANKARA ÜNİVERSİTESİ (Devlet Üniversitesi)": "Ankara",
    "ISPARTA UYGULAMALI BİLİMLER ÜNİVERSİTESİ (Devlet Üniversitesi)": "Isparta",
    "SAKARYA UYGULAMALI BİLİMLER ÜNİVERSİTESİ (Devlet Üniversitesi)": "Sakarya",
    "BURSA TEKNİK ÜNİVERSİTESİ (Devlet Üniversitesi)": "Bursa",
    "BURSA ULUDAĞ ÜNİVERSİTESİ (Devlet Üniversitesi)": "Bursa",
    "ERZURUM TEKNİK ÜNİVERSİTESİ (Devlet Üniversitesi)": "Erzurum",
    "KONYA TEKNİK ÜNİVERSİTESİ (Devlet Üniversitesi)": "Konya",
    "NECMETTİN ERBAKAN ÜNİVERSİTESİ (KONYA) (Devlet Üniversitesi)": "Konya",
    "SELÇUK ÜNİVERSİTESİ (KONYA) (Devlet Üniversitesi)": "Konya",
    "ESKİŞEHİR OSMANGAZİ ÜNİVERSİTESİ (Devlet Üniversitesi)": "Eskişehir",
    "KARADENİZ TEKNİK ÜNİVERSİTESİ (TRABZON) (Devlet Üniversitesi)": "Trabzon",
    "İSKENDERUN TEKNİK ÜNİVERSİTESİ (HATAY) (Devlet Üniversitesi)": "Hatay",
    "ÇUKUROVA ÜNİVERSİTESİ (ADANA) (Devlet Üniversitesi)": "Adana",
    "DİCLE ÜNİVERSİTESİ (DİYARBAKIR) (Devlet Üniversitesi)": "Diyarbakır",
    "FIRAT ÜNİVERSİTESİ (ELAZIĞ) (Devlet Üniversitesi)": "Elazığ",
    "HARRAN ÜNİVERSİTESİ (ŞANLIURFA) (Devlet Üniversitesi)": "Şanlıurfa",
    "İNÖNÜ ÜNİVERSİTESİ (MALATYA) (Devlet Üniversitesi)": "Malatya",
    "ERCİYES ÜNİVERSİTESİ (KAYSERİ) (Devlet Üniversitesi)": "Kayseri",
    "PAMUKKALE ÜNİVERSİTESİ (DENİZLİ) (Devlet Üniversitesi)": "Denizli",
    "ONDOKUZ MAYIS ÜNİVERSİTESİ (SAMSUN) (Devlet Üniversitesi)": "Samsun",
    "SÜLEYMAN DEMİREL ÜNİVERSİTESİ (ISPARTA) (Devlet Üniversitesi)": "Isparta",
    "KAHRAMANMARAŞ SÜTÇÜ İMAM ÜNİVERSİTESİ (Devlet Üniversitesi)": "Kahramanmaraş",
    "KARAMANOĞLU MEHMETBEY ÜNİVERSİTESİ (KARAMAN) (Devlet Üniversitesi)": "Karaman",
    "MANİSA CELÂL BAYAR ÜNİVERSİTESİ (Devlet Üniversitesi)": "Manisa",
    "MUNZUR ÜNİVERSİTESİ (TUNCELİ) (Devlet Üniversitesi)": "Tunceli",
    "MUĞLA SITKI KOÇMAN ÜNİVERSİTESİ (Devlet Üniversitesi)": "Muğla",
    "NEVŞEHİR HACI BEKTAŞ VELİ ÜNİVERSİTESİ (Devlet Üniversitesi)": "Nevşehir",
    "NİĞDE ÖMER HALİSDEMİR ÜNİVERSİTESİ (Devlet Üniversitesi)": "Niğde",
    "OSMANİYE KORKUT ATA ÜNİVERSİTESİ (Devlet Üniversitesi)": "Osmaniye",
    "RECEP TAYYİP ERDOĞAN ÜNİVERSİTESİ (RİZE) (Devlet Üniversitesi)": "Rize",
    "SİVAS CUMHURİYET ÜNİVERSİTESİ (Devlet Üniversitesi)": "Sivas",
    "TEKİRDAĞ NAMIK KEMAL ÜNİVERSİTESİ (Devlet Üniversitesi)": "Tekirdağ",
    "TOKAT GAZİOSMANPAŞA ÜNİVERSİTESİ (Devlet Üniversitesi)": "Tokat",
    "TRAKYA ÜNİVERSİTESİ (EDİRNE) (Devlet Üniversitesi)": "Edirne",
    "VAN YÜZÜNCÜ YIL ÜNİVERSİTESİ (Devlet Üniversitesi)": "Van",
    "YOZGAT BOZOK ÜNİVERSİTESİ (Devlet Üniversitesi)": "Yozgat",
    "ZONGULDAK BÜLENT ECEVİT ÜNİVERSİTESİ (Devlet Üniversitesi)": "Zonguldak",
    "ÇANAKKALE ONSEKİZ MART ÜNİVERSİTESİ (Devlet Üniversitesi)": "Çanakkale",
    "BOLU ABANT İZZET BAYSAL ÜNİVERSİTESİ (Devlet Üniversitesi)": "Bolu",
    "BURDUR MEHMET AKİF ERSOY ÜNİVERSİTESİ (Devlet Üniversitesi)": "Burdur",
    "BİLECİK ŞEYH EDEBALİ ÜNİVERSİTESİ (Devlet Üniversitesi)": "Bilecik",
    "BİTLİS EREN ÜNİVERSİTESİ (Devlet Üniversitesi)": "Bitlis",
    "AFYON KOCATEPE ÜNİVERSİTESİ (AFYONKARAHİSAR) (Devlet Üniversitesi)": "Afyonkarahisar",
    "AKDENİZ ÜNİVERSİTESİ (ANTALYA) (Devlet Üniversitesi)": "Antalya",
    "ATATÜRK ÜNİVERSİTESİ (ERZURUM) (Devlet Üniversitesi)": "Erzurum",
    "KÜTAHYA DUMLUPINAR ÜNİVERSİTESİ (Devlet Üniversitesi)": "Kütahya"
}

def get_city_for_uni(uni_name):
    if uni_name in CITY_OVERRIDE:
        return CITY_OVERRIDE[uni_name]
    m = re.search(r'\(([^)]+)\)\s*\(Devlet', uni_name)
    if m:
        c = m.group(1).strip()
        return c.capitalize()
    first = uni_name.split()[0].strip()
    return first.capitalize()

def parse_conditions(doc):
    page6 = doc[5].get_text()
    conditions = {}
    pattern = re.compile(r'Bk\.\s*(\d+)\s+([\s\S]+?)(?=(?:Bk\.\s*\d+)|$)')
    for m in pattern.finditer(page6):
        c_code = m.group(1).strip()
        c_desc = " ".join(m.group(2).split()).strip()
        conditions[c_code] = c_desc
    return conditions

def parse_minmax(pdf_path):
    doc = fitz.open(pdf_path)
    res = {}
    for page in doc:
        for tab in page.find_tables():
            for row in tab.extract():
                c = [col.replace('\n', ' ').strip() if col else '' for col in row]
                if c and c[0].isdigit() and len(c[0]) == 9:
                    code = c[0]
                    kont = int(c[2]) if c[2].isdigit() else 0
                    yer = int(c[3]) if c[3].isdigit() else 0
                    bos = int(c[4]) if c[4].isdigit() else 0
                    min_p = c[5]
                    max_p = c[6] if len(c) > 6 else '--'
                    min_val = None
                    max_val = None
                    if min_p not in ('--', '-', ''):
                        try:
                            min_val = float(min_p.replace(',', '.'))
                        except: pass
                    if max_p not in ('--', '-', ''):
                        try:
                            max_val = float(max_p.replace(',', '.'))
                        except: pass
                    res[code] = {
                        "kont": kont,
                        "yer": yer,
                        "bos": bos,
                        "min": min_p,
                        "min_val": min_val,
                        "max": max_p,
                        "max_val": max_val
                    }
    return res

def parse_tablo2(doc):
    page15 = doc[14]
    tabs = page15.find_tables()
    rows = tabs[0].extract()
    rules = []
    
    for row in rows[1:]:
        m_kodlar = [k.strip() for k in row[0].split('\n') if k.strip()]
        m_adlar = [a.strip() for a in row[1].split('\n') if a.strip()]
        l_adlar = [a.strip() for a in row[2].split('\n') if a.strip()]
        l_kodlar = [k.strip() for k in row[3].split('\n') if k.strip()]
        
        for k, a in zip(m_kodlar, m_adlar):
            rules.append({
                "mezuniyet_kodu": k,
                "mezuniyet_adi": a,
                "lisans_kodlari": l_kodlar,
                "lisans_programlari": l_adlar
            })
    return rules

def parse_tablo1(doc):
    current_uni = ""
    current_fak = ""
    programs = []

    for pno in range(6, 14):
        page = doc[pno]
        blocks = page.get_text('blocks')
        blocks.sort(key=lambda b: (round(b[1], 1), round(b[0], 1)))
        for b in blocks:
            text = b[4].strip()
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            if not lines: continue
            if 'TABLO-1' in text or '2026-MÜHENDİSLİK' in text or 'PROGRAM ADI' in text:
                continue
            if 'ÜNİVERSİTESİ' in text or 'YÜKSEK TEKNOLOJİ ENSTİTÜSÜ' in text:
                current_uni = text
                continue
            if 'FAKÜLTESİ' in text:
                current_fak = text
                continue
            if re.match(r'^\d{9}$', lines[0]):
                code = lines[0]
                name = lines[1] if len(lines) > 1 else ''
                puan_turu = lines[2] if len(lines) > 2 else ''
                kont = int(lines[3]) if len(lines) > 3 and lines[3].isdigit() else 0
                rem = lines[4:]
                kosullar = ""
                lisans_kodu = ""
                if len(rem) == 2:
                    kosullar = rem[0]
                    lisans_kodu = rem[1]
                elif len(rem) == 1:
                    if re.match(r'^\d{4}$', rem[0]):
                        lisans_kodu = rem[0]
                    else:
                        kosullar = rem[0]
                
                city = get_city_for_uni(current_uni)
                programs.append({
                    "code": code,
                    "univ": current_uni,
                    "city": city,
                    "fac": current_fak,
                    "prog": name,
                    "puan_turu": puan_turu,
                    "kont_2026": kont,
                    "lisans_kodu": lisans_kodu,
                    "kosul": kosullar
                })
    return programs

def main():
    print("Reading 2026 Guide PDF...")
    doc_guide = fitz.open(GUIDE_PDF)
    
    print("Parsing conditions...")
    conditions = parse_conditions(doc_guide)
    print(f"Parsed {len(conditions)} conditions: {list(conditions.keys())}")
    
    print("Parsing Tablo-2 (Mezuniyet)...")
    mezuniyet_list = parse_tablo2(doc_guide)
    print(f"Parsed {len(mezuniyet_list)} graduation mappings.")
    
    print("Parsing Tablo-1 (Programs)...")
    programs = parse_tablo1(doc_guide)
    print(f"Parsed {len(programs)} Tablo-1 programs.")
    
    print("Parsing 2026 Min-Max (Placement Results)...")
    data_2026 = parse_minmax(MINMAX_2026_PDF)
    print(f"Parsed {len(data_2026)} 2026 result entries.")

    print("Parsing 2025 Min-Max...")
    data_2025 = parse_minmax(MINMAX_2025_PDF)
    print(f"Parsed {len(data_2025)} 2025 entries.")
    
    print("Parsing 2024 Min-Max...")
    data_2024 = parse_minmax(MINMAX_2024_PDF)
    print(f"Parsed {len(data_2024)} 2024 entries.")
    
    # Merge results and historical data into programs
    merged_programs = []
    matched_2026 = 0
    matched_2025 = 0
    matched_2024 = 0
    
    for p in programs:
        code = p["code"]
        item = dict(p)

        # 2026 Yerleştirme Sonuçları
        if code in data_2026:
            matched_2026 += 1
            d26 = data_2026[code]
            item["kont_2026"] = d26["kont"]
            item["yer_2026"] = d26["yer"]
            item["bos_2026"] = d26["bos"]
            item["min_2026"] = d26["min"]
            item["min_2026_val"] = d26["min_val"]
            item["max_2026"] = d26["max"]
            item["max_2026_val"] = d26["max_val"]
            item["has_2026"] = True
        else:
            item["yer_2026"] = 0
            item["bos_2026"] = p.get("kont_2026", 0)
            item["min_2026"] = "--"
            item["min_2026_val"] = None
            item["max_2026"] = "--"
            item["max_2026_val"] = None
            item["has_2026"] = False

        if code in data_2025:
            matched_2025 += 1
            d25 = data_2025[code]
            item["has_2025"] = True
            item["kont_2025"] = d25["kont"]
            item["yer_2025"] = d25["yer"]
            item["bos_2025"] = d25["bos"]
            item["min_2025"] = d25["min"]
            item["min_2025_val"] = d25["min_val"]
            item["max_2025"] = d25["max"]
            item["max_2025_val"] = d25["max_val"]
        else:
            item["has_2025"] = False
            item["kont_2025"] = 0
            item["yer_2025"] = 0
            item["bos_2025"] = 0
            item["min_2025"] = "--"
            item["min_2025_val"] = None
            item["max_2025"] = "--"
            item["max_2025_val"] = None
            
        if code in data_2024:
            matched_2024 += 1
            d24 = data_2024[code]
            item["has_2024"] = True
            item["kont_2024"] = d24["kont"]
            item["yer_2024"] = d24["yer"]
            item["bos_2024"] = d24["bos"]
            item["min_2024"] = d24["min"]
            item["min_2024_val"] = d24["min_val"]
            item["max_2024"] = d24["max"]
            item["max_2024_val"] = d24["max_val"]
        else:
            item["has_2024"] = False
            item["kont_2024"] = 0
            item["yer_2024"] = 0
            item["bos_2024"] = 0
            item["min_2024"] = "--"
            item["min_2024_val"] = None
            item["max_2024"] = "--"
            item["max_2024_val"] = None
            
        merged_programs.append(item)

    print(f"2026 Programs matched with 2026 Results: {matched_2026} / {len(programs)}")
    print(f"2026 Programs matched with 2025: {matched_2025} / {len(programs)}")
    print(f"2026 Programs matched with 2024: {matched_2024} / {len(programs)}")

    # Write output files
    os.makedirs(DATA_DIR, exist_ok=True)
    
    prog_js = os.path.join(DATA_DIR, "muhendislik_programs.js")
    with open(prog_js, "w", encoding="utf-8") as f:
        f.write("window.DATA_MUHENDISLIK_PROGRAMS = " + json.dumps(merged_programs, ensure_ascii=False, indent=2) + ";\n")
    print(f"Wrote {prog_js} ({os.path.getsize(prog_js)} bytes)")

    mezun_js = os.path.join(DATA_DIR, "muhendislik_mezuniyet.js")
    with open(mezun_js, "w", encoding="utf-8") as f:
        f.write("window.DATA_MUHENDISLIK_MEZUNIYET = " + json.dumps(mezuniyet_list, ensure_ascii=False, indent=2) + ";\n")
    print(f"Wrote {mezun_js} ({os.path.getsize(mezun_js)} bytes)")

    cond_js = os.path.join(DATA_DIR, "muhendislik_conditions.js")
    with open(cond_js, "w", encoding="utf-8") as f:
        f.write("window.DATA_MUHENDISLIK_CONDITIONS = " + json.dumps(conditions, ensure_ascii=False, indent=2) + ";\n")
    print(f"Wrote {cond_js} ({os.path.getsize(cond_js)} bytes)")

    print("ALL DATA FILES GENERATED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
