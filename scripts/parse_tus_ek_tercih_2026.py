#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ÖSYM 2026 TUS 2. Dönem Ek Yerleştirme Kontenjanları Ayrıştırıcı & Veri Birleştirici
----------------------------------------------------------------------------------
Bu betik ÖSYM 2026-TUS 2. Dönem (Ek Dönem) güncel resmi kontenjan kılavuzunu ayrıştırır:
Dosya: 2026-tus-2donem-ek-donem-uzmanlik-ogrencisi-kontenjanlari-tt8pli-23144358.pdf

Çıktılar:
- data/tus_programs.js (window.DATA_TUS_PROGRAMS güncellenir)
"""

import os
import sys
import json
import re
import fitz

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = r"C:\Users\yakupcontarli\Downloads\2026-tus-2donem-ek-donem-uzmanlik-ogrencisi-kontenjanlari-tt8pli-23144358.pdf"
COND_PDF_PATH = r"C:\Users\yakupcontarli\Downloads\genel-bilgiler-temel-lke-ve-kurallar-5vfj5w-20083849.pdf"
PROGRAMS_JS_PATH = os.path.join(REPO_ROOT, "data", "tus_programs.js")
CONDITIONS_JS_PATH = os.path.join(REPO_ROOT, "data", "tus_conditions.js")


def extract_ek_conditions(pdf_path):
    print(f"Reading 2026-TUS 2. Dönem Ek Genel Bilgiler & Özel Koşullar PDF: {pdf_path}...")
    doc = fitz.open(pdf_path)

    # Page 2 has an upper callout box ("EK YERLEŞTİRMEYE İLİŞKİN BİLGİ") above y=290;
    # clip below it so Bk. 9 does not get polluted by the callout text.
    p2 = doc[1].get_text(clip=fitz.Rect(0, 290, doc[1].rect.width, 775))
    p3 = doc[2].get_text(clip=fitz.Rect(0, 60, doc[2].rect.width, 775))
    cond_text = p2 + "\n" + p3

    conditions = {}
    matches = list(re.finditer(r'Bk\.\s*(\d+)', cond_text))
    for i, m in enumerate(matches):
        k = m.group(1)
        s = m.end()
        e = matches[i + 1].start() if i + 1 < len(matches) else len(cond_text)
        val = " ".join(cond_text[s:e].split()).strip()
        conditions[k] = val

    assert len(conditions) == 12, f"Expected 12 conditions, got {len(conditions)}"
    assert "EK YERLEŞTİRMEYE İLİŞKİN BİLGİ" not in conditions.get("9", ""), "Bk. 9 contains callout text!"

    out_js = f"window.DATA_TUS_CONDITIONS = {json.dumps(conditions, ensure_ascii=False, indent=2)};\n"
    with open(CONDITIONS_JS_PATH, "w", encoding="utf-8") as f:
        f.write(out_js)

    print(f"Successfully updated {CONDITIONS_JS_PATH} with {len(conditions)} clean conditions!")
    return conditions


def to_int(val_str):
    if not val_str:
        return 0
    s = str(val_str).strip()
    return int(s) if s.isdigit() else 0


def extract_ek_quotas(pdf_path):
    print(f"Reading 2026-TUS 2. Dönem Ek Kontenjan PDF: {pdf_path}...")
    doc = fitz.open(pdf_path)
    print(f"Total pages: {len(doc)}")

    ek_data = {}
    for pno, page in enumerate(doc):
        tabs = page.find_tables()
        if not tabs.tables:
            continue
        for tab in tabs.tables:
            for row in tab.extract():
                if not row or not row[0]:
                    continue
                code = str(row[0]).strip()
                if not (code.isdigit() and len(code) == 9):
                    continue

                gk = to_int(row[9]) if len(row) > 9 else 0
                yk = to_int(row[10]) if len(row) > 10 else 0
                tot = gk + yk
                pt = str(row[8]).strip() if len(row) > 8 and row[8] else 'K'

                ek_data[code] = {
                    'code': code,
                    'puan_turu': pt,
                    'ek_kont_genel': gk,
                    'ek_kont_yabanci': yk,
                    'ek_kont_2026_2': tot,
                }

    print(f"Extracted {len(ek_data)} unique ek yerleştirme programs.")
    return ek_data


def merge_and_update(ek_data):
    print(f"Loading {PROGRAMS_JS_PATH}...")
    with open(PROGRAMS_JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r'window\.DATA_TUS_PROGRAMS\s*=\s*(\[.*?\]);?\s*$', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find window.DATA_TUS_PROGRAMS in file!")

    programs = json.loads(match.group(1))
    print(f"Total existing programs in dataset: {len(programs)}")

    matched_count = 0
    total_ek_genel = 0
    total_ek_yabanci = 0
    total_ek = 0
    klinik_ek_progs = 0
    temel_ek_progs = 0

    for item in programs:
        code = str(item.get('code', '')).strip()
        if code in ek_data:
            ek = ek_data[code]
            matched_count += 1
            item['has_ek_2026_2'] = True
            item['ek_kont_genel'] = ek['ek_kont_genel']
            item['ek_kont_yabanci'] = ek['ek_kont_yabanci']
            item['ek_kont_2026_2'] = ek['ek_kont_2026_2']

            total_ek_genel += ek['ek_kont_genel']
            total_ek_yabanci += ek['ek_kont_yabanci']
            total_ek += ek['ek_kont_2026_2']
            if item.get('puan_turu') == 'K':
                klinik_ek_progs += 1
            else:
                temel_ek_progs += 1
        else:
            item['has_ek_2026_2'] = False
            item['ek_kont_genel'] = 0
            item['ek_kont_yabanci'] = 0
            item['ek_kont_2026_2'] = 0

    print("\n--- 2026-TUS 2. DÖNEM EK YERLEŞTİRME MERGE RESULTS ---")
    print(f"Matched ek programs: {matched_count} / {len(ek_data)}")
    print(f"Klinik (K) ek programs: {klinik_ek_progs}")
    print(f"Temel (T) ek programs: {temel_ek_progs}")
    print(f"Genel Ek Kontenjan: {total_ek_genel:,}")
    print(f"Yabancı Uyruklu Ek Kontenjan: {total_ek_yabanci:,}")
    print(f"TOPLAM 2026/2 EK KONTENJAN: {total_ek:,}")

    assert matched_count == 774, f"Expected 774 matched ek programs, got {matched_count}"
    assert total_ek_genel == 1261, f"Expected 1261 genel ek kontenjan, got {total_ek_genel}"
    assert total_ek_yabanci == 155, f"Expected 155 yabanci ek kontenjan, got {total_ek_yabanci}"
    assert total_ek == 1416, f"Expected 1416 total ek kontenjan, got {total_ek}"

    out_js = f"window.DATA_TUS_PROGRAMS = {json.dumps(programs, ensure_ascii=False, indent=2)};\n"
    with open(PROGRAMS_JS_PATH, "w", encoding="utf-8") as f:
        f.write(out_js)

    print(f"Successfully updated {PROGRAMS_JS_PATH} (Size: {os.path.getsize(PROGRAMS_JS_PATH):,} bytes)!")


if __name__ == "__main__":
    extract_ek_conditions(COND_PDF_PATH)
    ek_data = extract_ek_quotas(PDF_PATH)
    merge_and_update(ek_data)
    print("ALL 2026-TUS 2. DÖNEM EK YERLEŞTİRME DATA & CONDITIONS MERGED AND VERIFIED!")
