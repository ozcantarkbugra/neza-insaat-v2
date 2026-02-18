const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5002'

export function shouldUnoptimizeImage(url: string | null | undefined): boolean {
  if (!url) return false
  const normalized = normalizeImageUrl(url)
  return normalized.startsWith('http://') || normalized.startsWith('https://')
}

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return ''

  if (url.includes('localhost:5001')) {
    url = url.replace('localhost:5001', 'localhost:5002')
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  if (url.startsWith('/uploads/')) {
    return `${BACKEND_URL}${url}`
  }

  return `${BACKEND_URL}/uploads/${url}`
}
