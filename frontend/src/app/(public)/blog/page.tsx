'use client'

import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Center,
  Stack,
  Box,
} from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { useBlogs } from '@/hooks/useBlogs'
import { useTranslation } from '@/lib/i18n'
import BlogCard from '@/components/ui/BlogCard'

export default function BlogPage() {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const { blogs, isLoading: loading } = useBlogs({ status: 'PUBLISHED', limit: 12 })

  const featuredBlogs = blogs.filter((b) => b.featured)
  const regularBlogs = blogs.filter((b) => !b.featured)

  const heroSubtext = colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[3]

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
    <Stack gap={0}>
      <Box
        py="xl"
        style={{
          background: colorScheme === 'dark'
            ? `linear-gradient(135deg, ${theme.colors.dark[8]} 0%, ${theme.colors.dark[9]} 100%)`
            : `linear-gradient(135deg, ${theme.colors.gray[9]} 0%, ${theme.colors.gray[8]} 100%)`,
        }}
      >
        <Container size="xl">
          <Title order={1} c="white" size="h2" mb="sm">{t('blog.title')}</Title>
          <Text size="xl" c={heroSubtext}>{t('blog.subtitle')}</Text>
        </Container>
      </Box>

      <Container size="xl" py="xl">
        {blogs.length === 0 ? (
          <Center py="xl">
            <Text size="lg" c="dimmed">{t('blog.noPosts')}</Text>
          </Center>
        ) : (
          <Stack gap="xl">
            {featuredBlogs.length > 0 && (
              <Box>
                <Title order={2} mb="lg">{t('blog.featuredSection')}</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {featuredBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      id={blog.id}
                      title={blog.title}
                      excerpt={blog.excerpt ?? undefined}
                      content={blog.content}
                      featuredImage={blog.featuredImage ?? undefined}
                      category={blog.category}
                      createdAt={blog.createdAt}
                      views={blog.views}
                      slug={blog.slug}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {regularBlogs.length > 0 && (
              <Box>
                <Title order={2} mb="lg">{t('blog.latestSection')}</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {regularBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      id={blog.id}
                      title={blog.title}
                      excerpt={blog.excerpt ?? undefined}
                      content={blog.content}
                      featuredImage={blog.featuredImage ?? undefined}
                      category={blog.category}
                      createdAt={blog.createdAt}
                      views={blog.views}
                      slug={blog.slug}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </Stack>
        )}
      </Container>
    </Stack>
  )
}
