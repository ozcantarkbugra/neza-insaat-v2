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
  Anchor,
  Center,
  Loader,
  Text,
  Paper,
} from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

export default function ServicesPage() {
  const { t } = useTranslation()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await api.get('/services')
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
        <Button component={Link} href="/admin/services/new" color="blue">
          {t('admin.newService')}
        </Button>
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
                    <Group justify="flex-end" gap="xs">
                      <Anchor component={Link} href={`/admin/services/${service.id}`} size="sm">
                        {t('admin.edit')}
                      </Anchor>
                      <Button
                        variant="subtle"
                        color="red"
                        size="compact-xs"
                        onClick={() => handleDelete(service.id)}
                      >
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
