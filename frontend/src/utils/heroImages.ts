import type { Project } from '@/types'
import { normalizeImageUrl } from './imageUtils'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5002'

export const FALLBACK_IMAGES = [
  `${BACKEND_URL}/uploads/project-modern-konut-1.jpg`,
  `${BACKEND_URL}/uploads/project-is-merkezi-1.jpg`,
  `${BACKEND_URL}/uploads/project-endustriyel-1.jpg`,
  `${BACKEND_URL}/uploads/project-villa-1.jpg`,
]

export function extractHeroImagesFromProjects(projects: Project[], maxImages = 6): string[] {
  if (!projects?.length) return FALLBACK_IMAGES

  const allImages: string[] = []

  projects.forEach((project) => {
    if (project.featuredImage) {
      const url = normalizeImageUrl(project.featuredImage)
      if (url && !allImages.includes(url)) allImages.push(url)
    }
    if (project.images?.length) {
      project.images.slice(0, 2).forEach((img) => {
        if (img.url) {
          const url = normalizeImageUrl(img.url)
          if (url && !allImages.includes(url)) allImages.push(url)
        }
      })
    }
  })

  if (allImages.length >= 4) return allImages.slice(0, maxImages)
  if (allImages.length > 0) {
    const combined = [...allImages, ...FALLBACK_IMAGES]
    return Array.from(new Set(combined)).slice(0, maxImages)
  }
  return FALLBACK_IMAGES
}
