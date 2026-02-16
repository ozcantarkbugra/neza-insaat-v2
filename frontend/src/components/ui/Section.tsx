'use client'

import { Box, useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  variant?: 'default' | 'light' | 'dark'
  py?: number | string
}

export default function Section({ children, variant = 'default', py = 80 }: SectionProps) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const getBackground = () => {
    if (colorScheme === 'light') {
      if (variant === 'light') return theme.colors.gray[0]
      if (variant === 'dark') return theme.colors.blue[9]
      return theme.white
    }
    // Dark: yumuşak geçişler için gradient (hero/sayfa arka planından bölüme)
    const b8 = theme.colors.blue[8]
    const b9 = theme.colors.blue[9]
    const darkBg = theme.colors.dark[9] ?? '#0f1419'
    if (variant === 'light') {
      return `linear-gradient(180deg, ${darkBg} 0%, ${b9} 18%, ${b9} 70%, ${b8} 100%)`
    }
    if (variant === 'dark') {
      return `linear-gradient(180deg, ${b8} 0%, ${b8} 70%, ${b9} 100%)`
    }
    return `linear-gradient(180deg, ${b8} 0%, ${b8} 70%, ${b9} 100%)`
  }

  return (
    <Box
      style={{
        paddingTop: typeof py === 'number' ? `${py}px` : py,
        paddingBottom: typeof py === 'number' ? `${py}px` : py,
        background: getBackground(),
        transition: 'background 200ms ease',
      }}
    >
      {children}
    </Box>
  )
}
