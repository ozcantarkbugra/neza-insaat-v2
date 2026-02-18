import prisma from '../config/database'
import { hashPassword, comparePassword } from '../utils/bcrypt'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt'
import { AppError } from '../middleware/errorHandler'
import { UserRole } from '@prisma/client'

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: UserRole
  }
  accessToken: string
  refreshToken: string
}

export class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email, isDeleted: false },
    })

    if (existingUser) {
      throw new AppError('User with this email already exists', 400)
    }

    const hashedPassword = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.EDITOR,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    })

    return {
      user,
      accessToken,
      refreshToken,
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const user = await prisma.user.findFirst({
      where: { email: data.email, isDeleted: false },
    })

    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive', 403)
    }

    const isValidPassword = await comparePassword(data.password, user.password)

    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401)
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = verifyRefreshToken(refreshToken)

    const user = await prisma.user.findFirst({
      where: { id: payload.userId, isDeleted: false },
    })

    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401)
    }

    if (user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401)
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateAccessToken(tokenPayload)

    return { accessToken }
  }

  async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
  }

  async getMe(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
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

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return user
  }
}

export default new AuthService()
