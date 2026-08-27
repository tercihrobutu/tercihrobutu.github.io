import fitz
import json
import re
import os
import unicodedata

PDF_COND_PATH = r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project\DGS_2026-tablo-1de-yer-alan-yuksekogretim-lisans-programlarinin-kosul-ve-aciklamalari-j3xmr1-27090615.pdf'
OUTPUT_COND_JS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'dgs_conditions.js')

def clean_tr(text):
    if not text:
        return ''
    norm = unicodedata.normalize('NFC', str(text))
    norm = norm.replace('\u0307', '').replace('\u200b', '')
    return ' '.join(norm.split()).strip()

def parse_conditions():
    print(f"Opening Conditions PDF: {PDF_COND_PATH}")
    doc = fitz.open(PDF_COND_PATH)
    print(f"Total pages: {len(doc)}")

    full_text = ''
    for page in doc:
        full_text += page.get_text('text') + '\n'

    # Split by 'Bk. X' or 'Bk.X' or 'Koşul X'
    # Pattern to find all Bk. <number> headers
    pattern = r'(?:^|\n)\s*(?:Bk\.|Koşul)\s*(\d+)\s*\n'
    splits = re.split(pattern, full_text, flags=re.MULTILINE)

    conditions = {}
    
    # splits[0] is intro text, followed by (code, text) pairs
    for i in range(1, len(splits), 2):
        code = splits[i].strip()
        raw_desc = splits[i+1].strip()
        
        # Clean page header/footer noise from description
        desc = re.sub(r'2026-DGS TERCİH KILAVUZU\s*\d+\s*', '', raw_desc)
        desc = re.sub(r'TABLO 1.*?AÇIKLAMALARI\s*', '', desc, flags=re.DOTALL)
        desc = re.sub(r'Koşul\s*Numarası\s*Açıklama\s*', '', desc)
        clean_desc = clean_tr(desc)
        
        conditions[code] = clean_desc

    print(f"Extracted {len(conditions)} condition explanations.")
    
    # Sort by numeric key
    sorted_conditions = {k: conditions[k] for k in sorted(conditions.keys(), key=lambda x: int(x))}

    # Save to data/dgs_conditions.js
    os.makedirs(os.path.dirname(OUTPUT_COND_JS), exist_ok=True)
    with open(OUTPUT_COND_JS, 'w', encoding='utf-8') as f:
        f.write('// 2026 DGS Tablo-1 Özel Koşul ve Açıklamaları\n')
        f.write('window.DATA_DGS_CONDITIONS = ')
        json.dump(sorted_conditions, f, ensure_ascii=False, indent=2)
        f.write(';\n')

    print(f"Successfully saved to {OUTPUT_COND_JS} ({os.path.getsize(OUTPUT_COND_JS) / 1024:.1f} KB)")
    return sorted_conditions

if __name__ == '__main__':
    parse_conditions()
