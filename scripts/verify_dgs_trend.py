import json

with open('data/dgs_programs.js', 'r', encoding='utf-8') as f:
    text = f.read()
    data = json.loads(text.split('=', 1)[1].rstrip(';\n '))

print('=== SAMPLE ENRICHED DGS PROGRAMS ===')
for item in data[:8]:
    c = item['code']
    u = item['univ'][:25]
    p = item['prog'][:25]
    p25 = item['puan_2025']
    k25 = item['kont_2025']
    p24 = item['puan_2024']
    k24 = item['kont_2024']
    k26 = item['kont']
    diff = item['kont_diff_str']
    print(f"[{c}] {u} - {p} | 2025: {p25} (K:{k25}) | 2024: {p24} (K:{k24}) | 2026 Kont: {k26} ({diff})")
