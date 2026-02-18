import prisma from '../config/database'
import { AppError } from '../middleware/errorHandler'

export interface CreateContactMessageData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export class ContactService {
  async create(data: CreateContactMessageData) {
    const message = await prisma.contactMessage.create({
      data,
    })

    return message
  }

  async getAll(filters: {
    read?: boolean
    page?: number
    limit?: number
    includeInactive?: boolean
  }) {
    const page = filters.page || 1
    const limit = filters.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}
    if (!filters.includeInactive) where.isActive = true
    if (filters.read !== undefined) where.read = filters.read

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ])

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getById(id: string) {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!message) {
      throw new AppError('Message not found', 404)
    }

    return message
  }

  async markAsRead(id: string) {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!message) {
      throw new AppError('Message not found', 404)
    }

    return prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    })
  }

  async markAsReplied(id: string) {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!message) {
      throw new AppError('Message not found', 404)
    }

    return prisma.contactMessage.update({
      where: { id },
      data: { replied: true },
    })
  }

  async toggleActive(id: string) {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!message) {
      throw new AppError('Message not found', 404)
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isActive: !message.isActive },
    })

    return updated
  }
}

export default new ContactService()
