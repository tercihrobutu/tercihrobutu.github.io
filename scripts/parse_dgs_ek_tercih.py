import os
import sys
import re
import json
import fitz
import unicodedata

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = r'C:\Users\yakupcontarli\Downloads\dgsEkTercih'
TABLO1_PDF = os.path.join(PDF_DIR, 'tablo-1-merkezi-ek-yerlestirme-le-dikey-gecis-yapilacak-yuksekogretim-lisans-programlari-h1ypoj-14134112.pdf')
CONDITIONS_PDF = os.path.join(PDF_DIR, 'tablo-1de-yer-alan-yuksekogretim-lisans-programlarinin-kosul-ve-aciklamalari-fnuv5d-14134112.pdf')
TABLO2_PDF = os.path.join(PDF_DIR, 'tablo-2-on-lisans-mezuniyet-alanlarina-gore-dikey-gecis-yapilabilecek-lisans-programlari-gq9l6s-14134112.pdf')

def clean_tr(text):
    if not text:
        return ''
    norm = unicodedata.normalize('NFC', str(text))
    norm = norm.replace('\u0307', '').replace('\u200b', '')
    return ' '.join(norm.split()).strip()

def parse_tablo1():
    print("=== PARSING TABLO-1 (EK YERLEŞTİRME) ===")
    doc = fitz.open(TABLO1_PDF)
    print(f"Total pages: {len(doc)}")

    programs = []
    current_univ = ''
    current_fac = ''

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        d = page.get_text('dict')
        
        spans = []
        for b in d['blocks']:
            if 'lines' in b:
                for line in b['lines']:
                    for s in line['spans']:
                        t = s['text'].strip()
                        if t:
                            spans.append({
                                'text': t,
                                'bbox': s['bbox'],
                                'font': s['font'],
                                'size': s['size']
                            })
        
        # Sort spans top-to-bottom, left-to-right
        spans.sort(key=lambda s: (round(s['bbox'][1], 1), round(s['bbox'][0], 1)))

        # Group spans into lines
        lines = []
        cur_line = []
        cur_y = None
        for s in spans:
            y = s['bbox'][1]
            if cur_y is None or abs(y - cur_y) < 3.5:
                cur_line.append(s)
                cur_y = y
            else:
                if cur_line:
                    cur_line.sort(key=lambda x: x['bbox'][0])
                    lines.append(cur_line)
                cur_line = [s]
                cur_y = y
        if cur_line:
            cur_line.sort(key=lambda x: x['bbox'][0])
            lines.append(cur_line)

        for line in lines:
            line_text = ' '.join(s['text'] for s in line).strip()
            first_span = line[0]
            font = first_span['font']
            is_bold = 'Bold' in font or 'bold' in font.lower()

            if 'TABLO-1' in line_text or 'Dikey Geçiş' in line_text or '2026-DGS' in line_text or 'Program Adı' in line_text or 'Ek Kont.' in line_text:
                continue

            if is_bold and ('ÜNİVERSİTESİ' in line_text or 'YÜKSEK TEKNOLOJİ' in line_text or 'AKADEMİSİ' in line_text):
                current_univ = line_text
                current_fac = ''
                continue

            if is_bold and ('FAKÜLTESİ' in line_text or 'YÜKSEKOKULU' in line_text or 'KONSERVATUVARI' in line_text or 'ENSTİTÜSÜ' in line_text or 'MESLEK YÜKSEKOKULU' in line_text):
                current_fac = line_text
                continue

            # Check if line starts with 9 digit code
            m = re.match(r'^(\d{9})\s*(.*)$', line_text)
            if m:
                code = m.group(1)
                
                sure = '4'
                puan = ''
                ek_kont = None
                kosul = ''
                lisans_alan_kodu = ''
                prog_name_spans = []

                for s in line:
                    x = s['bbox'][0]
                    t = s['text'].strip()
                    if not t:
                        continue
                    
                    if x < 315:
                        cleaned = re.sub(r'^\d{9}\s*', '', t).strip()
                        if cleaned:
                            prog_name_spans.append(cleaned)
                    elif 315 <= x < 345 and t.isdigit():
                        sure = t
                    elif 345 <= x < 385 and t in ['SAY', 'EA', 'SÖZ']:
                        puan = t
                    elif 385 <= x < 425 and t.isdigit():
                        ek_kont = int(t)
                    elif x >= 505 and re.match(r'^\d{4}$', t):
                        lisans_alan_kodu = t
                    elif 425 <= x < 505 or ',' in t:
                        if kosul:
                            kosul += ',' + t
                        else:
                            kosul = t

                programs.append({
                    'code': code,
                    'univ': clean_tr(current_univ),
                    'fac': clean_tr(current_fac),
                    'prog': clean_tr(' '.join(prog_name_spans)),
                    'sure': sure,
                    'puan': puan,
                    'ek_kont': ek_kont,
                    'kosul': kosul.strip(','),
                    'lisans_alan_kodu': lisans_alan_kodu,
                    'page': page_idx + 1,
                    'line_text': line_text
                })
            else:
                # Could this be a continuation line of the previous program?
                if programs:
                    last_p = programs[-1]
                    for s in line:
                        x = s['bbox'][0]
                        t = s['text'].strip()
                        if not t:
                            continue
                        if x < 315 and not is_bold:
                            last_p['prog'] = clean_tr(last_p['prog'] + ' ' + t)
                        elif 425 <= x < 505 or (',' in t and not is_bold):
                            if last_p['kosul']:
                                last_p['kosul'] += ',' + t
                            else:
                                last_p['kosul'] = t
                            last_p['kosul'] = last_p['kosul'].strip(',')
                        elif x >= 505 and re.match(r'^\d{4}$', t) and not last_p['lisans_alan_kodu']:
                            last_p['lisans_alan_kodu'] = t

    print(f"Total programs extracted: {len(programs)}")
    
    # Check for any missing fields or anomalies
    no_kont = [p for p in programs if p['ek_kont'] is None]
    no_puan = [p for p in programs if not p['puan']]
    no_lisans = [p for p in programs if not p['lisans_alan_kodu']]
    print(f"Missing ek_kont: {len(no_kont)}")
    print(f"Missing puan: {len(no_puan)}")
    print(f"Missing lisans_alan_kodu: {len(no_lisans)}")
    if no_kont:
        print("Sample missing kont:", no_kont[:3])
    if no_puan:
        print("Sample missing puan:", no_puan[:3])
    if no_lisans:
        print("Sample missing lisans:", no_lisans[:3])

    total_ek_kont = sum(p['ek_kont'] for p in programs if p['ek_kont'] is not None)
    print(f"TOTAL EK KONTENJAN: {total_ek_kont}")

    return programs

def update_dgs_programs(programs):
    js_path = os.path.join(REPO_ROOT, 'data', 'dgs_programs.js')
    print(f"Loading {js_path}...")
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'window\.DATA_DGS_PROGRAMS\s*=\s*(\[.*?\]);?\s*$', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find window.DATA_DGS_PROGRAMS in file!")

    all_programs = json.loads(match.group(1))
    print(f"Total existing programs in dgs_programs.js: {len(all_programs)}")

    ek_map = {p['code']: p for p in programs}

    matched_count = 0
    total_ek_assigned = 0

    for item in all_programs:
        code = str(item.get('code', '')).strip()
        if code in ek_map:
            ek_item = ek_map[code]
            item['ek_kont_2026'] = ek_item['ek_kont']
            item['has_ek_2026'] = True
            # Keep track of previous initial empty count if not already recorded
            if 'bos_ilk' not in item:
                item['bos_ilk'] = item.get('bos', 0)
            item['bos'] = ek_item['ek_kont']
            matched_count += 1
            total_ek_assigned += ek_item['ek_kont']
        else:
            item['ek_kont_2026'] = 0
            item['has_ek_2026'] = False
            if 'bos_ilk' not in item:
                item['bos_ilk'] = item.get('bos', 0)
            item['bos'] = 0

    print(f"Updated {matched_count} programs with ek_kont > 0.")
    print(f"Total ek quota assigned: {total_ek_assigned}")
    assert matched_count == 3398, f"Expected 3398 matched, got {matched_count}"
    assert total_ek_assigned == 21389, f"Expected 21389 ek quota, got {total_ek_assigned}"

    out_js = f"// 2026 DGS Tercih Kılavuzu & Ek Yerleştirme Kontenjanları\nwindow.DATA_DGS_PROGRAMS={json.dumps(all_programs, ensure_ascii=False, separators=(',', ':'))};\n"
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(out_js)

    print(f"Successfully saved {js_path} ({os.path.getsize(js_path) / 1024:.1f} KB)")

if __name__ == '__main__':
    ek_programs = parse_tablo1()
    update_dgs_programs(ek_programs)
    print("ALL DGS EK YERLEŞTİRME DATA PROCESSED AND VERIFIED!")


