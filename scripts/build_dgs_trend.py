import fitz
import json
import re
import os
import unicodedata

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project'

PDF_2024_MERKEZI = os.path.join(PROJECT_DIR, 'minmax27092024.pdf')
PDF_2025_MERKEZI = os.path.join(PROJECT_DIR, 'minmax_dgd08092025 (2).pdf')
PDF_2024_EK = os.path.join(PROJECT_DIR, '2024_DGS-EKYerlestirme.pdf')
PDF_2025_EK = os.path.join(PROJECT_DIR, '2025_DGS-EKYerlestirme.pdf')

DGS_PROGRAMS_JS = os.path.join(REPO_ROOT, 'data', 'dgs_programs.js')
DGS_TREND_JS = os.path.join(REPO_ROOT, 'data', 'dgs_trend.js')

def clean_tr(text):
    if not text:
        return ''
    norm = unicodedata.normalize('NFC', str(text))
    norm = norm.replace('\u0307', '').replace('\u200b', '')
    return ' '.join(norm.split()).strip()

def parse_placement_pdf(pdf_path, is_ek=False):
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return {}

    print(f"Parsing {os.path.basename(pdf_path)} (is_ek={is_ek})...")
    doc = fitz.open(pdf_path)
    print(f"  Total pages: {len(doc)}")

    results = {}
    
    for page_idx in range(len(doc)):
        page = doc[page_idx]
        text = page.get_text('text')
        lines = [clean_tr(l) for l in text.split('\n') if clean_tr(l)]

        i = 0
        while i < len(lines):
            l = lines[i]
            # Match 9-digit program code
            if re.match(r'^\d{9}$', l):
                code = l
                i += 1
                
                # Next 1 or 2 lines might be program name until we hit Puan Türü (SAY/EA/SÖZ)
                prog_name_parts = []
                while i < len(lines) and lines[i] not in ['SAY', 'EA', 'SÖZ'] and not re.match(r'^\d{9}$', lines[i]):
                    # Skip header noise if on page boundary
                    if not any(h in lines[i] for h in ['PROGRAM KODU', 'PROGRAM ADI', 'PUAN TÜRÜ', 'KONTENJAN', 'YERLEŞEN', 'BOŞ']):
                        prog_name_parts.append(lines[i])
                    i += 1

                prog_name = ' '.join(prog_name_parts)
                
                if i < len(lines) and lines[i] in ['SAY', 'EA', 'SÖZ']:
                    puan_type = lines[i]
                    i += 1
                else:
                    puan_type = ''

                # Next values: kont, yer, bos, min_puan, max_puan
                kont = lines[i] if i < len(lines) else '0'
                i += 1
                yer = lines[i] if i < len(lines) else '0'
                i += 1
                bos = lines[i] if i < len(lines) else '0'
                i += 1
                min_p = lines[i] if i < len(lines) else '--'
                i += 1
                max_p = lines[i] if i < len(lines) else '--'
                i += 1

                # Clean numeric values
                try:
                    kont_int = int(re.sub(r'[^\d]', '', kont)) if kont else 0
                except:
                    kont_int = 0

                try:
                    yer_int = int(re.sub(r'[^\d]', '', yer)) if yer else 0
                except:
                    yer_int = 0

                try:
                    bos_int = int(re.sub(r'[^\d]', '', bos)) if bos else 0
                except:
                    bos_int = 0

                # Clean score (convert Turkish comma to dot or keep formatted)
                min_p_clean = min_p.strip()
                max_p_clean = max_p.strip()

                min_score_float = None
                if min_p_clean and min_p_clean != '--':
                    try:
                        min_score_float = round(float(min_p_clean.replace(',', '.')), 5)
                    except:
                        min_score_float = None

                results[code] = {
                    'code': code,
                    'prog_name': prog_name,
                    'puan_type': puan_type,
                    'kont': kont_int,
                    'yer': yer_int,
                    'bos': bos_int,
                    'min_puan': min_p_clean,
                    'min_score': min_score_float,
                    'max_puan': max_p_clean
                }
            else:
                i += 1

    print(f"  Extracted {len(results)} programs from {os.path.basename(pdf_path)}.")
    return results

def build_dgs_trend():
    # 1. Parse all 4 historical placement files
    data_2024_merkezi = parse_placement_pdf(PDF_2024_MERKEZI, is_ek=False)
    data_2025_merkezi = parse_placement_pdf(PDF_2025_MERKEZI, is_ek=False)
    data_2024_ek = parse_placement_pdf(PDF_2024_EK, is_ek=True)
    data_2025_ek = parse_placement_pdf(PDF_2025_EK, is_ek=True)

    # 2. Load 2026 Tablo-1 Programs
    if os.path.exists(DGS_PROGRAMS_JS):
        with open(DGS_PROGRAMS_JS, 'r', encoding='utf-8') as f:
            text = f.read()
        prog_2026 = json.loads(text.split('=', 1)[1].rstrip(';\n '))
    else:
        prog_2026 = []

    print(f"Loaded {len(prog_2026)} programs from 2026 Tablo-1.")

    # 3. Build comprehensive trend database
    all_codes = set()
    for p in prog_2026: all_codes.add(p['code'])
    for c in data_2025_merkezi: all_codes.add(c)
    for c in data_2024_merkezi: all_codes.add(c)
    for c in data_2025_ek: all_codes.add(c)
    for c in data_2024_ek: all_codes.add(c)

    print(f"Total unique program codes across 2024-2026: {len(all_codes)}")

    trend_database = {}

    # Map 2026 programs by code
    prog_2026_map = {p['code']: p for p in prog_2026}

    for code in all_codes:
        p26 = prog_2026_map.get(code)
        m25 = data_2025_merkezi.get(code)
        m24 = data_2024_merkezi.get(code)
        e25 = data_2025_ek.get(code)
        e24 = data_2024_ek.get(code)

        # Infer titles
        univ = p26['univ'] if p26 else ''
        fac = p26['fac'] if p26 else ''
        prog = p26['prog'] if p26 else ''
        city = p26['city'] if p26 else ''
        puan = p26['puan'] if p26 else (m25['puan_type'] if m25 else (m24['puan_type'] if m24 else ''))

        if not prog and m25:
            prog = m25['prog_name']
        elif not prog and m24:
            prog = m24['prog_name']

        history = {}
        if m24:
            history['2024'] = {
                'kont': m24['kont'],
                'yer': m24['yer'],
                'bos': m24['bos'],
                'min': m24['min_puan'],
                'min_val': m24['min_score'],
                'max': m24['max_puan']
            }
        if m25:
            history['2025'] = {
                'kont': m25['kont'],
                'yer': m25['yer'],
                'bos': m25['bos'],
                'min': m25['min_puan'],
                'min_val': m25['min_score'],
                'max': m25['max_puan']
            }
        if p26:
            history['2026'] = {
                'kont': p26['kont']
            }

        ek_history = {}
        if e24:
            ek_history['2024_ek'] = {
                'kont': e24['kont'],
                'yer': e24['yer'],
                'bos': e24['bos'],
                'min': e24['min_puan'],
                'min_val': e24['min_score'],
                'max': e24['max_puan']
            }
        if e25:
            ek_history['2025_ek'] = {
                'kont': e25['kont'],
                'yer': e25['yer'],
                'bos': e25['bos'],
                'min': e25['min_puan'],
                'min_val': e25['min_score'],
                'max': e25['max_puan']
            }

        trend_database[code] = {
            'code': code,
            'univ': univ,
            'fac': fac,
            'prog': prog,
            'city': city,
            'puan': puan,
            'history': history,
            'ek_history': ek_history
        }

    # 4. Enrich 2026 Tablo-1 programs list with 2025 and 2024 taban puan and quota comparison
    enriched_2026 = []
    for p in prog_2026:
        code = p['code']
        m25 = data_2025_merkezi.get(code)
        m24 = data_2024_merkezi.get(code)

        p25_str = m25['min_puan'] if m25 else '--'
        p25_val = m25['min_score'] if m25 else None
        k25_val = m25['kont'] if m25 else None

        p24_str = m24['min_puan'] if m24 else '--'
        p24_val = m24['min_score'] if m24 else None
        k24_val = m24['kont'] if m24 else None

        # Compute quota difference: 2026 vs 2025
        kont_2026 = p['kont']
        if k25_val is not None:
            diff = kont_2026 - k25_val
            diff_str = f"+{diff}" if diff > 0 else (str(diff) if diff < 0 else "=")
        else:
            diff = None
            diff_str = "Yeni"

        item = {
            **p,
            'puan_2025': p25_str,
            'puan_2025_val': p25_val,
            'kont_2025': k25_val,
            'puan_2024': p24_str,
            'puan_2024_val': p24_val,
            'kont_2024': k24_val,
            'kont_diff': diff,
            'kont_diff_str': diff_str
        }
        enriched_2026.append(item)

    # 5. Save data/dgs_trend.js
    os.makedirs(os.path.dirname(DGS_TREND_JS), exist_ok=True)
    with open(DGS_TREND_JS, 'w', encoding='utf-8') as f:
        f.write('// 2024-2026 DGS Taban Puan ve Kontenjan Değişim Trend Arşivi\n')
        f.write('window.DATA_DGS_TREND = ')
        json.dump(trend_database, f, ensure_ascii=False, indent=2)
        f.write(';\n')

    print(f"Saved {len(trend_database)} programs to {DGS_TREND_JS} ({os.path.getsize(DGS_TREND_JS) / 1024:.1f} KB)")

    # 6. Save updated data/dgs_programs.js
    with open(DGS_PROGRAMS_JS, 'w', encoding='utf-8') as f:
        f.write('// 2026 DGS Tercih Kılavuzu Tablo-1 (2024-2025 Taban Puan ve Kontenjan Zenginleştirmeli)\n')
        f.write('window.DATA_DGS_PROGRAMS = ')
        json.dump(enriched_2026, f, ensure_ascii=False, indent=2)
        f.write(';\n')

    print(f"Saved {len(enriched_2026)} enriched programs to {DGS_PROGRAMS_JS} ({os.path.getsize(DGS_PROGRAMS_JS) / 1024:.1f} KB)")

if __name__ == '__main__':
    build_dgs_trend()
