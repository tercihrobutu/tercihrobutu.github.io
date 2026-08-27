import json

with open('data/dgs_mapping.js', 'r', encoding='utf-8') as f:
    text = f.read()
    mapping_str = text.split('window.DATA_DGS_MAPPING = ', 1)[1].split('window.DATA_DGS_MEZUNIYET_ALANLARI = ', 1)[0].rstrip(';\n ')
    mapping = json.loads(mapping_str)

with open('data/dgs_programs.js', 'r', encoding='utf-8') as f:
    prog_text = f.read()
    programs = json.loads(prog_text.split('=', 1)[1].rstrip(';\n '))

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
        print(f"=== {matched_key} ===")
        print(f"  Önlisans Kodları: {info['codes']}")
        print(f"  Geçiş Yapılabilecek Lisans Kodları ({len(allowed_codes)} adet): {allowed_codes}")
        print(f"  Geçiş Yapılabilecek Lisans İsimleri: {list(info['lisans_programlari'])[:4]}")
        print(f"  Tablo-1'de Tercih Edilebilecek Toplam Üniversite Programı: {len(matching_progs)} program")
        if matching_progs:
            first = matching_progs[0]
            print(f"  Örnek Program: [{first['code']}] {first['univ']} - {first['prog']} | Kont: {first['kont']} | Puan: {first['puan']}")
        print("-" * 60)
    else:
        print(f"NOT FOUND: {dept}")
