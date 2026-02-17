'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Container,
  Group,
  Button,
  Menu,
  ActionIcon,
  Burger,
  Stack,
  useMantineColorScheme,
  useMantineTheme,
  Text,
  Box,
} from '@mantine/core'
import { IconSun, IconMoon, IconChevronDown } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'

const SCROLL_THRESHOLD = 24

const LOGO_PATHS = ['/images/logo.svg', '/images/logo.png']

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const [logoIndex, setLogoIndex] = useState(0)
  const logoUrl = LOGO_PATHS[logoIndex]
  const logoError = logoIndex >= LOGO_PATHS.length
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    if (!mounted) return
    const onScroll = () => setIsScrolled(typeof window !== 'undefined' && window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mounted])
  const isDark = mounted ? colorScheme === 'dark' : false
  const { t, locale, setLocale } = useTranslation()

  const handleLogoError = () => {
    if (logoIndex + 1 < LOGO_PATHS.length) setLogoIndex((i) => i + 1)
  }

  const handleColorSchemeToggle = () => {
    toggleColorScheme()
    const root = document.documentElement
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark'
    if (newScheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const effectiveDark = mounted ? colorScheme === 'dark' : false
  const effectiveScrolled = mounted && isScrolled
  const borderColor = effectiveDark ? theme.colors.blue[8] : theme.colors.gray[2]
  const solidBg = effectiveDark ? theme.colors.blue[9] : theme.white
  const headerStyle = {
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    backgroundColor: effectiveScrolled ? 'transparent' : solidBg,
    borderBottom: `1px solid ${effectiveScrolled ? 'transparent' : borderColor}`,
    boxShadow: effectiveScrolled ? 'none' : theme.shadows.sm,
    transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
  }

  return (
    <header style={{ ...headerStyle, overflow: 'visible' }}>
      <Container size="xl" py="md" style={{ overflow: 'visible' }}>
        <Group justify="space-between" align="center">
          <Box
            component={Link}
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1,
              minHeight: 76,
            }}
            className="hover:opacity-90"
          >
            {!logoError ? (
              <Image
                src={logoUrl}
                alt={t('common.companyName')}
                width={340}
                height={80}
                priority
                style={{
                  objectFit: 'contain',
                  height: 'auto',
                  maxHeight: 76,
                  width: 'auto',
                  maxWidth: 340,
                  filter: isDark ? 'brightness(0) invert(1)' : undefined,
                  transition: 'filter 200ms ease',
                }}
                onError={handleLogoError}
                unoptimized
              />
            ) : (
              <Text size="xl" fw={700} c={isDark ? theme.white : theme.colors.blue[8]}>
                {t('common.companyName')}
              </Text>
            )}
          </Box>

          <Group gap="lg" visibleFrom="lg" style={{ overflow: 'visible' }}>
            <Menu
              trigger="hover"
              openDelay={100}
              closeDelay={200}
              position="bottom-start"
              withArrow
              shadow="lg"
              zIndex={1100}
              styles={{
                dropdown: {
                  backgroundColor: effectiveDark ? theme.colors.dark[7] : theme.white,
                  border: `1px solid ${effectiveDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                  minWidth: 200,
                  zIndex: 1100,
                  boxShadow: theme.shadows.lg,
                },
                item: {
                  color: effectiveDark ? theme.colors.gray[2] : theme.colors.gray[8],
                },
              }}
            >
              <Menu.Target>
                <Button
                  variant="subtle"
                  rightSection={<IconChevronDown size={16} />}
                  styles={{
                    root: {
                      color: effectiveScrolled && !effectiveDark ? theme.colors.gray[8] : (effectiveDark ? theme.colors.gray[3] : theme.colors.gray[7]),
                      '&:hover': {
                        backgroundColor: effectiveDark ? theme.colors.blue[8] : theme.colors.blue[0],
                        color: effectiveDark ? theme.white : theme.colors.blue[6],
                      },
                    },
                  }}
                >
                  {t('nav.about')}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item component={Link} href="/hakkimizda">
                  {t('nav.companyProfile')}
                </Menu.Item>
                <Menu.Item component={Link} href="/hakkimizda#misyon-vizyon">
                  {t('nav.missionVision')}
                </Menu.Item>
                <Menu.Item component={Link} href="/hakkimizda#tarihce">
                  {t('nav.history')}
                </Menu.Item>
                <Menu.Item component={Link} href="/hakkimizda#yonetim">
                  {t('nav.management')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Menu
              trigger="hover"
              openDelay={100}
              closeDelay={200}
              position="bottom-start"
              withArrow
              shadow="lg"
              zIndex={1100}
              styles={{
                dropdown: {
                  backgroundColor: effectiveDark ? theme.colors.dark[7] : theme.white,
                  border: `1px solid ${effectiveDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                  minWidth: 200,
                  zIndex: 1100,
                  boxShadow: theme.shadows.lg,
                },
                item: {
                  color: effectiveDark ? theme.colors.gray[2] : theme.colors.gray[8],
                },
                itemLabel: {
                  color: effectiveDark ? theme.colors.gray[2] : theme.colors.gray[8],
                },
              }}
            >
              <Menu.Target>
                <Button
                  variant="subtle"
                  rightSection={<IconChevronDown size={16} />}
                  styles={{
                    root: {
                      color: effectiveScrolled && !effectiveDark ? theme.colors.gray[8] : (effectiveDark ? theme.colors.gray[3] : theme.colors.gray[7]),
                      '&:hover': {
                        backgroundColor: effectiveDark ? theme.colors.blue[8] : theme.colors.blue[0],
                        color: effectiveDark ? theme.white : theme.colors.blue[6],
                      },
                    },
                  }}
                >
                  {t('nav.services')}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{t('nav.allServices')}</Menu.Label>
                <Menu.Divider />
                <Menu.Item component={Link} href="/hizmetler/konut-insaati">
                  {t('nav.residential')}
                </Menu.Item>
                <Menu.Item component={Link} href="/hizmetler/ticari-yapilar">
                  {t('nav.commercial')}
                </Menu.Item>
                <Menu.Item component={Link} href="/hizmetler/endustriyel-yapilar">
                  {t('nav.industrial')}
                </Menu.Item>
                <Menu.Item component={Link} href="/hizmetler/taahhut-hizmetleri">
                  {t('nav.contracting')}
                </Menu.Item>
                <Menu.Item component={Link} href="/hizmetler/kentsel-donusum">
                  {t('nav.urbanTransformation')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Button
              component={Link}
              href="/projeler"
              variant="subtle"
              styles={{
                root: {
                  color: effectiveScrolled && !effectiveDark ? theme.colors.gray[8] : (effectiveDark ? theme.colors.gray[3] : theme.colors.gray[7]),
                  '&:hover': {
                    backgroundColor: effectiveDark ? theme.colors.blue[8] : theme.colors.blue[0],
                    color: effectiveDark ? theme.white : theme.colors.blue[6],
                  },
                },
              }}
            >
              {t('nav.projects')}
            </Button>

            <Button
              component={Link}
              href="/blog"
              variant="subtle"
              styles={{
                root: {
                  color: effectiveScrolled && !effectiveDark ? theme.colors.gray[8] : (effectiveDark ? theme.colors.gray[3] : theme.colors.gray[7]),
                  '&:hover': {
                    backgroundColor: effectiveDark ? theme.colors.blue[8] : theme.colors.blue[0],
                    color: effectiveDark ? theme.white : theme.colors.blue[6],
                  },
                },
              }}
            >
              {t('nav.news')}
            </Button>

            <Button
              component={Link}
              href="/iletisim"
              variant="subtle"
              styles={{
                root: {
                  color: effectiveScrolled && !effectiveDark ? theme.colors.gray[8] : (effectiveDark ? theme.colors.gray[3] : theme.colors.gray[7]),
                  '&:hover': {
                    backgroundColor: effectiveDark ? theme.colors.blue[8] : theme.colors.blue[0],
                    color: effectiveDark ? theme.white : theme.colors.blue[6],
                  },
                },
              }}
            >
              {t('nav.contact')}
            </Button>

            <Group gap={4}>
              <Button
                variant={locale === 'tr' ? 'filled' : 'default'}
                size="compact-xs"
                onClick={() => setLocale('tr')}
              >
                TR
              </Button>
              <Button
                variant={locale === 'en' ? 'filled' : 'default'}
                size="compact-xs"
                onClick={() => setLocale('en')}
              >
                EN
              </Button>
            </Group>

            <ActionIcon
              onClick={handleColorSchemeToggle}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
              title={colorScheme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            >
              {isDark ? <IconMoon size={20} /> : <IconSun size={20} />}
            </ActionIcon>
          </Group>

          <Group gap="xs" hiddenFrom="lg">
            <Group gap={4}>
              <Button variant={locale === 'tr' ? 'filled' : 'default'} size="compact-xs" onClick={() => setLocale('tr')}>
                TR
              </Button>
              <Button variant={locale === 'en' ? 'filled' : 'default'} size="compact-xs" onClick={() => setLocale('en')}>
                EN
              </Button>
            </Group>
            <ActionIcon
              onClick={handleColorSchemeToggle}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {isDark ? <IconMoon size={20} /> : <IconSun size={20} />}
            </ActionIcon>
            <Burger opened={opened} onClick={toggle} aria-label={t('nav.toggleNav')} />
          </Group>
        </Group>

        {opened && (
          <Stack gap="xs" mt="md" hiddenFrom="lg">
            <Button
              component={Link}
              href="/hakkimizda"
              variant="subtle"
              fullWidth
              justify="flex-start"
              onClick={toggle}
            >
              {t('nav.about')}
            </Button>
            <Button
              component={Link}
              href="/hizmetler"
              variant="subtle"
              fullWidth
              justify="flex-start"
              onClick={toggle}
            >
              {t('nav.services')}
            </Button>
            <Button
              component={Link}
              href="/projeler"
              variant="subtle"
              fullWidth
              justify="flex-start"
              onClick={toggle}
            >
              {t('nav.projects')}
            </Button>
            <Button
              component={Link}
              href="/blog"
              variant="subtle"
              fullWidth
              justify="flex-start"
              onClick={toggle}
            >
              {t('nav.news')}
            </Button>
            <Button
              component={Link}
              href="/iletisim"
              variant="subtle"
              fullWidth
              justify="flex-start"
              onClick={toggle}
            >
              {t('nav.contact')}
            </Button>
          </Stack>
        )}
      </Container>
    </header>
  )
}
