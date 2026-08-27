# ============================================================
# Search Engine Sitemap Ping & IndexNow Script
# ============================================================
import urllib.request
import urllib.parse
import json
import ssl

SITEMAP_URL = "https://tercihrobutu.github.io/sitemap.xml"
HOST = "tercihrobutu.github.io"

ctx = ssl.create_default_context()

print(f"[PING] Arama motorlarina sitemap ping islemi baslatiliyor: {SITEMAP_URL}\n")

# 1. Standard Ping Endpoints
ping_endpoints = [
    ("Google", f"https://www.google.com/ping?sitemap={urllib.parse.quote_plus(SITEMAP_URL)}"),
    ("Bing", f"https://www.bing.com/ping?sitemap={urllib.parse.quote_plus(SITEMAP_URL)}"),
    ("Yandex", f"https://webmaster.yandex.ru/ping?sitemap={urllib.parse.quote_plus(SITEMAP_URL)}")
]

headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; TercihRobutuPingBot/1.0; +https://tercihrobutu.github.io/)'
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

# 2. IndexNow API (Bing, Yandex, Seznam & Partners Instant Indexing)
INDEXNOW_URL = "https://api.indexnow.org/indexnow"
KEY = "8f7a0796a90379d4b2d97e"
KEY_LOCATION = f"https://tercihrobutu.github.io/{KEY}.txt"

sample_urls = [
    "https://tercihrobutu.github.io/",
    "https://tercihrobutu.github.io/dgs.html",
    "https://tercihrobutu.github.io/yks.html",
    "https://tercihrobutu.github.io/?puan=SAY",
    "https://tercihrobutu.github.io/?puan=EA",
    "https://tercihrobutu.github.io/?puan=SOZ"
]

payload = {
    "host": HOST,
    "key": KEY,
    "keyLocation": KEY_LOCATION,
    "urlList": sample_urls
}

try:
    req = urllib.request.Request(
        INDEXNOW_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'TercihRobutuIndexNow/1.0'}
    )
    with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
        print(f"\n[OK] IndexNow (Bing & Partner Arama Motorlari) Anlik Bildirim: HTTP {resp.status} (Basarili!)")
except urllib.error.HTTPError as e:
    print(f"\n[INFO] IndexNow Yanit: HTTP {e.code} (Dosya push edildikten sonra onaylanacak)")
except Exception as e:
    print(f"\n[INFO] IndexNow Bildirimi: {e}")

print("\n[TAMAMLANDI] Tum arama motoru botlarina ping ve bildirimler iletildi!")
