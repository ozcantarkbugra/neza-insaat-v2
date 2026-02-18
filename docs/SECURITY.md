# Güvenlik Dokümantasyonu

## SQL Injection Koruması

Proje **Prisma ORM** kullanmaktadır. Prisma tüm sorgularda **parametreli sorgular** kullanır; bu nedenle SQL injection riski minimize edilmiştir.

- **Raw SQL kullanımı yok**: `$queryRaw`, `$executeRaw`, `$queryRawUnsafe` gibi ham SQL çağrıları projede bulunmamaktadır.
- **Zod validasyonu**: API endpoint'lerinde gelen veriler Zod şemaları ile doğrulanmaktadır.
- **UUID kullanımı**: ID alanları UUID formatında; string interpolasyon ile SQL oluşturulmamaktadır.

## Soft Delete Politikası

Aşağıdaki modeller **hard delete** yerine **soft delete** kullanmaktadır:

| Model | Alan | Açıklama |
|-------|------|----------|
| User | `isDeleted` | Kullanıcılar silinmez; sadece `isActive` ile pasif yapılır |
| Role | `isDeleted`, `isActive` | Roller silinmez; aktif/pasif toggle |
| Project | `isDeleted` | Projeler soft delete |
| Service | `isDeleted` | Hizmetler soft delete |
| Blog | `isDeleted` | Blog yazıları soft delete |
| BlogCategory | `isDeleted` | Blog kategorileri soft delete |
| ContactMessage | `isDeleted` | İletişim mesajları soft delete |
| MediaFile | `isDeleted` | Medya dosyaları soft delete |

### User ve Role

- **User**: Silme endpoint'i yok. Sadece `toggleUserActive` ile aktif/pasif yapılır.
- **Role**: Silme endpoint'i yok. Sadece aktif/pasif toggle kullanılmalıdır.
- Tüm User sorguları `isDeleted: false` filtresi ile yapılır (login, getMe, admin işlemleri).

## Sunucu Veritabanına Migration

Production ortamında migration çalıştırmak için:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

Mevcut migration'lar:
- `20260218130000_add_blog_en_and_user_role_soft_delete`: Blog EN alanları, User/Role soft delete alanları
