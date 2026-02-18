'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, useMantineTheme } from '@mantine/core'
import { IconBrandWhatsapp, IconFileDescription } from '@tabler/icons-react'
import { useTranslation } from '@/lib/i18n'
import api from '@/lib/api'

type SiteSettings = Record<string, string>

const CTA_MAX_WIDTH = 200
const CTA_MIN_WIDTH = 180
const TRIGGER_WIDTH = 32

export default function FloatingCTAs() {
  const theme = useMantineTheme()
  const { t } = useTranslation()
  const [contactPhone, setContactPhone] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    api
      .get<SiteSettings>('/settings')
      .then((res) => {
        const phone = res.data?.contact_phone
        if (phone && typeof phone === 'string') setContactPhone(phone)
      })
      .catch(() => {})
  }, [])

  const whatsappNumber = contactPhone.replace(/\D/g, '')
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://wa.me'

  const sharedButtonStyle = {
    minWidth: CTA_MIN_WIDTH,
    maxWidth: CTA_MAX_WIDTH,
    width: CTA_MAX_WIDTH,
    justifyContent: 'center' as const,
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'flex-end',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
          visibility: isHovered ? 'visible' : 'hidden',
          transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s',
          marginRight: 8,
        }}
      >
        <Button
          component="a"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          leftSection={
            <span className="whatsapp-icon-wrap">
              <IconBrandWhatsapp size={24} stroke={2.5} />
            </span>
          }
          size="md"
          radius="xl"
          style={{
            ...sharedButtonStyle,
            backgroundColor: '#25D366',
            color: 'white',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            boxShadow: theme.shadows.md,
          }}
          className="whatsapp-cta"
        >
          {t('cta.whatsapp')}
        </Button>
        <Button
          component={Link}
          href="/iletisim"
          leftSection={<IconFileDescription size={22} />}
          size="md"
          radius="xl"
          variant="filled"
          style={{
            ...sharedButtonStyle,
            backgroundColor: theme.colors.blue[6],
            color: 'white',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            boxShadow: theme.shadows.md,
          }}
        >
          {t('cta.quoteForm')}
        </Button>
      </div>
      <div
        style={{
          width: TRIGGER_WIDTH,
          height: 120,
          flexShrink: 0,
          cursor: 'pointer',
        }}
        aria-label="Show contact options"
      />
    </div>
  )
}
