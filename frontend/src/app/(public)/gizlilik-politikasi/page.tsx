'use client'

import { useState, useEffect } from 'react'
import LegalPageLayout from '@/components/ui/LegalPageLayout'
import { Text, Title } from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

export default function GizlilikPolitikasiPage() {
  const { t, locale } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dateLocale = locale === 'en' ? 'en-GB' : 'tr-TR'
  return (
    <LegalPageLayout title={t('legal.privacyTitle')}>
      <Text size="sm" c="dimmed">
        {t('legal.lastUpdated')}: {mounted ? new Date().toLocaleDateString(dateLocale) : ''}
      </Text>
      <Text>{t('legal.privacyIntro')}</Text>

      <Title order={2} size="h4">
        {t('legal.privacySection1Title')}
      </Title>
      <Text>{t('legal.privacySection1Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.privacySection2Title')}
      </Title>
      <Text>{t('legal.privacySection2Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.privacySection3Title')}
      </Title>
      <Text>{t('legal.privacySection3Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.privacySection4Title')}
      </Title>
      <Text>{t('legal.privacySection4Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.privacySection5Title')}
      </Title>
      <Text>{t('legal.privacySection5Body')}</Text>
    </LegalPageLayout>
  )
}
