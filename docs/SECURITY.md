# Güvenlik Dokümantasyonu

## SQL Injection Koruması

Proje **Prisma ORM** kullanmaktadır. Prisma tüm sorgularda **parametreli sorgular** kullanır; bu nedenle SQL injection riski minimize edilmiştir.

- **Raw SQL kullanımı yok**: `$queryRaw`, `$executeRaw`, `$queryRawUnsafe` gibi ham SQL çağrıları projede bulunmamaktadır.
- **Zod validasyonu**: API endpoint'lerinde gelen veriler Zod şemaları ile doğrulanmaktadır.
- **UUID kullanımı**: ID alanları UUID formatında; string interpolasyon ile SQL oluşturulmamaktadır.

## Aktif/Pasif Politikası (Tek Alan: isActive)

Projede **isDeleted** kaldırılmıştır. Tüm modeller sadece **isActive** kullanır:

| Model | Alan | Açıklama |
|-------|------|----------|
| User | `isActive` | Kullanıcılar silinmez; sadece aktif/pasif toggle |
| Role | `isActive` | Roller silinmez; aktif/pasif toggle |
| Project | `isActive` | Projeler silinmez; aktif/pasif toggle |
| Service | `isActive` | Hizmetler silinmez; aktif/pasif toggle |
| Blog | `isActive` | Blog yazıları silinmez; aktif/pasif toggle |
| BlogCategory | `isActive` | Blog kategorileri silinmez; aktif/pasif toggle |
| ContactMessage | `isActive` | İletişim mesajları silinmez; aktif/pasif toggle |
| MediaFile | `isActive` | Medya dosyaları silinmez; aktif/pasif toggle |

### Silme İşlemi Yok

- **Silme ikonu/endpoint yok**: Tüm admin sayfalarında sadece aktif/pasif toggle bulunur.
- **User, Role**: Silme endpoint'i yok. Sadece `toggleUserActive` ile aktif/pasif.
- **Project, Service, Blog, ContactMessage**: Silme yerine `toggleActive` (PATCH) kullanılır.

## Sunucu Veritabanına Migration

Production ortamında migration çalıştırmak için:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

Mevcut migration'lar:
- `20260218130000_add_blog_en_and_user_role_soft_delete`: Blog EN alanları, User/Role soft delete alanları
- `20260218140000_use_only_is_active`: isDeleted kaldırıldı; sadece isActive kullanılıyor
