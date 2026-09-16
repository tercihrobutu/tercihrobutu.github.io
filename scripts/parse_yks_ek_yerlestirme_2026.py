import os
import sys
import re
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = r'C:\Users\yakupcontarli\Downloads\2026-yuksekogretim-programlari-ek-yerlestirme-kilavuzu-bwch9h-16154905.pdf'
ONLISANS_JS = os.path.join(REPO_ROOT, 'data', 'onlisans.js')
LISANS_JS = os.path.join(REPO_ROOT, 'data', 'lisans.js')

def parse_int_or_zero(val_str):
    if not val_str:
        return 0
    clean = re.sub(r'[^\d]', '', str(val_str))
    return int(clean) if clean else 0

def parse_score(val_str):
    if not val_str:
        return None
    val_str = str(val_str).strip()
    if val_str in ['--', '----', '']:
        return None
    try:
        return round(float(val_str.replace(',', '.')), 5)
    except:
        return None

def extract_table_range(doc, start_page, end_page, table_name):
    print(f"Extracting {table_name} from page {start_page} to {end_page}...")
    results = {}
    
    prog_code_pattern = re.compile(r'^\d{8,9}$')
    
    for pno in range(start_page - 1, end_page):
        page = doc[pno]
        tabs = page.find_tables()
        if not tabs.tables:
            continue
        
        table = tabs.tables[0]
        rows = table.extract()
        
        for r in rows:
            if not r or len(r) < 5:
                continue
            
            raw_code = (r[0] or '').strip()
            if not prog_code_pattern.match(raw_code):
                continue
            
            code = raw_code
            prog_name = (r[1] or '').strip().replace('\n', ' ')
            duration = parse_int_or_zero(r[2]) if len(r) > 2 else 0
            score_type = (r[3] or '').strip() if len(r) > 3 else ''
            
            ek_kont_genel = parse_int_or_zero(r[4]) if len(r) > 4 else 0
            ek_kont_sehit_gazi = parse_int_or_zero(r[5]) if len(r) > 5 else 0
            ek_kont_kadin34 = parse_int_or_zero(r[6]) if len(r) > 6 else 0
            
            ek_spec_cond = (r[7] or '').strip().replace('\n', ' ') if len(r) > 7 else ''
            ek_score_gk = parse_score(r[8]) if len(r) > 8 else None
            ek_score_sgy = parse_score(r[9]) if len(r) > 9 else None
            ek_score_34y = parse_score(r[10]) if len(r) > 10 else None
            
            results[code] = {
                'code': code,
                'prog_name_pdf': prog_name,
                'duration': duration,
                'score_type': score_type,
                'ek_kont_genel': ek_kont_genel,
                'ek_kont_sehit_gazi': ek_kont_sehit_gazi,
                'ek_kont_kadin34': ek_kont_kadin34,
                'ek_kont_total': ek_kont_genel + ek_kont_sehit_gazi + ek_kont_kadin34,
                'ek_spec_cond': ek_spec_cond,
                'ek_score_gk': ek_score_gk,
                'ek_score_sgy': ek_score_sgy,
                'ek_score_34y': ek_score_34y,
            }
            
    print(f"Extracted {len(results)} programs for {table_name}.")
    total_kont = sum(x['ek_kont_genel'] for x in results.values())
    total_with_kont = sum(1 for x in results.values() if x['ek_kont_genel'] > 0)
    print(f"  Total Genel Ek Kontenjan: {total_kont} across {total_with_kont} programs with quota > 0")
    return results

def update_dataset_file(file_path, var_name, extracted_data):
    print(f"\nUpdating {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'\[.*\]', content, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find JSON array in {file_path}")
    
    items = json.loads(match.group(0))
    matched_count = 0
    with_ek_kont = 0
    total_ek_kont = 0
    
    for item in items:
        code = str(item.get('code', '')).strip()
        if code in extracted_data:
            r = extracted_data[code]
            item['ek_kont_genel'] = r['ek_kont_genel']
            item['ek_kont_sehit_gazi'] = r['ek_kont_sehit_gazi']
            item['ek_kont_kadin34'] = r['ek_kont_kadin34']
            item['ek_kont_total'] = r['ek_kont_total']
            item['ek_score_gk'] = r['ek_score_gk']
            item['ek_score_sgy'] = r['ek_score_sgy']
            item['ek_score_34y'] = r['ek_score_34y']
            item['ek_spec_cond'] = r['ek_spec_cond']
            # Update quota_empty to reflect official 2026 Ek Kontenjan
            item['quota_empty'] = r['ek_kont_genel']
            
            matched_count += 1
            if r['ek_kont_genel'] > 0:
                with_ek_kont += 1
                total_ek_kont += r['ek_kont_genel']
        else:
            item['ek_kont_genel'] = 0
            item['ek_kont_sehit_gazi'] = 0
            item['ek_kont_kadin34'] = 0
            item['ek_kont_total'] = 0
            item['ek_score_gk'] = None
            item['ek_score_sgy'] = None
            item['ek_score_34y'] = None
            item['ek_spec_cond'] = ''
            item['quota_empty'] = 0
            
    print(f"  Matched {matched_count} / {len(items)} programs.")
    print(f"  Programs with Ek Kontenjan > 0: {with_ek_kont}")
    print(f"  Total Genel Ek Kontenjan assigned: {total_ek_kont}")
    
    # Save back
    out_js = f"{var_name}={json.dumps(items, ensure_ascii=False, separators=(',', ':'))};\n"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(out_js)
    print(f"Saved {file_path} successfully!")

def main():
    if not os.path.exists(PDF_PATH):
        print(f"Error: PDF not found at {PDF_PATH}")
        sys.exit(1)
        
    doc = fitz.open(PDF_PATH)
    print(f"Opened PDF: {PDF_PATH} ({len(doc)} pages)")
    
    # Tablo 3: On Lisans (Pages 11-124)
    tablo3_data = extract_table_range(doc, 11, 124, "TABLO-3 (On Lisans)")
    update_dataset_file(ONLISANS_JS, "window.DATA_ONLISANS", tablo3_data)
    
    # Tablo 4: Lisans (Pages 126-303)
    tablo4_data = extract_table_range(doc, 126, 303, "TABLO-4 (Lisans)")
    update_dataset_file(LISANS_JS, "window.DATA_LISANS", tablo4_data)
    
    print("\nSUCCESS! All 2026 YKS Ek Yerlestirme data processed and saved.")

if __name__ == '__main__':
    main()
