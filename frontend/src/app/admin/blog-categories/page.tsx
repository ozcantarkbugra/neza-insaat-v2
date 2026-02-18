'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import {
  Title,
  Button,
  Table,
  Group,
  Center,
  Loader,
  Text,
  Paper,
  ActionIcon,
  Tooltip,
  Modal,
  TextInput,
  Textarea,
  Stack,
} from '@mantine/core'
import { IconPencil, IconPlus, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/lib/toast'

interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function BlogCategoriesPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpened, setModalOpened] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/blog-categories?includeInactive=1')
      setCategories(res.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '' })
    setFormError('')
    setModalOpened(true)
  }

  const handleOpenEdit = (cat: BlogCategory) => {
    setEditingId(cat.id)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    })
    setFormError('')
    setModalOpened(true)
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slugify(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!formData.name.trim()) {
      setFormError(t('admin.invalidName'))
      return
    }
    if (!formData.slug.trim()) {
      setFormError(t('admin.slugRequired'))
      return
    }
    setSubmitting(true)
    try {
      if (editingId) {
        await api.put(`/admin/blog-categories/${editingId}`, {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || undefined,
        })
      } else {
        await api.post('/admin/blog-categories', {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || undefined,
        })
      }
      setModalOpened(false)
      toast.success(editingId ? t('admin.saved') : t('admin.categoryCreated'))
      fetchCategories()
    } catch (err: any) {
      setFormError(err.response?.data?.error || t('admin.operationFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const res = await api.patch(`/admin/blog-categories/${id}/toggle-active`)
      setCategories(categories.map((c) => (c.id === id ? { ...c, isActive: res.data.isActive } : c)))
    } catch (error) {
      toast.error(t('admin.operationFailed'))
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
      <Group justify="space-between" mb="xl">
        <Title order={2}>{t('admin.blogCategoriesTitle')}</Title>
        <Tooltip label={t('admin.newCategory')}>
          <Button color="blue" leftSection={<IconPlus size={18} />} onClick={handleOpenCreate}>
            {t('admin.newCategory')}
          </Button>
        </Tooltip>
      </Group>

      {categories.length === 0 ? (
        <Text c="dimmed">{t('admin.noCategories')}</Text>
      ) : (
        <Paper shadow="sm" radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('admin.title')}</Table.Th>
                <Table.Th>{t('admin.slug')}</Table.Th>
                <Table.Th>{t('admin.active')}</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>{t('admin.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories.map((cat) => (
                <Table.Tr key={cat.id}>
                  <Table.Td>
                    <Text fw={500}>{cat.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {cat.slug}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={cat.isActive ? t('admin.active') : t('admin.inactive')}>
                      <ActionIcon
                        variant="subtle"
                        color={cat.isActive ? 'green' : 'red'}
                        size="sm"
                        onClick={() => handleToggleActive(cat.id)}
                      >
                        {cat.isActive ? <IconCircleCheck size={18} /> : <IconCircleX size={18} />}
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end" gap="xs">
                      <Tooltip label={t('admin.edit')}>
                        <ActionIcon variant="subtle" color="blue" size="sm" onClick={() => handleOpenEdit(cat)}>
                          <IconPencil size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingId ? t('admin.editCategoryForm') : t('admin.newCategoryForm')}
        centered
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {formError && (
              <Text size="sm" c="red">
                {formError}
              </Text>
            )}
            <TextInput
              label={t('admin.title')}
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Haberler"
            />
            <TextInput
              label={t('admin.slug')}
              required
              value={formData.slug}
              onChange={(e) => setFormData((f) => ({ ...f, slug: e.target.value }))}
              placeholder="haberler"
              description={t('admin.slugDescription')}
            />
            <Textarea
              label={t('admin.description')}
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              placeholder={t('admin.descriptionOptional')}
              minRows={2}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                {t('admin.cancel')}
              </Button>
              <Button type="submit" loading={submitting}>
                {t('admin.save')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  )
}
