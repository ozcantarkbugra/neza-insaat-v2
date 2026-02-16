import prisma from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { ProjectStatus } from '@prisma/client'

export interface CreateProjectData {
  title: string
  titleEn?: string
  slug: string
  description: string
  descriptionEn?: string
  shortDescription?: string
  shortDescriptionEn?: string
  status: ProjectStatus
  area?: number
  location?: string
  latitude?: number
  longitude?: number
  deliveryDate?: Date
  startDate?: Date
  featured?: boolean
  featuredImage?: string
  metaTitle?: string
  metaDescription?: string
  serviceId?: string
  imageUrls?: string[]
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string
}

export class ProjectService {
  async getAll(filters: {
    status?: ProjectStatus
    featured?: boolean
    serviceId?: string
    page?: number
    limit?: number
  }) {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.featured !== undefined) where.featured = filters.featured
    if (filters.serviceId) where.serviceId = filters.serviceId

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          service: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ])

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        service: true,
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

    if (!project) {
      throw new AppError('Project not found', 404)
    }

    return project
  }

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        service: true,
      },
    })

    if (!project) {
      throw new AppError('Project not found', 404)
    }

    return project
  }

  async create(data: CreateProjectData, userId: string) {
    // Check if slug exists
    const existing = await prisma.project.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      throw new AppError('Project with this slug already exists', 400)
    }

    const { imageUrls, ...projectData } = data

    const project = await prisma.project.create({
      data: {
        ...projectData,
        createdById: userId,
        updatedById: userId,
        images: imageUrls
          ? {
              create: imageUrls.map((url, index) => ({
                url,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        service: true,
      },
    })

    return project
  }

  async update(data: UpdateProjectData, userId: string) {
    const { id, imageUrls, ...updateData } = data

    const existing = await prisma.project.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new AppError('Project not found', 404)
    }

    // Check slug uniqueness if changing
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: updateData.slug },
      })
      if (slugExists) {
        throw new AppError('Project with this slug already exists', 400)
      }
    }

    // Handle images update
    if (imageUrls !== undefined) {
      // Delete existing images
      await prisma.projectImage.deleteMany({
        where: { projectId: id },
      })

      // Create new images
      if (imageUrls.length > 0) {
        await prisma.projectImage.createMany({
          data: imageUrls.map((url, index) => ({
            projectId: id,
            url,
            order: index,
          })),
        })
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        updatedById: userId,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        service: true,
      },
    })

    return project
  }

  async delete(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      throw new AppError('Project not found', 404)
    }

    await prisma.project.delete({
      where: { id },
    })

    return { message: 'Project deleted successfully' }
  }
}

export default new ProjectService()
