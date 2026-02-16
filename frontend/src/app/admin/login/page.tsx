'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { login } from '@/store/slices/authSlice'
import {
  Center,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

export default function AdminLoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const theme = useMantineTheme()
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await dispatch(login(formData)).unwrap()
      if (result) {
        router.push('/admin/dashboard')
      }
    } catch (err) {
      // Error handled by Redux
    }
  }

  return (
    <Center
      style={{
        minHeight: '100%',
        width: '100%',
        padding: 24,
      }}
    >
      <Paper shadow="md" radius="md" p="xl" maw={400} w="100%" withBorder>
        <Title order={2} ta="center" mb="xl">
          {t('admin.adminLogin')}
        </Title>

        {error && (
          <Alert color="red" mb="md" title={t('admin.error')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label={t('admin.email')}
              type="email"
              required
              placeholder={t('admin.placeholderEmail')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <PasswordInput
              label={t('admin.password')}
              required
              placeholder={t('admin.placeholderPassword')}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button type="submit" fullWidth loading={loading} color="blue" size="md">
              {loading ? t('admin.loggingIn') : t('admin.login')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  )
}
