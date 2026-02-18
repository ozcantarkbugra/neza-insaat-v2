'use client'

import { useState } from 'react'
import { Card, Text, Title, Stack } from '@mantine/core'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import Link from 'next/link'
import NextImage from 'next/image'
import { normalizeImageUrl, shouldUnoptimizeImage } from '@/utils/imageUtils'
import { useTranslation } from '@/lib/i18n'

interface ServiceCardProps {
  id: string
  title: string
  titleEn?: string | null
  shortDescription?: string
  shortDescriptionEn?: string | null
  image?: string
  slug: string
}

export default function ServiceCard({ title, titleEn, shortDescription, shortDescriptionEn, image, slug }: ServiceCardProps) {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const { locale } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const isEn = locale === 'en'
  const displayTitle = isEn && titleEn ? titleEn : title
  const displayShort = isEn && shortDescriptionEn ? shortDescriptionEn : (shortDescription ?? '')

  return (
    <Card
      component={Link}
      href={`/hizmetler/${slug}`}
      padding="lg"
      radius="md"
      withBorder
      style={{
        height: '100%',
        textDecoration: 'none',
        transition: 'all 200ms ease',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        borderColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-blue-500"
    >
      <Stack gap="md">
        {image && (
          <Card.Section>
            <div
              style={{
                position: 'relative',
                height: 200,
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
                  src={normalizeImageUrl(image)}
                  alt={displayTitle}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={shouldUnoptimizeImage(image)}
                />
              </div>
            </div>
          </Card.Section>
        )}
        <Stack gap="xs">
          <Title
            order={3}
            size="h4"
            c={colorScheme === 'dark' ? theme.white : theme.colors.blue[8]}
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
            {displayShort || (isEn ? 'Click for service details.' : 'Hizmet detayları için tıklayın.')}
          </Text>
        </Stack>
      </Stack>
    </Card>
  )
}
