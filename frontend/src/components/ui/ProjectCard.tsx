'use client'

import { useState } from 'react'
import { Card, Badge, Text, Title, Stack, Group } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import Link from 'next/link'
import NextImage from 'next/image'
import { normalizeImageUrl, shouldUnoptimizeImage } from '@/utils/imageUtils'
import { useTranslation } from '@/lib/i18n'

interface ProjectCardProps {
  id: string
  title: string
  titleEn?: string | null
  shortDescription?: string
  shortDescriptionEn?: string | null
  description: string
  featuredImage?: string
  location?: string
  area?: number
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNING' | 'ON_HOLD'
  slug: string
}

export default function ProjectCard({
  title,
  titleEn,
  shortDescription,
  shortDescriptionEn,
  description,
  featuredImage,
  location,
  area,
  status,
  slug,
}: ProjectCardProps) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const { t, locale } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const isEn = locale === 'en'
  const displayTitle = isEn && titleEn ? titleEn : title
  const displayShort = isEn && shortDescriptionEn ? shortDescriptionEn : (shortDescription ?? description.substring(0, 100))

  const statusConfig = {
    COMPLETED: { label: t('projects.completed'), color: 'green' },
    IN_PROGRESS: { label: t('projects.inProgress'), color: 'blue' },
    PLANNING: { label: t('projects.planning'), color: 'gray' },
    ON_HOLD: { label: t('projects.onHold'), color: 'yellow' },
  }

  const statusInfo = statusConfig[status]

  return (
    <Card
      component={Link}
      href={`/projeler/${slug}`}
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
                height: 256,
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
                  alt={displayTitle}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={shouldUnoptimizeImage(featuredImage)}
                />
              </div>
              <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                <Badge color={statusInfo.color} size="sm" radius="xl">
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
          </Card.Section>
        )}
        <Stack gap="md" p="lg">
          <Title
            order={3}
            size="h4"
            c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}
            lineClamp={2}
            style={{
              transition: 'color 200ms ease',
            }}
            className="hover:text-orange-500 dark:hover:text-orange-400"
          >
            {displayTitle}
          </Title>
          <Text
            size="sm"
            c={colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[7]}
            lineClamp={2}
            style={{ lineHeight: 1.6 }}
          >
            {displayShort}...
          </Text>
          <Group justify="space-between" gap="xs">
            {location && (
              <Text 
                size="xs" 
                c={colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[6]}
                fw={500}
              >
                {location}
              </Text>
            )}
            {area && (
              <Text 
                size="xs" 
                fw={700} 
                c={colorScheme === 'dark' ? theme.colors.orange[3] : theme.colors.orange[6]}
              >
                {area.toLocaleString('tr-TR')} m²
              </Text>
            )}
          </Group>
        </Stack>
      </Stack>
    </Card>
  )
}
