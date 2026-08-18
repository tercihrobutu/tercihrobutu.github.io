import openpyxl
import os
import json

ARCHIVE_DIR = r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project\Arsiv\YKS'
DATA_DIR = r'C:\Users\yakupcontarli\Documents\GitHub\tercihrobutu.github.io\data'

OUTPUT_PATHS = [
    r'C:\Users\yakupcontarli\Documents\GitHub\tercihrobutu.github.io\data\yks_trend.js',
    r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project\data\yks_trend.js',
    r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project\web\data\yks_trend.js'
]

# File mapping to year and table type
FILES = [
    ('2022-yks_yerlestirme_tablo3_2022.xlsx', 2022, 'onlisans'),
    ('2022-yks_yerlestirme_tablo4_2022.xlsx', 2022, 'lisans'),
    ('2023-tablo3yd_22082023.xlsx', 2023, 'onlisans'),
    ('2023-tablo4yd_22082023.xlsx', 2023, 'lisans'),
    ('2024-tablo-3minmax_d27082024.xlsx', 2024, 'onlisans'),
    ('2024-tablo-4minmax_b27082024.xlsx', 2024, 'lisans'),
    ('2025-tablo3_ykd25082025.xlsx', 2025, 'onlisans'),
    ('2025-tablo4_ykd25082025.xlsx', 2025, 'lisans')
]

trend_data = {}

def parse_float(val):
    if val is None or val == '' or str(val).strip() in ['-', '----', '...']:
        return None
    try:
        return float(str(val).replace(',', '.'))
    except ValueError:
        return None

def parse_int(val):
    if val is None or val == '' or str(val).strip() in ['-', '----', '...']:
        return None
    try:
        return int(float(str(val).replace(',', '.')))
    except ValueError:
        return None

print("Starting Excel parsing (2022-2025)...")

for fname, year, cat in FILES:
    fpath = os.path.join(ARCHIVE_DIR, fname)
    if not os.path.exists(fpath):
        print(f"File not found: {fpath}")
        continue
    
    print(f"Processing {fname} ({year} - {cat})...")
    wb = openpyxl.load_workbook(fpath, read_only=True)
    sheet = wb.active

    header_idx = None
    rows = list(sheet.iter_rows(values_only=True))
    for idx, row in enumerate(rows[:10]):
        row_strs = [str(c).strip() for c in row if c is not None]
        if 'Program Kodu' in row_strs:
            header_idx = idx
            break
    
    if header_idx is None:
        print(f"Header not found in {fname}")
        continue

    for row in rows[header_idx + 1:]:
        if not row or not row[0]:
            continue
        
        code = str(row[0]).strip()
        if not code.isdigit() or len(code) < 7:
            continue

        univ_type = str(row[1]).strip() if len(row) > 1 and row[1] else ''
        univ = str(row[2]).strip() if len(row) > 2 and row[2] else ''
        fac = str(row[3]).strip() if len(row) > 3 and row[3] else ''
        prog = str(row[4]).strip() if len(row) > 4 and row[4] else ''
        score_type = str(row[5]).strip() if len(row) > 5 and row[5] else ''
        quota = parse_int(row[6]) if len(row) > 6 else None
        placed = parse_int(row[7]) if len(row) > 7 else None
        score_min = parse_float(row[8]) if len(row) > 8 else None
        score_max = parse_float(row[9]) if len(row) > 9 else None

        if code not in trend_data:
            trend_data[code] = {
                "univ": univ,
                "prog": prog,
                "score_type": score_type,
                "history": {}
            }
        
        trend_data[code]["history"][str(year)] = {
            "score": score_min,
            "score_max": score_max,
            "quota": quota,
            "placed": placed
        }

print("Parsing 2026 data from lisans.js and onlisans.js...")
for js_file in ['lisans.js', 'onlisans.js']:
    js_path = os.path.join(DATA_DIR, js_file)
    if os.path.exists(js_path):
        with open(js_path, 'r', encoding='utf-8') as f:
            content = f.read()
            json_str = content[content.find('['):content.rfind(']')+1]
            try:
                items = json.loads(json_str)
                for item in items:
                    code = str(item.get('code', '')).strip()
                    if not code: continue
                    score_min = parse_float(item.get('score'))
                    score_max = parse_float(item.get('score_max'))
                    quota = parse_int(item.get('quota_genel'))
                    placed = parse_int(item.get('quota_placed'))
                    rank = parse_int(item.get('rank'))

                    if code not in trend_data:
                        trend_data[code] = {
                            "univ": item.get('univ', ''),
                            "prog": item.get('prog', ''),
                            "score_type": item.get('score_type', ''),
                            "history": {}
                        }
                    
                    trend_data[code]["history"]["2026"] = {
                        "score": score_min,
                        "score_max": score_max,
                        "quota": quota,
                        "placed": placed,
                        "rank": rank
                    }
            except Exception as e:
                print(f"Error parsing 2026 data in {js_file}: {e}")

print(f"Total programs mapped across 2022-2026: {len(trend_data)}")

js_content = f"window.DATA_YKS_TREND = {json.dumps(trend_data, ensure_ascii=False, indent=None)};"

for out_path in OUTPUT_PATHS:
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

print("5-Year Trend dataset build complete!")
