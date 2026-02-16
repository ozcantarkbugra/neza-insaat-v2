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
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new AppError('User with this email already exists', 400)
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.EDITOR, // Default role
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Save refresh token
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
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive', 403)
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password)

    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401)
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Save refresh token
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
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401)
    }

    if (user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401)
    }

    // Generate new access token
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
