import type { Metadata } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'

async function getBlog(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blogs/slug/${slug}`, { next: { revalidate: 3600 } })
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
  const blog = await getBlog(slug)
  if (!blog) return { title: 'Blog' }

  const title = blog.metaTitle || blog.title
  const description =
    blog.metaDescription ||
    blog.excerpt ||
    blog.content?.replace(/<[^>]*>/g, '').substring(0, 160) ||
    `${blog.title} - Neza İnşaat blog`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: blog.featuredImage ? [blog.featuredImage] : undefined,
      type: 'article',
    },
  }
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
