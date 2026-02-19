'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

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
        flexShrink: 0,
      }}
      className="hover:opacity-90 ml-4 lg:ml-20"
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
          maxHeight: 144,
          maxWidth: 240,
        }}
      />
    </Link>
  )
}
