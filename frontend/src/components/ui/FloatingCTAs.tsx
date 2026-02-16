'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, useMantineTheme } from '@mantine/core'
import { IconBrandWhatsapp, IconFileDescription } from '@tabler/icons-react'
import { useTranslation } from '@/lib/i18n'
import api from '@/lib/api'

type SiteSettings = Record<string, string>

export default function FloatingCTAs() {
  const theme = useMantineTheme()
  const { t } = useTranslation()
  const [contactPhone, setContactPhone] = useState<string>('')

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

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-end',
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
  )
}
