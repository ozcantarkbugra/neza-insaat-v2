'use client'

import Link from 'next/link'
import { Box, Stack, Title, Text, Button } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

export default function NotFound() {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const backgroundColor = colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]
  const textColor = colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9]

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: backgroundColor,
        color: textColor,
      }}
    >
      <Stack align="center" gap="md">
        <Title order={1} size="4rem" fw={700}>
          404
        </Title>
        <Title order={2} size="h4">
          {t('common.notFoundTitle')}
        </Title>
        <Text c="dimmed" size="md">
          {t('common.notFoundMessage')}
        </Text>
        <Button component={Link} href="/" color="blue" size="md" mt="md">
          {t('common.backToHome')}
        </Button>
      </Stack>
    </Box>
  )
}
