"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'İnşaat Firması API',
        version: '1.0.0',
        description: 'İnşaat firması backend API dokümantasyonu',
    },
    servers: [
        {
            url: `http://localhost:${env_1.env.PORT}`,
            description: 'Development',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                },
            },
            RegisterRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                },
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                    expiresIn: { type: 'number' },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            email: { type: 'string' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            role: { type: 'string' },
                        },
                    },
                },
            },
            ContactRequest: {
                type: 'object',
                required: ['name', 'email', 'message'],
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    message: { type: 'string' },
                    subject: { type: 'string' },
                },
            },
        },
    },
    paths: {
        '/health': {
            get: {
                summary: 'Health check',
                tags: ['System'],
                responses: {
                    200: {
                        description: 'API ve veritabanı durumu',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        db: { type: 'string' },
                                        timestamp: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/auth/register': {
            post: {
                summary: 'Kayıt ol',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Kayıt başarılı',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' },
                            },
                        },
                    },
                    400: { description: 'Geçersiz istek', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/auth/login': {
            post: {
                summary: 'Giriş yap',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Giriş başarılı',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' },
                            },
                        },
                    },
                    401: { description: 'Hatalı kimlik bilgileri', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                },
            },
        },
        '/api/auth/refresh': {
            post: {
                summary: 'Token yenile',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['refreshToken'],
                                properties: { refreshToken: { type: 'string' } },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Token yenilendi',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/auth/logout': {
            post: {
                summary: 'Çıkış yap',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Çıkış başarılı' },
                    401: { description: 'Yetkisiz' },
                },
            },
        },
        '/api/auth/me': {
            get: {
                summary: 'Mevcut kullanıcı bilgisi',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Kullanıcı bilgileri' },
                    401: { description: 'Yetkisiz' },
                },
            },
        },
        '/api/projects': {
            get: {
                summary: 'Projeleri listele',
                tags: ['Projects'],
                parameters: [
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'] } },
                    { name: 'featured', in: 'query', schema: { type: 'boolean' } },
                    { name: 'serviceId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 100 } },
                    { name: 'includeInactive', in: 'query', schema: { type: 'boolean' } },
                ],
                responses: { 200: { description: 'Proje listesi' } },
            },
            post: {
                summary: 'Proje oluştur',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['title', 'slug', 'description', 'status'],
                                properties: {
                                    title: { type: 'string' },
                                    titleEn: { type: 'string' },
                                    slug: { type: 'string' },
                                    description: { type: 'string' },
                                    descriptionEn: { type: 'string' },
                                    shortDescription: { type: 'string' },
                                    shortDescriptionEn: { type: 'string' },
                                    status: { type: 'string', enum: ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'] },
                                    area: { type: 'number' },
                                    location: { type: 'string' },
                                    latitude: { type: 'number' },
                                    longitude: { type: 'number' },
                                    deliveryDate: { type: 'string', format: 'date-time' },
                                    startDate: { type: 'string', format: 'date-time' },
                                    featured: { type: 'boolean' },
                                    featuredImage: { type: 'string', format: 'uri' },
                                    metaTitle: { type: 'string' },
                                    metaDescription: { type: 'string' },
                                    serviceId: { type: 'string', format: 'uuid' },
                                    imageUrls: { type: 'array', items: { type: 'string', format: 'uri' } },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Proje oluşturuldu' }, 401: { description: 'Yetkisiz' } },
            },
        },
        '/api/projects/slug/{slug}': {
            get: {
                summary: 'Slug ile proje getir',
                tags: ['Projects'],
                parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Proje detayı' }, 404: { description: 'Bulunamadı' } },
            },
        },
        '/api/projects/{id}': {
            get: {
                summary: 'ID ile proje getir',
                tags: ['Projects'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Proje detayı' }, 404: { description: 'Bulunamadı' } },
            },
            put: {
                summary: 'Proje güncelle',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    slug: { type: 'string' },
                                    description: { type: 'string' },
                                    status: { type: 'string', enum: ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'] },
                                    featured: { type: 'boolean' },
                                    featuredImage: { type: 'string', format: 'uri' },
                                    imageUrls: { type: 'array', items: { type: 'string', format: 'uri' } },
                                },
                            },
                        },
                    },
                },
                responses: { 200: { description: 'Proje güncellendi' }, 401: { description: 'Yetkisiz' } },
            },
        },
        '/api/projects/{id}/toggle-active': {
            patch: {
                summary: 'Proje aktif/pasif toggle',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Proje güncellendi' }, 401: { description: 'Yetkisiz' } },
            },
        },
        '/api/services': {
            get: {
                summary: 'Hizmetleri listele',
                tags: ['Services'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'includeInactive', in: 'query', schema: { type: 'boolean' } },
                ],
                responses: { 200: { description: 'Hizmet listesi' } },
            },
            post: {
                summary: 'Hizmet oluştur',
                tags: ['Services'],
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Hizmet oluşturuldu' }, 401: { description: 'Yetkisiz' } },
            },
        },
        '/api/services/slug/{slug}': {
            get: {
                summary: 'Slug ile hizmet getir',
                tags: ['Services'],
                parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Hizmet detayı' } },
            },
        },
        '/api/services/{id}': {
            get: {
                summary: 'ID ile hizmet getir',
                tags: ['Services'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Hizmet detayı' } },
            },
            put: {
                summary: 'Hizmet güncelle',
                tags: ['Services'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Hizmet güncellendi' } },
            },
        },
        '/api/services/{id}/toggle-active': {
            patch: {
                summary: 'Hizmet aktif/pasif toggle',
                tags: ['Services'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Hizmet güncellendi' } },
            },
        },
        '/api/blogs': {
            get: {
                summary: 'Blog yazılarını listele',
                tags: ['Blogs'],
                parameters: [
                    { name: 'categoryId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'includeInactive', in: 'query', schema: { type: 'boolean' } },
                ],
                responses: { 200: { description: 'Blog listesi' } },
            },
            post: {
                summary: 'Blog yazısı oluştur',
                tags: ['Blogs'],
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Blog oluşturuldu' }, 401: { description: 'Yetkisiz' } },
            },
        },
        '/api/blogs/slug/{slug}': {
            get: {
                summary: 'Slug ile blog getir',
                tags: ['Blogs'],
                parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Blog detayı' } },
            },
        },
        '/api/blogs/{id}': {
            get: {
                summary: 'ID ile blog getir',
                tags: ['Blogs'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Blog detayı' } },
            },
            put: {
                summary: 'Blog güncelle',
                tags: ['Blogs'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Blog güncellendi' } },
            },
        },
        '/api/blogs/{id}/toggle-active': {
            patch: {
                summary: 'Blog aktif/pasif toggle',
                tags: ['Blogs'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Blog güncellendi' } },
            },
        },
        '/api/contact': {
            post: {
                summary: 'İletişim formu gönder',
                tags: ['Contact'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ContactRequest' },
                        },
                    },
                },
                responses: {
                    201: { description: 'Mesaj gönderildi' },
                    429: { description: 'Çok fazla istek (15 dk limit)' },
                },
            },
            get: {
                summary: 'İletişim mesajlarını listele',
                tags: ['Contact'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Mesaj listesi' }, 401: { description: 'Yetkisiz' } },
            },
        },
        '/api/contact/{id}': {
            get: {
                summary: 'İletişim mesajı detayı',
                tags: ['Contact'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Mesaj detayı' } },
            },
        },
        '/api/contact/{id}/read': {
            patch: {
                summary: 'Mesajı okundu işaretle',
                tags: ['Contact'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Güncellendi' } },
            },
        },
        '/api/contact/{id}/replied': {
            patch: {
                summary: 'Mesajı yanıtlandı işaretle',
                tags: ['Contact'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Güncellendi' } },
            },
        },
        '/api/contact/{id}/toggle-active': {
            patch: {
                summary: 'Mesaj aktif/pasif toggle',
                tags: ['Contact'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Güncellendi' } },
            },
        },
        '/api/settings': {
            get: {
                summary: 'Site ayarlarını getir',
                tags: ['Settings'],
                responses: { 200: { description: 'Site ayarları (key-value map)' } },
            },
        },
        '/api/admin/dashboard': {
            get: {
                summary: 'Admin dashboard istatistikleri',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Dashboard verileri' }, 401: { description: 'Yetkisiz' } },
            },
        },
        '/api/admin/users': {
            get: {
                summary: 'Kullanıcıları listele',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Kullanıcı listesi' } },
            },
            post: {
                summary: 'Kullanıcı oluştur',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Kullanıcı oluşturuldu' } },
            },
        },
        '/api/admin/users/{id}': {
            put: {
                summary: 'Kullanıcı güncelle',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Kullanıcı güncellendi' } },
            },
        },
        '/api/admin/users/{id}/role': {
            patch: {
                summary: 'Kullanıcı rolü güncelle',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Rol güncellendi' } },
            },
        },
        '/api/admin/users/{id}/toggle-active': {
            patch: {
                summary: 'Kullanıcı aktif/pasif toggle',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Güncellendi' } },
            },
        },
        '/api/admin/blog-categories': {
            get: {
                summary: 'Blog kategorilerini listele',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Kategori listesi' } },
            },
            post: {
                summary: 'Blog kategorisi oluştur',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Kategori oluşturuldu' } },
            },
        },
        '/api/admin/blog-categories/{id}': {
            put: {
                summary: 'Blog kategorisi güncelle',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Kategori güncellendi' } },
            },
        },
        '/api/admin/blog-categories/{id}/toggle-active': {
            patch: {
                summary: 'Blog kategorisi aktif/pasif toggle',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Güncellendi' } },
            },
        },
        '/api/admin/settings': {
            get: {
                summary: 'Admin site ayarları',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Ayarlar listesi' } },
            },
        },
        '/api/admin/settings/{key}': {
            put: {
                summary: 'Site ayarı güncelle',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'key', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Ayar güncellendi' } },
            },
        },
        '/api/admin/media/upload': {
            post: {
                summary: 'Medya yükle',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    file: { type: 'string', format: 'binary' },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Dosya yüklendi' } },
            },
        },
        '/api/admin/media': {
            get: {
                summary: 'Medya listesi',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: 'Medya listesi' } },
            },
        },
        '/api/admin/media/{id}/toggle-active': {
            patch: {
                summary: 'Medya aktif/pasif toggle',
                tags: ['Admin'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Güncellendi' } },
            },
        },
    },
};
exports.default = swaggerDefinition;
//# sourceMappingURL=swagger.js.map