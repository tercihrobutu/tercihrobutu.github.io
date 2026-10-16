#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ÖSYM 2026 TUS 2. Dönem Yerleştirme Sonuçları Ayrıştırıcı & Veri Birleştirici
--------------------------------------------------------------------------
Bu betik ÖSYM 2026-TUS 2. Dönem resmi yerleştirme sonuçları belgesini ayrıştırır:
Dosya: 2026-tus-2donem-yerlestirme-sonuclarina-liskin-en-buyuk-ve-en-kucuk-puanlar-genel-yabanci-uyruklu-uzp3a0-16132230.pdf

Çıktılar:
- data/tus_programs.js (window.DATA_TUS_PROGRAMS)
"""

import os
import sys
import json
import re
import fitz

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = r"C:\Users\yakupcontarli\Downloads\2026-tus-2donem-yerlestirme-sonuclarina-liskin-en-buyuk-ve-en-kucuk-puanlar-genel-yabanci-uyruklu-uzp3a0-16132230.pdf"
PROGRAMS_JS_PATH = os.path.join(REPO_ROOT, "data", "tus_programs.js")

def parse_float_tr(val_str):
    if not val_str or val_str in ['--', '----', '']:
        return None
    try:
        clean = val_str.replace('*', '').strip().replace(',', '.')
        return round(float(clean), 5)
    except:
        return None

def to_int(val_str):
    if not val_str:
        return 0
    clean = re.sub(r'[^\d]', '', str(val_str))
    return int(clean) if clean else 0

def extract_results(pdf_path):
    print(f"Reading PDF from {pdf_path}...")
    doc = fitz.open(pdf_path)
    print(f"Total pages: {len(doc)}")

    results = {}
    total_rows = 0

    for pno, page in enumerate(doc):
        tabs = page.find_tables()
        if not tabs.tables:
            continue
        for row in tabs.tables[0].extract():
            if not row or not row[0]:
                continue
            c0 = str(row[0]).strip()
            if c0 == 'Program Kodu' or not c0.isdigit():
                continue

            code = c0
            prog_name = str(row[1]).strip().replace('\n', ' ') if len(row) > 1 and row[1] else ''
            kont_turu = str(row[2]).strip() if len(row) > 2 and row[2] else ''
            kont_sayisi = to_int(row[3]) if len(row) > 3 else 0
            yerlesen_sayisi = to_int(row[4]) if len(row) > 4 else 0
            bos_sayisi = to_int(row[5]) if len(row) > 5 else 0
            min_puan_str = str(row[6]).strip() if len(row) > 6 and row[6] else '--'
            max_puan_str = str(row[7]).strip() if len(row) > 7 and row[7] else '--'

            min_val = parse_float_tr(min_puan_str)
            max_val = parse_float_tr(max_puan_str)

            results[code] = {
                'code': code,
                'prog_name_res': prog_name,
                'kont_turu': kont_turu,
                'kont_2026_2': kont_sayisi,
                'yer_2026_2': yerlesen_sayisi,
                'bos_2026_2': bos_sayisi,
                'min_2026_2': min_puan_str,
                'min_2026_2_val': min_val,
                'max_2026_2': max_puan_str,
                'max_2026_2_val': max_val,
                'has_yerlesme_2026_2': yerlesen_sayisi > 0,
                'has_score_2026_2': min_val is not None
            }
            total_rows += 1

    print(f"Extracted {len(results)} programs from results PDF (Total rows: {total_rows}).")
    return results

def merge_and_update(results):
    print(f"Loading {PROGRAMS_JS_PATH}...")
    with open(PROGRAMS_JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'window\.DATA_TUS_PROGRAMS\s*=\s*(\[.*?\]);?\s*$', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find window.DATA_TUS_PROGRAMS in file!")

    programs = json.loads(match.group(1))
    print(f"Total existing programs in dataset: {len(programs)}")

    matched_count = 0
    total_kont = 0
    total_yer = 0
    total_bos = 0
    total_with_score = 0

    branch_scores_26_2 = {}

    for item in programs:
        code = str(item.get('code', '')).strip()
        br = item.get('brans', '')
        if br not in branch_scores_26_2:
            branch_scores_26_2[br] = []

        if code in results:
            r = results[code]
            matched_count += 1
            item['has_2026_2'] = True
            item['kont_2026_2'] = r['kont_2026_2']
            item['yer_2026_2'] = r['yer_2026_2']
            item['bos_2026_2'] = r['bos_2026_2']
            item['min_2026_2'] = r['min_2026_2']
            item['min_2026_2_val'] = r['min_2026_2_val']
            item['max_2026_2'] = r['max_2026_2']
            item['max_2026_2_val'] = r['max_2026_2_val']

            # Update latest score to 2026-2!
            if r['min_2026_2_val'] is not None:
                item['latest_score_val'] = r['min_2026_2_val']
                item['latest_score_str'] = r['min_2026_2']
                branch_scores_26_2[br].append(r['min_2026_2_val'])
                total_with_score += 1

            total_kont += r['kont_2026_2']
            total_yer += r['yer_2026_2']
            total_bos += r['bos_2026_2']
        else:
            print(f"Warning: Program {code} not in results!")
            item['has_2026_2'] = False
            item['kont_2026_2'] = item.get('kont_total', 0)
            item['yer_2026_2'] = 0
            item['bos_2026_2'] = item.get('kont_total', 0)
            item['min_2026_2'] = '--'
            item['min_2026_2_val'] = None
            item['max_2026_2'] = '--'
            item['max_2026_2_val'] = None

    # Calculate branch 2026-2 averages
    for item in programs:
        br = item.get('brans', '')
        scores = branch_scores_26_2.get(br, [])
        item['branch_avg_26_2'] = round(sum(scores) / len(scores), 2) if scores else None

    print(f"\n--- 2026-TUS 2. DÖNEM MERGE RESULTS ---")
    print(f"Matched programs: {matched_count} / {len(programs)}")
    print(f"Total 2026/2 Kontenjan: {total_kont:,}")
    print(f"Total 2026/2 Yerleşen: {total_yer:,}")
    print(f"Total 2026/2 Boş Kontenjan: {total_bos:,}")
    print(f"Total Taban Puanı Oluşan Program: {total_with_score:,}")
    print(f"Total Dolmayan (--) Program: {len(programs) - total_with_score:,}")
    print(f"Doluluk Oranı: %{total_yer / total_kont * 100:.2f}")

    assert matched_count == 2941, f"Expected 2941 matched, got {matched_count}"
    assert total_kont == 8637, f"Expected 8637 kontenjan, got {total_kont}"
    assert total_yer == 7625, f"Expected 7625 yerleşen, got {total_yer}"
    assert total_bos == 1013, f"Expected 1013 boş kontenjan, got {total_bos}"
    assert total_with_score == 2660, f"Expected 2660 with score, got {total_with_score}"

    # Write back to data/tus_programs.js
    out_js = f"window.DATA_TUS_PROGRAMS = {json.dumps(programs, ensure_ascii=False, indent=2)};\n"
    with open(PROGRAMS_JS_PATH, "w", encoding="utf-8") as f:
        f.write(out_js)
    print(f"Successfully updated {PROGRAMS_JS_PATH} (Size: {os.path.getsize(PROGRAMS_JS_PATH):,} bytes)!")

if __name__ == "__main__":
    results = extract_results(PDF_PATH)
    merge_and_update(results)
    print("ALL 2026 TUS 2. DÖNEM PLACEMENT RESULTS MERGED AND VERIFIED!")
