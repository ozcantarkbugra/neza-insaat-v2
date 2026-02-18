import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ColorSchemeScript } from '@mantine/core'

const inter = Inter({ subsets: ['latin'] })

const SITE_NAME = 'Neza İnşaat'
const DEFAULT_DESC = 'Güvenilir inşaat çözümleri. Konut, ticari ve endüstriyel projelerde kalite ve güven.'

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESC,
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESC,
    type: 'website',
  },
  icons: {
    icon: [{ url: '/images/logo.svg', type: 'image/svg+xml' }, { url: '/images/logo.png', type: 'image/png' }],
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
