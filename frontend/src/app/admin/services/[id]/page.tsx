'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'
import { Service } from '@/types'
import {
  Title,
  Paper,
  TextInput,
  Textarea,
  NumberInput,
  Checkbox,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Center,
  Loader,
} from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

export default function ServiceEditPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useTranslation()
  const serviceId = params.id as string
  const isNew = serviceId === 'new'

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    shortDescription: '',
    shortDescriptionEn: '',
    icon: '',
    image: '',
    featured: false,
    order: 0,
    metaTitle: '',
    metaDescription: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      setLoading(true)
      async function fetchService() {
        try {
          const res = await api.get(`/services/${serviceId}`)
          const service = res.data
          setFormData({
            title: service.title || '',
            titleEn: service.titleEn || '',
            slug: service.slug || '',
            description: service.description || '',
            descriptionEn: service.descriptionEn || '',
            shortDescription: service.shortDescription || '',
            shortDescriptionEn: service.shortDescriptionEn || '',
            icon: service.icon || '',
            image: service.image || '',
            featured: service.featured || false,
            order: service.order ?? 0,
            metaTitle: service.metaTitle || '',
            metaDescription: service.metaDescription || '',
          })
        } catch (error) {
          console.error('Failed to fetch service:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchService()
    } else {
      setLoading(false)
    }
  }, [serviceId, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...formData,
        image: formData.image?.startsWith('http') ? formData.image : formData.image || undefined,
      }
      if (isNew) {
        await api.post('/services', data)
      } else {
        await api.put(`/services/${serviceId}`, data)
      }
      router.push('/admin/services')
    } catch (error: any) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors) ? error.response.data.errors.join(', ') : t('admin.saveFailed'))
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    )
  }

  return (
    <>
      <Title order={2} mb="xl">
        {isNew ? t('admin.newServiceForm') : t('admin.editServiceForm')}
      </Title>

      <Paper shadow="sm" radius="md" p="lg" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <TextInput
                label={`${t('admin.title')} (TR)`}
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextInput
                label={`${t('admin.title')} (EN)`}
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="Title (English)"
              />
            </SimpleGrid>
            <TextInput
              label={t('admin.slug')}
              required
              description={t('admin.slugDescription')}
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />

            <Textarea
              label={`${t('admin.description')} (TR)`}
              required
              minRows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Textarea
              label={`${t('admin.description')} (EN)`}
              minRows={6}
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              placeholder="Description (English)"
            />
            <Textarea
              label={`${t('admin.shortDescription')} (TR)`}
              minRows={3}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
            <Textarea
              label={`${t('admin.shortDescription')} (EN)`}
              minRows={3}
              value={formData.shortDescriptionEn}
              onChange={(e) => setFormData({ ...formData, shortDescriptionEn: e.target.value })}
              placeholder="Short description (English)"
            />

            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <TextInput
                label={t('admin.icon')}
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Icon class veya emoji"
              />
              <TextInput
                label={t('admin.image')}
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
              <NumberInput
                label={t('admin.order')}
                value={formData.order}
                onChange={(v) => setFormData({ ...formData, order: typeof v === 'number' ? v : 0 })}
                min={0}
              />
            </SimpleGrid>

            <Checkbox
              label={t('admin.featured')}
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />

            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <TextInput
                label={t('admin.metaTitle')}
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              />
              <TextInput
                label={t('admin.metaDescription')}
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              />
            </SimpleGrid>

            <Group>
              <Button type="submit" loading={saving} color="blue">
                {saving ? t('admin.saving') : t('admin.save')}
              </Button>
              <Button variant="default" onClick={() => router.back()}>
                {t('admin.cancel')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  )
}
