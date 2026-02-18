'use client'

import { useState } from 'react'
import { Card, Text, Title, Stack, Group, Badge } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import Link from 'next/link'
import NextImage from 'next/image'
import { normalizeImageUrl, shouldUnoptimizeImage } from '@/utils/imageUtils'
import { useTranslation } from '@/lib/i18n'

interface BlogCardProps {
  id: string
  title: string
  excerpt?: string
  content: string
  featuredImage?: string
  category?: { name: string }
  createdAt: string
  views: number
  slug: string
}

export default function BlogCard({
  title,
  excerpt,
  content,
  featuredImage,
  category,
  createdAt,
  views,
  slug,
}: BlogCardProps) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const { t, locale } = useTranslation()
  const dateLocale = locale === 'en' ? 'en-GB' : 'tr-TR'
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      component={Link}
      href={`/blog/${slug}`}
      padding={0}
      radius="md"
      withBorder
      style={{
        height: '100%',
        textDecoration: 'none',
        overflow: 'hidden',
        transition: 'all 200ms ease',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-blue-500"
    >
      <Stack gap={0}>
        {featuredImage && (
          <Card.Section>
            <div
              style={{
                position: 'relative',
                height: 192,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 300ms ease',
                }}
              >
                <NextImage
                  src={normalizeImageUrl(featuredImage)}
                  alt={title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={shouldUnoptimizeImage(featuredImage)}
                />
              </div>
            </div>
          </Card.Section>
        )}
        <Stack gap="sm" p="lg">
          {category && (
            <Badge color="orange" size="xs" variant="light" radius="xl">
              {category.name.toUpperCase()}
            </Badge>
          )}
          <Title
            order={3}
            size="h5"
            c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}
            lineClamp={2}
            style={{
              transition: 'color 200ms ease',
            }}
            className="hover:text-orange-500 dark:hover:text-orange-400"
          >
            {title}
          </Title>
          <Text
            size="sm"
            c={colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[7]}
            lineClamp={2}
            style={{ lineHeight: 1.6 }}
          >
            {excerpt || content.substring(0, 100)}...
          </Text>
          <Group justify="space-between" gap="xs" mt="auto">
            <Text 
              size="xs" 
              c={colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[6]}
              fw={500}
            >
              {new Date(createdAt).toLocaleDateString(dateLocale)}
            </Text>
            <Text 
              size="xs" 
              c={colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[6]}
              fw={500}
            >
              {views} {t('blog.views')}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  )
}
