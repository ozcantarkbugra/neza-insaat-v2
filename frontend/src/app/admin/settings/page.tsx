'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Title, TextInput, Paper, Stack, Group, Text, Center, Loader } from '@mantine/core'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/lib/toast'

interface Setting {
  id: string
  key: string
  value: string
  group: string | null
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

function isValidEmail(value: string): boolean {
  if (!value.trim()) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value.trim())
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get('/admin/settings')
        setSettings(res.data || [])
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleBlur = (setting: Setting, value: string) => {
    if (value === setting.value) {
      setErrors((e) => ({ ...e, [setting.key]: '' }))
      return
    }
    if (setting.key === 'contact_phone') {
      if (!isValidPhone(value)) {
        setErrors((e) => ({ ...e, [setting.key]: t('admin.invalidPhone') }))
        return
      }
    }
    if (setting.key === 'contact_email') {
      if (!isValidEmail(value)) {
        setErrors((e) => ({ ...e, [setting.key]: t('admin.invalidEmail') }))
        return
      }
    }
    setErrors((e) => ({ ...e, [setting.key]: '' }))
    handleSave(setting.key, value)
  }

  const handleSave = async (key: string, value: string) => {
    setSaving(key)
    try {
      await api.put(`/admin/settings/${key}`, { value })
      setSettings(settings.map((s) => (s.key === key ? { ...s, value } : s)))
    } catch (error) {
      toast.error(t('admin.settingsSaveFailed'))
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    )
  }

  const groupedSettings = settings.reduce(
    (acc, setting) => {
      const group = setting.group || 'other'
      if (!acc[group]) acc[group] = []
      acc[group].push(setting)
      return acc
    },
    {} as Record<string, Setting[]>
  )

  const getGroupLabel = (group: string) => {
    const key = `admin.settingsGroup${group.charAt(0).toUpperCase() + group.slice(1)}`
    const translated = t(key)
    return translated !== key ? translated : group
  }

  const getKeyLabel = (key: string) => {
    const map: Record<string, string> = {
      contact_email: 'admin.settingsKeyContactEmail',
      contact_phone: 'admin.settingsKeyContactPhone',
      contact_address: 'admin.settingsKeyContactAddress',
      facebook_url: 'admin.settingsKeyFacebookUrl',
      instagram_url: 'admin.settingsKeyInstagramUrl',
      linkedin_url: 'admin.settingsKeyLinkedinUrl',
      twitter_url: 'admin.settingsKeyTwitterUrl',
      google_maps_api_key: 'admin.settingsKeyGoogleMapsApiKey',
      site_name: 'admin.settingsKeySiteName',
      site_description: 'admin.settingsKeySiteDescription',
    }
    const tKey = map[key] || key
    const translated = t(tKey)
    return translated !== tKey ? translated : key
  }

  return (
    <>
      <Title order={2} mb="xl">
        {t('admin.settingsTitle')}
      </Title>

      <Stack gap="lg">
        {Object.entries(groupedSettings).map(([group, groupSettings]) => (
          <Paper key={group} shadow="sm" p="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              {getGroupLabel(group)}
            </Title>
            <Stack gap="md">
              {groupSettings.map((setting) => (
                <Stack key={setting.id} gap={4}>
                  <Group align="flex-end" wrap="nowrap">
                    <TextInput
                      label={getKeyLabel(setting.key)}
                      style={{ flex: 1 }}
                      type={setting.key === 'contact_phone' ? 'tel' : setting.key === 'contact_email' ? 'email' : 'text'}
                      placeholder={setting.key === 'contact_phone' ? '+90 530 924 20 75' : undefined}
                      defaultValue={setting.value}
                      error={errors[setting.key]}
                      onBlur={(e) => handleBlur(setting, e.target.value)}
                    />
                    {saving === setting.key && (
                      <Text size="sm" c="dimmed">
                        {t('admin.settingsSaving')}
                      </Text>
                    )}
                  </Group>
                  </Stack>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </>
  )
}
