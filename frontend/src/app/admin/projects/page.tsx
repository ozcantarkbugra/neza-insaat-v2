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
  Center,
  Loader,
  Text,
  Paper,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import { IconPencil, IconTrash, IconPlus, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
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
        const res = await api.get('/projects?limit=100&includeInactive=1')
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
    if (!confirm(t('admin.confirmDeleteProject'))) return
    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter((p) => p.id !== id))
    } catch (error) {
      alert(t('admin.deleteFailed'))
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const res = await api.patch(`/projects/${id}/toggle-active`)
      setProjects(projects.map((p) => (p.id === id ? { ...p, isActive: res.data.isActive } : p)))
    } catch (error) {
      alert(t('admin.operationFailed'))
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
        <Tooltip label={t('admin.newProject')}>
          <Button component={Link} href="/admin/projects/new" color="blue" leftSection={<IconPlus size={18} />}>
            {t('admin.newProject')}
          </Button>
        </Tooltip>
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
                <Table.Th>{t('admin.active')}</Table.Th>
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
                    <Tooltip label={project.isActive !== false ? t('admin.active') : t('admin.inactive')}>
                      <ActionIcon
                        variant="subtle"
                        color={project.isActive !== false ? 'green' : 'red'}
                        size="sm"
                        onClick={() => handleToggleActive(project.id)}
                      >
                        {project.isActive !== false ? <IconCircleCheck size={18} /> : <IconCircleX size={18} />}
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end" gap="xs">
                      <Tooltip label={t('admin.edit')}>
                        <ActionIcon component={Link} href={`/admin/projects/${project.id}`} variant="subtle" color="blue" size="sm" aria-label={t('admin.edit')}>
                          <IconPencil size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={t('admin.delete')}>
                        <ActionIcon variant="subtle" color="red" size="sm" onClick={() => handleDelete(project.id)}>
                          <IconTrash size={18} />
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
    </>
  )
}
