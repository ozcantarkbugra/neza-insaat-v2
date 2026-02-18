'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Center,
  Stack,
  Box,
} from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import Image from 'next/image'
import api from '@/lib/api'
import { Blog } from '@/types'
import { normalizeImageUrl, shouldUnoptimizeImage } from '@/utils/imageUtils'
import { useTranslation } from '@/lib/i18n'

export default function BlogDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = use(props.params)
  const { t, locale } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const dateLocale = locale === 'en' ? 'en-GB' : 'tr-TR'

  useEffect(() => {
    async function getBlog() {
      try {
        const res = await api.get(`/blogs/slug/${params.slug}`)
        setBlog(res.data)
      } catch {
        setBlog(null)
      } finally {
        setLoading(false)
      }
    }
    getBlog()
  }, [params.slug])

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Center py="xl">
          <Text size="lg" c="dimmed">{t('common.loading')}</Text>
        </Center>
      </Container>
    )
  }

  if (!blog) {
    notFound()
  }

  const textPrimary = colorScheme === 'dark' ? theme.white : theme.colors.gray[9]
  const textSecondary = colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7]

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        {blog.featuredImage && (
          <Box pos="relative" h={384} style={{ borderRadius: theme.radius.md, overflow: 'hidden' }}>
            <Image
              src={normalizeImageUrl(blog.featuredImage)}
              alt={blog.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
              unoptimized={shouldUnoptimizeImage(blog.featuredImage)}
            />
          </Box>
        )}

        {blog.category && (
          <Badge color="orange" size="sm" variant="light" radius="xl">
            {blog.category.name}
          </Badge>
        )}

        <Title order={1} c={textPrimary}>{blog.title}</Title>

        <Group gap="md" c={textSecondary}>
          {blog.createdBy && (
            <Text size="sm">
              {blog.createdBy.firstName} {blog.createdBy.lastName}
            </Text>
          )}
          <Text span size="sm">•</Text>
          <Text size="sm">{new Date(blog.createdAt).toLocaleDateString(dateLocale)}</Text>
          <Text span size="sm">•</Text>
          <Text size="sm">{blog.views} {t('blog.views')}</Text>
        </Group>

        <Text size="lg" c={textSecondary} style={{ whiteSpace: 'pre-line' }}>
          {blog.content}
        </Text>
      </Stack>
    </Container>
  )
}
