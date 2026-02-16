'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import {
  Title,
  Table,
  Badge,
  Group,
  Button,
  Center,
  Loader,
  Text,
  Paper,
  Select,
  Modal,
  TextInput,
  PasswordInput,
  Stack,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from '@/lib/i18n'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  isActive: boolean
}

export default function UsersPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false)
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'EDITOR',
  })
  const [editForm, setEditForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'EDITOR',
    password: '',
  })

  const roleOptionsWithT = [
    { value: 'SUPER_ADMIN', label: t('admin.superAdmin') },
    { value: 'ADMIN', label: t('admin.adminRole') },
    { value: 'EDITOR', label: t('admin.editor') },
  ]

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`)
      setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)))
    } catch (error) {
      alert(t('admin.operationFailed'))
    }
  }

  const handleChangeRole = async (id: string, role: string | null) => {
    if (!role) return
    try {
      await api.patch(`/admin/users/${id}/role`, { role })
      setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)))
    } catch (error) {
      alert(t('admin.operationFailed'))
    }
  }

  const handleOpenCreate = () => {
    setFormError('')
    setCreateForm({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', role: 'EDITOR' })
    openCreate()
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!createForm.email.trim()) {
      setFormError(t('admin.invalidEmail'))
      return
    }
    if (createForm.password.length < 8) {
      setFormError(t('admin.passwordMinHint'))
      return
    }
    if (createForm.password !== createForm.confirmPassword) {
      setFormError(t('admin.passwordsDoNotMatch'))
      return
    }
    setSubmitting(true)
    try {
      await api.post('/admin/users', {
        email: createForm.email.trim(),
        password: createForm.password,
        firstName: createForm.firstName.trim() || undefined,
        lastName: createForm.lastName.trim() || undefined,
        role: createForm.role,
      })
      closeCreate()
      fetchUsers()
    } catch (err: any) {
      setFormError(err.response?.data?.error || t('admin.operationFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setEditForm({
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      password: '',
    })
    setFormError('')
    openEdit()
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setFormError('')
    if (!editForm.email.trim()) {
      setFormError(t('admin.invalidEmail'))
      return
    }
    if (editForm.password.length > 0 && editForm.password.length < 8) {
      setFormError(t('admin.passwordMinHint'))
      return
    }
    setSubmitting(true)
    try {
      const body: { email: string; firstName?: string; lastName?: string; role: string; password?: string } = {
        email: editForm.email.trim(),
        firstName: editForm.firstName.trim() || undefined,
        lastName: editForm.lastName.trim() || undefined,
        role: editForm.role,
      }
      if (editForm.password) body.password = editForm.password
      await api.put(`/admin/users/${editingUser.id}`, body)
      closeEdit()
      setEditingUser(null)
      fetchUsers()
    } catch (err: any) {
      setFormError(err.response?.data?.error || t('admin.operationFailed'))
    } finally {
      setSubmitting(false)
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
        <Title order={2}>{t('admin.usersTitle')}</Title>
        <Button onClick={handleOpenCreate}>{t('admin.addNewAdmin')}</Button>
      </Group>

      {users.length === 0 ? (
        <Text c="dimmed">{t('admin.noUsers')}</Text>
      ) : (
        <Paper shadow="sm" radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('admin.email')}</Table.Th>
                <Table.Th>{t('admin.firstName')} / {t('admin.lastName')}</Table.Th>
                <Table.Th>{t('admin.role')}</Table.Th>
                <Table.Th>{t('admin.status')}</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>{t('admin.actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Text fw={500}>{user.email}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {[user.firstName, user.lastName].filter(Boolean).join(' ') || '-'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Select
                      size="xs"
                      w={140}
                      data={roleOptionsWithT}
                      value={user.role}
                      onChange={(v) => handleChangeRole(user.id, v)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Badge color={user.isActive ? 'green' : 'red'} variant="light">
                      {user.isActive ? t('admin.active') : t('admin.inactive')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group justify="flex-end" gap="xs">
                      <Button
                        variant="subtle"
                        size="compact-sm"
                        color="gray"
                        onClick={() => handleOpenEdit(user)}
                      >
                        {t('admin.editUser')}
                      </Button>
                      <Button
                        variant="subtle"
                        size="compact-sm"
                        color="blue"
                        onClick={() => handleToggleActive(user.id)}
                      >
                        {user.isActive ? t('admin.makeInactive') : t('admin.makeActive')}
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      <Modal opened={createOpened} onClose={closeCreate} title={t('admin.newUserModalTitle')} centered>
        <form onSubmit={handleCreateSubmit} autoComplete="off">
          <Stack gap="md">
            {formError && (
              <Text size="sm" c="red">
                {formError}
              </Text>
            )}
            <TextInput
              label={t('admin.email')}
              type="email"
              required
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="yeni@ornek.com"
              autoComplete="off"
            />
            <PasswordInput
              label={t('admin.password')}
              required
              minLength={8}
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              description={t('admin.passwordMinHint')}
              autoComplete="new-password"
            />
            <PasswordInput
              label={t('admin.confirmPassword')}
              required
              value={createForm.confirmPassword}
              onChange={(e) => setCreateForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              placeholder="••••••••"
              error={createForm.confirmPassword && createForm.password !== createForm.confirmPassword ? t('admin.passwordsDoNotMatch') : undefined}
              autoComplete="new-password"
            />
            <TextInput
              label={t('admin.firstName')}
              value={createForm.firstName}
              onChange={(e) => setCreateForm((f) => ({ ...f, firstName: e.target.value }))}
            />
            <TextInput
              label={t('admin.lastName')}
              value={createForm.lastName}
              onChange={(e) => setCreateForm((f) => ({ ...f, lastName: e.target.value }))}
            />
            <Select
              label={t('admin.role')}
              data={roleOptionsWithT}
              value={createForm.role}
              onChange={(v) => setCreateForm((f) => ({ ...f, role: v || 'EDITOR' }))}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={closeCreate}>
                {t('admin.cancel')}
              </Button>
              <Button type="submit" loading={submitting}>
                {t('admin.save')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={editOpened} onClose={() => { closeEdit(); setEditingUser(null) }} title={t('admin.editUserModalTitle')} centered>
        <form onSubmit={handleEditSubmit}>
          <Stack gap="md">
            {formError && (
              <Text size="sm" c="red">
                {formError}
              </Text>
            )}
            <TextInput
              label={t('admin.email')}
              type="email"
              required
              value={editForm.email}
              onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
            />
            <PasswordInput
              label={t('admin.password')}
              value={editForm.password}
              onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
              placeholder={t('admin.passwordEditPlaceholder')}
              description={t('admin.passwordOptionalHint')}
              autoComplete="new-password"
            />
            <TextInput
              label={t('admin.firstName')}
              value={editForm.firstName}
              onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
            />
            <TextInput
              label={t('admin.lastName')}
              value={editForm.lastName}
              onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
            />
            <Select
              label={t('admin.role')}
              data={roleOptionsWithT}
              value={editForm.role}
              onChange={(v) => setEditForm((f) => ({ ...f, role: v || 'EDITOR' }))}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => { closeEdit(); setEditingUser(null) }}>
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
