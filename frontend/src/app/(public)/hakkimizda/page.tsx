'use client'

import {
  Box,
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Paper,
  Card,
  List,
} from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { useTranslation } from '@/lib/i18n'

const HISTORY_ITEMS = [
  { year: '2000', label: 'history2000Label', text: 'history2000' },
  { year: '2005', label: 'history2005Label', text: 'history2005' },
  { year: '2010', label: 'history2010Label', text: 'history2010' },
  { year: '2015', label: 'history2015Label', text: 'history2015' },
  { year: '2020', label: 'history2020Label', text: 'history2020' },
  { year: '2025', label: 'history2025Label', text: 'history2025' },
] as const

export default function AboutPage() {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const isDark = colorScheme === 'dark'
  const textPrimary = isDark ? theme.colors.dark[0] : theme.colors.gray[9]
  const textSecondary = isDark ? theme.colors.dark[2] : theme.colors.gray[7]
  const accent = theme.colors.blue[6]
  const sectionBg = isDark ? theme.colors.dark[8] : theme.colors.gray[1]
  const sectionBorder = isDark ? theme.colors.dark[5] : theme.colors.gray[2]
  const cardBg = isDark ? theme.colors.dark[7] : theme.white
  const heroBg = isDark
    ? `linear-gradient(135deg, ${theme.colors.dark[9]} 0%, ${theme.colors.blue[9]} 100%)`
    : `linear-gradient(135deg, ${theme.colors.gray[9]} 0%, ${theme.colors.gray[8]} 100%)`
  const heroSubtext = isDark ? theme.colors.gray[4] : theme.colors.gray[3]

  return (
    <Stack gap={0}>
      <Box
        py="xl"
        style={{
          background: heroBg,
          paddingTop: '5rem',
          paddingBottom: '5rem',
        }}
      >
        <Container size="xl">
          <Title order={1} c="white" size="h1" mb="sm">
            {t('about.title')}
          </Title>
          <Text size="xl" c={heroSubtext}>
            {t('about.profileSubtitle')}
          </Text>
        </Container>
      </Box>

      <Container size="md" py="xl">
        <Stack gap="xl">
          <Box id="sirket-profili">
            <Title order={2} mb="md" c={textPrimary}>
              {t('about.profileTitle')}
            </Title>
            <Stack gap="md">
              <Text size="lg" c={textSecondary} style={{ lineHeight: 1.7 }}>
                {t('about.profileIntro1')}
              </Text>
              <Text c={textSecondary} style={{ lineHeight: 1.7 }}>
                {t('about.profileIntro2')}
              </Text>
            </Stack>
          </Box>

          <Paper
            id="misyon-vizyon"
            p="xl"
            radius="md"
            withBorder
            style={{
              backgroundColor: sectionBg,
              borderColor: sectionBorder,
            }}
          >
            <Stack gap="lg">
              <Title order={2} c={textPrimary}>
                {t('about.missionVisionTitle')}
              </Title>
              <Box>
                <Title order={3} size="h4" c={accent} mb="xs">
                  {t('about.missionLabel')}
                </Title>
                <Text c={textSecondary} style={{ lineHeight: 1.6 }}>
                  {t('about.mission')}
                </Text>
              </Box>
              <Box>
                <Title order={3} size="h4" c={accent} mb="xs">
                  {t('about.visionLabel')}
                </Title>
                <Text c={textSecondary} style={{ lineHeight: 1.6 }}>
                  {t('about.vision')}
                </Text>
              </Box>
              <Box>
                <Title order={3} size="h4" c={accent} mb="sm">
                  {t('about.valuesTitle')}
                </Title>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xs">
                  <List
                    spacing="xs"
                    size="sm"
                    c={textSecondary}
                    icon={
                      <Text span c={accent} fw={600}>
                        •
                      </Text>
                    }
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <List.Item key={i}>{t(`about.value${i}`)}</List.Item>
                    ))}
                  </List>
                  <List
                    spacing="xs"
                    size="sm"
                    c={textSecondary}
                    icon={
                      <Text span c={accent} fw={600}>
                        •
                      </Text>
                    }
                  >
                    {[5, 6, 7, 8].map((i) => (
                      <List.Item key={i}>{t(`about.value${i}`)}</List.Item>
                    ))}
                  </List>
                </SimpleGrid>
              </Box>
            </Stack>
          </Paper>

          <Box id="tarihce">
            <Title order={2} mb="lg" c={textPrimary}>
              {t('about.historyTitle')}
            </Title>
            <Stack gap="lg">
              {HISTORY_ITEMS.map(({ year, label, text }) => (
                <Box
                  key={year}
                  pl="lg"
                  style={{
                    borderLeft: `4px solid ${accent}`,
                  }}
                >
                  <Title order={3} size="h5" c={textPrimary} mb="xs">
                    {year} – {t(`about.${label}`)}
                  </Title>
                  <Text c={textSecondary} size="sm" style={{ lineHeight: 1.6 }}>
                    {t(`about.${text}`)}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>

          <Paper
            id="yonetim"
            p="xl"
            radius="md"
            withBorder
            style={{
              backgroundColor: sectionBg,
              borderColor: sectionBorder,
            }}
          >
            <Stack gap="lg">
              <Title order={2} c={textPrimary}>
                {t('about.managementTitle')}
              </Title>
              <Text c={textSecondary} style={{ lineHeight: 1.6 }}>
                {t('about.managementIntro')}
              </Text>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Card
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: cardBg,
                    borderColor: sectionBorder,
                  }}
                >
                  <Stack gap="xs">
                    <Title order={3} size="h5" c={textPrimary}>
                      {t('about.managementChairman')}
                    </Title>
                    <Text size="sm" c={textSecondary} style={{ lineHeight: 1.6 }}>
                      {t('about.managementChairmanDesc')}
                    </Text>
                  </Stack>
                </Card>
                <Card
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: cardBg,
                    borderColor: sectionBorder,
                  }}
                >
                  <Stack gap="xs">
                    <Title order={3} size="h5" c={textPrimary}>
                      {t('about.managementCEO')}
                    </Title>
                    <Text size="sm" c={textSecondary} style={{ lineHeight: 1.6 }}>
                      {t('about.managementCEODesc')}
                    </Text>
                  </Stack>
                </Card>
              </SimpleGrid>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Stack>
  )
}
