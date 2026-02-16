'use client'

import { useState, useEffect } from 'react'
import LegalPageLayout from '@/components/ui/LegalPageLayout'
import { Text, Title } from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

export default function KullanimSartlariPage() {
  const { t, locale } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dateLocale = locale === 'en' ? 'en-GB' : 'tr-TR'
  return (
    <LegalPageLayout title={t('legal.termsTitle')}>
      <Text size="sm" c="dimmed">
        {t('legal.lastUpdated')}: {mounted ? new Date().toLocaleDateString(dateLocale) : ''}
      </Text>
      <Text>{t('legal.termsIntro')}</Text>

      <Title order={2} size="h4">
        {t('legal.termsSection1Title')}
      </Title>
      <Text>{t('legal.termsSection1Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.termsSection2Title')}
      </Title>
      <Text>{t('legal.termsSection2Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.termsSection3Title')}
      </Title>
      <Text>{t('legal.termsSection3Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.termsSection4Title')}
      </Title>
      <Text>{t('legal.termsSection4Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.termsSection5Title')}
      </Title>
      <Text>{t('legal.termsSection5Body')}</Text>
    </LegalPageLayout>
  )
}
