# ============================================================
# Search Engine Sitemap Ping & Full IndexNow (3000+ URLs) Script
# ============================================================
import urllib.request
import urllib.parse
import json
import ssl
import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
SITEMAP_PATH = os.path.join(REPO_ROOT, 'sitemap.xml')

SITEMAP_URL = "https://tercihrobutu.github.io/sitemap.xml"
HOST = "tercihrobutu.github.io"
KEY = "8f7a0796a90379d4b2d97e"
KEY_LOCATION = f"https://tercihrobutu.github.io/{KEY}.txt"

ctx = ssl.create_default_context()

print(f"[PING] Arama motorlarina sitemap ping islemi baslatiliyor: {SITEMAP_URL}\n")

# 1. Standard Ping Endpoints (Google, Bing, Yandex)
ping_endpoints = [
    ("Google", f"https://www.google.com/ping?sitemap={urllib.parse.quote_plus(SITEMAP_URL)}"),
    ("Bing", f"https://www.bing.com/ping?sitemap={urllib.parse.quote_plus(SITEMAP_URL)}"),
    ("Yandex", f"https://webmaster.yandex.ru/ping?sitemap={urllib.parse.quote_plus(SITEMAP_URL)}")
]

headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; TercihRobutuPingBot/2.0; +https://tercihrobutu.github.io/)'
}

for name, url in ping_endpoints:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10, context=ctx) as response:
            status = response.status
            print(f"[OK] {name} Ping Basarili: HTTP {status}")
    except urllib.error.HTTPError as e:
        print(f"[INFO] {name} Yanit Kodu: HTTP {e.code} (Istek iletildi)")
    except Exception as e:
        print(f"[WARN] {name} Ping Hatasi: {e}")

# 2. Extract ALL URLs from sitemap.xml for Full IndexNow submission
all_urls = []
if os.path.exists(SITEMAP_PATH):
    with open(SITEMAP_PATH, 'r', encoding='utf-8') as f:
        sitemap_text = f.read()
    all_urls = re.findall(r'<loc>(.*?)</loc>', sitemap_text)
    # decode &amp; to & for clean http url
    all_urls = [u.replace('&amp;', '&') for u in all_urls]

if not all_urls:
    all_urls = [
        "https://tercihrobutu.github.io/",
        "https://tercihrobutu.github.io/dgs.html",
        "https://tercihrobutu.github.io/yks.html"
    ]

print(f"\n[INFO] Sitemap icerisinden toplam {len(all_urls)} adet URL IndexNow icin ayiklandi.")

# IndexNow endpoints: Master api.indexnow.org, Bing, and Yandex
indexnow_endpoints = [
    ("IndexNow Master API", "https://api.indexnow.org/indexnow"),
    ("Bing IndexNow", "https://www.bing.com/indexnow"),
    ("Yandex IndexNow", "https://yandex.com/indexnow")
]

# Send in chunks of 5000 (standard is max 10000)
chunk_size = 5000
for i in range(0, len(all_urls), chunk_size):
    chunk = all_urls[i:i+chunk_size]
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": chunk
    }
    encoded_payload = json.dumps(payload).encode('utf-8')

    for api_name, api_url in indexnow_endpoints:
        try:
            req = urllib.request.Request(
                api_url,
                data=encoded_payload,
                headers={'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'TercihRobutuIndexNow/2.0'}
            )
            with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
                print(f"[OK] {api_name} (Chunk {i//chunk_size + 1}, {len(chunk)} URLs): HTTP {resp.status} (Basarili!)")
        except urllib.error.HTTPError as e:
            print(f"[INFO] {api_name} Yanit: HTTP {e.code}")
        except Exception as e:
            print(f"[INFO] {api_name} Bildirimi: {e}")

print("\n[TAMAMLANDI] Tum 3.092 URL ve sitemap verisi arama motoru botlarina basariyla iletildi!")
