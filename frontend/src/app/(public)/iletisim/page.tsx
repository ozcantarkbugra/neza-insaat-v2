'use client'

import { useState } from 'react'
import api from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { Container, Title, Text, TextInput, Textarea, Button, Stack, Alert } from '@mantine/core'
import PhoneInput, { isValidPhoneNumber } from '@/components/ui/PhoneInput'

function isValidEmail(value: string): boolean {
  if (!value.trim()) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value.trim())
}

export default function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setEmailError('')
    setPhoneError('')
    if (!isValidEmail(formData.email)) {
      setEmailError(t('contact.invalidEmail'))
      return
    }
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      setPhoneError(t('contact.invalidPhone'))
      return
    }
    setLoading(true)

    try {
      await api.post('/contact', formData)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (err: any) {
      setError(err.response?.data?.error || t('contact.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Title order={1}>{t('contact.title')}</Title>
        <Text c="dimmed">{t('contact.subtitle')}</Text>

        {success && (
          <Alert color="green" title={t('contact.success')} />
        )}

        {error && (
          <Alert color="red" title={error} />
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label={t('contact.name')}
              required
              placeholder={t('contact.placeholderName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextInput
              label={t('contact.email')}
              type="email"
              required
              placeholder={t('contact.placeholderEmail')}
              value={formData.email}
              error={emailError}
              onBlur={() => {
                if (formData.email && !isValidEmail(formData.email)) {
                  setEmailError(t('contact.invalidEmail'))
                } else {
                  setEmailError('')
                }
              }}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (emailError) setEmailError('')
              }}
            />
            <PhoneInput
              label={t('contact.phone')}
              placeholder={t('contact.placeholderPhone')}
              value={formData.phone}
              error={phoneError}
              onBlur={() => {
                if (formData.phone && !isValidPhoneNumber(formData.phone)) {
                  setPhoneError(t('contact.invalidPhone'))
                } else {
                  setPhoneError('')
                }
              }}
              onChange={(value) => {
                setFormData({ ...formData, phone: value || '' })
                if (phoneError) setPhoneError('')
              }}
            />
            <TextInput
              label={t('contact.subject')}
              placeholder={t('contact.placeholderSubject')}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
            <Textarea
              label={t('contact.message')}
              required
              minRows={6}
              placeholder={t('contact.placeholderMessage')}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <Button type="submit" loading={loading} color="blue" fullWidth>
              {loading ? t('contact.sending') : t('contact.send')}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}
