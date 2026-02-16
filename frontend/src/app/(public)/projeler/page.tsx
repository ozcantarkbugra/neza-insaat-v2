'use client'

import { Container, Title, Text, SimpleGrid, Stack } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/ui/ProjectCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { useTranslation } from '@/lib/i18n'

export default function ProjectsPage() {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const { projects, isLoading: loading, isError } = useProjects({ limit: 50 })

  const apiError = isError
    ? 'Backend\'e bağlanılamadı. Backend\'in çalıştığından emin olun (örn. port 5002).'
    : null

  // Projeleri duruma göre grupla
  const completedProjects = projects.filter(p => p.status === 'COMPLETED')
  const inProgressProjects = projects.filter(p => p.status === 'IN_PROGRESS')
  const otherProjects = projects.filter(p => p.status !== 'COMPLETED' && p.status !== 'IN_PROGRESS')

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text size="lg" c="dimmed">{t('common.loading')}</Text>
      </Container>
    )
  }

  return (
    <Stack gap={0}>
      {/* Hero Section */}
      <section
        style={{
          background: colorScheme === 'dark' 
            ? `linear-gradient(135deg, ${theme.colors.blue[9]} 0%, ${theme.colors.blue[8]} 100%)`
            : `linear-gradient(135deg, ${theme.colors.dark[9] || '#1a1b1e'} 0%, ${theme.colors.dark[8] || '#25262b'} 100%)`,
          paddingTop: '6rem',
          paddingBottom: '6rem',
        }}
      >
        <Container size="xl">
          <Stack gap="md" align="center">
            <Title order={1} size="h1" c="white" ta="center">
              {t('projects.title')}
            </Title>
            <Text size="xl" c="gray.2" ta="center" maw={800}>
              {t('projects.subtitle')}
            </Text>
          </Stack>
        </Container>
      </section>

      <Container size="xl" py="xl">
        {apiError ? (
          <Stack align="center" gap="md" py="xl">
            <Text size="lg" c="red.6" fw={500}>{t('projects.apiError')}</Text>
            <Text size="sm" c="dimmed">{apiError}</Text>
            <Text size="xs" c="dimmed">
              API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'} — Backend ve veritabanının çalıştığından emin olun.
            </Text>
          </Stack>
        ) : projects.length === 0 ? (
          <Stack align="center" gap="md" py="xl">
            <Text size="lg" c="dimmed">{t('projects.noProjects')}</Text>
          </Stack>
        ) : (
          <Stack gap="xl">
            {/* Devam Eden Projeler */}
            {inProgressProjects.length > 0 && (
              <Stack gap="lg">
                <Title order={2} size="h2" c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}>
                  {t('projects.inProgressSection')}
                </Title>
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 'md', md: 'lg' }}>
                  {inProgressProjects.map((project) => (
                    <ScrollReveal key={project.id}>
                      <ProjectCard {...project} />
                    </ScrollReveal>
                  ))}
                </SimpleGrid>
              </Stack>
            )}

            {/* Tamamlanan Projeler */}
            {completedProjects.length > 0 && (
              <Stack gap="lg">
                <Title order={2} size="h2" c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}>
                  {t('projects.completedSection')}
                </Title>
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 'md', md: 'lg' }}>
                  {completedProjects.map((project) => (
                    <ScrollReveal key={project.id}>
                      <ProjectCard {...project} />
                    </ScrollReveal>
                  ))}
                </SimpleGrid>
              </Stack>
            )}

            {/* Diğer Projeler */}
            {otherProjects.length > 0 && (
              <Stack gap="lg">
                <Title order={2} size="h2" c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}>
                  {t('projects.otherSection')}
                </Title>
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 'md', md: 'lg' }}>
                  {otherProjects.map((project) => (
                    <ScrollReveal key={project.id}>
                      <ProjectCard {...project} />
                    </ScrollReveal>
                  ))}
                </SimpleGrid>
              </Stack>
            )}
          </Stack>
        )}
      </Container>
    </Stack>
  )
}
