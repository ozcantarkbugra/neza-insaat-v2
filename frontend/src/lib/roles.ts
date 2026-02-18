/**
 * Rol bazlı yetki kontrolleri.
 * Backend ile uyumlu: SUPER_ADMIN ve ADMIN tam yetkili, EDITOR sadece blog içeriği.
 */
export const canManageProjects = (role: string | undefined) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

export const canManageServices = (role: string | undefined) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

export const canPublishBlogs = (role: string | undefined) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

export const canManageBlogs = (role: string | undefined) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'EDITOR'

export const canManageUsers = (role: string | undefined) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

export const canManageMessages = (role: string | undefined) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

export const canManageSettings = (role: string | undefined) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'
