"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const services_1 = __importDefault(require("./routes/services"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const contact_1 = __importDefault(require("./routes/contact"));
const admin_1 = __importDefault(require("./routes/admin"));
const settings_1 = __importDefault(require("./routes/settings"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Compression (gzip)
app.use((0, compression_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve uploaded files FIRST (before helmet to avoid 403)
const uploadsPath = path_1.default.join(process.cwd(), 'uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
// Security middleware (after static files, but skip for /uploads)
app.use((req, res, next) => {
    if (req.path.startsWith('/uploads')) {
        return next();
    }
    (0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })(req, res, next);
});
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/services', services_1.default);
app.use('/api/blogs', blogs_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/settings', settings_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
const PORT = env_1.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${env_1.env.NODE_ENV}`);
});
//# sourceMappingURL=index.js.map