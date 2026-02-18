import nodemailer from 'nodemailer'
import { env } from '../config/env'
import prisma from '../config/database'

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : 587,
    secure: env.SMTP_PORT === '465',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  })
  return transporter
}

export function isEmailConfigured(): boolean {
  return !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS)
}

export async function getAdminEmail(): Promise<string> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'contact_email' },
  })
  return setting?.value || env.SMTP_FROM || 'admin@example.com'
}

export interface ContactMessageData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendContactNotification(data: ContactMessageData): Promise<void> {
  const transport = getTransporter()
  if (!transport) return

  const adminEmail = await getAdminEmail()
  const from = env.SMTP_FROM || env.SMTP_USER || 'noreply@example.com'
  const siteName = (await prisma.siteSetting.findUnique({ where: { key: 'site_name' } }))?.value || 'Neza İnşaat'

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
  `

  await transport.sendMail({
    from: `${siteName} <${from}>`,
    to: adminEmail,
    subject: `[${siteName}] Yeni İletişim Mesajı - ${data.name}`,
    html,
    replyTo: data.email,
  })
}

export async function sendContactAutoReply(data: ContactMessageData): Promise<void> {
  const transport = getTransporter()
  if (!transport) return

  const from = env.SMTP_FROM || env.SMTP_USER || 'noreply@example.com'
  const siteName = (await prisma.siteSetting.findUnique({ where: { key: 'site_name' } }))?.value || 'Neza İnşaat'

  const html = `
    <h2>Mesajınız Alındı</h2>
    <p>Sayın ${escapeHtml(data.name)},</p>
    <p>İletişim formu üzerinden gönderdiğiniz mesajınız tarafımıza ulaşmıştır. En kısa sürede size dönüş yapacağız.</p>
    <p>Teşekkür ederiz.</p>
    <hr>
    <p style="color:#888;font-size:12px;">${siteName}</p>
  `

  await transport.sendMail({
    from: `${siteName} <${from}>`,
    to: data.email,
    subject: `[${siteName}] Mesajınız Alındı`,
    html,
  })
}
