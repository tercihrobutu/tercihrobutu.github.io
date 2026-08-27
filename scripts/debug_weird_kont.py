import json

with open('data/dgs_programs.js', 'r', encoding='utf-8') as f:
    text = f.read()
    data = json.loads(text.split('=', 1)[1].rstrip(';\n '))

for item in data:
    kont = item['kont']
    if kont == 0 or kont > 50:
        print(f"Page {item['page']}: [{item['code']}] {item['univ'][:30]} - {item['prog'][:30]} | kont={kont} | kosul={item['kosul']} | puan={item['puan']} | kod={item['lisans_alan_kodu']}")
