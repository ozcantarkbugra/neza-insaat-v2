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
const database_1 = __importDefault(require("./config/database"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const services_1 = __importDefault(require("./routes/services"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const contact_1 = __importDefault(require("./routes/contact"));
const admin_1 = __importDefault(require("./routes/admin"));
const settings_1 = __importDefault(require("./routes/settings"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
const uploadsPath = path_1.default.join(process.cwd(), 'uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
app.use((req, res, next) => {
    if (req.path.startsWith('/uploads')) {
        return next();
    }
    (0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })(req, res, next);
});
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.get('/api-docs.json', (_req, res) => res.json(swagger_1.default));
app.get('/health', async (_req, res) => {
    const timestamp = new Date().toISOString();
    try {
        await database_1.default.$queryRaw `SELECT 1`;
        res.json({ status: 'ok', db: 'connected', timestamp });
    }
    catch (err) {
        res.status(503).json({ status: 'degraded', db: 'disconnected', timestamp });
    }
});
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/services', services_1.default);
app.use('/api/blogs', blogs_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/settings', settings_1.default);
app.use(errorHandler_1.errorHandler);
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
const PORT = env_1.env.PORT;
app.listen(PORT);
//# sourceMappingURL=index.js.map