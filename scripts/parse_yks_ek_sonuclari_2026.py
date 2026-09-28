#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2026 YKS Ek Yerlestirme Sonuclari Parser & Data Merger
Reads official OSYM Excel files for Tablo-3 (On Lisans) and Tablo-4 (Lisans)
Merges placed counts, min/max scores, and remaining empty quotas into data/lisans.js and data/onlisans.js
"""

import os
import sys
import json
import openpyxl

EXCEL_DIR = r"C:\Users\yakupcontarli\Downloads\Documents\YKS2026-EKYerlestirme"
FILE_TABLO_4 = os.path.join(EXCEL_DIR, "en-kucuk-ve-en-buyuk-puanlar-tablo-4-m2t3b1-28143457.xlsx")
FILE_TABLO_3 = os.path.join(EXCEL_DIR, "en-kucuk-ve-en-buyuk-puanlar-tablo-3-kc316m-28143325.xlsx")

PROJECT_DIR = r"C:\Users\yakupcontarli\Documents\GitHub\tercihrobutu.github.io"
DATA_LISANS_PATH = os.path.join(PROJECT_DIR, "data", "lisans.js")
DATA_ONLISANS_PATH = os.path.join(PROJECT_DIR, "data", "onlisans.js")

def parse_excel_file(filepath):
    print(f"Reading Excel: {filepath}")
    wb = openpyxl.load_workbook(filepath, read_only=True)
    sheet = wb.active
    
    records = {}
    row_count = 0
    
    for row in sheet.iter_rows(min_row=4, values_only=True):
        if not row or not row[0]:
            continue
        
        row_count += 1
        code = str(row[0]).strip()
        univ_type_raw = str(row[1]).strip() if row[1] else ""
        univ = str(row[2]).strip() if row[2] else ""
        fac = str(row[3]).strip() if row[3] else ""
        prog = str(row[4]).strip() if row[4] else ""
        score_type = str(row[5]).strip() if row[5] else ""
        
        # Genel Ek Kontenjan & Yerlesen & Puanlar
        c6, c7, c8, c9 = row[6], row[7], row[8], row[9]
        ek_kont_genel = int(c6) if isinstance(c6, int) else 0
        ek_yer_genel = int(c7) if isinstance(c7, int) else 0
        ek_bos_genel = max(0, ek_kont_genel - ek_yer_genel)
        
        ek_min_puan = float(c8) if isinstance(c8, (int, float)) else None
        ek_min_puan_str = f"{ek_min_puan:.5f}".replace('.', ',') if ek_min_puan is not None else None
        ek_max_puan = float(c9) if isinstance(c9, (int, float)) else None
        ek_max_puan_str = f"{ek_max_puan:.5f}".replace('.', ',') if ek_max_puan is not None else None
        
        # 34 Yas Ustu Kadin Ek Kontenjan & Yerlesen & Puanlar
        c10, c11, c12, c13 = row[10], row[11], row[12], row[13]
        ek_kont_kadin34 = int(c10) if isinstance(c10, int) else 0
        ek_yer_kadin34 = int(c11) if isinstance(c11, int) else 0
        ek_bos_kadin34 = max(0, ek_kont_kadin34 - ek_yer_kadin34)
        ek_min_kadin34 = float(c12) if isinstance(c12, (int, float)) else None
        ek_min_kadin34_str = f"{ek_min_kadin34:.5f}".replace('.', ',') if ek_min_kadin34 is not None else None
        ek_max_kadin34 = float(c13) if isinstance(c13, (int, float)) else None
        ek_max_kadin34_str = f"{ek_max_kadin34:.5f}".replace('.', ',') if ek_max_kadin34 is not None else None
        
        # Sehit/Gazi Yakini Ek Kontenjan & Yerlesen & Puanlar
        c14, c15, c16, c17 = row[14], row[15], row[16], row[17]
        ek_kont_sehit_gazi = int(c14) if isinstance(c14, int) else 0
        ek_yer_sehit_gazi = int(c15) if isinstance(c15, int) else 0
        ek_bos_sehit_gazi = max(0, ek_kont_sehit_gazi - ek_yer_sehit_gazi)
        ek_min_sehit_gazi = float(c16) if isinstance(c16, (int, float)) else None
        ek_min_sehit_gazi_str = f"{ek_min_sehit_gazi:.5f}".replace('.', ',') if ek_min_sehit_gazi is not None else None
        ek_max_sehit_gazi = float(c17) if isinstance(c17, (int, float)) else None
        ek_max_sehit_gazi_str = f"{ek_max_sehit_gazi:.5f}".replace('.', ',') if ek_max_sehit_gazi is not None else None
        
        ek_kont_total = ek_kont_genel + ek_kont_kadin34 + ek_kont_sehit_gazi
        ek_yer_total = ek_yer_genel + ek_yer_kadin34 + ek_yer_sehit_gazi
        ek_bos_total = ek_bos_genel + ek_bos_kadin34 + ek_bos_sehit_gazi
        
        records[code] = {
            "has_ek_sonuc": True,
            "ek_kont_genel": ek_kont_genel,
            "ek_yer_genel": ek_yer_genel,
            "ek_bos_genel": ek_bos_genel,
            "ek_min_puan": ek_min_puan,
            "ek_min_puan_str": ek_min_puan_str,
            "ek_max_puan": ek_max_puan,
            "ek_max_puan_str": ek_max_puan_str,
            "ek_kont_kadin34": ek_kont_kadin34,
            "ek_yer_kadin34": ek_yer_kadin34,
            "ek_bos_kadin34": ek_bos_kadin34,
            "ek_min_kadin34": ek_min_kadin34,
            "ek_min_kadin34_str": ek_min_kadin34_str,
            "ek_max_kadin34": ek_max_kadin34,
            "ek_max_kadin34_str": ek_max_kadin34_str,
            "ek_kont_sehit_gazi": ek_kont_sehit_gazi,
            "ek_yer_sehit_gazi": ek_yer_sehit_gazi,
            "ek_bos_sehit_gazi": ek_bos_sehit_gazi,
            "ek_min_sehit_gazi": ek_min_sehit_gazi,
            "ek_min_sehit_gazi_str": ek_min_sehit_gazi_str,
            "ek_max_sehit_gazi": ek_max_sehit_gazi,
            "ek_max_sehit_gazi_str": ek_max_sehit_gazi_str,
            "ek_kont_total": ek_kont_total,
            "ek_yer_total": ek_yer_total,
            "ek_bos_total": ek_bos_total,
            # Metadata from excel if needed
            "_excel_univ": univ,
            "_excel_fac": fac,
            "_excel_prog": prog,
            "_excel_score_type": score_type,
            "_excel_univ_type": univ_type_raw
        }
        
    print(f"Parsed {len(records)} programs from {filepath} (rows: {row_count})")
    return records

def load_js_data(filepath, var_name):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read().strip()
    prefix = f"window.{var_name}="
    if not content.startswith(prefix):
        raise ValueError(f"File {filepath} does not start with {prefix}")
    raw_json = content[len(prefix):].rstrip(';')
    return json.loads(raw_json)

def save_js_data(filepath, var_name, data):
    print(f"Writing updated dataset to {filepath} ({len(data)} items)...")
    json_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"window.{var_name}={json_str};")
    print(f"Saved {filepath} successfully (Size: {os.path.getsize(filepath):,} bytes).")

def main():
    # 1. Parse Excel files
    lisans_excel = parse_excel_file(FILE_TABLO_4)
    onlisans_excel = parse_excel_file(FILE_TABLO_3)
    
    # 2. Load existing JS datasets
    lisans_data = load_js_data(DATA_LISANS_PATH, "DATA_LISANS")
    onlisans_data = load_js_data(DATA_ONLISANS_PATH, "DATA_ONLISANS")
    
    print(f"Existing Lisans records: {len(lisans_data)}")
    print(f"Existing Onlisans records: {len(onlisans_data)}")
    
    # 3. Merge Lisans
    matched_lisans = 0
    for item in lisans_data:
        code = str(item["code"])
        if code in lisans_excel:
            matched_lisans += 1
            info = lisans_excel[code]
            item["has_ek_sonuc"] = True
            item["ek_kont_genel"] = info["ek_kont_genel"]
            item["ek_yer_genel"] = info["ek_yer_genel"]
            item["ek_bos_genel"] = info["ek_bos_genel"]
            item["ek_min_puan"] = info["ek_min_puan"]
            item["ek_min_puan_str"] = info["ek_min_puan_str"]
            item["ek_max_puan"] = info["ek_max_puan"]
            item["ek_max_puan_str"] = info["ek_max_puan_str"]
            item["ek_kont_kadin34"] = info["ek_kont_kadin34"]
            item["ek_yer_kadin34"] = info["ek_yer_kadin34"]
            item["ek_bos_kadin34"] = info["ek_bos_kadin34"]
            item["ek_min_kadin34"] = info["ek_min_kadin34"]
            item["ek_min_kadin34_str"] = info["ek_min_kadin34_str"]
            item["ek_max_kadin34"] = info["ek_max_kadin34"]
            item["ek_max_kadin34_str"] = info["ek_max_kadin34_str"]
            item["ek_kont_sehit_gazi"] = info["ek_kont_sehit_gazi"]
            item["ek_yer_sehit_gazi"] = info["ek_yer_sehit_gazi"]
            item["ek_bos_sehit_gazi"] = info["ek_bos_sehit_gazi"]
            item["ek_min_sehit_gazi"] = info["ek_min_sehit_gazi"]
            item["ek_min_sehit_gazi_str"] = info["ek_min_sehit_gazi_str"]
            item["ek_max_sehit_gazi"] = info["ek_max_sehit_gazi"]
            item["ek_max_sehit_gazi_str"] = info["ek_max_sehit_gazi_str"]
            item["ek_kont_total"] = info["ek_kont_total"]
            item["ek_yer_total"] = info["ek_yer_total"]
            item["ek_bos_total"] = info["ek_bos_total"]
        else:
            item["has_ek_sonuc"] = False
            item["ek_kont_genel"] = 0
            item["ek_yer_genel"] = 0
            item["ek_bos_genel"] = 0
            item["ek_min_puan"] = None
            item["ek_min_puan_str"] = None
            item["ek_max_puan"] = None
            item["ek_max_puan_str"] = None
            item["ek_kont_kadin34"] = 0
            item["ek_yer_kadin34"] = 0
            item["ek_bos_kadin34"] = 0
            item["ek_min_kadin34"] = None
            item["ek_min_kadin34_str"] = None
            item["ek_max_kadin34"] = None
            item["ek_max_kadin34_str"] = None
            item["ek_kont_sehit_gazi"] = 0
            item["ek_yer_sehit_gazi"] = 0
            item["ek_bos_sehit_gazi"] = 0
            item["ek_min_sehit_gazi"] = None
            item["ek_min_sehit_gazi_str"] = None
            item["ek_max_sehit_gazi"] = None
            item["ek_max_sehit_gazi_str"] = None
            item["ek_kont_total"] = 0
            item["ek_yer_total"] = 0
            item["ek_bos_total"] = 0
            
    print(f"Lisans matched: {matched_lisans} / {len(lisans_excel)} (%{matched_lisans/len(lisans_excel)*100:.2f})")
    assert matched_lisans == len(lisans_excel), f"Expected {len(lisans_excel)} matches in Lisans, got {matched_lisans}"
    
    # 4. Merge Onlisans
    matched_onlisans = 0
    existing_onlisans_codes = set()
    for item in onlisans_data:
        code = str(item["code"])
        existing_onlisans_codes.add(code)
        if code in onlisans_excel:
            matched_onlisans += 1
            info = onlisans_excel[code]
            item["has_ek_sonuc"] = True
            item["ek_kont_genel"] = info["ek_kont_genel"]
            item["ek_yer_genel"] = info["ek_yer_genel"]
            item["ek_bos_genel"] = info["ek_bos_genel"]
            item["ek_min_puan"] = info["ek_min_puan"]
            item["ek_min_puan_str"] = info["ek_min_puan_str"]
            item["ek_max_puan"] = info["ek_max_puan"]
            item["ek_max_puan_str"] = info["ek_max_puan_str"]
            item["ek_kont_kadin34"] = info["ek_kont_kadin34"]
            item["ek_yer_kadin34"] = info["ek_yer_kadin34"]
            item["ek_bos_kadin34"] = info["ek_bos_kadin34"]
            item["ek_min_kadin34"] = info["ek_min_kadin34"]
            item["ek_min_kadin34_str"] = info["ek_min_kadin34_str"]
            item["ek_max_kadin34"] = info["ek_max_kadin34"]
            item["ek_max_kadin34_str"] = info["ek_max_kadin34_str"]
            item["ek_kont_sehit_gazi"] = info["ek_kont_sehit_gazi"]
            item["ek_yer_sehit_gazi"] = info["ek_yer_sehit_gazi"]
            item["ek_bos_sehit_gazi"] = info["ek_bos_sehit_gazi"]
            item["ek_min_sehit_gazi"] = info["ek_min_sehit_gazi"]
            item["ek_min_sehit_gazi_str"] = info["ek_min_sehit_gazi_str"]
            item["ek_max_sehit_gazi"] = info["ek_max_sehit_gazi"]
            item["ek_max_sehit_gazi_str"] = info["ek_max_sehit_gazi_str"]
            item["ek_kont_total"] = info["ek_kont_total"]
            item["ek_yer_total"] = info["ek_yer_total"]
            item["ek_bos_total"] = info["ek_bos_total"]
        else:
            item["has_ek_sonuc"] = False
            item["ek_kont_genel"] = 0
            item["ek_yer_genel"] = 0
            item["ek_bos_genel"] = 0
            item["ek_min_puan"] = None
            item["ek_min_puan_str"] = None
            item["ek_max_puan"] = None
            item["ek_max_puan_str"] = None
            item["ek_kont_kadin34"] = 0
            item["ek_yer_kadin34"] = 0
            item["ek_bos_kadin34"] = 0
            item["ek_min_kadin34"] = None
            item["ek_min_kadin34_str"] = None
            item["ek_max_kadin34"] = None
            item["ek_max_kadin34_str"] = None
            item["ek_kont_sehit_gazi"] = 0
            item["ek_yer_sehit_gazi"] = 0
            item["ek_bos_sehit_gazi"] = 0
            item["ek_min_sehit_gazi"] = None
            item["ek_min_sehit_gazi_str"] = None
            item["ek_max_sehit_gazi"] = None
            item["ek_max_sehit_gazi_str"] = None
            item["ek_kont_total"] = 0
            item["ek_yer_total"] = 0
            item["ek_bos_total"] = 0
            
    print(f"Onlisans matched: {matched_onlisans} / {len(onlisans_excel)} (%{matched_onlisans/len(onlisans_excel)*100:.2f})")
    
    # 5. Check missing programs in Onlisans (e.g. 300900115)
    missing_codes = [c for c in onlisans_excel if c not in existing_onlisans_codes]
    print(f"New programs to append in Onlisans: {missing_codes}")
    for code in missing_codes:
        info = onlisans_excel[code]
        new_item = {
            "code": code,
            "city": "Yurtdışı",
            "univ": info["_excel_univ"],
            "univ_type": "KKTC Üniversitesi" if "KKTC" in info["_excel_univ_type"] else info["_excel_univ_type"],
            "fac": info["_excel_fac"],
            "tip": "Örgün",
            "prog": info["_excel_prog"],
            "duration": 2,
            "score_type": info["_excel_score_type"],
            "quota_genel": info["ek_kont_genel"],
            "quota_placed": 0,
            "quota_empty": info["ek_kont_genel"],
            "quota_kadin34": info["ek_kont_kadin34"],
            "quota_okul1": 0,
            "quota_sehit_gazi": info["ek_kont_sehit_gazi"],
            "spec_cond": "18, 19, 21, 22, 23, 24, 64, 132",
            "score": "",
            "score_max": "----",
            "rank": "",
            "ek_kont_genel": info["ek_kont_genel"],
            "ek_yer_genel": info["ek_yer_genel"],
            "ek_bos_genel": info["ek_bos_genel"],
            "ek_min_puan": info["ek_min_puan"],
            "ek_min_puan_str": info["ek_min_puan_str"],
            "ek_max_puan": info["ek_max_puan"],
            "ek_max_puan_str": info["ek_max_puan_str"],
            "ek_kont_kadin34": info["ek_kont_kadin34"],
            "ek_yer_kadin34": info["ek_yer_kadin34"],
            "ek_bos_kadin34": info["ek_bos_kadin34"],
            "ek_min_kadin34": info["ek_min_kadin34"],
            "ek_min_kadin34_str": info["ek_min_kadin34_str"],
            "ek_max_kadin34": info["ek_max_kadin34"],
            "ek_max_kadin34_str": info["ek_max_kadin34_str"],
            "ek_kont_sehit_gazi": info["ek_kont_sehit_gazi"],
            "ek_yer_sehit_gazi": info["ek_yer_sehit_gazi"],
            "ek_bos_sehit_gazi": info["ek_bos_sehit_gazi"],
            "ek_min_sehit_gazi": info["ek_min_sehit_gazi"],
            "ek_min_sehit_gazi_str": info["ek_min_sehit_gazi_str"],
            "ek_max_sehit_gazi": info["ek_max_sehit_gazi"],
            "ek_max_sehit_gazi_str": info["ek_max_sehit_gazi_str"],
            "ek_kont_total": info["ek_kont_total"],
            "ek_yer_total": info["ek_yer_total"],
            "ek_bos_total": info["ek_bos_total"],
            "ek_score_gk": info["ek_min_puan"],
            "ek_score_sgy": info["ek_min_sehit_gazi"],
            "ek_score_34y": info["ek_min_kadin34"],
            "ek_spec_cond": "18, 19, 21, 22, 23, 24, 64, 132",
            "has_ek_sonuc": True
        }
        onlisans_data.append(new_item)
        print(f"Appended missing program {code}: {new_item['univ']} - {new_item['prog']}")
        
    # 6. Verify Totals
    def compute_totals(dataset):
        tot_kont = sum(x.get("ek_kont_total", 0) for x in dataset if x.get("has_ek_sonuc"))
        tot_yer = sum(x.get("ek_yer_total", 0) for x in dataset if x.get("has_ek_sonuc"))
        tot_bos = sum(x.get("ek_bos_total", 0) for x in dataset if x.get("has_ek_sonuc"))
        has_min = sum(1 for x in dataset if x.get("has_ek_sonuc") and x.get("ek_min_puan") is not None)
        return tot_kont, tot_yer, tot_bos, has_min

    l_kont, l_yer, l_bos, l_min = compute_totals(lisans_data)
    o_kont, o_yer, o_bos, o_min = compute_totals(onlisans_data)

    print("\n--- MERGE VERIFICATION ---")
    print(f"Lisans: Kont={l_kont:,}, Yer={l_yer:,}, Bos={l_bos:,}, TabanOlusan={l_min:,}")
    print(f"Onlisans: Kont={o_kont:,}, Yer={o_yer:,}, Bos={o_bos:,}, TabanOlusan={o_min:,}")
    print(f"Grand Total: Kont={l_kont+o_kont:,}, Yer={l_yer+o_yer:,}, Bos={l_bos+o_bos:,}, TabanOlusan={l_min+o_min:,}")

    assert l_kont == 50278, f"Lisans Kont mismatch: {l_kont}"
    assert l_yer == 15085, f"Lisans Yer mismatch: {l_yer}"
    assert l_min == 4820, f"Lisans Min mismatch: {l_min}"

    assert o_kont == 64541, f"Onlisans Kont mismatch: {o_kont}"
    assert o_yer == 42063, f"Onlisans Yer mismatch: {o_yer}"
    assert o_min == 6985, f"Onlisans Min mismatch: {o_min}"

    assert l_kont + o_kont == 114819, f"Total Kont mismatch: {l_kont + o_kont}"
    assert l_yer + o_yer == 57148, f"Total Yer mismatch: {l_yer + o_yer}"
    assert l_min + o_min == 11805, f"Total TabanOlusan mismatch: {l_min + o_min}"

    # 7. Write to files
    save_js_data(DATA_LISANS_PATH, "DATA_LISANS", lisans_data)
    save_js_data(DATA_ONLISANS_PATH, "DATA_ONLISANS", onlisans_data)
    print("\nSUCCESS: All data parsed, merged, validated, and saved!")

if __name__ == "__main__":
    main()
