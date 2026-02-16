'use client'

import Link from 'next/link'
import { Container, Title, Text, SimpleGrid, Stack, Group, Button } from '@mantine/core'
import { useProjects } from '@/hooks/useProjects'
import { useServices } from '@/hooks/useServices'
import { useBlogs } from '@/hooks/useBlogs'
import { useTranslation } from '@/lib/i18n'
import HeroSection from '@/components/ui/HeroSection'
import ServiceCard from '@/components/ui/ServiceCard'
import ProjectCard from '@/components/ui/ProjectCard'
import BlogCard from '@/components/ui/BlogCard'
import Section from '@/components/ui/Section'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function HomePage() {
  const { t } = useTranslation()
  const { projects, isLoading: projectsLoading } = useProjects({ featured: true, limit: 6 })
  const { services } = useServices(true)
  const { blogs } = useBlogs({ status: 'PUBLISHED', limit: 3 })

  const loading = projectsLoading

  if (loading) {
    return (
      <Stack gap={0} align="center" justify="center" style={{ minHeight: '50vh' }}>
        <Text size="lg" c="dimmed">{t('common.loading')}</Text>
      </Stack>
    )
  }

  return (
    <Stack gap={0}>
      <HeroSection projects={projects} />

      {services.length > 0 && (
        <ScrollReveal>
          <Section variant="light">
            <Container size="xl">
              <Stack gap="xl">
                <Stack gap="xs" align="center">
                  <Title order={2} size="h1" ta="center">
                    {t('home.servicesTitle')}
                  </Title>
                  <Text size="lg" c="dimmed" maw={600} mx="auto" ta="center">
                    {t('services.subtitle')}
                  </Text>
                </Stack>
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 'md', md: 'lg' }}>
                  {services.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                  ))}
                </SimpleGrid>
              </Stack>
            </Container>
          </Section>
        </ScrollReveal>
      )}

      {projects.length > 0 && (
        <ScrollReveal>
          <Section>
            <Container size="xl">
              <Group justify="space-between" align="flex-start" mb="xl">
                <Stack gap="xs">
                  <Title order={2} size="h1">
                    {t('home.projectsTitle')}
                  </Title>
                  <Text size="md" c="dimmed">
                    {t('home.projectsSubtitle')}
                  </Text>
                </Stack>
                <Button
                  component={Link}
                  href="/projeler"
                  variant="subtle"
                  rightSection="→"
                >
                  {t('home.viewAll')}
                </Button>
              </Group>
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 'md', md: 'lg' }}>
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </SimpleGrid>
            </Container>
          </Section>
        </ScrollReveal>
      )}

      {blogs.length > 0 && (
        <ScrollReveal>
          <Section variant="light">
            <Container size="xl">
              <Group justify="space-between" align="flex-start" mb="xl">
                <Stack gap="xs">
                  <Title order={2} size="h1">
                    {t('home.blogTitle')}
                  </Title>
                  <Text size="md" c="dimmed">
                    {t('home.blogSubtitle')}
                  </Text>
                </Stack>
                <Button
                  component={Link}
                  href="/blog"
                  variant="subtle"
                  rightSection="→"
                >
                  {t('home.viewAll')}
                </Button>
              </Group>
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 'md', md: 'lg' }}>
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} {...blog} />
                ))}
              </SimpleGrid>
            </Container>
          </Section>
        </ScrollReveal>
      )}
    </Stack>
  )
}
