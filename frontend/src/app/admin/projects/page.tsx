'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Project } from '@/types'
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
  COMPLETED: 'green',
  IN_PROGRESS: 'blue',
  PLANNING: 'gray',
  ON_HOLD: 'yellow',
}

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const statusLabels: Record<string, string> = {
    COMPLETED: t('admin.statusCompleted'),
    IN_PROGRESS: t('admin.statusInProgress'),
    PLANNING: t('admin.statusPlanning'),
    ON_HOLD: t('admin.statusOnHold'),
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get('/projects?limit=100')
        const list = Array.isArray(res.data) ? res.data : (res.data?.projects ?? [])
        setProjects(list)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDeleteProject'))) {
      return
    }
    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter((p) => p.id !== id))
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
        <Title order={2}>{t('admin.projectsTitle')}</Title>
        <Button component={Link} href="/admin/projects/new" color="blue">
          {t('admin.newProject')}
        </Button>
      </Group>

      {projects.length === 0 ? (
        <Text c="dimmed">{t('admin.noProjects')}</Text>
      ) : (
        <Paper shadow="sm" radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('admin.title')}</Table.Th>
                <Table.Th>{t('admin.status')}</Table.Th>
                <Table.Th>{t('admin.location')}</Table.Th>
                <Table.Th>{t('admin.date')}</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>{t('admin.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {projects.map((project) => (
                <Table.Tr key={project.id}>
                  <Table.Td>
                    <Text fw={500}>{project.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={STATUS_COLORS[project.status] || 'gray'} variant="light">
                      {statusLabels[project.status] || project.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {project.location || '-'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {project.deliveryDate
                        ? new Date(project.deliveryDate).toLocaleDateString('tr-TR')
                        : project.startDate
                          ? new Date(project.startDate).toLocaleDateString('tr-TR')
                          : new Date(project.createdAt).toLocaleDateString('tr-TR')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end" gap="xs">
                      <Anchor component={Link} href={`/admin/projects/${project.id}`} size="sm">
                        {t('admin.edit')}
                      </Anchor>
                      <Button variant="subtle" color="red" size="compact-xs" onClick={() => handleDelete(project.id)}>
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
