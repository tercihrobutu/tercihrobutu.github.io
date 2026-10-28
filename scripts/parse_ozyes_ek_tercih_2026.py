import os
import re
import json
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = r"C:\Users\yakupcontarli\Documents\GitHub\tercihrobutu.github.io"
DATA_DIR = os.path.join(REPO_ROOT, "data")
JS_PATH = os.path.join(DATA_DIR, "ozyes_programs.js")
PDF_PATH = r"C:\Users\yakupcontarli\Downloads\2026-ozel-yetenek-sinavi-ozyes-ek-tercih-kilavuzu-hcqb3z-27141254.pdf"

def clean_int(v):
    if not v:
        return 0
    v = v.strip().replace('.', '')
    return int(v) if v.isdigit() else 0

def main():
    if not os.path.exists(PDF_PATH):
        print(f"ERROR: PDF not found at {PDF_PATH}")
        sys.exit(1)

    print(f"Opening 2026 ÖZYES Ek Tercih Kılavuzu PDF: {PDF_PATH}...")
    doc = fitz.open(PDF_PATH)
    print(f"Total pages: {len(doc)}")

    extracted_ek = {}
    current_univ = ''
    current_fac = ''

    for pno in range(2, 10): # Pages 3 to 10 (0-indexed 2 to 9)
        page = doc[pno]
        tabs = list(page.find_tables())
        if not tabs:
            continue
        for row in tabs[0].extract():
            col0 = (row[0] or '').strip()
            col1 = (row[1] or '').strip()

            if 'TABLO' in col0 or 'KODU' in col0:
                continue

            if not col0 and ('ÜNİVERSİTESİ' in col1 or 'YÜKSEKTEKNOLOJİ' in col1 or 'ENSTİTÜSÜ' in col1):
                current_univ = col1.replace('\n', ' ').strip()
                current_fac = ''
                continue

            if not col0 and any(f in col1 for f in ['FAKÜLTESİ', 'YÜKSEKOKULU', 'ENSTİTÜ']):
                current_fac = col1.replace('\n', ' ').strip()
                continue

            if re.match(r'^\d{9}$', col0):
                prog_code = col0
                prog_name = col1.replace('\n', ' ').strip()
                sure = (row[2] or '4').strip()
                ge_e = clean_int(row[3])
                ge_k = clean_int(row[4])
                eng_e = clean_int(row[5])
                eng_k = clean_int(row[6])
                kosul = (row[7] or '').replace('\n', ' ').strip()

                tot_ek = ge_e + ge_k + eng_e + eng_k

                extracted_ek[prog_code] = {
                    'code': prog_code,
                    'univ': current_univ,
                    'fac': current_fac,
                    'prog': prog_name,
                    'sure': sure,
                    'ek_kont_genel_e': ge_e,
                    'ek_kont_genel_k': ge_k,
                    'ek_kont_engelli_e': eng_e,
                    'ek_kont_engelli_k': eng_k,
                    'ek_kont_toplam': tot_ek,
                    'kosul_ek': kosul,
                    'page': pno + 1
                }

    print(f"\nExtracted {len(extracted_ek)} ek yerleştirme programs from PDF.")
    tot_ge_e = sum(p['ek_kont_genel_e'] for p in extracted_ek.values())
    tot_ge_k = sum(p['ek_kont_genel_k'] for p in extracted_ek.values())
    tot_eng_e = sum(p['ek_kont_engelli_e'] for p in extracted_ek.values())
    tot_eng_k = sum(p['ek_kont_engelli_k'] for p in extracted_ek.values())
    tot_all = sum(p['ek_kont_toplam'] for p in extracted_ek.values())

    print("--- 2026-ÖZYES Ek Yerleştirme Kontenjan İstatistikleri ---")
    print(f"Genel Kontenjan Erkek Ek: {tot_ge_e:,}")
    print(f"Genel Kontenjan Kadın Ek: {tot_ge_k:,}")
    print(f"Engelli Kontenjanı Erkek Ek: {tot_eng_e:,}")
    print(f"Engelli Kontenjanı Kadın Ek: {tot_eng_k:,}")
    print(f"Toplam Erkek Ek (Genel + Engelli): {tot_ge_e + tot_eng_e:,}")
    print(f"Toplam Kadın Ek (Genel + Engelli): {tot_ge_k + tot_eng_k:,}")
    print(f"TOPLAM 2026-ÖZYES EK KONTENJAN: {tot_all:,}")

    # Load existing data/ozyes_programs.js
    with open(JS_PATH, 'r', encoding='utf-8') as f:
        text = f.read()

    prefix = 'window.DATA_OZYES_PROGRAMS='
    idx = text.find(prefix)
    if idx == -1:
        raise ValueError("Could not find window.DATA_OZYES_PROGRAMS in ozyes_programs.js")

    programs = json.loads(text[idx + len(prefix):].rstrip(';\n '))
    print(f"\nLoaded {len(programs)} existing programs from {JS_PATH}")

    matched_count = 0
    for p in programs:
        code = p['code']
        if code in extracted_ek:
            matched_count += 1
            ek_data = extracted_ek[code]
            p['has_ek_2026'] = True
            p['ek_kont_toplam'] = ek_data['ek_kont_toplam']
            p['ek_kont_genel_e'] = ek_data['ek_kont_genel_e']
            p['ek_kont_genel_k'] = ek_data['ek_kont_genel_k']
            p['ek_kont_engelli_e'] = ek_data['ek_kont_engelli_e']
            p['ek_kont_engelli_k'] = ek_data['ek_kont_engelli_k']
            p['kosul_ek'] = ek_data['kosul_ek']
        else:
            p['has_ek_2026'] = False
            p['ek_kont_toplam'] = 0
            p['ek_kont_genel_e'] = 0
            p['ek_kont_genel_k'] = 0
            p['ek_kont_engelli_e'] = 0
            p['ek_kont_engelli_k'] = 0
            p['kosul_ek'] = ''

    print(f"Matched and updated {matched_count} / {len(extracted_ek)} programs in database.")

    # Save back to ozyes_programs.js
    new_content = f"// 2026 ÖZYES Spor Bilimleri Programları & Ek Yerleştirme Kontenjanları\n{prefix}{json.dumps(programs, ensure_ascii=False)};\n"
    with open(JS_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Saved updated dataset to {JS_PATH} ({len(new_content):,} bytes).")
    print("\nSUCCESS: 2026-ÖZYES Ek Yerleştirme verileri başarıyla işlendi!")

if __name__ == '__main__':
    main()
