# Neza İnşaat - Production Deployment

Bu doküman, projeyi **nezainsaat.com** domain'inde **194.146.36.65** sunucusunda çalıştırmak için adım adım rehberdir.

## Ön Koşullar

1. **DNS (KRİTİK)**: Hostinger panelinden `nezainsaat.com` ve `www.nezainsaat.com` A kayıtlarını `194.146.36.65` IP adresine yönlendirin. **Domain "Parked" görünüyorsa DNS henüz yapılandırılmamış demektir.**
2. **Sunucu**: root erişimi ile SSH bağlantısı.

---

## 1. Sunucuya Bağlan ve Temel Kurulum

```bash
ssh root@194.146.36.65
```

Gerekli araçları kurun (yoksa):

```bash
apt update && apt install -y docker.io docker-compose git nginx certbot python3-certbot-nginx
```

---

## 2. Projeyi Sunucuya Al

```bash
cd /var/www
# Eğer repo zaten varsa:
cd /var/www/neza-insaat-v2
git pull origin main

# İlk kurulumda:
# git clone <repo-url> neza-insaat-v2
# cd neza-insaat-v2
```

---

## 3. Production Ortam Değişkenleri

Proje kökünde `.env` dosyası oluşturun:

```bash
cd /var/www/neza-insaat-v2
cp deploy/.env.production.example .env
nano .env   # veya vim
```

**Mutlaka değiştirin:**
- `JWT_SECRET`: Min 32 karakter, rastgele string
- `JWT_REFRESH_SECRET`: Min 32 karakter, rastgele string

**Veritabanı:** `POSTGRES_PASSWORD=postgres` (dev ile aynı) – isterseniz güçlü bir şifreyle değiştirebilirsiniz.

**SMTP (opsiyonel):** İletişim formu e-posta bildirimi için. Tanımlanırsa:
- Yeni mesajda `contact_email` adresine admin bildirimi gider
- Müşteriye otomatik "Mesajınız alındı" e-postası gider
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` zorunlu; `SMTP_PORT` (varsayılan 587), `SMTP_FROM` opsiyonel

---

## 4. Docker Compose ile Uygulamayı Başlat

```bash
cd /var/www/neza-insaat-v2
docker compose -f docker-compose.prod.yml up -d --build
```

İlk çalıştırmada Prisma migration uygulayın:

```bash
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

**Seed (veritabanı + placeholder görseller):**

```bash
docker compose -f docker-compose.prod.yml run --rm backend npx prisma db seed
```

Bu komut:
- Eksik placeholder görselleri `uploads/` klasörüne oluşturur
- Admin, servisler, projeler, bloglar ve ayarları veritabanına ekler

---

## 5. Nginx Yapılandırması

Nginx config dosyasını kopyalayın:

```bash
cp /var/www/neza-insaat-v2/deploy/nginx.conf /etc/nginx/sites-available/nezainsaat.com
ln -sf /etc/nginx/sites-available/nezainsaat.com /etc/nginx/sites-enabled/
```

Varsayılan siteyi devre dışı bırakın (çakışma varsa):

```bash
rm -f /etc/nginx/sites-enabled/default
```

Config testi ve Nginx yeniden başlatma:

```bash
nginx -t && systemctl reload nginx
```

---

## 6. SSL (HTTPS) Kurulumu

Let's Encrypt ile ücretsiz SSL:

```bash
certbot --nginx -d nezainsaat.com -d www.nezainsaat.com
```

Sorgulara göre e-posta girin, şartları kabul edin. Certbot Nginx config'ini otomatik güncelleyecektir.

---

## 7. Kontrol

- **Frontend**: https://nezainsaat.com
- **API**: https://nezainsaat.com/api/health
- **Admin**: https://nezainsaat.com/admin

---

## Güncelleme (Deploy)

Kod güncellemesi sonrası:

```bash
cd /var/www/neza-insaat-v2
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

Seed'i yeniden çalıştırmak isterseniz (görseller + veri):

```bash
docker compose -f docker-compose.prod.yml run --rm backend npx prisma db seed
```

---

## Sunucuda Sadece Seed Çalıştırma

Kod zaten deploy edilmiş, sadece seed çalıştırmak istiyorsanız:

```bash
cd /var/www/neza-insaat-v2
docker compose -f docker-compose.prod.yml run --rm backend npx prisma db seed
```

Başarılı çıktı örneği:
```
🌱 Seeding database...
BASE_URL: https://nezainsaat.com
DATABASE_URL: ✓ set
📁 Created 20 placeholder images in uploads/
✅ Admin user: admin@construction.com
✅ Services: 5
...
🎉 Seeding completed!
```

---

## Sorun Giderme

### "nezainsaat.com Parked Domain görünüyor"
- **DNS yapılandırılmamış.** Hostinger DNS panelinde: `nezainsaat.com` ve `www.nezainsaat.com` için **A kaydı** ekleyin, değer: `194.146.36.65`
- DNS propagasyonu 24 saat sürebilir; genelde 1–2 saat içinde güncellenir.

### "Site açılmıyor" (DNS doğruysa)
- Nginx kurulu ve config aktif mi? `nginx -t && systemctl status nginx`
- SSL sertifikası alındı mı? `certbot certificates`
- Frontend/backend çalışıyor mu? `docker ps` ile kontrol edin

### Container logları
```bash
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Yeniden başlatma
```bash
docker compose -f docker-compose.prod.yml restart
```

### Tam temiz başlangıç
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```
