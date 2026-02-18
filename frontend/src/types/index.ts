export interface Project {
  id: string
  title: string
  titleEn?: string | null
  slug: string
  description: string
  descriptionEn?: string | null
  shortDescription?: string
  shortDescriptionEn?: string | null
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  area?: number
  location?: string
  latitude?: number
  longitude?: number
  deliveryDate?: string
  startDate?: string
  featured: boolean
  featuredImage?: string
  metaTitle?: string
  metaDescription?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
  images?: ProjectImage[]
  service?: Service
}

export interface ProjectImage {
  id: string
  url: string
  alt?: string
  order: number
}

export interface Service {
  id: string
  title: string
  titleEn?: string | null
  slug: string
  description: string
  descriptionEn?: string | null
  shortDescription?: string
  shortDescriptionEn?: string | null
  icon?: string
  image?: string
  featured: boolean
  order: number
  metaTitle?: string
  metaDescription?: string
  isActive?: boolean
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured: boolean
  views: number
  metaTitle?: string
  metaDescription?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  category?: BlogCategory
  createdBy?: {
    id: string
    firstName: string | null
    lastName: string | null
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  read: boolean
  replied: boolean
  isActive?: boolean
  createdAt: string
}
