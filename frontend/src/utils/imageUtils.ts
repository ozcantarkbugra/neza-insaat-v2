// Backend URL'ini al
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5002'

/**
 * Görsel URL'ini normalize et
 * - Eski port numaralarını yeni porta çevir (5001 -> 5002)
 * - Relative path'leri tam URL'e çevir
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  
  // Eski port numaralarını yeni porta çevir (5001 -> 5002)
  if (url.includes('localhost:5001')) {
    url = url.replace('localhost:5001', 'localhost:5002')
  }
  
  // Zaten tam URL ise döndür
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Relative path ise backend URL'ine ekle
  if (url.startsWith('/uploads/')) {
    return `${BACKEND_URL}${url}`
  }
  
  // Sadece dosya adı ise uploads klasörüne ekle
  return `${BACKEND_URL}/uploads/${url}`
}
