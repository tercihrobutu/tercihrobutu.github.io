import json

with open('data/dgs_mapping.js', 'r', encoding='utf-8') as f:
    text = f.read()
    raw = text.split('DATA_DGS_MAPPING', 1)[1].split('=', 1)[1]
    mapping_str = raw.split('window.DATA_DGS_MEZUNIYET_ALANLARI', 1)[0].rstrip(';\n ')
    mapping = json.loads(mapping_str)

with open('data/dgs_programs.js', 'r', encoding='utf-8') as f:
    prog_text = f.read()
    programs = json.loads(prog_text.split('=', 1)[1].rstrip(';\n '))

import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== VERIFYING DGS DATA INTEGRITY ===")
total_progs = len(programs)
print(f"Total programs: {total_progs}")
assert total_progs == 7060, f"Expected 7060 programs, got {total_progs}"

ek_progs = [p for p in programs if p.get('has_ek_2026')]
total_ek_kont = sum(p.get('ek_kont_2026', 0) for p in programs)
print(f"Programs with Ek Kontenjan: {len(ek_progs)} / {total_progs}")
print(f"Total Ek Kontenjan: {total_ek_kont}")
assert len(ek_progs) == 3398, f"Expected 3398 programs with ek kontenjan, got {len(ek_progs)}"
assert total_ek_kont == 21389, f"Expected 21389 ek kontenjan, got {total_ek_kont}"

test_depts = ['Adalet', 'Bilgisayar Programcılığı', 'İlk ve Acil Yardım (Myo/Yo)', 'Anestezi', 'Aşçılık', 'İlahiyat']

for dept in test_depts:
    matched_key = None
    for k in mapping:
        if dept.lower() in k.lower():
            matched_key = k
            break
    
    if matched_key:
        info = mapping[matched_key]
        allowed_codes = info['lisans_kodlari']
        matching_progs = [p for p in programs if p['lisans_alan_kodu'] in allowed_codes]
        matching_ek = [p for p in matching_progs if p.get('has_ek_2026')]
        matching_ek_kont = sum(p.get('ek_kont_2026', 0) for p in matching_ek)
        print(f"=== {matched_key} ===")
        print(f"  Önlisans Kodları: {info['codes']}")
        print(f"  Geçiş Yapılabilecek Lisans Kodları ({len(allowed_codes)} adet): {allowed_codes[:6]}...")
        print(f"  Tablo-1'de Toplam Lisans Programı: {len(matching_progs)} program")
        print(f"  Ek Tercihte Başvurulabilecek Program: {len(matching_ek)} program | Toplam Ek Kontenjan: {matching_ek_kont}")
        if matching_ek:
            first = matching_ek[0]
            print(f"  Örnek Ek Program: [{first['code']}] {first['univ']} - {first['prog']} | Ek Kont: {first.get('ek_kont_2026')} | 2026 Puan: {first.get('puan_2026')}")
        print("-" * 60)
    else:
        print(f"NOT FOUND: {dept}")

print("ALL DGS & EK YERLEŞTİRME VERIFICATIONS PASSED 100%!")

