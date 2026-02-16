'use client'

import { Container, SimpleGrid, Text, Stack } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'

const stats = [
  { value: '25+', label: 'Yıllık Tecrübe' },
  { value: '150+', label: 'Tamamlanan Proje' },
  { value: '500K+', label: 'm² İnşa Alanı' },
  { value: '1000+', label: 'Mutlu Müşteri' },
]

export default function StatsSection() {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  return (
    <section
      style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: colorScheme === 'dark' ? theme.colors.blue[9] : theme.white,
        borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.gray[2]}`,
      }}
    >
      <Container size="xl">
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing={{ base: 'md', md: 'xl' }}>
          {stats.map((stat, index) => (
            <Stack key={index} gap="xs" align="center">
              <Text
                size="3rem"
                fw={700}
                c={colorScheme === 'dark' ? theme.colors.orange[4] : theme.colors.blue[8]}
                style={{
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </Text>
              <Text
                size="md"
                fw={500}
                c={colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[6]}
                ta="center"
              >
                {stat.label}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  )
}
