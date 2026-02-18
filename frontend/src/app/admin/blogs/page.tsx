'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Blog } from '@/types'
import {
  Title,
  Button,
  Table,
  Badge,
  Group,
  Center,
  Loader,
  Text,
  Paper,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import { IconPencil, IconPlus, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/lib/toast'
import { useAppSelector } from '@/hooks/useAppSelector'
import { canManageBlogs, canPublishBlogs } from '@/lib/roles'

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'green',
  DRAFT: 'gray',
  ARCHIVED: 'yellow',
}

export default function BlogsPage() {
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)
  const canEdit = canManageBlogs(user?.role)
  const canPublish = canPublishBlogs(user?.role)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  const statusLabels: Record<string, string> = {
    PUBLISHED: t('admin.statusPublished'),
    DRAFT: t('admin.statusDraft'),
    ARCHIVED: t('admin.statusArchived'),
  }

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await api.get('/blogs?includeInactive=1')
        setBlogs(res.data.blogs || [])
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const handleToggleActive = async (id: string) => {
    try {
      const res = await api.patch(`/blogs/${id}/toggle-active`)
      setBlogs(blogs.map((b) => (b.id === id ? { ...b, isActive: res.data.isActive } : b)))
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
        <Title order={2}>{t('admin.blogTitle')}</Title>
        {canEdit && (
          <Tooltip label={t('admin.newBlog')}>
            <Button component={Link} href="/admin/blogs/new" color="blue" leftSection={<IconPlus size={18} />}>
              {t('admin.newBlog')}
            </Button>
          </Tooltip>
        )}
      </Group>

      {blogs.length === 0 ? (
        <Text c="dimmed">{t('admin.noBlogs')}</Text>
      ) : (
        <Paper shadow="sm" radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('admin.title')}</Table.Th>
                <Table.Th>{t('admin.status')}</Table.Th>
                <Table.Th>{t('admin.category')}</Table.Th>
                <Table.Th>{t('admin.views')}</Table.Th>
                <Table.Th>{t('admin.date')}</Table.Th>
                {canPublish && <Table.Th>{t('admin.active')}</Table.Th>}
                {canEdit && <Table.Th style={{ textAlign: 'right' }}>{t('admin.actions')}</Table.Th>}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {blogs.map((blog) => (
                <Table.Tr key={blog.id}>
                  <Table.Td>
                    <Text fw={500}>{blog.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={STATUS_COLORS[blog.status] || 'gray'} variant="light">
                      {statusLabels[blog.status] || blog.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {(blog as Blog & { category?: { name: string } }).category?.name || '-'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {blog.views}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                    </Text>
                  </Table.Td>
                  {canPublish && (
                    <Table.Td>
                      <Tooltip label={blog.isActive !== false ? t('admin.active') : t('admin.inactive')}>
                        <ActionIcon
                          variant="subtle"
                          color={blog.isActive !== false ? 'green' : 'red'}
                          size="sm"
                          onClick={() => handleToggleActive(blog.id)}
                        >
                          {blog.isActive !== false ? <IconCircleCheck size={18} /> : <IconCircleX size={18} />}
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  )}
                  {canEdit && (
                    <Table.Td>
                      <Group justify="flex-end" gap="xs">
                        <Tooltip label={t('admin.edit')}>
                          <ActionIcon component={Link} href={`/admin/blogs/${blog.id}`} variant="subtle" color="blue" size="sm" aria-label={t('admin.edit')}>
                            <IconPencil size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </>
  )
}
