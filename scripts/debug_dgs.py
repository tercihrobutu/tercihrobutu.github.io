import fitz

f2 = r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project\2026_DGS-tablo-2-on-lisans-mezuniyet-alanlarina-gore-dikey-gecis-yapilabilecek-lisans-programlari-yme5f7-27090615.pdf'
doc = fitz.open(f2)
p0 = doc[0]

spans = []
d = p0.get_text('dict')
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

spans.sort(key=lambda s: (round(s['bbox'][1], 1), round(s['bbox'][0], 1)))

for s in spans[:45]:
    bb = s['bbox']
    font = s['font']
    txt = s['text']
    print(f"y={bb[1]:.1f}, x={bb[0]:.1f}, font={font} : {txt}")
