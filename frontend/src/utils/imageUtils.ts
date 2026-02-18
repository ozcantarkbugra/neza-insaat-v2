// Görseller her zaman backend'den gelir - API URL'den türetilir (local: 5002, prod: domain)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5002'

export function shouldUnoptimizeImage(url: string | null | undefined): boolean {
  if (!url) return false
  const normalized = normalizeImageUrl(url)
  return normalized.startsWith('http://') || normalized.startsWith('https://')
}

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return ''

  // Tam URL: localhost ile yanlış port (3000, 5000, 5001) → BACKEND_URL ile düzelt
  // Prod (https://domain.com) etkilenmez
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (/^https?:\/\/localhost:(3000|5000|5001)\//.test(url)) {
      const path = url.replace(/^https?:\/\/[^/]+/, '')
      return `${BACKEND_URL.replace(/\/$/, '')}${path}`
    }
    return url
  }

  // Göreli URL: BACKEND_URL ekle
  if (url.startsWith('/uploads/')) {
    return `${BACKEND_URL.replace(/\/$/, '')}${url}`
  }
  return `${BACKEND_URL.replace(/\/$/, '')}/uploads/${url}`
}
