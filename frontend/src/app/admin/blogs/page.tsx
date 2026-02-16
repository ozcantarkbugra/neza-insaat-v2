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
  Anchor,
  Center,
  Loader,
  Text,
  Paper,
} from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'green',
  DRAFT: 'gray',
  ARCHIVED: 'yellow',
}

export default function BlogsPage() {
  const { t } = useTranslation()
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
        const res = await api.get('/blogs')
        setBlogs(res.data.blogs || [])
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDeleteBlog'))) return
    try {
      await api.delete(`/blogs/${id}`)
      setBlogs(blogs.filter((b) => b.id !== id))
    } catch (error) {
      alert(t('admin.deleteFailed'))
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
        <Button component={Link} href="/admin/blogs/new" color="blue">
          {t('admin.newBlog')}
        </Button>
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
                <Table.Th style={{ textAlign: 'right' }}>{t('admin.actions')}</Table.Th>
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
                  <Table.Td>
                    <Group justify="flex-end" gap="xs">
                      <Anchor component={Link} href={`/admin/blogs/${blog.id}`} size="sm">
                        {t('admin.edit')}
                      </Anchor>
                      <Button variant="subtle" color="red" size="compact-xs" onClick={() => handleDelete(blog.id)}>
                        {t('admin.delete')}
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </>
  )
}
