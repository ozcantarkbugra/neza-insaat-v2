'use client'

import Link from 'next/link'
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
} from '@mantine/core'
import { IconSun, IconMoon, IconChevronDown, IconLanguage } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import Logo from './Logo'

const SCROLL_THRESHOLD = 24

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
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
  const scrolledBg = effectiveDark ? 'rgba(18, 55, 105, 0.92)' : 'rgba(255, 255, 255, 0.92)'
  const headerStyle = {
    position: 'sticky' as const,
    top: 0,
    zIndex: 1100,
    backgroundColor: effectiveScrolled ? scrolledBg : solidBg,
    backdropFilter: effectiveScrolled ? 'saturate(180%) blur(12px)' : undefined,
    WebkitBackdropFilter: effectiveScrolled ? 'saturate(180%) blur(12px)' : undefined,
    borderBottom: `1px solid ${effectiveScrolled ? (effectiveDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : borderColor}`,
    boxShadow: effectiveScrolled ? (effectiveDark ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.06)') : theme.shadows.sm,
    transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
  }

  return (
    <header style={headerStyle} suppressHydrationWarning>
      <Container size="lg" py="sm" px={{ base: 'xs', sm: 'md', lg: 'xl' }} style={{ maxWidth: '100%' }}>
        <Group justify="space-between" align="center" className="min-h-16 sm:min-h-20 lg:min-h-36" wrap="nowrap" gap="md" suppressHydrationWarning>
          <Logo isDark={isDark} />

          <Group gap="lg" visibleFrom="lg" style={{ overflow: 'visible' }} suppressHydrationWarning>
            <Menu
              trigger="hover"
              openDelay={100}
              closeDelay={150}
              position="bottom-start"
              withArrow
              offset={4}
              shadow="xl"
              zIndex={9999}
              styles={{
                dropdown: {
                  backgroundColor: effectiveDark ? theme.colors.dark[7] : theme.white,
                  border: `1px solid ${effectiveDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                  minWidth: 200,
                  zIndex: 9999,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
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
              closeDelay={150}
              position="bottom-start"
              withArrow
              offset={4}
              shadow="xl"
              zIndex={9999}
              styles={{
                dropdown: {
                  backgroundColor: effectiveDark ? theme.colors.dark[7] : theme.white,
                  border: `1px solid ${effectiveDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                  minWidth: 200,
                  zIndex: 9999,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
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

            <Menu position="bottom-end" withArrow shadow="md" zIndex={9999}>
              <Menu.Target>
                <ActionIcon
                  variant="default"
                  size="lg"
                  aria-label={t('nav.language')}
                  title={locale === 'tr' ? 'Türkçe' : 'English'}
                >
                  <IconLanguage size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setLocale('tr')} leftSection={locale === 'tr' ? '✓' : undefined}>
                  TR
                </Menu.Item>
                <Menu.Item onClick={() => setLocale('en')} leftSection={locale === 'en' ? '✓' : undefined}>
                  EN
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            {mounted && (
              <ActionIcon
                onClick={handleColorSchemeToggle}
                variant="default"
                size="lg"
                aria-label="Toggle color scheme"
                title={colorScheme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
              >
                {isDark ? <IconMoon size={20} /> : <IconSun size={20} />}
              </ActionIcon>
            )}
          </Group>

          <Group gap="xs" hiddenFrom="lg" wrap="nowrap" style={{ flexShrink: 0 }} suppressHydrationWarning>
            <Menu position="bottom-end" withArrow shadow="md" zIndex={9999}>
              <Menu.Target>
                <ActionIcon variant="default" size="md" aria-label={t('nav.language')}>
                  <IconLanguage size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setLocale('tr')} leftSection={locale === 'tr' ? '✓' : undefined}>
                  TR
                </Menu.Item>
                <Menu.Item onClick={() => setLocale('en')} leftSection={locale === 'en' ? '✓' : undefined}>
                  EN
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            {mounted && (
              <ActionIcon
                onClick={handleColorSchemeToggle}
                variant="default"
                size="md"
                aria-label="Toggle color scheme"
              >
                {isDark ? <IconMoon size={18} /> : <IconSun size={18} />}
              </ActionIcon>
            )}
            <Burger opened={opened} onClick={toggle} aria-label={t('nav.toggleNav')} size="sm" />
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
