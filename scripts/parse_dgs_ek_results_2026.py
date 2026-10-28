import os
import sys
import fitz
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

repo_dir = r"C:\Users\yakupcontarli\Documents\GitHub\tercihrobutu.github.io"
pdf_path = r"C:\Users\yakupcontarli\Downloads\2026-dgs-ek-yerlestirme-sonuclarina-liskin-en-kucuk-ve-en-buyuk-puanlar-ntn1d2-28091943.pdf"

if not os.path.exists(pdf_path):
    print(f"ERROR: PDF not found at {pdf_path}")
    sys.exit(1)

print(f"Opening PDF: {pdf_path}")
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

code_pattern = re.compile(r'^\d{9}$')
pdf_progs = {}
errors = []

for pno, page in enumerate(doc):
    # Clip above footer (y < 555) and below top title (y > 75) to avoid header/footer contamination
    rect = fitz.Rect(40, 75, page.rect.width - 20, 555)
    text = page.get_text('text', clip=rect)
    lines = [l.strip() for l in text.split('\n') if l.strip()]

    i = 0
    while i < len(lines):
        line = lines[i]
        if code_pattern.match(line):
            code = line
            i += 1
            name_parts = []
            while i < len(lines) and lines[i] not in ('SAY', 'EA', 'SÖZ'):
                name_parts.append(lines[i])
                i += 1
            if i >= len(lines):
                errors.append((pno + 1, code, 'EOF before puan type'))
                break
            puan_type = lines[i]
            i += 1
            tokens = []
            while i < len(lines) and not code_pattern.match(lines[i]):
                if any(h in lines[i] for h in ['PROGRAM', 'KODU', 'KONTENJAN', 'YERLEŞEN', 'EN KÜÇÜK', 'EN BÜYÜK', 'BOŞ']):
                    i += 1
                    continue
                tokens.extend(lines[i].split())
                i += 1

            if len(tokens) == 5:
                kont = int(tokens[0])
                yer = int(tokens[1])
                bos = int(tokens[2])
                min_puan = tokens[3]
                max_puan = tokens[4]
                min_val = float(min_puan.replace(',', '.')) if min_puan != '--' else None
                max_val = float(max_puan.replace(',', '.')) if max_puan != '--' else None

                pdf_progs[code] = {
                    'page': pno + 1,
                    'code': code,
                    'name': ' '.join(name_parts),
                    'puan_type': puan_type,
                    'kont': kont,
                    'yerlesen': yer,
                    'bos': bos,
                    'min_puan': min_puan,
                    'min_val': min_val,
                    'max_puan': max_puan,
                    'max_val': max_val
                }
            else:
                errors.append((pno + 1, code, f'Expected 5 tokens, got {len(tokens)}: {tokens}'))
        else:
            i += 1

print(f"Total programs parsed: {len(pdf_progs)}")
print(f"Total parsing errors: {len(errors)}")
if errors:
    print("Sample errors:", errors[:10])
    sys.exit(1)

# Stats
tot_kont = sum(p['kont'] for p in pdf_progs.values())
tot_yer = sum(p['yerlesen'] for p in pdf_progs.values())
tot_bos = sum(p['bos'] for p in pdf_progs.values())
with_score = sum(1 for p in pdf_progs.values() if p['min_puan'] != '--')
empty_score = sum(1 for p in pdf_progs.values() if p['min_puan'] == '--')

print("\n--- ÖSYM 2026-DGS Ek Yerleştirme Sonuç İstatistikleri ---")
print(f"Toplam Ek Kontenjan: {tot_kont:,}")
print(f"Toplam Yerleşen: {tot_yer:,}")
print(f"Toplam Boş Kalan: {tot_bos:,}")
print(f"Taban Puanı Oluşan Program Sayısı: {with_score:,}")
print(f"Boş Kalan / Puan Oluşmayan Program Sayısı (--): {empty_score:,}")
print(f"Genel Ek Yerleştirme Doluluk Oranı: %{tot_yer/tot_kont*100:.2f}")

# Update data/dgs_programs.js
js_path = os.path.join(repo_dir, "data", "dgs_programs.js")
with open(js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

prefix = "window.DATA_DGS_PROGRAMS="
idx = js_content.find(prefix)
if idx == -1:
    print("ERROR: Could not find prefix window.DATA_DGS_PROGRAMS=")
    sys.exit(1)

comment_header = js_content[:idx]
raw_json = js_content[idx + len(prefix):].rstrip(';\n ')
db = json.loads(raw_json)
print(f"\nLoaded {len(db)} programs from dgs_programs.js")

matched = 0
for prog in db:
    code = prog["code"]
    if code in pdf_progs:
        matched += 1
        res = pdf_progs[code]
        prog["has_ek_sonuc_2026"] = True
        prog["ek_kont_2026"] = res["kont"]
        prog["ek_yerlesen_2026"] = res["yerlesen"]
        prog["ek_bos_2026"] = res["bos"]
        prog["ek_min_2026"] = res["min_puan"]
        prog["ek_min_2026_val"] = res["min_val"]
        prog["ek_max_2026"] = res["max_puan"]
        prog["ek_max_2026_val"] = res["max_val"]
    else:
        prog["has_ek_sonuc_2026"] = False
        prog["ek_yerlesen_2026"] = 0
        prog["ek_bos_2026"] = 0
        prog["ek_min_2026"] = "--"
        prog["ek_min_2026_val"] = None
        prog["ek_max_2026"] = "--"
        prog["ek_max_2026_val"] = None

print(f"Successfully updated {matched} / {len(pdf_progs)} programs in DB")

new_js_content = f"// 2026 DGS Tercih Kılavuzu & Ek Yerleştirme Sonuçları\n{prefix}{json.dumps(db, ensure_ascii=False)};\n"
with open(js_path, "w", encoding="utf-8") as f:
    f.write(new_js_content)
print(f"Wrote updated {js_path} ({len(new_js_content):,} bytes)")

# Update data/dgs_trend.js
trend_path = os.path.join(repo_dir, "data", "dgs_trend.js")
if os.path.exists(trend_path):
    with open(trend_path, "r", encoding="utf-8") as f:
        t_content = f.read()
    t_prefix = "window.DATA_DGS_TREND="
    t_idx = t_content.find(t_prefix)
    if t_idx != -1:
        trend_db = json.loads(t_content[t_idx + len(t_prefix):].rstrip(';\n '))
        trend_matched = 0
        for code, res in pdf_progs.items():
            if code in trend_db:
                trend_matched += 1
                if "ek_history" not in trend_db[code]:
                    trend_db[code]["ek_history"] = {}
                trend_db[code]["ek_history"]["2026_ek"] = {
                    "kont": res["kont"],
                    "yer": res["yerlesen"],
                    "bos": res["bos"],
                    "min": res["min_puan"],
                    "min_val": res["min_val"],
                    "max": res["max_puan"],
                    "max_val": res["max_val"]
                }
        print(f"Updated {trend_matched} programs in dgs_trend.js")
        new_trend_content = f"{t_prefix}{json.dumps(trend_db, ensure_ascii=False)};\n"
        with open(trend_path, "w", encoding="utf-8") as f:
            f.write(new_trend_content)
        print(f"Wrote updated {trend_path} ({len(new_trend_content):,} bytes)")

print("\nSUCCESS: Data update completed successfully!")
