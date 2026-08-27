import fitz
import json
import re
import os
import unicodedata

PDF_PATH = r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project\2026_DGS-tablo-1-merkezi-yerlestirme-le-dikey-gecis-yapilacak-yuksekogretim-lisans-programlari-024ghf-27090615.pdf'
OUTPUT_JS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'dgs_programs.js')

def clean_tr(text):
    if not text:
        return ''
    norm = unicodedata.normalize('NFC', str(text))
    norm = norm.replace('\u0307', '').replace('\u200b', '')
    return ' '.join(norm.split()).strip()

def extract_city_and_type(univ_str):
    univ_type = 'Devlet'
    if 'Vakıf' in univ_str:
        univ_type = 'Vakıf'
    elif 'KKTC' in univ_str:
        univ_type = 'KKTC'
    elif 'Yurtdışı' in univ_str or 'Yabancı' in univ_str:
        univ_type = 'Yurtdışı'
    
    city = ''
    matches = re.findall(r'\(([^)]+)\)', univ_str)
    for m in matches:
        m_clean = m.strip()
        if m_clean not in ['Devlet Üniversitesi', 'Vakıf Üniversitesi', 'KKTC Üniversitesi', 'Yurtdışı Üniversitesi', 'Özel']:
            city = m_clean.title()
            city = city.replace('I', 'ı').replace('İ', 'i').capitalize()
            break
    
    if not city:
        first_word = univ_str.split()[0].title()
        city = first_word
        
    return city, univ_type

def parse_tablo1():
    print(f"Opening Tablo-1 PDF: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
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

            if 'TABLO-1' in line_text or 'Dikey Geçiş' in line_text or '2026-DGS' in line_text or 'Program Adı' in line_text:
                continue

            if is_bold and ('ÜNİVERSİTESİ' in line_text or 'YÜKSEK TEKNOLOJİ' in line_text or 'AKADEMİSİ' in line_text):
                current_univ = line_text
                current_fac = ''
                continue

            if is_bold and ('FAKÜLTESİ' in line_text or 'YÜKSEKOKULU' in line_text or 'KONSERVATUVARI' in line_text or 'ENSTİTÜSÜ' in line_text or 'MESLEK YÜKSEKOKULU' in line_text):
                current_fac = line_text
                continue

            # Check if this line starts a program row (9-digit program code)
            match = re.match(r'^(\d{9})\s*(.*)$', line_text)
            if match:
                code = match.group(1)
                
                prog_name = ''
                sure = '4'
                puan = ''
                kont = ''
                kosul = ''
                lisans_alan_kodu = ''

                for s in line:
                    x = s['bbox'][0]
                    t = s['text'].strip()
                    if not t:
                        continue
                    
                    if x < 330:
                        cleaned = re.sub(r'^\d{9}\s*', '', t).strip()
                        if cleaned:
                            if prog_name:
                                prog_name += ' ' + cleaned
                            else:
                                prog_name = cleaned
                    elif 340 <= x < 375 and t.isdigit() and len(t) == 1:
                        sure = t
                    elif 375 <= x < 405 and t in ['SAY', 'EA', 'SÖZ']:
                        puan = t
                    elif (405 <= x < 435) and t.isdigit() and len(t) <= 4 and (not ',' in t):
                        kont = t
                    elif x >= 510 and re.match(r'^\d{4}$', t):
                        lisans_alan_kodu = t
                    elif (435 <= x < 515) or (',' in t) or (len(t) > 4 and x < 510):
                        if kosul:
                            kosul += ',' + t
                        else:
                            kosul = t

                # Fallbacks if slight coordinate variance
                if not prog_name:
                    prog_name = match.group(2)

                city, univ_type = extract_city_and_type(current_univ)

                # Clean quota
                try:
                    kont_int = int(re.sub(r'[^\d]', '', kont)) if kont else 0
                except:
                    kont_int = 0

                # Clean kosul (remove trailing/duplicate commas)
                kosul_cleaned = re.sub(r',+', ',', kosul).strip(',')

                programs.append({
                    'code': code,
                    'univ': clean_tr(current_univ),
                    'city': city,
                    'univ_type': univ_type,
                    'fac': clean_tr(current_fac),
                    'prog': clean_tr(prog_name),
                    'sure': sure,
                    'puan': puan,
                    'kont': kont_int,
                    'kosul': kosul_cleaned,
                    'lisans_alan_kodu': lisans_alan_kodu,
                    'page': page_idx + 1
                })

    print(f"Total DGS programs extracted: {len(programs)}")
    
    # Save to data/dgs_programs.js
    os.makedirs(os.path.dirname(OUTPUT_JS), exist_ok=True)
    with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
        f.write('// 2026 DGS Tercih Kılavuzu Tablo-1 Merkezi Yerleştirme Lisans Programları\n')
        f.write('window.DATA_DGS_PROGRAMS = ')
        json.dump(programs, f, ensure_ascii=False, indent=2)
        f.write(';\n')

    print(f"Successfully saved to {OUTPUT_JS} ({os.path.getsize(OUTPUT_JS) / 1024:.1f} KB)")
    return programs

if __name__ == '__main__':
    parse_tablo1()
