import fitz

f1 = r'c:\Users\yakupcontarli\Documents\Antigravity_Workspace_2026_Full\project\2026_DGS-tablo-1-merkezi-yerlestirme-le-dikey-gecis-yapilacak-yuksekogretim-lisans-programlari-024ghf-27090615.pdf'
doc = fitz.open(f1)
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

# Group spans by y
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

for line in lines[3:15]:
    print("LINE Y=", round(line[0]['bbox'][1], 1))
    for s in line:
        print(f"   x={s['bbox'][0]:.1f}-{s['bbox'][2]:.1f} : {repr(s['text'])}")
