'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Title, Text, SimpleGrid, Card, Center, Loader } from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

interface DashboardStats {
  projects: {
    total: number
    active: number
    completed: number
  }
  blogs: {
    total: number
    published: number
  }
  messages: {
    total: number
    unread: number
  }
  users: {
    total: number
  }
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/admin/dashboard')
        setStats(res.data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    )
  }

  if (!stats) {
    return (
      <Center py="xl">
        <Text c="dimmed">{t('admin.dataLoadFailed')}</Text>
      </Center>
    )
  }

  const cards = [
    { id: 'totalProjects', label: t('admin.totalProjects'), value: stats.projects.total, color: 'blue' as const, href: '/admin/projects' },
    { id: 'activeProjects', label: t('admin.activeProjects'), value: stats.projects.active, color: 'blue' as const, href: '/admin/projects' },
    { id: 'completedProjects', label: t('admin.completedProjects'), value: stats.projects.completed, color: 'green' as const, href: '/admin/projects' },
    { id: 'blogPosts', label: t('admin.blogPosts'), value: stats.blogs.total, color: 'violet' as const, href: '/admin/blogs' },
    { id: 'published', label: t('admin.published'), value: stats.blogs.published, color: 'violet' as const, href: '/admin/blogs' },
    { id: 'totalMessages', label: t('admin.totalMessages'), value: stats.messages.total, color: 'yellow' as const, href: '/admin/messages' },
    { id: 'unread', label: t('admin.unread'), value: stats.messages.unread, color: 'red' as const, href: '/admin/messages' },
    { id: 'usersCount', label: t('admin.usersCount'), value: stats.users.total, color: 'gray' as const, href: '/admin/users' },
  ]

  return (
    <>
      <Title order={2} mb="xl">
        {t('admin.dashboardTitle')}
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {cards.map((item) => (
          <Card
            key={item.id}
            component={Link}
            href={item.href}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ textDecoration: 'none' }}
            className="hover:opacity-90 transition-opacity"
          >
            <Text size="sm" c="dimmed" mb="xs">
              {item.label}
            </Text>
            <Title order={2} c={`${item.color}.6`}>
              {item.value}
            </Title>
          </Card>
        ))}
      </SimpleGrid>
    </>
  )
}
