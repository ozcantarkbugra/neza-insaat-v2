import prisma from '../config/database'
import { AppError } from '../middleware/errorHandler'
import { UserRole } from '@prisma/client'
import { hashPassword } from '../utils/bcrypt'

export class AdminService {
  async getDashboardStats() {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalBlogs,
      publishedBlogs,
      totalMessages,
      unreadMessages,
      totalUsers,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.blog.count(),
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.user.count(),
    ])

    return {
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
      },
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
      },
      users: {
        total: totalUsers,
      },
    }
  }

  async getUsers(filters: { page?: number; limit?: number }) {
    const page = filters.page || 1
    const limit = filters.limit || 20
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async updateUserRole(userId: string, role: UserRole) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    })
  }

  async toggleUserActive(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    })
  }

  async createUser(data: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    role: UserRole
  }) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, isActive: true },
    })
    if (existing) {
      throw new AppError('Bu e-posta adresi zaten kayıtlı', 400)
    }
    const hashedPassword = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })
    return user
  }

  async updateUser(
    userId: string,
    data: {
      email?: string
      password?: string
      firstName?: string
      lastName?: string
      role?: UserRole
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new AppError('User not found', 404)
    }
    const updateData: {
      email?: string
      password?: string
      firstName?: string
      lastName?: string
      role?: UserRole
    } = {}
    if (data.email !== undefined) updateData.email = data.email
    if (data.firstName !== undefined) updateData.firstName = data.firstName || undefined
    if (data.lastName !== undefined) updateData.lastName = data.lastName || undefined
    if (data.role !== undefined) updateData.role = data.role
    if (data.password && data.password.length > 0) {
      updateData.password = await hashPassword(data.password)
    }
    return prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    })
  }

  async getBlogCategories(includeInactive?: boolean) {
    const where = includeInactive ? {} : { isActive: true }
    return prisma.blogCategory.findMany({
      where,
      orderBy: { name: 'asc' },
    })
  }

  async createBlogCategory(data: { name: string; slug: string; description?: string }) {
    const existing = await prisma.blogCategory.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      throw new AppError('Category with this slug already exists', 400)
    }

    return prisma.blogCategory.create({
      data,
    })
  }

  async updateBlogCategory(id: string, data: { name?: string; slug?: string; description?: string }) {
    const existing = await prisma.blogCategory.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new AppError('Category not found', 404)
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.blogCategory.findUnique({
        where: { slug: data.slug },
      })
      if (slugExists) {
        throw new AppError('Category with this slug already exists', 400)
      }
    }

    return prisma.blogCategory.update({
      where: { id },
      data,
    })
  }

  async toggleBlogCategoryActive(id: string) {
    const category = await prisma.blogCategory.findUnique({
      where: { id },
    })

    if (!category) {
      throw new AppError('Category not found', 404)
    }

    const updated = await prisma.blogCategory.update({
      where: { id },
      data: { isActive: !category.isActive },
    })

    return updated
  }

  async getSiteSettings(group?: string) {
    const where: any = {}
    if (group) where.group = group

    const settings = await prisma.siteSetting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    })

    return settings
  }

  async updateSiteSetting(key: string, value: string) {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    })

    if (!setting) {
      throw new AppError('Setting not found', 404)
    }

    return prisma.siteSetting.update({
      where: { key },
      data: { value },
    })
  }

  async uploadMedia(file: Express.Multer.File, baseUrl: string) {
    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url: `${baseUrl}/uploads/${file.filename}`,
      },
    })

    return mediaFile
  }

  async getMedia(filters: { page?: number; limit?: number; mimeType?: string; includeInactive?: boolean }) {
    const page = filters.page || 1
    const limit = filters.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}
    if (!filters.includeInactive) where.isActive = true
    if (filters.mimeType) where.mimeType = { startsWith: filters.mimeType }

    const [files, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.mediaFile.count({ where }),
    ])

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async toggleMediaActive(id: string) {
    const file = await prisma.mediaFile.findUnique({
      where: { id },
    })

    if (!file) {
      throw new AppError('Media file not found', 404)
    }

    const updated = await prisma.mediaFile.update({
      where: { id },
      data: { isActive: !file.isActive },
    })

    return updated
  }
}

export default new AdminService()
