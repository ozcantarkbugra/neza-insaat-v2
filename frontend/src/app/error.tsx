'use client'

import { useEffect } from 'react'
import { Box, Stack, Title, Text, Button } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  useEffect(() => {
    console.error(error)
  }, [error])

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
        <Title order={1} size="h3">
          {t('common.errorTitle')}
        </Title>
        <Text c="dimmed" size="md" ta="center" maw={400}>
          {t('common.errorMessage')}
        </Text>
        <Button onClick={reset} color="blue" size="md" mt="md">
          {t('common.tryAgain')}
        </Button>
      </Stack>
    </Box>
  )
}
