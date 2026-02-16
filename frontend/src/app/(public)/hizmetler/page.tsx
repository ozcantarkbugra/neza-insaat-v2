'use client'

import { Container, Title, Text, SimpleGrid, Center, Stack } from '@mantine/core'
import { useServices } from '@/hooks/useServices'
import { useTranslation } from '@/lib/i18n'
import ServiceCard from '@/components/ui/ServiceCard'

export default function ServicesPage() {
  const { t } = useTranslation()
  const { services, isLoading: loading } = useServices()

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center py="xl">
          <Text size="lg" c="dimmed">{t('common.loading')}</Text>
        </Center>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={1} size="h2">{t('services.title')}</Title>

        {services.length === 0 ? (
          <Text size="lg" c="dimmed">{t('services.noServices')}</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                titleEn={service.titleEn}
                shortDescription={service.shortDescription ?? undefined}
                shortDescriptionEn={service.shortDescriptionEn ?? undefined}
                image={service.image ?? undefined}
                slug={service.slug}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  )
}
