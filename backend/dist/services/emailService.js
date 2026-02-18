"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailConfigured = isEmailConfigured;
exports.getAdminEmail = getAdminEmail;
exports.sendContactNotification = sendContactNotification;
exports.sendContactAutoReply = sendContactAutoReply;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const database_1 = __importDefault(require("../config/database"));
let transporter = null;
function getTransporter() {
    if (transporter)
        return transporter;
    if (!env_1.env.SMTP_HOST || !env_1.env.SMTP_USER || !env_1.env.SMTP_PASS)
        return null;
    transporter = nodemailer_1.default.createTransport({
        host: env_1.env.SMTP_HOST,
        port: env_1.env.SMTP_PORT ? parseInt(env_1.env.SMTP_PORT, 10) : 587,
        secure: env_1.env.SMTP_PORT === '465',
        auth: {
            user: env_1.env.SMTP_USER,
            pass: env_1.env.SMTP_PASS,
        },
    });
    return transporter;
}
function isEmailConfigured() {
    return !!(env_1.env.SMTP_HOST && env_1.env.SMTP_USER && env_1.env.SMTP_PASS);
}
async function getAdminEmail() {
    const setting = await database_1.default.siteSetting.findUnique({
        where: { key: 'contact_email' },
    });
    return setting?.value || env_1.env.SMTP_FROM || 'admin@example.com';
}
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
async function sendContactNotification(data) {
    const transport = getTransporter();
    if (!transport)
        return;
    const adminEmail = await getAdminEmail();
    const from = env_1.env.SMTP_FROM || env_1.env.SMTP_USER || 'noreply@example.com';
    const siteName = (await database_1.default.siteSetting.findUnique({ where: { key: 'site_name' } }))?.value || 'Neza İnşaat';
    const html = `
    <h2>Yeni İletişim Mesajı</h2>
    <p><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>` : ''}
    ${data.subject ? `<p><strong>Konu:</strong> ${escapeHtml(data.subject)}</p>` : ''}
    <p><strong>Mesaj:</strong></p>
    <pre style="background:#f5f5f5;padding:12px;border-radius:4px;">${escapeHtml(data.message)}</pre>
    <hr>
    <p style="color:#888;font-size:12px;">Bu mesaj ${siteName} web sitesi iletişim formundan gönderilmiştir.</p>
  `;
    await transport.sendMail({
        from: `${siteName} <${from}>`,
        to: adminEmail,
        subject: `[${siteName}] Yeni İletişim Mesajı - ${data.name}`,
        html,
        replyTo: data.email,
    });
}
async function sendContactAutoReply(data) {
    const transport = getTransporter();
    if (!transport)
        return;
    const from = env_1.env.SMTP_FROM || env_1.env.SMTP_USER || 'noreply@example.com';
    const siteName = (await database_1.default.siteSetting.findUnique({ where: { key: 'site_name' } }))?.value || 'Neza İnşaat';
    const html = `
    <h2>Mesajınız Alındı</h2>
    <p>Sayın ${escapeHtml(data.name)},</p>
    <p>İletişim formu üzerinden gönderdiğiniz mesajınız tarafımıza ulaşmıştır. En kısa sürede size dönüş yapacağız.</p>
    <p>Teşekkür ederiz.</p>
    <hr>
    <p style="color:#888;font-size:12px;">${siteName}</p>
  `;
    await transport.sendMail({
        from: `${siteName} <${from}>`,
        to: data.email,
        subject: `[${siteName}] Mesajınız Alındı`,
        html,
    });
}
//# sourceMappingURL=emailService.js.map