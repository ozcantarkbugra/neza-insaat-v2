declare const swaggerDefinition: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            Error: {
                type: string;
                properties: {
                    error: {
                        type: string;
                    };
                };
            };
            LoginRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                    };
                };
            };
            RegisterRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                    };
                    firstName: {
                        type: string;
                    };
                    lastName: {
                        type: string;
                    };
                };
            };
            AuthResponse: {
                type: string;
                properties: {
                    accessToken: {
                        type: string;
                    };
                    refreshToken: {
                        type: string;
                    };
                    expiresIn: {
                        type: string;
                    };
                    user: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                            email: {
                                type: string;
                            };
                            firstName: {
                                type: string;
                            };
                            lastName: {
                                type: string;
                            };
                            role: {
                                type: string;
                            };
                        };
                    };
                };
            };
            ContactRequest: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    phone: {
                        type: string;
                    };
                    message: {
                        type: string;
                    };
                    subject: {
                        type: string;
                    };
                };
            };
        };
    };
    paths: {
        '/health': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        status: {
                                            type: string;
                                        };
                                        db: {
                                            type: string;
                                        };
                                        timestamp: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/register': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/login': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/refresh': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    refreshToken: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/auth/logout': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/me': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/projects': {
            get: {
                summary: string;
                tags: string[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum: string[];
                        format?: undefined;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum?: undefined;
                        format?: undefined;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                        enum?: undefined;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                        enum?: undefined;
                        format?: undefined;
                    };
                })[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    title: {
                                        type: string;
                                    };
                                    titleEn: {
                                        type: string;
                                    };
                                    slug: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    descriptionEn: {
                                        type: string;
                                    };
                                    shortDescription: {
                                        type: string;
                                    };
                                    shortDescriptionEn: {
                                        type: string;
                                    };
                                    status: {
                                        type: string;
                                        enum: string[];
                                    };
                                    area: {
                                        type: string;
                                    };
                                    location: {
                                        type: string;
                                    };
                                    latitude: {
                                        type: string;
                                    };
                                    longitude: {
                                        type: string;
                                    };
                                    deliveryDate: {
                                        type: string;
                                        format: string;
                                    };
                                    startDate: {
                                        type: string;
                                        format: string;
                                    };
                                    featured: {
                                        type: string;
                                    };
                                    featuredImage: {
                                        type: string;
                                        format: string;
                                    };
                                    metaTitle: {
                                        type: string;
                                    };
                                    metaDescription: {
                                        type: string;
                                    };
                                    serviceId: {
                                        type: string;
                                        format: string;
                                    };
                                    imageUrls: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/projects/slug/{slug}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
        };
        '/api/projects/{id}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    title: {
                                        type: string;
                                    };
                                    slug: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    status: {
                                        type: string;
                                        enum: string[];
                                    };
                                    featured: {
                                        type: string;
                                    };
                                    featuredImage: {
                                        type: string;
                                        format: string;
                                    };
                                    imageUrls: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/projects/{id}/toggle-active': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/services': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    201: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/services/slug/{slug}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/services/{id}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/services/{id}/toggle-active': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/blogs': {
            get: {
                summary: string;
                tags: string[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format?: undefined;
                    };
                })[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    201: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/blogs/slug/{slug}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/blogs/{id}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/blogs/{id}/toggle-active': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/contact': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                    };
                    429: {
                        description: string;
                    };
                };
            };
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/contact/{id}': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/contact/{id}/read': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/contact/{id}/replied': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/contact/{id}/toggle-active': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/settings': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/dashboard': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/users': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    201: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/users/{id}': {
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/users/{id}/role': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/users/{id}/toggle-active': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/blog-categories': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    201: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/blog-categories/{id}': {
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/blog-categories/{id}/toggle-active': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/settings': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/settings/{key}': {
            put: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/media/upload': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: string;
                                properties: {
                                    file: {
                                        type: string;
                                        format: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/media': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/admin/media/{id}/toggle-active': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
    };
};
export default swaggerDefinition;
//# sourceMappingURL=swagger.d.ts.map