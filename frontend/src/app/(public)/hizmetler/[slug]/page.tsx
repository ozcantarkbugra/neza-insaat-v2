'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Center,
  Stack,
  Box,
} from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import api from '@/lib/api'
import { Service, Project } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { normalizeImageUrl, shouldUnoptimizeImage } from '@/utils/imageUtils'
import { useTranslation } from '@/lib/i18n'

type ServiceWithProjects = Service & { projects?: Project[] }

export default function ServiceDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = use(props.params)
  const { t, locale } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const [service, setService] = useState<ServiceWithProjects | null>(null)
  const [loading, setLoading] = useState(true)
  const isEn = locale === 'en'
  const serviceTitle = isEn && service?.titleEn ? service.titleEn : (service?.title ?? '')
  const serviceDescription = isEn && service?.descriptionEn ? service.descriptionEn : (service?.description ?? '')

  useEffect(() => {
    async function getService() {
      try {
        const res = await api.get(`/services/slug/${params.slug}`)
        setService(res.data)
      } catch {
        setService(null)
      } finally {
        setLoading(false)
      }
    }
    getService()
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

  if (!service) {
    notFound()
  }

  const projectTitle = (p: Project) => (isEn && p.titleEn ? p.titleEn : p.title)
  const projectDescription = (p: Project) => {
    if (isEn && (p.shortDescriptionEn ?? p.descriptionEn)) return (p.shortDescriptionEn || p.descriptionEn || '').substring(0, 100)
    return (p.shortDescription || p.description || '').substring(0, 100)
  }

  const cardBg = colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  const cardBorder = colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
  const textPrimary = colorScheme === 'dark' ? theme.white : theme.colors.gray[9]
  const textSecondary = colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[7]

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={1} c={textPrimary}>{serviceTitle}</Title>

        <Text size="lg" c={textSecondary} style={{ whiteSpace: 'pre-line' }}>
          {serviceDescription}
        </Text>

        {service.projects && service.projects.length > 0 && (
          <Box>
            <Title order={2} mb="md" c={textPrimary}>{t('services.relatedProjects')}</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {service.projects.map((project) => (
                <Card
                  key={project.id}
                  component={Link}
                  href={`/projeler/${project.slug}`}
                  padding={0}
                  radius="md"
                  withBorder
                  style={{
                    textDecoration: 'none',
                    overflow: 'hidden',
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                  }}
                  className="hover:shadow-xl transition-shadow"
                >
                  {project.images && project.images.length > 0 && (
                    <Card.Section>
                      <Box pos="relative" h={192}>
                        <Image
                          src={normalizeImageUrl(project.images[0].url)}
                          alt={projectTitle(project)}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized={shouldUnoptimizeImage(project.images[0].url)}
                        />
                      </Box>
                    </Card.Section>
                  )}
                  <Stack gap="xs" p="md">
                    <Title order={4} c={textPrimary}>{projectTitle(project)}</Title>
                    <Text size="sm" c={textSecondary} lineClamp={2}>
                      {projectDescription(project)}...
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
    </Container>
  )
}
