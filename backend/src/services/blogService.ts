import prisma from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { BlogStatus } from '@prisma/client'

export interface CreateBlogData {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: BlogStatus
  featured?: boolean
  metaTitle?: string
  metaDescription?: string
  categoryId?: string
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  id: string
}

export class BlogService {
  async getAll(filters: {
    status?: BlogStatus
    featured?: boolean
    categoryId?: string
    page?: number
    limit?: number
  }) {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.featured !== undefined) where.featured = filters.featured
    if (filters.categoryId) where.categoryId = filters.categoryId

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ])

    return {
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!blog) {
      throw new AppError('Blog not found', 404)
    }

    // Increment views
    await prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    })

    return blog
  }

  async getById(id: string) {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!blog) {
      throw new AppError('Blog not found', 404)
    }

    return blog
  }

  async create(data: CreateBlogData, userId: string) {
    const existing = await prisma.blog.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      throw new AppError('Blog with this slug already exists', 400)
    }

    const blog = await prisma.blog.create({
      data: {
        ...data,
        createdById: userId,
        updatedById: userId,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined,
      },
      include: {
        category: true,
      },
    })

    return blog
  }

  async update(data: UpdateBlogData, userId: string) {
    const { id, ...updateData } = data

    const existing = await prisma.blog.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new AppError('Blog not found', 404)
    }

    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug: updateData.slug },
      })
      if (slugExists) {
        throw new AppError('Blog with this slug already exists', 400)
      }
    }

    // Handle publishedAt
    const publishedAt =
      updateData.status === 'PUBLISHED' && existing.status !== 'PUBLISHED'
        ? new Date()
        : updateData.status === 'PUBLISHED' && existing.publishedAt
        ? existing.publishedAt
        : updateData.status !== 'PUBLISHED'
        ? null
        : undefined

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...updateData,
        updatedById: userId,
        publishedAt,
      },
      include: {
        category: true,
      },
    })

    return blog
  }

  async delete(id: string) {
    const blog = await prisma.blog.findUnique({
      where: { id },
    })

    if (!blog) {
      throw new AppError('Blog not found', 404)
    }

    await prisma.blog.delete({
      where: { id },
    })

    return { message: 'Blog deleted successfully' }
  }
}

export default new BlogService()
