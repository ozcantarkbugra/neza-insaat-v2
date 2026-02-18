import type { Metadata } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'

async function getProject(slug: string) {
  try {
    const res = await fetch(`${API_URL}/projects/slug/${slug}`, { next: { revalidate: 3600 } })
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
  const project = await getProject(slug)
  if (!project) return { title: 'Proje' }

  const title = project.title
  const description =
    project.metaDescription ||
    project.shortDescription ||
    project.description?.substring(0, 160) ||
    `${project.title} - Neza İnşaat projesi`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.featuredImage ? [project.featuredImage] : undefined,
    },
  }
}

export default function ProjectSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
