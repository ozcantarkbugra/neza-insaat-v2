import prisma from '../config/database'
import { AppError } from '../middleware/errorHandler'

export interface CreateServiceData {
  title: string
  titleEn?: string
  slug: string
  description: string
  descriptionEn?: string
  shortDescription?: string
  shortDescriptionEn?: string
  icon?: string
  image?: string
  featured?: boolean
  order?: number
  metaTitle?: string
  metaDescription?: string
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: string
}

export class ServiceService {
  async getAll(filters: { featured?: boolean }) {
    const where: any = {}
    if (filters.featured !== undefined) where.featured = filters.featured

    const services = await prisma.service.findMany({
      where,
      include: {
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { order: 'asc' },
    })

    return services
  }

  async getBySlug(slug: string) {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        projects: {
          take: 6,
          orderBy: { createdAt: 'desc' },
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!service) {
      throw new AppError('Service not found', 404)
    }

    return service
  }

  async getById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      throw new AppError('Service not found', 404)
    }

    return service
  }

  async create(data: CreateServiceData) {
    const existing = await prisma.service.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      throw new AppError('Service with this slug already exists', 400)
    }

    const service = await prisma.service.create({
      data,
    })

    return service
  }

  async update(data: UpdateServiceData) {
    const { id, ...updateData } = data

    const existing = await prisma.service.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new AppError('Service not found', 404)
    }

    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugExists = await prisma.service.findUnique({
        where: { slug: updateData.slug },
      })
      if (slugExists) {
        throw new AppError('Service with this slug already exists', 400)
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    })

    return service
  }

  async delete(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      throw new AppError('Service not found', 404)
    }

    await prisma.service.delete({
      where: { id },
    })

    return { message: 'Service deleted successfully' }
  }
}

export default new ServiceService()
