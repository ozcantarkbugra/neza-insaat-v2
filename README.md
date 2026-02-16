# Neza İnşaat - Kurumsal Web Sitesi

Modern, çok dilli ve performans odaklı inşaat firması kurumsal web sitesi. Next.js frontend ve Express.js backend ile geliştirilmiştir.

![Node](https://img.shields.io/badge/Node.js-22.x-green)
![Next.js](https://img.shields.io/badge/Next.js-14-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Proje Yapısı](#-proje-yapısı)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Ortam Değişkenleri](#-ortam-değişkenleri)
- [Çalıştırma](#-çalıştırma)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Veritabanı](#-veritabanı)
- [Dağıtım](#-dağıtım)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## ✨ Özellikler

### Genel Özellikler
- 🌐 **Çok dilli destek** (Türkçe / İngilizce)
- 📱 **Responsive tasarım** – Mobil uyumlu
- 🌙 **Karanlık / Açık tema** – Kullanıcı tercihine göre
- ⚡ **Performans optimizasyonları** – SWR cache, gzip, Cache-Control
- 🔒 **JWT tabanlı kimlik doğrulama** – Access + Refresh token
- 📧 **İletişim formu** – E-posta bildirimi (SMTP)
- 🗺️ **Google Maps entegrasyonu** (opsiyonel)

### Public Sayfalar
- **Ana Sayfa** – Hero slider, öne çıkan projeler, hizmetler, blog
- **Projeler** – Proje listesi, detay sayfası, durum filtreleme
- **Hizmetler** – Faaliyet alanları, hizmet detayları
- **Blog / Haberler** – Makale listesi, detay, kategori
- **Hakkımızda** – Şirket profili, misyon-vizyon, tarihçe
- **İletişim** – İletişim formu, harita
- **Yasal Sayfalar** – Gizlilik politikası, KVKK, kullanım şartları

### Admin Panel
- **Dashboard** – Özet istatistikler
- **Proje Yönetimi** – CRUD, görsel yükleme
- **Blog Yönetimi** – Makale CRUD, kategoriler
- **Hizmet Yönetimi** – Faaliyet alanları CRUD
- **Kullanıcı Yönetimi** – Rol bazlı yetkilendirme (SUPER_ADMIN, ADMIN, EDITOR)
- **Mesajlar** – İletişim formu mesajları
- **Site Ayarları** – İletişim bilgileri, sosyal medya
- **Medya Kütüphanesi** – Dosya yükleme ve yönetimi

---

## 🛠 Teknoloji Yığını

### Frontend
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| Next.js | 14.0.4 | React framework, App Router |
| React | 18.2 | UI kütüphanesi |
| Mantine | 8.3 | UI bileşen kütüphanesi |
| SWR | 2.4 | Veri çekme ve cache |
| Redux Toolkit | 2.0 | State management (auth) |
| React Hook Form | 7.49 | Form yönetimi |
| Zod | 3.22 | Schema validasyonu |
| Axios | 1.6 | HTTP client |
| Tailwind CSS | 3.4 | Utility-first CSS |

### Backend
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| Node.js | 22.x | Runtime |
| Express | 4.18 | Web framework |
| Prisma | 5.7 | ORM |
| PostgreSQL | 14 | Veritabanı |
| TypeScript | 5.3 | Tip güvenliği |
| JWT | 9.0 | Kimlik doğrulama |
| Bcrypt | 5.1 | Şifre hash |
| Multer | 1.4 | Dosya yükleme |
| Helmet | 7.1 | Güvenlik header'ları |
| Compression | 1.8 | Gzip sıkıştırma |

### Altyapı
- **Docker** – PostgreSQL container
- **Prisma Migrate** – Veritabanı migrasyonları

---

## 📁 Proje Yapısı

```
insaat/
├── backend/                 # Express API
│   ├── prisma/
│   │   ├── schema.prisma    # Veritabanı şeması
│   │   ├── seed.ts          # Seed verisi
│   │   └── migrations/      # Migrasyon dosyaları
│   ├── src/
│   │   ├── config/          # Env, database config
│   │   ├── controllers/     # Route controller'ları
│   │   ├── middleware/      # Auth, validation, error, cache
│   │   ├── routes/          # API route tanımları
│   │   ├── services/        # İş mantığı
│   │   ├── utils/           # Yardımcı fonksiyonlar
│   │   └── index.ts         # Uygulama giriş noktası
│   ├── uploads/             # Yüklenen dosyalar (gitignore)
│   └── package.json
│
├── frontend/                # Next.js uygulaması
│   ├── src/
│   │   ├── app/             # App Router sayfaları
│   │   │   ├── (public)/    # Public sayfalar
│   │   │   ├── admin/       # Admin panel
│   │   │   ├── layout.tsx
│   │   │   └── providers.tsx
│   │   ├── components/      # React bileşenleri
│   │   │   ├── admin/       # Admin bileşenleri
│   │   │   ├── layout/      # Header, Footer
│   │   │   └── ui/          # UI bileşenleri
│   │   ├── hooks/           # Custom hooks (SWR, Redux)
│   │   ├── lib/             # API client, i18n, utils
│   │   ├── store/           # Redux store
│   │   └── types/           # TypeScript tipleri
│   ├── public/
│   │   └── images/
│   └── package.json
│
├── docker-compose.dev.yml   # PostgreSQL container
├── .gitignore
└── README.md
```

---

## 📌 Gereksinimler

- **Node.js** 18+ (önerilen: 22.x)
- **npm** veya **yarn**
- **Docker** ve **Docker Compose** (veritabanı için)
- **Git**

---

## 🚀 Kurulum

### 1. Repoyu Klonlayın

```bash
git clone https://github.com/ozcantarkbugra/neza-insaat.git
cd neza-insaat
```

### 2. Veritabanını Başlatın

```bash
docker compose -f docker-compose.dev.yml up -d
```

PostgreSQL `localhost:5472` portunda çalışacaktır.

### 3. Backend Kurulumu

```bash
cd backend
npm install
cp .env.example .env   # .env dosyasını düzenleyin
npx prisma generate
npx prisma migrate dev
npm run prisma:seed    # İsteğe bağlı: örnek veri
```

### 4. Frontend Kurulumu

```bash
cd frontend
npm install
cp .env.local.example .env.local   # .env.local dosyasını düzenleyin
```

---

## 🔐 Ortam Değişkenleri

### Backend (`backend/.env`)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `DATABASE_URL` | ✅ | PostgreSQL bağlantı URL'i |
| `JWT_SECRET` | ✅ | JWT imza anahtarı (min 32 karakter) |
| `JWT_REFRESH_SECRET` | ✅ | Refresh token anahtarı (min 32 karakter) |
| `PORT` | | Sunucu portu (varsayılan: 5000) |
| `FRONTEND_URL` | | CORS izin verilen origin (varsayılan: http://localhost:3000) |
| `JWT_EXPIRES_IN` | | Access token süresi (varsayılan: 15m) |
| `JWT_REFRESH_EXPIRES_IN` | | Refresh token süresi (varsayılan: 7d) |
| `GOOGLE_MAPS_API_KEY` | | Google Maps API anahtarı |
| `SMTP_HOST` | | SMTP sunucu (e-posta için) |
| `SMTP_PORT` | | SMTP port |
| `SMTP_USER` | | SMTP kullanıcı adı |
| `SMTP_PASS` | | SMTP şifre |
| `SMTP_FROM` | | Gönderen e-posta adresi |
| `MAX_FILE_SIZE` | | Maksimum dosya boyutu (bytes, varsayılan: 5MB) |

**Örnek `.env`:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5472/construction_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
NODE_ENV=development
PORT=5002
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL'i |

**Örnek `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5002/api
```

---

## ▶️ Çalıştırma

### Geliştirme Modu

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```
Backend: http://localhost:5002

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```
Frontend: http://localhost:3000

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Prisma Komutları

```bash
cd backend
npx prisma generate      # Prisma Client oluştur
npx prisma migrate dev   # Migrasyon uygula
npx prisma studio        # Veritabanı GUI
npm run prisma:seed      # Seed çalıştır
```

---

## 📡 API Dokümantasyonu

### Base URL
```
http://localhost:5002/api
```

### Public Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/projects` | Proje listesi (query: featured, limit, page, status) |
| GET | `/projects/slug/:slug` | Slug ile proje detayı |
| GET | `/projects/:id` | ID ile proje detayı |
| GET | `/services` | Hizmet listesi (query: featured) |
| GET | `/services/slug/:slug` | Slug ile hizmet detayı |
| GET | `/blogs` | Blog listesi (query: status, limit, page) |
| GET | `/blogs/slug/:slug` | Slug ile blog detayı |
| POST | `/contact` | İletişim formu gönderimi |
| GET | `/settings` | Site ayarları |

### Auth Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/auth/register` | Kayıt |
| POST | `/auth/login` | Giriş |
| POST | `/auth/refresh` | Token yenileme |
| POST | `/auth/logout` | Çıkış (Bearer token) |
| GET | `/auth/me` | Mevcut kullanıcı (Bearer token) |

### Admin Endpoints (Bearer token gerekli)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/admin/dashboard` | Dashboard istatistikleri |
| GET/POST | `/admin/users` | Kullanıcı listesi / oluşturma |
| PUT/PATCH | `/admin/users/:id` | Kullanıcı güncelleme |
| GET/POST | `/admin/blog-categories` | Blog kategorileri |
| GET/PUT | `/admin/settings` | Site ayarları |
| POST | `/admin/media/upload` | Medya yükleme |

### Health Check

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/health` | Sunucu sağlık kontrolü |

---

## 🗄 Veritabanı

### Modeller
- **User** – Kullanıcılar (rol: SUPER_ADMIN, ADMIN, EDITOR)
- **Project** – Projeler (durum: PLANNING, IN_PROGRESS, COMPLETED, ON_HOLD)
- **ProjectImage** – Proje görselleri
- **Service** – Hizmetler / Faaliyet alanları
- **Blog** – Blog makaleleri (durum: DRAFT, PUBLISHED, ARCHIVED)
- **BlogCategory** – Blog kategorileri
- **ContactMessage** – İletişim formu mesajları
- **SiteSetting** – Site ayarları (key-value)
- **MediaFile** – Yüklenen medya dosyaları

### Docker PostgreSQL

```yaml
# docker-compose.dev.yml
Port: 5472 → 5432 (container)
Database: construction_db
User: postgres
Password: postgres
```

---

## 🚢 Dağıtım

### Vercel (Frontend)
1. GitHub repo'yu Vercel'e bağlayın
2. Root directory: `frontend`
3. Build command: `npm run build`
4. `NEXT_PUBLIC_API_URL` ortam değişkenini ekleyin

### Backend (Node.js hosting)
- Railway, Render, Fly.io veya VPS
- PostgreSQL (managed veya Docker)
- Ortam değişkenlerini ayarlayın
- `npm run build && npm start`

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje ISC lisansı altında lisanslanmıştır.

---

## 👤 İletişim

**Tarık Buğra Özcan**  
E-posta: ozcantarkbugra@outlook.com  
GitHub: [@ozcantarkbugra](https://github.com/ozcantarkbugra)
