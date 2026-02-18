'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { MantineProvider, createTheme, useMantineColorScheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { I18nProvider } from '@/lib/i18n'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import 'dayjs/locale/tr'
import { DatesProvider } from '@mantine/dates'
import { useEffect } from 'react'

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#e6f0f7',
      '#cce1ef',
      '#99c3df',
      '#66a5cf',
      '#3387bf',
      '#0069af',
      '#00548c',
      '#003f69',
      '#002a46',
      '#001523',
    ],
    dark: [
      '#e6edf3',
      '#c9d1d9',
      '#8b9cb3',
      '#6e7d8f',
      '#4a5568',
      '#2d3748',
      '#1e2936',
      '#151b23',
      '#0f1419',
      '#0a0e12',
    ],
    orange: [
      '#fff4e6',
      '#ffe9cc',
      '#ffd399',
      '#ffbd66',
      '#ffa733',
      '#ff9100',
      '#cc7400',
      '#995700',
      '#663a00',
      '#331d00',
    ],
  },
  fontFamily: 'system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    sizes: {
      h1: { fontSize: '3.5rem', lineHeight: '1.1' },
      h2: { fontSize: '2.5rem', lineHeight: '1.2' },
      h3: { fontSize: '2rem', lineHeight: '1.3' },
    },
  },
  defaultRadius: 'md',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 16px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.16)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.20)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: (theme: any) => ({
        root: {
          transition: 'all 200ms ease',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      }),
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
        withBorder: true,
      },
      styles: (theme: any) => ({
        root: {
          transition: 'all 200ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.md,
          },
        },
      }),
    },
    ActionIcon: {
      defaultProps: {
        radius: 'md',
        variant: 'default',
      },
      styles: (theme: any) => ({
        root: {
          transition: 'all 200ms ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      }),
    },
  },
})

function ColorSchemeSync({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useMantineColorScheme()

  useEffect(() => {
    const root = document.documentElement
    if (colorScheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [colorScheme])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" autoClose={4000} />
      <DatesProvider settings={{ locale: 'tr', firstDayOfWeek: 1 }}>
        <ColorSchemeSync>
          <Provider store={store}>
            <I18nProvider>{children}</I18nProvider>
          </Provider>
        </ColorSchemeSync>
      </DatesProvider>
    </MantineProvider>
  )
}
