'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'
import { Project } from '@/types'
import {
  Title,
  Paper,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Checkbox,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Center,
  Loader,
  Text,
  Box,
  Image,
  Radio,
  ActionIcon,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/lib/toast'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5002'

function toYyyyMmDd(d: Date | string | null | undefined): string {
  if (!d) return ''
  if (d instanceof Date && !Number.isNaN(d.getTime())) return d.toISOString().split('T')[0]
  if (typeof d === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10)
    const parts = d.split(/[.\-/]/)
    if (parts.length === 3) {
      const [a, b, c] = parts
      if (a.length === 4) return `${a}-${b.padStart(2, '0')}-${c.padStart(2, '0')}`
      return `${c}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`
    }
  }
  return ''
}

export default function ProjectEditPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useTranslation()
  const projectId = params.id as string
  const isNew = projectId === 'new'
  const fileInputRef = useRef<HTMLInputElement>(null)

  const statusOptions = [
    { value: 'PLANNING', label: t('admin.statusPlanning') },
    { value: 'IN_PROGRESS', label: t('admin.statusInProgress') },
    { value: 'COMPLETED', label: t('admin.statusCompleted') },
    { value: 'ON_HOLD', label: t('admin.statusOnHold') },
  ]

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    shortDescription: '',
    shortDescriptionEn: '',
    status: 'PLANNING' as Project['status'],
    area: '',
    location: '',
    latitude: '',
    longitude: '',
    deliveryDate: '',
    startDate: '',
    featured: false,
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    serviceId: '',
    imageUrls: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isNew) {
      setLoading(true)
      async function fetchProject() {
        try {
          const res = await api.get(`/projects/${projectId}`)
          const project = res.data
          setFormData({
            title: project.title || '',
            titleEn: project.titleEn || '',
            slug: project.slug || '',
            description: project.description || '',
            descriptionEn: project.descriptionEn || '',
            shortDescription: project.shortDescription || '',
            shortDescriptionEn: project.shortDescriptionEn || '',
            status: project.status || 'PLANNING',
            area: project.area?.toString() || '',
            location: project.location || '',
            latitude: project.latitude?.toString() || '',
            longitude: project.longitude?.toString() || '',
            deliveryDate: project.deliveryDate ? new Date(project.deliveryDate).toISOString().split('T')[0] : '',
            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
            featured: project.featured || false,
            featuredImage: project.featuredImage || '',
            metaTitle: project.metaTitle || '',
            metaDescription: project.metaDescription || '',
            serviceId: project.serviceId || '',
            imageUrls: project.images?.map((img: { url: string }) => img.url) || [],
          })
        } catch (error) {
          console.error('Failed to fetch project:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchProject()
    } else {
      setLoading(false)
    }
  }, [projectId, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const toIsoDate = (d: string) => (d ? `${d}T00:00:00.000Z` : undefined)
      const data: Record<string, unknown> = {
        title: formData.title,
        titleEn: formData.titleEn || undefined,
        slug: formData.slug,
        description: formData.description,
        descriptionEn: formData.descriptionEn || undefined,
        shortDescription: formData.shortDescription || undefined,
        shortDescriptionEn: formData.shortDescriptionEn || undefined,
        status: formData.status,
        area: formData.area ? parseFloat(formData.area) : undefined,
        location: formData.location || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        deliveryDate: toIsoDate(formData.deliveryDate),
        startDate: toIsoDate(formData.startDate),
        featured: formData.featured,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        serviceId: formData.serviceId || undefined,
        imageUrls: formData.imageUrls.length > 0 ? formData.imageUrls : undefined,
      }
      if (formData.featuredImage && formData.featuredImage.startsWith('http')) {
        data.featuredImage = formData.featuredImage
      }
      if (isNew) {
        await api.post('/projects', data)
      } else {
        await api.put(`/projects/${projectId}`, data)
      }
      router.push('/admin/projects')
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || (Array.isArray(error.response?.data?.errors) ? error.response.data.errors.join(', ') : t('admin.saveFailed'))
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.warning(t('admin.selectImageFile'))
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post<{ url: string }>('/admin/media/upload', fd)
      const url = res.data?.url
      if (url) {
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, url],
          featuredImage: prev.featuredImage || url,
        }))
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || t('admin.uploadFailed'))
    } finally {
      setUploading(false)
      e.target.value = ''
      fileInputRef.current?.form?.reset()
    }
  }

  const removeImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((u) => u !== url),
      featuredImage:
        prev.featuredImage === url
          ? (prev.imageUrls[0] === url ? prev.imageUrls[1] : prev.imageUrls[0]) || ''
          : prev.featuredImage,
    }))
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
        {isNew ? t('admin.newProjectForm') : t('admin.editProjectForm')}
      </Title>

      <Paper shadow="sm" radius="md" p="lg" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <TextInput
                label={t('admin.title')}
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextInput
                label={t('admin.titleEn')}
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="Project title in English"
              />
              <TextInput
                label={t('admin.slug')}
                required
                description={t('admin.slugDescription')}
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </SimpleGrid>

            <Textarea
              label={t('admin.description')}
              required
              minRows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Textarea
              label={t('admin.descriptionEn')}
              minRows={6}
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              placeholder="Project description in English"
            />
            <Textarea
              label={t('admin.shortDescription')}
              minRows={3}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
            <Textarea
              label={t('admin.shortDescriptionEn')}
              minRows={3}
              value={formData.shortDescriptionEn}
              onChange={(e) => setFormData({ ...formData, shortDescriptionEn: e.target.value })}
              placeholder="Short description in English"
            />

            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Select
                label={t('admin.status')}
                data={statusOptions}
                value={formData.status}
                onChange={(v) => setFormData({ ...formData, status: (v as Project['status']) || 'PLANNING' })}
              />
              <NumberInput
                label={t('admin.area')}
                value={formData.area ? parseFloat(formData.area) : undefined}
                onChange={(v) => setFormData({ ...formData, area: v?.toString() ?? '' })}
              />
              <TextInput
                label={t('admin.location')}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <NumberInput
                label={t('admin.latitude')}
                decimalScale={6}
                value={formData.latitude ? parseFloat(formData.latitude) : undefined}
                onChange={(v) => setFormData({ ...formData, latitude: v?.toString() ?? '' })}
              />
              <NumberInput
                label={t('admin.longitude')}
                decimalScale={6}
                value={formData.longitude ? parseFloat(formData.longitude) : undefined}
                onChange={(v) => setFormData({ ...formData, longitude: v?.toString() ?? '' })}
              />
              <DateInput
                label={t('admin.startDate')}
                value={formData.startDate ? new Date(formData.startDate + 'T00:00:00') : null}
                onChange={(d) => setFormData((prev) => ({ ...prev, startDate: toYyyyMmDd(d ?? null) }))}
                placeholder="gg.aa.yyyy"
                valueFormat="DD.MM.YYYY"
                clearable
              />
              <DateInput
                label={t('admin.deliveryDate')}
                value={formData.deliveryDate ? new Date(formData.deliveryDate + 'T00:00:00') : null}
                onChange={(d) => setFormData((prev) => ({ ...prev, deliveryDate: toYyyyMmDd(d ?? null) }))}
                placeholder="gg.aa.yyyy"
                valueFormat="DD.MM.YYYY"
                clearable
              />
            </SimpleGrid>

            <Checkbox
              label={t('admin.featured')}
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />

            <TextInput
              label={t('admin.featuredImageUrl')}
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              placeholder="Veya yüklediğiniz görsellerden birini seçin"
            />

            <Box>
              <Text size="sm" fw={500} mb="xs">
                {t('admin.projectImages')}
              </Text>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
                aria-hidden
              />
              <Button
                type="button"
                variant="light"
                size="sm"
                loading={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? t('admin.loading') : t('admin.selectFile')}
              </Button>
              {formData.imageUrls.length > 0 && (
                <Text size="xs" c="dimmed" mt="xs">
                  {formData.imageUrls.length} {t('admin.imagesAdded')}
                </Text>
              )}
              {formData.imageUrls.length > 0 && (
                <Radio.Group
                  label={t('admin.featuredImage')}
                  value={formData.featuredImage}
                  onChange={(v) => setFormData((prev) => ({ ...prev, featuredImage: v }))}
                  mt="md"
                >
                  <Group mt="xs" gap="md">
                    {formData.imageUrls.map((url) => (
                      <Box key={url} pos="relative">
                        <Box
                          style={{
                            width: 96,
                            height: 96,
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: '1px solid var(--mantine-color-default-border)',
                          }}
                        >
                          <Image
                            src={url.startsWith('http') ? url : `${API_BASE}${url}`}
                            alt=""
                            fit="cover"
                            w={96}
                            h={96}
                          />
                        </Box>
                        <Radio value={url} label={t('admin.featured')} size="xs" mt={4} />
                        <ActionIcon
                          color="red"
                          size="sm"
                          variant="filled"
                          pos="absolute"
                          top={0}
                          right={0}
                          onClick={() => removeImage(url)}
                        >
                          ×
                        </ActionIcon>
                      </Box>
                    ))}
                  </Group>
                </Radio.Group>
              )}
            </Box>

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
