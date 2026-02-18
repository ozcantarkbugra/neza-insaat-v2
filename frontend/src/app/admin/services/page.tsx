'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Service } from '@/types'
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

export default function ServicesPage() {
  const { t } = useTranslation()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await api.get('/services?includeInactive=1')
        setServices(res.data || [])
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDeleteService'))) return
    try {
      await api.delete(`/services/${id}`)
      setServices(services.filter((s) => s.id !== id))
    } catch (error) {
      alert(t('admin.deleteFailed'))
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const res = await api.patch(`/services/${id}/toggle-active`)
      setServices(services.map((s) => (s.id === id ? { ...s, isActive: res.data.isActive } : s)))
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
        <Title order={2}>{t('admin.servicesTitle')}</Title>
        <Tooltip label={t('admin.newService')}>
          <Button component={Link} href="/admin/services/new" color="blue" leftSection={<IconPlus size={18} />}>
            {t('admin.newService')}
          </Button>
        </Tooltip>
      </Group>

      {services.length === 0 ? (
        <Text c="dimmed">{t('admin.noServices')}</Text>
      ) : (
        <Paper shadow="sm" radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('admin.title')}</Table.Th>
                <Table.Th>{t('admin.order')}</Table.Th>
                <Table.Th>{t('admin.featured')}</Table.Th>
                <Table.Th>{t('admin.active')}</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>{t('admin.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {services.map((service) => (
                <Table.Tr key={service.id}>
                  <Table.Td>
                    <Text fw={500}>{service.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {service.order}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={service.featured ? 'green' : 'gray'} variant="light">
                      {service.featured ? t('admin.yes') : t('admin.no')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={service.isActive !== false ? t('admin.active') : t('admin.inactive')}>
                      <ActionIcon
                        variant="subtle"
                        color={service.isActive !== false ? 'green' : 'red'}
                        size="sm"
                        onClick={() => handleToggleActive(service.id)}
                      >
                        {service.isActive !== false ? <IconCircleCheck size={18} /> : <IconCircleX size={18} />}
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end" gap="xs">
                      <Tooltip label={t('admin.edit')}>
                        <ActionIcon component={Link} href={`/admin/services/${service.id}`} variant="subtle" color="blue" size="sm" aria-label={t('admin.edit')}>
                          <IconPencil size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={t('admin.delete')}>
                        <ActionIcon variant="subtle" color="red" size="sm" onClick={() => handleDelete(service.id)}>
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
