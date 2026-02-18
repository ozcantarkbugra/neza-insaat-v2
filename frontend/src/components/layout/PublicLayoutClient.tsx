'use client'

import { Box } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingCTAs from '@/components/ui/FloatingCTAs'
import { I18nProvider } from '@/lib/i18n'

export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const backgroundColor = colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  const textColor = colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9]

  return (
    <I18nProvider>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: backgroundColor,
          color: textColor,
        }}
      >
        <Header />
        <Box component="main" style={{ flex: 1, paddingTop: 24 }}>
          {children}
        </Box>
        <Footer />
        <FloatingCTAs />
      </Box>
    </I18nProvider>
  )
}
