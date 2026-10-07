import os
import re
import json
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")
JS_PATH = os.path.join(DATA_DIR, "ozyes_programs.js")
PDF_PATH = r"C:\Users\yakupcontarli\Downloads\Compressed\OSYM\2026-ozyes-yerlestirme-sonuclarina-liskin-en-kucuk-ve-en-buyuk-puanlar-ed0yq5-06160838.pdf"

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

def main():
    print("Loading existing data/ozyes_programs.js...")
    with open(JS_PATH, 'r', encoding='utf-8') as f:
        text = f.read()

    m = re.search(r'window\.DATA_OZYES_PROGRAMS\s*=\s*(\[.*?\]);?\s*$', text, re.DOTALL)
    if not m:
        raise ValueError("Could not find window.DATA_OZYES_PROGRAMS in ozyes_programs.js")

    programs = json.loads(m.group(1))
    print(f"Loaded {len(programs)} existing programs.")

    print(f"Opening 2026 ÖZYES Results PDF: {PDF_PATH}...")
    doc = fitz.open(PDF_PATH)

    results_2026 = {}
    for page in doc:
        for tab in page.find_tables():
            for row in tab.extract():
                code = (row[0] or '').strip()
                if re.match(r'^\d{9}$', code):
                    # 29 columns:
                    # 0: Code, 1: Univ Turu, 2: Univ, 3: Fak, 4: Prog
                    # 5: Kont GE, 6: Yer GE, 7: Min GE, 8: Max GE
                    # 9: Kont GK, 10: Yer GK, 11: Min GK, 12: Max GK
                    # 13: Kont ME, 14: Yer ME, 15: Min ME, 16: Max ME
                    # 17: Kont MK, 18: Yer MK, 19: Min MK, 20: Max MK
                    # 21: Kont EE, 22: Yer EE, 23: Min EE, 24: Max EE
                    # 25: Kont EK, 26: Yer EK, 27: Min EK, 28: Max EK
                    results_2026[code] = {
                        "kont_ge": parse_int_safe(row[5]),
                        "yer_ge": parse_int_safe(row[6]),
                        "min_ge": (row[7] or '--').strip(),
                        "min_ge_val": parse_float_tr(row[7]),
                        "max_ge": (row[8] or '--').strip(),
                        "max_ge_val": parse_float_tr(row[8]),

                        "kont_gk": parse_int_safe(row[9]),
                        "yer_gk": parse_int_safe(row[10]),
                        "min_gk": (row[11] or '--').strip(),
                        "min_gk_val": parse_float_tr(row[11]),
                        "max_gk": (row[12] or '--').strip(),
                        "max_gk_val": parse_float_tr(row[12]),

                        "kont_me": parse_int_safe(row[13]),
                        "yer_me": parse_int_safe(row[14]),
                        "min_me": (row[15] or '--').strip(),
                        "min_me_val": parse_float_tr(row[15]),
                        "max_me": (row[16] or '--').strip(),
                        "max_me_val": parse_float_tr(row[16]),

                        "kont_mk": parse_int_safe(row[17]),
                        "yer_mk": parse_int_safe(row[18]),
                        "min_mk": (row[19] or '--').strip(),
                        "min_mk_val": parse_float_tr(row[19]),
                        "max_mk": (row[20] or '--').strip(),
                        "max_mk_val": parse_float_tr(row[20]),

                        "kont_ee": parse_int_safe(row[21]),
                        "yer_ee": parse_int_safe(row[22]),
                        "min_ee": (row[23] or '--').strip(),
                        "min_ee_val": parse_float_tr(row[23]),
                        "max_ee": (row[24] or '--').strip(),
                        "max_ee_val": parse_float_tr(row[24]),

                        "kont_ek": parse_int_safe(row[25]),
                        "yer_ek": parse_int_safe(row[26]),
                        "min_ek": (row[27] or '--').strip(),
                        "min_ek_val": parse_float_tr(row[27]),
                        "max_ek": (row[28] or '--').strip(),
                        "max_ek_val": parse_float_tr(row[28]),
                    }

    print(f"Extracted {len(results_2026)} programs from 2026 PDF.")

    matched_count = 0
    updated_programs = []

    for item in programs:
        code = item["code"]
        p = dict(item)

        if code in results_2026:
            matched_count += 1
            r = results_2026[code]

            tot_kont = r["kont_ge"] + r["kont_gk"] + r["kont_me"] + r["kont_mk"] + r["kont_ee"] + r["kont_ek"]
            tot_yer = r["yer_ge"] + r["yer_gk"] + r["yer_me"] + r["yer_mk"] + r["yer_ee"] + r["yer_ek"]
            tot_bos = max(0, tot_kont - tot_yer)

            p["has_2026"] = True
            p["kont_2026_toplam"] = tot_kont
            p["yer_2026_toplam"] = tot_yer
            p["bos_2026_toplam"] = tot_bos

            # Genel Erkek
            p["yer_2026_e"] = r["yer_ge"]
            p["min_2026_e"] = r["min_ge"]
            p["min_2026_e_val"] = r["min_ge_val"]
            p["max_2026_e"] = r["max_ge"]
            p["max_2026_e_val"] = r["max_ge_val"]

            # Genel Kadın
            p["yer_2026_k"] = r["yer_gk"]
            p["min_2026_k"] = r["min_gk"]
            p["min_2026_k_val"] = r["min_gk_val"]
            p["max_2026_k"] = r["max_gk"]
            p["max_2026_k_val"] = r["max_gk_val"]

            # Millî Sporcu Erkek & Kadın
            p["yer_2026_milli_e"] = r["yer_me"]
            p["min_2026_milli_e"] = r["min_me"]
            p["min_2026_milli_e_val"] = r["min_me_val"]
            p["max_2026_milli_e"] = r["max_me"]
            p["max_2026_milli_e_val"] = r["max_me_val"]

            p["yer_2026_milli_k"] = r["yer_mk"]
            p["min_2026_milli_k"] = r["min_mk"]
            p["min_2026_milli_k_val"] = r["min_mk_val"]
            p["max_2026_milli_k"] = r["max_mk"]
            p["max_2026_milli_k_val"] = r["max_mk_val"]

            # Engelli Sporcu Erkek & Kadın
            p["yer_2026_eng_e"] = r["yer_ee"]
            p["min_2026_eng_e"] = r["min_ee"]
            p["min_2026_eng_e_val"] = r["min_ee_val"]
            p["max_2026_eng_e"] = r["max_ee"]
            p["max_2026_eng_e_val"] = r["max_ee_val"]

            p["yer_2026_eng_k"] = r["yer_ek"]
            p["min_2026_eng_k"] = r["min_ek"]
            p["min_2026_eng_k_val"] = r["min_ek_val"]
            p["max_2026_eng_k"] = r["max_ek"]
            p["max_2026_eng_k_val"] = r["max_ek_val"]
        else:
            p["has_2026"] = False
            p["kont_2026_toplam"] = p.get("kont_toplam", 0)
            p["yer_2026_toplam"] = 0
            p["bos_2026_toplam"] = p.get("kont_toplam", 0)
            p["yer_2026_e"] = 0
            p["min_2026_e"] = "--"
            p["min_2026_e_val"] = None
            p["max_2026_e"] = "--"
            p["max_2026_e_val"] = None
            p["yer_2026_k"] = 0
            p["min_2026_k"] = "--"
            p["min_2026_k_val"] = None
            p["max_2026_k"] = "--"
            p["max_2026_k_val"] = None

        updated_programs.append(p)

    print(f"Matched {matched_count} / {len(programs)} programs with 2026 results.")

    with open(JS_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.DATA_OZYES_PROGRAMS={json.dumps(updated_programs, ensure_ascii=False, separators=(',', ':'))};\n")

    print(f"Successfully updated {JS_PATH} with 2026 results! ({os.path.getsize(JS_PATH)} bytes)")

if __name__ == '__main__':
    main()
