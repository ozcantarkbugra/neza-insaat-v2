'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

const NAVBAR_HEIGHT = 144

interface LogoProps {
  isDark: boolean
}

export default function Logo({ isDark }: LogoProps) {
  const { t } = useTranslation()
  const logoSrc = isDark ? '/images/logo-neza-dark.svg' : '/images/logo-neza.svg'

  return (
    <Link
      href="/"
      style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1,
        height: NAVBAR_HEIGHT,
        flexShrink: 0,
        marginLeft: 80,
      }}
      className="hover:opacity-90"
      aria-label={t('common.companyName')}
    >
      <img
        key={isDark ? 'dark' : 'light'}
        src={logoSrc}
        alt={t('common.companyName')}
        width={240}
        height={144}
        style={{
          objectFit: 'contain',
          maxHeight: NAVBAR_HEIGHT,
          maxWidth: 640,
          transition: 'opacity 200ms ease',
        }}
      />
    </Link>
  )
}
