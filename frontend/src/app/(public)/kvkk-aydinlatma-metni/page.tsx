'use client'

import { useState, useEffect } from 'react'
import LegalPageLayout from '@/components/ui/LegalPageLayout'
import { Text, Title, Anchor } from '@mantine/core'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export default function KvkkAydinlatmaMetniPage() {
  const { t, locale } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dateLocale = locale === 'en' ? 'en-GB' : 'tr-TR'
  return (
    <LegalPageLayout title={t('legal.kvkkTitle')}>
      <Text size="sm" c="dimmed">
        {t('legal.lastUpdated')}: {mounted ? new Date().toLocaleDateString(dateLocale) : ''}
      </Text>
      <Text>{t('legal.kvkkIntro')}</Text>

      <Title order={2} size="h4">
        {t('legal.kvkkSection1Title')}
      </Title>
      <Text>{t('legal.kvkkSection1Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.kvkkSection2Title')}
      </Title>
      <Text>{t('legal.kvkkSection2Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.kvkkSection3Title')}
      </Title>
      <Text>{t('legal.kvkkSection3Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.kvkkSection4Title')}
      </Title>
      <Text>{t('legal.kvkkSection4Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.kvkkSection5Title')}
      </Title>
      <Text>{t('legal.kvkkSection5Body')}</Text>

      <Title order={2} size="h4">
        {t('legal.kvkkSection6Title')}
      </Title>
      <Text>
        {t('legal.kvkkSection6Before')}
        <Anchor component={Link} href="/gizlilik-politikasi">
          {t('footer.privacyPolicy')}
        </Anchor>
        {t('legal.kvkkSection6Between')}
        <Anchor component={Link} href="/kullanim-sartlari">
          {t('footer.termsOfUse')}
        </Anchor>
        {t('legal.kvkkSection6After')}
      </Text>
    </LegalPageLayout>
  )
}
