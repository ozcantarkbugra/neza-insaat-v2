'use client'

import { Container, Title, Stack, useMantineTheme, useMantineColorScheme } from '@mantine/core'

interface LegalPageLayoutProps {
  title: string
  children: React.ReactNode
}

export default function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  return (
    <Stack gap={0}>
      <section
        suppressHydrationWarning
        style={{
          background: colorScheme === 'dark'
            ? `linear-gradient(135deg, ${theme.colors.blue[9]} 0%, ${theme.colors.blue[8]} 100%)`
            : `linear-gradient(135deg, ${theme.colors.dark[9] || '#1a1b1e'} 0%, ${theme.colors.dark[8] || '#25262b'} 100%)`,
          paddingTop: '6rem',
          paddingBottom: '4rem',
        }}
      >
        <Container size="xl">
          <Title order={1} size="h1" c="white" ta="center">
            {title}
          </Title>
        </Container>
      </section>
      <Container size="md" py="xl">
        <Stack gap="lg" style={{ lineHeight: 1.8 }}>
          {children}
        </Stack>
      </Container>
    </Stack>
  )
}
