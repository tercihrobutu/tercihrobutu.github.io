import os
import sys
import re
import json
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = r'C:\Users\Dell\.gemini\antigravity\brain\2db3e7a6-59dc-4cf1-9193-13e70eca0358\.user_uploaded\media_1788856628648.pdf'
PROGRAMS_JS_PATH = os.path.join(REPO_ROOT, 'data', 'dgs_programs.js')
TREND_JS_PATH = os.path.join(REPO_ROOT, 'data', 'dgs_trend.js')

def parse_float_tr(val_str):
    if not val_str or val_str == '--' or val_str == '----':
        return None
    try:
        return round(float(val_str.replace(',', '.')), 5)
    except:
        return None

def extract_pdf_data(pdf_path):
    print(f"Reading PDF from {pdf_path}...")
    reader = pypdf.PdfReader(pdf_path)
    pattern = re.compile(r'^(\d{8,9})\s+(.*?)\s+(SAY|EA|SÖZ)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,]+|--)\s+([\d,]+|--)$')
    
    results = {}
    
    for pno, page in enumerate(reader.pages):
        text = page.extract_text()
        for line in text.splitlines():
            line = line.strip()
            if not line or 'PROGRAM' in line or 'ÖSYM' in line or '2026 DGS' in line or re.match(r'^\d+\s*/\s*\d+$', line):
                continue
            m = pattern.match(line)
            if m:
                code, prog_name, puan_turu, kont, yerlesen, bos, p_min, p_max = m.groups()
                code = code.strip()
                results[code] = {
                    'code': code,
                    'prog_name_pdf': prog_name.strip(),
                    'puan_turu': puan_turu.strip(),
                    'kont_2026': int(kont),
                    'yerlesen_2026': int(yerlesen),
                    'bos_2026': int(bos),
                    'puan_2026': p_min.strip(),
                    'puan_2026_val': parse_float_tr(p_min.strip()),
                    'puan_2026_max': p_max.strip(),
                    'puan_2026_max_val': parse_float_tr(p_max.strip()),
                }
    
    print(f"Total programs extracted from PDF: {len(results)}")
    return results

def update_dgs_programs(results):
    print(f"Loading {PROGRAMS_JS_PATH}...")
    with open(PROGRAMS_JS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'window\.DATA_DGS_PROGRAMS\s*=\s*(\[.*?\]);?\s*$', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find window.DATA_DGS_PROGRAMS in file!")
    
    programs = json.loads(match.group(1))
    matched_count = 0
    unmatched_codes = []
    
    for item in programs:
        c = str(item.get('code', '')).strip()
        if c in results:
            r = results[c]
            item['kont'] = r['kont_2026']
            item['yerlesen'] = r['yerlesen_2026']
            item['bos'] = r['bos_2026']
            item['puan_2026'] = r['puan_2026']
            item['puan_2026_val'] = r['puan_2026_val']
            item['puan_2026_max'] = r['puan_2026_max']
            item['puan_2026_max_val'] = r['puan_2026_max_val']
            matched_count += 1
        else:
            unmatched_codes.append(c)
            item['yerlesen'] = 0
            item['bos'] = item.get('kont', 0)
            item['puan_2026'] = '--'
            item['puan_2026_val'] = None
            item['puan_2026_max'] = '--'
            item['puan_2026_max_val'] = None
            
    print(f"Updated {matched_count} / {len(programs)} programs in dgs_programs.js")
    if unmatched_codes:
        print(f"Unmatched codes ({len(unmatched_codes)}): {unmatched_codes[:5]}")
        
    out_js = f"window.DATA_DGS_PROGRAMS={json.dumps(programs, ensure_ascii=False, separators=(',', ':'))};\n"
    with open(PROGRAMS_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(out_js)
    print(f"Saved updated {PROGRAMS_JS_PATH} successfully!")

def update_dgs_trend(results):
    print(f"Loading {TREND_JS_PATH}...")
    with open(TREND_JS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'window\.DATA_DGS_TREND\s*=\s*(\{.*?\});?\s*$', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find window.DATA_DGS_TREND in file!")
    
    trend_dict = json.loads(match.group(1))
    trend_updated = 0
    
    for code, item in trend_dict.items():
        if code in results:
            r = results[code]
            if 'history' not in item:
                item['history'] = {}
            item['history']['2026'] = {
                'kont': r['kont_2026'],
                'yer': r['yerlesen_2026'],
                'bos': r['bos_2026'],
                'min': r['puan_2026'],
                'min_val': r['puan_2026_val'],
                'max': r['puan_2026_max'],
                'max_val': r['puan_2026_max_val']
            }
            trend_updated += 1
            
    print(f"Updated {trend_updated} programs in dgs_trend.js")
    out_js = f"window.DATA_DGS_TREND={json.dumps(trend_dict, ensure_ascii=False, separators=(',', ':'))};\n"
    with open(TREND_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(out_js)
    print(f"Saved updated {TREND_JS_PATH} successfully!")

if __name__ == '__main__':
    results = extract_pdf_data(PDF_PATH)
    update_dgs_programs(results)
    update_dgs_trend(results)
    print("ALL DGS 2026 PLACEMENT RESULTS UPDATED SUCCESSFULLY!")
