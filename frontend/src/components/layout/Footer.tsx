'use client'

import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import { Container, SimpleGrid, Stack, Text, Group, Anchor, ActionIcon } from '@mantine/core'
import { useMantineTheme } from '@mantine/core'
import { IconMail, IconPhone, IconMapPin, IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react'
import { useTranslation } from '@/lib/i18n'

type SiteSettings = Record<string, string>

const DEFAULT_CONTACT = {
  contact_email: 'info@neza.com',
  contact_phone: '',
  contact_address: 'İstanbul, Türkiye',
  facebook_url: 'https://facebook.com',
  instagram_url: 'https://instagram.com',
  linkedin_url: 'https://linkedin.com',
  twitter_url: 'https://twitter.com',
}

const VALUE_KEYS = [
  { titleKey: 'footer.value1Title', descKey: 'footer.value1Desc' },
  { titleKey: 'footer.value2Title', descKey: 'footer.value2Desc' },
  { titleKey: 'footer.value3Title', descKey: 'footer.value3Desc' },
] as const

export default function Footer() {
  const theme = useMantineTheme()
  const { t } = useTranslation()
  const { settings } = useSettings()

  const s = { ...DEFAULT_CONTACT, ...settings }
  const email = s.contact_email || DEFAULT_CONTACT.contact_email
  const phone = s.contact_phone || DEFAULT_CONTACT.contact_phone
  const address = s.contact_address || DEFAULT_CONTACT.contact_address
  const telHref = phone.replace(/\s|\(|\)|-/g, '')

  return (
    <footer
      style={{
        background: `linear-gradient(180deg, ${theme.colors.blue[8]} 0%, ${theme.colors.blue[9]} 72px, ${theme.colors.blue[9]} 100%)`,
        paddingTop: '4rem',
        paddingBottom: '4rem',
      }}
    >
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mb="xl">
          {VALUE_KEYS.map((item) => (
            <Stack key={item.titleKey} gap="xs" align="center">
              <Text size="md" fw={700} c="white" ta="center">
                {t(item.titleKey)}
              </Text>
              <Text size="sm" c="gray.4" ta="center" style={{ lineHeight: 1.6 }}>
                {t(item.descKey)}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 'xl', md: 'xl' }} mb="xl">
          <Stack gap="md">
            <Text
              component={Link}
              href="/"
              size="xl"
              fw={700}
              c="white"
              style={{ textDecoration: 'none' }}
              className="hover:opacity-90"
            >
              {t('common.companyName')}
            </Text>
            <Text size="sm" c="gray.3" style={{ lineHeight: 1.6 }}>
              {t('footer.tagline')}
            </Text>
            <Group gap="xs" mt="sm">
              <ActionIcon
                component="a"
                href={s.facebook_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="gray"
                size="lg"
                style={{ color: theme.colors.gray[4] }}
              >
                <IconBrandFacebook size={20} />
              </ActionIcon>
              <ActionIcon
                component="a"
                href={s.instagram_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="gray"
                size="lg"
                style={{ color: theme.colors.gray[4] }}
              >
                <IconBrandInstagram size={20} />
              </ActionIcon>
              <ActionIcon
                component="a"
                href={s.linkedin_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="gray"
                size="lg"
                style={{ color: theme.colors.gray[4] }}
              >
                <IconBrandLinkedin size={20} />
              </ActionIcon>
              <ActionIcon
                component="a"
                href={s.twitter_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="gray"
                size="lg"
                style={{ color: theme.colors.gray[4] }}
              >
                <IconBrandTwitter size={20} />
              </ActionIcon>
            </Group>
          </Stack>

          <Stack gap="md">
            <Text size="xs" fw={600} c="white" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
              {t('footer.corporate')}
            </Text>
            <Stack gap="xs">
              <Anchor component={Link} href="/hakkimizda" c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                {t('footer.about')}
              </Anchor>
              <Anchor component={Link} href="/hakkimizda#misyon-vizyon" c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                {t('footer.missionVision')}
              </Anchor>
              <Anchor component={Link} href="/hakkimizda#tarihce" c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                {t('footer.history')}
              </Anchor>
              <Anchor component={Link} href="/hakkimizda#yonetim" c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                {t('footer.management')}
              </Anchor>
              <Anchor component={Link} href="/iletisim" c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                {t('footer.contact')}
              </Anchor>
            </Stack>
          </Stack>

          <Stack gap="md">
            <Text size="xs" fw={600} c="white" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
              {t('footer.privacyPolicies')}
            </Text>
            <Stack gap="xs">
              <Anchor component={Link} href="/gizlilik-politikasi" c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                {t('footer.privacyPolicy')}
              </Anchor>
              <Anchor component={Link} href="/kullanim-sartlari" c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                {t('footer.termsOfUse')}
              </Anchor>
              <Anchor component={Link} href="/kvkk-aydinlatma-metni" c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                {t('footer.kvkk')}
              </Anchor>
            </Stack>
          </Stack>

          <Stack gap="md">
            <Text size="xs" fw={600} c="white" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
              {t('footer.contactHeading')}
            </Text>
            <Stack gap="sm">
              <Group gap="xs" align="flex-start">
                <IconMail size={18} color={theme.colors.gray[4]} style={{ marginTop: 2 }} />
                <Anchor href={`mailto:${email}`} c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                  {email}
                </Anchor>
              </Group>
              <Group gap="xs" align="flex-start">
                <IconPhone size={18} color={theme.colors.gray[4]} style={{ marginTop: 2 }} />
                <Anchor href={`tel:${telHref}`} c="gray.3" size="sm" style={{ textDecoration: 'none' }}>
                  {phone}
                </Anchor>
              </Group>
              <Group gap="xs" align="flex-start">
                <IconMapPin size={18} color={theme.colors.gray[4]} style={{ marginTop: 2 }} />
                <Text size="sm" c="gray.3">{address}</Text>
              </Group>
            </Stack>
          </Stack>
        </SimpleGrid>

        <Group justify="center">
          <Text size="sm" c="gray.4">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </Text>
        </Group>
      </Container>
    </footer>
  )
}
