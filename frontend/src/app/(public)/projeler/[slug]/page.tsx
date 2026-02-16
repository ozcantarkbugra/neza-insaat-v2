'use client'

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Container, Title, Text, SimpleGrid, Card, Stack, Badge, Group } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import Image from 'next/image'
import api from '@/lib/api'
import { Project } from '@/types'
import { normalizeImageUrl } from '@/utils/imageUtils'
import { useTranslation } from '@/lib/i18n'

const STATUS_KEYS: Record<string, string> = {
  PLANNING: 'projects.planning',
  IN_PROGRESS: 'projects.inProgress',
  COMPLETED: 'projects.completed',
  ON_HOLD: 'projects.onHold',
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const { t, locale } = useTranslation()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const isEn = locale === 'en'
  const dateLocale = isEn ? 'en-GB' : 'tr-TR'
  const description = isEn && project?.descriptionEn
    ? project.descriptionEn
    : (project?.description ?? '')

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await api.get(`/projects/slug/${params.slug}`)
        setProject(res.data)
      } catch {
        setProject(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [params.slug])

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text size="lg" c="dimmed">{t('common.loading')}</Text>
      </Container>
    )
  }

  if (!project) {
    notFound()
  }

  const statusConfig = {
    COMPLETED: { color: 'green' },
    IN_PROGRESS: { color: 'blue' },
    PLANNING: { color: 'gray' },
    ON_HOLD: { color: 'yellow' },
  }
  const statusInfo = statusConfig[project.status]
  const statusLabel = t(STATUS_KEYS[project.status] || 'projects.planning')

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {project.featuredImage && (
          <div
            style={{
              position: 'relative',
              height: '500px',
              width: '100%',
              borderRadius: theme.radius.md,
              overflow: 'hidden',
            }}
          >
            <Image
              src={normalizeImageUrl(project.featuredImage)}
              alt={isEn && project.titleEn ? project.titleEn : project.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Title order={1} size="h1">
              {isEn && project.titleEn ? project.titleEn : project.title}
            </Title>
            <Badge color={statusInfo.color} size="lg" radius="xl">
              {statusLabel}
            </Badge>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Card
              padding="lg"
              radius="md"
              withBorder
              style={{
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
              }}
            >
              <Stack gap="xs">
                <Text
                  size="sm"
                  c={colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[6]}
                  fw={500}
                >
                  {t('projects.status')}
                </Text>
                <Text
                  size="lg"
                  fw={700}
                  c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}
                >
                  {statusLabel}
                </Text>
              </Stack>
            </Card>

            {project.area && (
              <Card
                padding="lg"
                radius="md"
                withBorder
                style={{
                  backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                  borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
                }}
              >
                <Stack gap="xs">
                  <Text
                    size="sm"
                    c={colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[6]}
                    fw={500}
                  >
                    {t('projects.area')}
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}
                  >
                    {project.area.toLocaleString(isEn ? 'en-US' : 'tr-TR')} m²
                  </Text>
                </Stack>
              </Card>
            )}

            {project.location && (
              <Card
                padding="lg"
                radius="md"
                withBorder
                style={{
                  backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                  borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
                }}
              >
                <Stack gap="xs">
                  <Text
                    size="sm"
                    c={colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[6]}
                    fw={500}
                  >
                    {t('projects.location')}
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}
                  >
                    {project.location}
                  </Text>
                </Stack>
              </Card>
            )}

            {project.deliveryDate && (
              <Card
                padding="lg"
                radius="md"
                withBorder
                style={{
                  backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                  borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
                }}
              >
                <Stack gap="xs">
                  <Text
                    size="sm"
                    c={colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[6]}
                    fw={500}
                  >
                    {t('projects.deliveryDate')}
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}
                  >
                    {new Date(project.deliveryDate).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </Stack>
              </Card>
            )}
          </SimpleGrid>

          <Card
            padding="lg"
            radius="md"
            withBorder
            style={{
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
            }}
          >
            <Text
              size="md"
              c={colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[7]}
              style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}
            >
              {description}
            </Text>
          </Card>

          {project.images && project.images.length > 0 && (
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {project.images.map((image) => (
                <div
                  key={image.id}
                  style={{
                    position: 'relative',
                    height: '300px',
                    width: '100%',
                    borderRadius: theme.radius.md,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={normalizeImageUrl(image.url)}
                    alt={image.alt || project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Stack>
    </Container>
  )
}
