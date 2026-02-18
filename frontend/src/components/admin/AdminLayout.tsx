'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { logout } from '@/store/slices/authSlice'
import { useEffect, useState } from 'react'
import {
  AppShell,
  Group,
  Title,
  Text,
  Button,
  NavLink,
  Box,
  useMantineTheme,
  Center,
  Loader,
  ActionIcon,
  SegmentedControl,
  useMantineColorScheme,
} from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTranslation } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import AdminFooter from './AdminFooter'

const LOGO_PATHS = ['/images/logo.svg', '/images/logo.png']

const ALL_NAV_ITEMS = [
  { href: '/admin/dashboard', key: 'dashboard' as const, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { href: '/admin/projects', key: 'projects' as const, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { href: '/admin/blogs', key: 'blog' as const, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { href: '/admin/blog-categories', key: 'blogCategories' as const, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { href: '/admin/services', key: 'services' as const, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { href: '/admin/users', key: 'users' as const, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { href: '/admin/messages', key: 'messages' as const, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { href: '/admin/settings', key: 'settings' as const, roles: ['SUPER_ADMIN', 'ADMIN'] },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const theme = useMantineTheme()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const { t, locale, setLocale } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoIndex, setLogoIndex] = useState(0)
  const logoUrl = LOGO_PATHS[logoIndex]
  const logoError = logoIndex >= LOGO_PATHS.length

  const effectiveDark = mounted ? colorScheme === 'dark' : false
  const effectiveScrolled = mounted && scrolled
  const headerBg = effectiveDark ? theme.colors.dark[8] : theme.colors.blue[9]
  const navbarBg = effectiveDark ? theme.colors.dark[7] : theme.white
  const mainBg = effectiveDark ? theme.colors.dark[6] : theme.colors.gray[0]
  const headerTextColor =
    effectiveScrolled ? (effectiveDark ? theme.colors.gray[2] : theme.colors.gray[8]) : effectiveDark ? theme.colors.gray[2] : 'white'
  const headerSubtextColor =
    effectiveScrolled ? (effectiveDark ? theme.colors.gray[4] : theme.colors.gray[7]) : effectiveDark ? theme.colors.gray[4] : theme.colors.gray[3]

  const SCROLL_THRESHOLD = 24

  useEffect(() => {
    if (!user && pathname !== '/admin/login') {
      router.push('/admin/login')
      return
    }
    if (user?.role === 'EDITOR') {
      const isEditorAllowed =
        pathname === '/admin/login' ||
        pathname?.startsWith('/admin/blogs') ||
        pathname === '/admin/projects' ||
        pathname === '/admin/services'
      if (!isEditorAllowed && pathname?.startsWith('/admin')) {
        router.replace('/admin/blogs')
      }
    }
  }, [user, pathname, router])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(typeof window !== 'undefined' && window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await dispatch(logout())
    router.push('/admin/login')
  }

  const handleLogoError = () => {
    if (logoIndex + 1 < LOGO_PATHS.length) setLogoIndex((i) => i + 1)
  }

  const logoFilter = !effectiveScrolled || effectiveDark ? 'brightness(0) invert(1)' : undefined

  if (pathname === '/admin/login') {
    return (
      <Box style={{ minHeight: '100vh', backgroundColor: mainBg, display: 'flex', flexDirection: 'column' }}>
        <Box
          component="header"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${effectiveDark ? theme.colors.dark[5] : 'rgba(255,255,255,0.15)'}`,
            padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
            minHeight: 108,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Group justify="space-between" align="center" style={{ width: '100%' }}>
            <Link
              href="/"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', minHeight: 76 }}
              className="hover:opacity-90"
            >
              <Group gap="sm" align="center">
                {!logoError ? (
                  <Image
                    src={logoUrl}
                    alt={t('admin.adminPanel')}
                    width={340}
                    height={80}
                    priority
                    style={{
                      objectFit: 'contain',
                      height: 'auto',
                      maxHeight: 76,
                      maxWidth: 340,
                      filter: 'brightness(0) invert(1)',
                      transition: 'filter 200ms ease',
                    }}
                    onError={handleLogoError}
                    unoptimized
                  />
                ) : null}
                <Title order={4} c={headerTextColor}>
                  {t('admin.adminPanel')}
                </Title>
              </Group>
            </Link>
            <Group gap="sm">
              <SegmentedControl
                size="xs"
                value={locale}
                onChange={(v) => setLocale(v as Locale)}
                data={[
                  { label: 'TR', value: 'tr' },
                  { label: 'EN', value: 'en' },
                ]}
                styles={{
                  root: {
                    backgroundColor: effectiveDark ? theme.colors.dark[5] : 'rgba(255,255,255,0.2)',
                  },
                }}
              />
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                onClick={() => toggleColorScheme()}
                style={{ color: headerSubtextColor }}
                title={effectiveDark ? t('admin.themeLight') : t('admin.themeDark')}
              >
                {effectiveDark ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Group>
          </Group>
        </Box>
        <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </Box>
      </Box>
    )
  }

  if (!mounted || !user) {
    return (
      <Box style={{ minHeight: '100vh', background: mainBg }}>
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      </Box>
    )
  }

  return (
    <AppShell
      header={{ height: 108 }}
      navbar={{ width: 260, breakpoint: 'sm' }}
      padding="md"
      styles={{
        main: {
          backgroundColor: mainBg,
          minHeight: '100vh',
          flex: 'none',
          display: 'block',
        },
      }}
    >
      <AppShell.Header
        style={{
          backgroundColor: scrolled ? 'transparent' : headerBg,
          borderBottom: scrolled ? 'none' : 'none',
          boxShadow: scrolled ? 'none' : 'none',
          transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
        }}
      >
        <Group justify="space-between" h="100%" px="md">
          <Link
            href="/"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
            className="hover:opacity-90"
          >
            <Group gap="sm" align="center">
              {!logoError ? (
                <Image
                  src={logoUrl}
                  alt={t('admin.adminPanel')}
                  width={340}
                  height={80}
                  priority
                  style={{
                    objectFit: 'contain',
                    height: 'auto',
                    maxHeight: 76,
                    width: 'auto',
                    maxWidth: 340,
                    filter: logoFilter,
                    transition: 'filter 200ms ease',
                  }}
                  onError={handleLogoError}
                  unoptimized
                />
              ) : null}
              <Title order={4} c={headerTextColor}>
                {t('admin.adminPanel')}
              </Title>
            </Group>
          </Link>
          <Group gap="sm">
            <SegmentedControl
              size="xs"
              value={locale}
              onChange={(v) => setLocale(v as Locale)}
              data={[
                { label: 'TR', value: 'tr' },
                { label: 'EN', value: 'en' },
              ]}
              styles={{
                root: {
                  backgroundColor: scrolled
                    ? (effectiveDark ? theme.colors.dark[5] : theme.colors.gray[2])
                    : effectiveDark
                      ? theme.colors.dark[5]
                      : 'rgba(255,255,255,0.2)',
                },
              }}
            />
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => toggleColorScheme()}
              style={{ color: headerSubtextColor }}
              title={effectiveDark ? t('admin.themeLight') : t('admin.themeDark')}
            >
              {effectiveDark ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
            <Text size="sm" c={headerSubtextColor}>
              {user?.email}
            </Text>
            <Button color="red" variant="filled" size="sm" onClick={handleLogout}>
              {t('admin.logout')}
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ backgroundColor: navbarBg }}>
        <AppShell.Section grow>
          {ALL_NAV_ITEMS.filter((item) => user?.role && (item.roles as readonly string[]).includes(user.role)).map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={t(`admin.${item.key}`)}
              active={pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href))}
              style={{ borderRadius: theme.radius.md }}
            />
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box py="md">
          {children}
        </Box>
        <AdminFooter />
      </AppShell.Main>
    </AppShell>
  )
}
