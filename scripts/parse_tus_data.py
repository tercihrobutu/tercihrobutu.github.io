#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ÖSYM 2026 TUS 2. Dönem Tercih Kılavuzu & Geçmiş Dönem Taban Puanları Ayrıştırıcı
-----------------------------------------------------------------------------
Bu betik ÖSYM tarafından yayımlanan resmi TUS PDF belgelerini ayrıştırır:
1. 2026-TUS 2. Dönem Kontenjanları (Tablo)
2. 2026-TUS 2. Dönem Genel Bilgiler & Özel Koşullar
3. 2026-TUS 1. Dönem Min-Max Puanları
4. 2025-TUS 2. Dönem Min-Max Puanları
5. 2025-TUS 1. Dönem Min-Max Puanları

Çıktılar:
- data/tus_programs.js (window.DATA_TUS_PROGRAMS)
- data/tus_conditions.js (window.DATA_TUS_CONDITIONS)
"""

import os
import sys
import json
import re
import time
import fitz

sys.stdout.reconfigure(encoding='utf-8')

TUS_DIR = r"C:\Users\yakupcontarli\Downloads\TUS"
FILE_2026_2_KONT = os.path.join(TUS_DIR, "2026-tus-2-donem-uzmanlik-ogrencisi-kontenjanlari-o6s71l-29153457.pdf")
FILE_GENEL_BILGI = os.path.join(TUS_DIR, "genel-bilgiler-temel-lke-ve-kurallar-oy59j5-29153248.pdf")
FILE_2026_1_MINMAX = os.path.join(TUS_DIR, "2026_TUS_1inciDonem-minmax_ts1d21052026.pdf")
FILE_2025_2_MINMAX = os.path.join(TUS_DIR, "2025_TUS_2inciDonem-minmax_ts1d21052026.pdf")
FILE_2025_1_MINMAX = os.path.join(TUS_DIR, "2025_TUS_1inciDonem-minmax_ts1d21052026.pdf")

OUTPUT_PROGRAMS_JS = os.path.join(os.path.dirname(__file__), "..", "data", "tus_programs.js")
OUTPUT_CONDITIONS_JS = os.path.join(os.path.dirname(__file__), "..", "data", "tus_conditions.js")

def tr_title(text):
    """Turkish-aware Title Case formatting."""
    if not text:
        return ""
    words = text.split()
    res = []
    for w in words:
        if not w:
            continue
        # Special abbreviations
        w_upper = w.upper()
        if w_upper in ["T.C.", "SBÜ", "MAP", "EAH", "ADL", "KKTC", "AÖF", "YBU", "BNDH", "MSB", "MYO"]:
            res.append(w_upper)
            continue
        # Capitalize first char in Turkish
        first = w[0]
        rest = w[1:]
        if first == 'i' or first == 'İ':
            first = 'İ'
        elif first == 'ı' or first == 'I':
            first = 'I'
        else:
            first = first.upper()
            
        # Lower rest in Turkish
        rest_clean = []
        for ch in rest:
            if ch == 'I':
                rest_clean.append('ı')
            elif ch == 'İ':
                rest_clean.append('i')
            else:
                rest_clean.append(ch.lower())
        res.append(first + "".join(rest_clean))
    return " ".join(res)

def parse_conditions(pdf_path):
    print(f"Parsing conditions from {pdf_path}...")
    doc = fitz.open(pdf_path)
    text = "\n".join(p.get_text() for p in doc)
    
    pos = text.find("Özel Koşul")
    if pos == -1:
        pos = text.find("Bk.")
    cond_text = text[pos:] if pos != -1 else text
    
    conditions = {}
    matches = list(re.finditer(r'Bk\.\s*(\d+)', cond_text))
    for i, match in enumerate(matches):
        c_num = match.group(1)
        start_idx = match.end()
        end_idx = matches[i + 1].start() if i + 1 < len(matches) else len(cond_text)
        chunk = cond_text[start_idx:end_idx].strip()
        
        # Clean header lines from chunk
        clean_lines = []
        for line in chunk.split('\n'):
            line_str = line.strip()
            if not line_str:
                continue
            if "2026-TUS 2. DÖNEM TERCİH KILAVUZU" in line_str:
                continue
            if line_str.isdigit() and len(line_str) <= 3:
                continue
            if "EK YERLEŞTİRMEYE İLİŞKİN BİLGİ" in line_str:
                # keep reading or stop
                pass
            clean_lines.append(line_str)
            
        conditions[c_num] = " ".join(clean_lines).strip()
        
    print(f"Parsed {len(conditions)} special conditions: {sorted(list(map(int, conditions.keys())))}")
    return conditions

def parse_minmax_pdf(pdf_path, label):
    t0 = time.time()
    print(f"Parsing minmax {label} from {pdf_path}...")
    doc = fitz.open(pdf_path)
    items = {}
    for p in doc:
        for t in p.find_tables().tables:
            for r in t.extract():
                if r and r[0] and r[0].strip().isdigit() and len(r[0].strip()) == 9:
                    code = r[0].strip()
                    prog_name = r[1].strip().replace('\n', ' ') if len(r) > 1 and r[1] else ''
                    k_turu = r[2].strip().replace('\n', ' ') if len(r) > 2 and r[2] else 'Genel'
                    k_sayisi = int(r[3].strip()) if len(r) > 3 and r[3] and r[3].strip().isdigit() else 0
                    yerlesen = int(r[4].strip()) if len(r) > 4 and r[4] and r[4].strip().isdigit() else 0
                    bos = int(r[5].strip()) if len(r) > 5 and r[5] and r[5].strip().isdigit() else 0
                    min_p = r[6].strip() if len(r) > 6 and r[6] else ''
                    max_p = r[7].strip() if len(r) > 7 and r[7] else ''
                    
                    min_f = float(min_p.replace(',', '.')) if min_p and min_p != '--' and min_p != '-' else None
                    max_f = float(max_p.replace(',', '.')) if max_p and max_p != '--' and max_p != '-' else None
                    
                    items[code] = {
                        "code": code,
                        "name": prog_name,
                        "k_turu": k_turu,
                        "kont": k_sayisi,
                        "yer": yerlesen,
                        "bos": bos,
                        "min_p": min_p if min_p else "--",
                        "max_p": max_p if max_p else "--",
                        "min_score": min_f,
                        "max_score": max_f
                    }
    print(f"[{label}] Extracted {len(items)} records in {round(time.time() - t0, 1)}s")
    return items

def parse_active_2026_2(pdf_path):
    t0 = time.time()
    print(f"Parsing active 2026-2 guide from {pdf_path}...")
    doc = fitz.open(pdf_path)
    records = []
    
    for p_idx, page in enumerate(doc):
        for t in page.find_tables().tables:
            for r in t.extract():
                if r and r[0] and r[0].strip().isdigit() and len(r[0].strip()) == 9:
                    code = r[0].strip()
                    sinif = r[1].strip() if len(r) > 1 and r[1] else ''
                    tur = r[2].strip().replace('\n', ' ') if len(r) > 2 and r[2] else ''
                    il = r[3].strip() if len(r) > 3 and r[3] else ''
                    kurum = r[4].strip().replace('\n', ' ') if len(r) > 4 and r[4] else ''
                    b_univ = r[5].strip().replace('\n', ' ') if len(r) > 5 and r[5] else ''
                    b_fac = r[6].strip().replace('\n', ' ') if len(r) > 6 and r[6] else ''
                    brans = r[7].strip().replace('\n', ' ') if len(r) > 7 and r[7] else ''
                    pt = r[8].strip() if len(r) > 8 and r[8] else 'K'
                    gk_str = r[9].strip() if len(r) > 9 and r[9] else '0'
                    yk_str = r[10].strip() if len(r) > 10 and r[10] else '0'
                    kosul = r[11].strip().replace('\n', ' ') if len(r) > 11 and r[11] else ''
                    
                    gk = int(gk_str) if gk_str.isdigit() else 0
                    yk = int(yk_str) if yk_str.isdigit() else 0
                    
                    # Clean city name (e.g. İSTANBUL -> İstanbul)
                    city_clean = tr_title(il)
                    
                    # Normalize Kurum & Faculty
                    kurum_clean = kurum.strip()
                    b_univ_clean = b_univ.strip()
                    b_fac_clean = b_fac.strip()
                    brans_clean = brans.strip()
                    
                    # Determine human-friendly institution type
                    # ÜNİ, EAH, YBU, MAP, İçişleri Bakanlığı, KKTC, ADL, BNDH
                    tur_tag = tur
                    if "ÜNİ" in tur:
                        tur_tag = "Üniversite"
                    elif "EAH" in tur:
                        tur_tag = "SB-EAH / Şehir Hastanesi"
                    elif "YBU" in tur:
                        tur_tag = "Yabancı Uyruklu"
                    elif "MAP" in tur:
                        tur_tag = "Misafir Askeri Personel (MAP)"
                    elif "İçişleri" in tur:
                        tur_tag = "İçişleri Bakanlığı (Jandarma)"
                    elif "KKTC" in tur or "BNDH" in tur:
                        tur_tag = "KKTC Sağlık Bakanlığı"
                    elif "ADL" in tur:
                        tur_tag = "Adli Tıp Kurumu"
                        
                    records.append({
                        "code": code,
                        "sinif": sinif,
                        "tur": tur,
                        "tur_tag": tur_tag,
                        "city": city_clean,
                        "kurum": kurum_clean,
                        "birlikte_univ": b_univ_clean,
                        "birlikte_fac": b_fac_clean,
                        "brans": brans_clean,
                        "puan_turu": pt,
                        "puan_turu_tag": "Klinik Tıp (K)" if pt == "K" else "Temel Tıp (T)",
                        "kont_genel": gk,
                        "kont_yabanci": yk,
                        "kont_total": gk + yk,
                        "kosullar": kosul
                    })
                    
    print(f"Extracted {len(records)} active 2026-2 programs in {round(time.time() - t0, 1)}s")
    return records

def main():
    print("=" * 60)
    print("🚀 Starting 2026 TUS Tercih Robotu Data Processing")
    print("=" * 60)
    
    # 1. Parse Conditions
    conditions = parse_conditions(FILE_GENEL_BILGI)
    
    # 2. Parse Past Min-Max periods
    m26_1 = parse_minmax_pdf(FILE_2026_1_MINMAX, "2026 1. Dönem")
    m25_2 = parse_minmax_pdf(FILE_2025_2_MINMAX, "2025 2. Dönem")
    m25_1 = parse_minmax_pdf(FILE_2025_1_MINMAX, "2025 1. Dönem")
    
    # 3. Parse Active 2026 2. Dönem
    programs = parse_active_2026_2(FILE_2026_2_KONT)
    
    # 4. Merge Historical Results
    print("\nMerging historical placement records onto 2026-2 programs...")
    matched_26_1 = 0
    matched_25_2 = 0
    matched_25_1 = 0
    
    for item in programs:
        code = item["code"]
        
        # 2026 1. Dönem
        if code in m26_1:
            matched_26_1 += 1
            info = m26_1[code]
            item["has_2026_1"] = True
            item["kont_2026_1"] = info["kont"]
            item["yer_2026_1"] = info["yer"]
            item["bos_2026_1"] = info["bos"]
            item["min_2026_1"] = info["min_p"]
            item["min_2026_1_val"] = info["min_score"]
            item["max_2026_1"] = info["max_p"]
            item["max_2026_1_val"] = info["max_score"]
        else:
            item["has_2026_1"] = False
            item["kont_2026_1"] = None
            item["yer_2026_1"] = None
            item["bos_2026_1"] = None
            item["min_2026_1"] = "--"
            item["min_2026_1_val"] = None
            item["max_2026_1"] = "--"
            item["max_2026_1_val"] = None
            
        # 2025 2. Dönem
        if code in m25_2:
            matched_25_2 += 1
            info = m25_2[code]
            item["has_2025_2"] = True
            item["kont_2025_2"] = info["kont"]
            item["yer_2025_2"] = info["yer"]
            item["bos_2025_2"] = info["bos"]
            item["min_2025_2"] = info["min_p"]
            item["min_2025_2_val"] = info["min_score"]
            item["max_2025_2"] = info["max_p"]
            item["max_2025_2_val"] = info["max_score"]
        else:
            item["has_2025_2"] = False
            item["kont_2025_2"] = None
            item["yer_2025_2"] = None
            item["bos_2025_2"] = None
            item["min_2025_2"] = "--"
            item["min_2025_2_val"] = None
            item["max_2025_2"] = "--"
            item["max_2025_2_val"] = None
            
        # 2025 1. Dönem
        if code in m25_1:
            matched_25_1 += 1
            info = m25_1[code]
            item["has_2025_1"] = True
            item["kont_2025_1"] = info["kont"]
            item["yer_2025_1"] = info["yer"]
            item["bos_2025_1"] = info["bos"]
            item["min_2025_1"] = info["min_p"]
            item["min_2025_1_val"] = info["min_score"]
            item["max_2025_1"] = info["max_p"]
            item["max_2025_1_val"] = info["max_score"]
        else:
            item["has_2025_1"] = False
            item["kont_2025_1"] = None
            item["yer_2025_1"] = None
            item["bos_2025_1"] = None
            item["min_2025_1"] = "--"
            item["min_2025_1_val"] = None
            item["max_2025_1"] = "--"
            item["max_2025_1_val"] = None
            
        # Latest available score for sorting
        latest_val = item["min_2026_1_val"]
        if latest_val is None:
            latest_val = item["min_2025_2_val"]
        if latest_val is None:
            latest_val = item["min_2025_1_val"]
        item["latest_score_val"] = latest_val
        item["latest_score_str"] = (
            item["min_2026_1"] if item["has_2026_1"] and item["min_2026_1"] != "--"
            else (item["min_2025_2"] if item["has_2025_2"] and item["min_2025_2"] != "--"
            else (item["min_2025_1"] if item["has_2025_1"] and item["min_2025_1"] != "--" else "--"))
        )

    # 5. Calculate Branch & Specialty Averages
    print("\nCalculating branch statistics across TUS programs...")
    branch_stats = {}
    for item in programs:
        br = item["brans"]
        if br not in branch_stats:
            branch_stats[br] = {
                "count": 0, "total_kont": 0,
                "scores_26_1": [], "scores_25_2": [], "scores_25_1": []
            }
        branch_stats[br]["count"] += 1
        branch_stats[br]["total_kont"] += item["kont_total"]
        if item["min_2026_1_val"]:
            branch_stats[br]["scores_26_1"].append(item["min_2026_1_val"])
        if item["min_2025_2_val"]:
            branch_stats[br]["scores_25_2"].append(item["min_2025_2_val"])
        if item["min_2025_1_val"]:
            branch_stats[br]["scores_25_1"].append(item["min_2025_1_val"])

    for item in programs:
        br = item["brans"]
        b_info = branch_stats[br]
        item["branch_avg_26_1"] = round(sum(b_info["scores_26_1"]) / len(b_info["scores_26_1"]), 2) if b_info["scores_26_1"] else None
        item["branch_avg_25_1"] = round(sum(b_info["scores_25_1"]) / len(b_info["scores_25_1"]), 2) if b_info["scores_25_1"] else None

    # Summary Statistics
    total_gk = sum(p["kont_genel"] for p in programs)
    total_yk = sum(p["kont_yabanci"] for p in programs)
    total_kont = sum(p["kont_total"] for p in programs)
    
    print("\n--- TUS 2026 2. DÖNEM MERGE SUMMARY ---")
    print(f"Toplam Uzmanlık Programı: {len(programs):,}")
    print(f"Toplam Genel Kontenjan: {total_gk:,}")
    print(f"Toplam Yabancı Uyruklu Kontenjanı: {total_yk:,}")
    print(f"Genel Toplam Kontenjan: {total_kont:,}")
    print(f"2026 1. Dönem ile Eşleşen: {matched_26_1:,} (%{matched_26_1/len(programs)*100:.1f})")
    print(f"2025 2. Dönem ile Eşleşen: {matched_25_2:,} (%{matched_25_2/len(programs)*100:.1f})")
    print(f"2025 1. Dönem ile Eşleşen: {matched_25_1:,} (%{matched_25_1/len(programs)*100:.1f})")
    print(f"Özel Koşul Sayısı: {len(conditions)}")

    assert len(programs) == 2941, f"Expected 2941 programs, got {len(programs)}"
    assert total_gk == 8353, f"Expected 8353 Genel Kontenjan, got {total_gk}"
    assert total_yk == 284, f"Expected 284 Yabancı Kontenjan, got {total_yk}"
    assert total_kont == 8637, f"Expected 8637 Toplam Kontenjan, got {total_kont}"

    # 6. Save JS datasets
    print(f"\nWriting dataset to {OUTPUT_PROGRAMS_JS}...")
    os.makedirs(os.path.dirname(OUTPUT_PROGRAMS_JS), exist_ok=True)
    with open(OUTPUT_PROGRAMS_JS, "w", encoding="utf-8") as f:
        f.write("window.DATA_TUS_PROGRAMS = ")
        json.dump(programs, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"Saved {OUTPUT_PROGRAMS_JS} (Size: {os.path.getsize(OUTPUT_PROGRAMS_JS):,} bytes)")

    print(f"Writing conditions to {OUTPUT_CONDITIONS_JS}...")
    with open(OUTPUT_CONDITIONS_JS, "w", encoding="utf-8") as f:
        f.write("window.DATA_TUS_CONDITIONS = ")
        json.dump(conditions, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"Saved {OUTPUT_CONDITIONS_JS} (Size: {os.path.getsize(OUTPUT_CONDITIONS_JS):,} bytes)")

    print("\n✅ TUS DATA PROCESSING COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
