import os
from PIL import Image, ImageDraw, ImageFont

def create_og_image(
    filename,
    badge_text,
    badge_color,
    title_text,
    subtitle_text,
    metrics,
    footer_tagline,
    theme="portal"
):
    W, H = 1200, 630
    
    # Color palette
    if theme == "portal":
        bg_top = (15, 23, 42)          # Slate 900
        bg_bottom = (30, 41, 59)       # Slate 800
        glow_primary = (99, 102, 241, 40)   # Indigo
        glow_secondary = (56, 189, 248, 30) # Sky blue
        accent_color = (99, 102, 241)       # Indigo 500
        card_bg = (30, 41, 59)
        card_border = (71, 85, 105)
        tag_color = (129, 140, 248)
    elif theme == "dgs":
        bg_top = (20, 14, 40)          # Deep purple-black
        bg_bottom = (42, 22, 75)       # Rich royal purple
        glow_primary = (168, 85, 247, 45)   # Purple
        glow_secondary = (236, 72, 153, 30) # Pink
        accent_color = (168, 85, 247)       # Purple 500
        card_bg = (43, 24, 80)
        card_border = (126, 75, 185)
        tag_color = (216, 180, 254)
    else: # yks
        bg_top = (10, 25, 47)          # Deep Navy
        bg_bottom = (15, 45, 85)       # Oceanic Blue
        glow_primary = (59, 130, 246, 45)   # Blue
        glow_secondary = (45, 212, 191, 30) # Teal
        accent_color = (37, 99, 235)        # Blue 600
        card_bg = (22, 50, 92)
        card_border = (59, 130, 246)
        tag_color = (147, 197, 253)

    # 1. Base Image & Gradient
    img = Image.new("RGB", (W, H), bg_top)
    draw = ImageDraw.Draw(img)

    for y in range(H):
        ratio = y / H
        r = int(bg_top[0] + (bg_bottom[0] - bg_top[0]) * ratio)
        g = int(bg_top[1] + (bg_bottom[1] - bg_top[1]) * ratio)
        b = int(bg_top[2] + (bg_bottom[2] - bg_top[2]) * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # 2. Glowing atmospheric effects
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)

    ov_draw.ellipse([(-80, -80), (520, 520)], fill=glow_primary)
    ov_draw.ellipse([(W - 480, H - 480), (W + 160, H + 160)], fill=glow_primary)
    ov_draw.ellipse([(W - 300, -100), (W + 100, 300)], fill=glow_secondary)

    # Grid texture
    grid_color = (255, 255, 255, 5)
    for x in range(60, W, 70):
        ov_draw.line([(x, 0), (x, H)], fill=grid_color, width=1)
    for y in range(60, H, 70):
        ov_draw.line([(0, y), (W, y)], fill=grid_color, width=1)

    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Fonts (Using Arial Bold for bulletproof Turkish character rendering)
    font_bold_path = "C:/Windows/Fonts/arialbd.ttf"
    font_reg_path = "C:/Windows/Fonts/arial.ttf"

    title_font = ImageFont.truetype(font_bold_path, 54)
    subtitle_font = ImageFont.truetype(font_reg_path, 25)
    badge_font = ImageFont.truetype(font_bold_path, 19)
    metric_val_font = ImageFont.truetype(font_bold_path, 26)
    metric_lbl_font = ImageFont.truetype(font_reg_path, 18)
    footer_font = ImageFont.truetype(font_bold_path, 21)

    margin_left = 80
    cursor_y = 65

    # 3. Badge Pill
    badge_bbox = badge_font.getbbox(badge_text)
    bw = badge_bbox[2] - badge_bbox[0] + 34
    bh = badge_bbox[3] - badge_bbox[1] + 18
    draw.rounded_rectangle(
        [margin_left, cursor_y, margin_left + bw, cursor_y + bh],
        radius=14,
        fill=badge_color
    )
    draw.text(
        (margin_left + 17, cursor_y + 8),
        badge_text,
        font=badge_font,
        fill=(255, 255, 255)
    )

    cursor_y += bh + 28

    # 4. Main Title
    draw.text((margin_left, cursor_y), title_text, font=title_font, fill=(255, 255, 255))
    cursor_y += 75

    # 5. Subtitle
    draw.text((margin_left, cursor_y), subtitle_text, font=subtitle_font, fill=(203, 213, 225))
    cursor_y += 55

    # 6. Horizontal separator
    draw.line([(margin_left, cursor_y), (W - margin_left, cursor_y)], fill=(71, 85, 105), width=1)
    cursor_y += 35

    # 7. Metrics Cards (Horizontal row)
    card_width = (W - 2 * margin_left - (len(metrics) - 1) * 20) // len(metrics)
    card_height = 115

    for i, (m_val, m_lbl) in enumerate(metrics):
        cx = margin_left + i * (card_width + 20)
        cy = cursor_y

        # Main rounded card
        draw.rounded_rectangle(
            [cx, cy, cx + card_width, cy + card_height],
            radius=16,
            fill=card_bg,
            outline=card_border,
            width=2
        )

        # Subtle colored indicator dot
        draw.ellipse([cx + 20, cy + 22, cx + 30, cy + 32], fill=tag_color)

        # Metric Value
        draw.text((cx + 38, cy + 18), m_val, font=metric_val_font, fill=(255, 255, 255))
        # Metric Label
        draw.text((cx + 20, cy + 64), m_lbl, font=metric_lbl_font, fill=(203, 213, 225))

    # 8. Bottom Bar
    footer_y = H - 85
    draw.line([(margin_left, footer_y - 20), (W - margin_left, footer_y - 20)], fill=(51, 65, 85), width=1)

    # Domain pill button
    domain_text = "tercihrobutu.github.io"
    d_bbox = footer_font.getbbox(domain_text)
    dw = d_bbox[2] - d_bbox[0] + 32
    dh = d_bbox[3] - d_bbox[1] + 16

    draw.rounded_rectangle(
        [margin_left, footer_y, margin_left + dw, footer_y + dh],
        radius=10,
        fill=accent_color
    )
    draw.text((margin_left + 16, footer_y + 7), domain_text, font=footer_font, fill=(255, 255, 255))

    # Right footer text
    rf_bbox = subtitle_font.getbbox(footer_tagline)
    rf_w = rf_bbox[2] - rf_bbox[0]
    draw.text((W - margin_left - rf_w, footer_y + 9), footer_tagline, font=subtitle_font, fill=(148, 163, 184))

    # Save
    output_path = os.path.join(r"C:\Users\yakupcontarli\Documents\GitHub\tercihrobutu.github.io", filename)
    img.save(output_path, "JPEG", quality=95, optimize=True)
    print(f"Successfully generated: {output_path}")

if __name__ == "__main__":
    # 1. Genel Portal (index.html) -> og-image.jpg
    create_og_image(
        filename="og-image.jpg",
        badge_text="2026 RESMİ TERCİH PORTALI",
        badge_color=(79, 70, 229), # Indigo 600
        title_text="2026 Tercih Robotu Portalı",
        subtitle_text="ÖSYM 2026 YKS ve DGS Yerleştirme Sonuçları, Taban Puanlar ve Sıralamalar",
        metrics=[
            ("DGS 2026", "7.060 Program & 15.873 Boş Kontenjan"),
            ("YKS 2026", "21.479 Lisans & Önlisans Programı"),
            ("%100 Ücretsiz", "Resmi ÖSYM Verileriyle Anlık Analiz"),
        ],
        footer_tagline="Hızlı • Reklamsız • Güncel",
        theme="portal"
    )

    # 2. DGS Robotu (dgs.html) -> og-image-dgs.jpg
    create_og_image(
        filename="og-image-dgs.jpg",
        badge_text="2026 DGS YERLEŞTİRME SONUÇLARI",
        badge_color=(147, 51, 234), # Purple 600
        title_text="2026 DGS Tercih Robotu",
        subtitle_text="Resmi Yerleştirme Taban Puanları, Boş Kontenjanlar ve Önlisans Geçiş Tablosu",
        metrics=[
            ("7.060 Program", "Tüm Üniversiteler & Bölümler"),
            ("15.873 Boş Kontenjan", "Ek Tercih Öncesi Güncel Durum"),
            ("856 Bölüm Eşleşmesi", "Tablo-2 Lisans Geçiş Alanları"),
        ],
        footer_tagline="Sayısal • Eşit Ağırlık • Sözel",
        theme="dgs"
    )

    # 3. YKS Robotu (yks.html) -> og-image-yks.jpg
    create_og_image(
        filename="og-image-yks.jpg",
        badge_text="2026 YKS YERLEŞTİRME SONUÇLARI",
        badge_color=(37, 99, 235), # Blue 600
        title_text="2026 YKS Tercih Robotu",
        subtitle_text="Lisans ve Önlisans Taban Puanları, Sıralamalar ve 4 Yıllık Başarı Grafikleri",
        metrics=[
            ("21.479 Program", "Devlet, Vakıf ve KKTC Üniversiteleri"),
            ("Lisans & Önlisans", "SAY, EA, SÖZ, DİL ve TYT"),
            ("4 Yıllık Trend", "Net, Puan ve Sıralama İstatistikleri"),
        ],
        footer_tagline="Üniversite Tercih & Sıralama Rehberi",
        theme="yks"
    )
