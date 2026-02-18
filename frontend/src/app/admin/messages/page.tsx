'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { ContactMessage } from '@/types'
import {
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Button,
  Center,
  Loader,
  Box,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useTranslation } from '@/lib/i18n'

export default function MessagesPage() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await api.get('/contact')
        setMessages(res.data.messages ?? res.data ?? [])
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/read`)
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)))
    } catch (error) {
      alert(t('admin.operationFailed'))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirmDeleteMessage'))) return
    try {
      await api.delete(`/contact/${id}`)
      setMessages(messages.filter((m) => m.id !== id))
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
      <Title order={2} mb="xl">
        {t('admin.messagesTitle')}
      </Title>

      {messages.length === 0 ? (
        <Text c="dimmed">{t('admin.noMessages')}</Text>
      ) : (
        <Stack gap="md">
          {messages.map((message) => (
            <Paper
              key={message.id}
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
              style={{
                borderLeft: message.read ? undefined : '4px solid var(--mantine-color-blue-6)',
              }}
            >
              <Group justify="space-between" align="flex-start" mb="sm">
                <Box>
                  <Text fw={600} size="lg">
                    {message.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {message.email}
                  </Text>
                  {message.phone && (
                    <Text size="sm" c="dimmed">
                      {message.phone}
                    </Text>
                  )}
                </Box>
                <Text size="sm" c="dimmed">
                  {new Date(message.createdAt).toLocaleString('tr-TR')}
                </Text>
              </Group>
              {message.subject && (
                <Text fw={500} mb="xs">
                  {t('admin.subjectLabel')}: {message.subject}
                </Text>
              )}
              <Text size="sm" c="dimmed" mb="md" style={{ whiteSpace: 'pre-wrap' }}>
                {message.message}
              </Text>
              <Group gap="xs">
                {!message.read && (
                  <Button size="sm" color="blue" variant="light" onClick={() => handleMarkAsRead(message.id)}>
                    {t('admin.markAsRead')}
                  </Button>
                )}
                <Tooltip label={t('admin.delete')}>
                  <ActionIcon color="red" variant="light" size="lg" onClick={() => handleDelete(message.id)}>
                    <IconTrash size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </>
  )
}
