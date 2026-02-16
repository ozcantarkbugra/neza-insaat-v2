'use client'

import Link from 'next/link'
import { Group, Text, Anchor, useMantineColorScheme } from '@mantine/core'
import { useTranslation } from '@/lib/i18n'
import { useMantineTheme } from '@mantine/core'

export default function AdminFooter() {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const borderColor = isDark ? theme.colors.dark[4] : theme.colors.gray[3]
  const bg = isDark ? theme.colors.dark[7] : theme.colors.gray[0]

  return (
    <footer
      style={{
        padding: theme.spacing.md,
        borderTop: `1px solid ${borderColor}`,
        backgroundColor: bg,
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Text size="sm" c="dimmed">
          &copy; {new Date().getFullYear()} {t('admin.footerCopyright')}
        </Text>
        <Anchor component={Link} href="/" size="sm" c="blue.6">
          {t('admin.viewSite')}
        </Anchor>
      </Group>
    </footer>
  )
}
