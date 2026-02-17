'use client'

import { useState, useEffect, useMemo } from 'react'
import { Container, Title, Text, Group, Button, Stack } from '@mantine/core'
import { useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import Image from 'next/image'
import { IconArrowDown } from '@tabler/icons-react'
import { Project } from '@/types'
import { extractHeroImagesFromProjects, FALLBACK_IMAGES } from '@/utils/heroImages'
import { useTranslation } from '@/lib/i18n'

const HERO_KEYS = [
  { title: 'hero.title1', desc: 'hero.desc1' },
  { title: 'hero.title2', desc: 'hero.desc2' },
  { title: 'hero.title3', desc: 'hero.desc3' },
  { title: 'hero.title4', desc: 'hero.desc4' },
  { title: 'hero.title5', desc: 'hero.desc5' },
  { title: 'hero.title6', desc: 'hero.desc6' },
] as const

interface HeroSectionProps {
  projects?: Project[]
}

export default function HeroSection({ projects = [] }: HeroSectionProps) {
  const theme = useMantineTheme()
  const { t } = useTranslation()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const heroImages = useMemo(
    () => extractHeroImagesFromProjects(projects) || FALLBACK_IMAGES,
    [projects]
  )

  useEffect(() => {
    if (heroImages.length === 0) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
        setTimeout(() => setIsAnimating(false), 100)
      }, 400)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  const handleSlideChange = (index: number) => {
    if (index === currentImageIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentImageIndex(index)
      setTimeout(() => setIsAnimating(false), 100)
    }, 400)
  }

  const currentContent = useMemo(
    () => HERO_KEYS[currentImageIndex % HERO_KEYS.length],
    [currentImageIndex]
  )

  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        {heroImages.map((image, index) => {
          const isActive = index === currentImageIndex
          return (
            <div
              key={`${image}-${index}`}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : 'scale(1.1)',
                transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                visibility: isActive ? 'visible' : 'hidden',
              }}
            >
              <Image
                src={image}
                alt={`Hero image ${index + 1}`}
                fill
                priority={index === 0}
                quality={90}
                style={{ objectFit: 'cover' }}
                unoptimized={image.startsWith('http://localhost')}
              />
            </div>
          )
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.4) 75%, rgba(15,20,25,0.92) 100%)',
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            style={{
              width: index === currentImageIndex ? '2rem' : '0.5rem',
              height: '0.5rem',
              borderRadius: '0.25rem',
              backgroundColor: index === currentImageIndex ? theme.colors.orange[5] : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <Container size="xl" style={{ position: 'relative', zIndex: 20 }}>
        <Stack gap="xl">
          <Title
            key={`title-${currentImageIndex}`}
            order={1}
            size="clamp(2.5rem, 8vw, 6rem)"
            fw={700}
            c="white"
            style={{
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              lineHeight: 1.1,
              animation: isAnimating ? 'none' : 'fadeInUp 0.8s ease-out',
            }}
          >
            {t(currentContent.title)}
          </Title>

          <Text
            key={`text-${currentImageIndex}`}
            size="xl"
            c="gray.2"
            maw={800}
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              animation: isAnimating ? 'none' : 'fadeInUp 0.8s ease-out 0.2s both',
            }}
          >
            {t(currentContent.desc)}
          </Text>

          <Group
            key={`buttons-${currentImageIndex}`}
            gap="md"
            style={{
              animation: isAnimating ? 'none' : 'fadeInUp 0.8s ease-out 0.4s both',
            }}
          >
            <Button
              component={Link}
              href="/projeler"
              size="lg"
              color="orange"
              radius="md"
              style={{ boxShadow: theme.shadows.md }}
            >
              {t('hero.ctaProjects')}
            </Button>
            <Button
              component={Link}
              href="/iletisim"
              size="lg"
              variant="outline"
              color="white"
              radius="md"
            >
              {t('hero.ctaContact')}
            </Button>
          </Group>
        </Stack>
      </Container>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
        }}
        className="animate-bounce"
      >
        <IconArrowDown size={32} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
      </div>
    </section>
  )
}
