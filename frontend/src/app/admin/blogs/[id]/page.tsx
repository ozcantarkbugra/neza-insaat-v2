'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'
import { Blog, BlogCategory } from '@/types'
import {
  Title,
  Paper,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Center,
  Loader,
} from '@mantine/core'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/lib/toast'

export default function BlogEditPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useTranslation()
  const blogId = params.id as string
  const isNew = blogId === 'new'

  const statusOptions = [
    { value: 'DRAFT', label: t('admin.statusDraft') },
    { value: 'PUBLISHED', label: t('admin.statusPublished') },
    { value: 'ARCHIVED', label: t('admin.statusArchived') },
  ]

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
    content: '',
    contentEn: '',
    excerpt: '',
    excerptEn: '',
    featuredImage: '',
    status: 'DRAFT' as Blog['status'],
    featured: false,
    metaTitle: '',
    metaDescription: '',
    categoryId: '',
  })
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/admin/blog-categories')
        setCategories(res.data || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()

    if (!isNew) {
      setLoading(true)
      async function fetchBlog() {
        try {
          const res = await api.get(`/blogs/${blogId}`)
          const blog = res.data
          setFormData({
            title: blog.title || '',
            titleEn: blog.titleEn || '',
            slug: blog.slug || '',
            content: blog.content || '',
            contentEn: blog.contentEn || '',
            excerpt: blog.excerpt || '',
            excerptEn: blog.excerptEn || '',
            featuredImage: blog.featuredImage || '',
            status: blog.status || 'DRAFT',
            featured: blog.featured || false,
            metaTitle: blog.metaTitle || '',
            metaDescription: blog.metaDescription || '',
            categoryId: blog.categoryId || '',
          })
        } catch (error) {
          console.error('Failed to fetch blog:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchBlog()
    } else {
      setLoading(false)
    }
  }, [blogId, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...formData,
        categoryId: formData.categoryId || undefined,
        featuredImage: formData.featuredImage?.startsWith('http') ? formData.featuredImage : undefined,
      }
      if (isNew) {
        await api.post('/blogs', data)
      } else {
        await api.put(`/blogs/${blogId}`, data)
      }
      router.push('/admin/blogs')
    } catch (error: any) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors) ? error.response.data.errors.join(', ') : t('admin.saveFailed'))
      toast.error(msg)
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
        {isNew ? t('admin.newBlogForm') : t('admin.editBlogForm')}
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

            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Textarea
                label={`${t('admin.content')} (TR)`}
                required
                minRows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <Textarea
                label={`${t('admin.content')} (EN)`}
                minRows={12}
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                placeholder="Content (English)"
              />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Textarea
                label={`${t('admin.excerpt')} (TR)`}
                minRows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
              <Textarea
                label={`${t('admin.excerpt')} (EN)`}
                minRows={3}
                value={formData.excerptEn}
                onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                placeholder="Excerpt (English)"
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Select
                label={t('admin.status')}
                data={statusOptions}
                value={formData.status}
                onChange={(v) => setFormData({ ...formData, status: (v as Blog['status']) || 'DRAFT' })}
              />
              <Select
                label={t('admin.category')}
                placeholder={t('admin.selectCategory')}
                value={formData.categoryId || null}
                onChange={(v) => setFormData({ ...formData, categoryId: v || '' })}
                data={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
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
              placeholder="https://..."
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
