import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

async function getBaseUrl(): Promise<string> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || headersList.get('x-forwarded-host')
    const proto = headersList.get('x-forwarded-proto') || headersList.get('x-forwarded-ssl')
    if (host && !host.includes('localhost')) {
      const protocol = proto === 'https' || proto === 'on' ? 'https' : 'https'
      return `${protocol}://${host}`
    }
  } catch {}
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl && !apiUrl.includes('localhost')) {
    return apiUrl.replace(/\/api\/?$/, '')
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://nezainsaat.com'
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
