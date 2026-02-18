import type { Metadata } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'

async function getService(slug: string) {
  try {
    const res = await fetch(`${API_URL}/services/slug/${slug}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return { title: 'Hizmet' }

  const title = service.title
  const description =
    service.metaDescription ||
    service.shortDescription ||
    service.description?.substring(0, 160) ||
    `${service.title} - Neza İnşaat hizmeti`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: service.image ? [service.image] : undefined,
    },
  }
}

export default function ServiceSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
