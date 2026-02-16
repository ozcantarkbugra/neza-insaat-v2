'use client'

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  rootMargin?: string
  threshold?: number
  triggerOnce?: boolean
}

export function useInView(options: UseInViewOptions = {}) {
  const { rootMargin = '0px 0px -40px 0px', threshold = 0.1, triggerOnce = true } = options
  const ref = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold, triggerOnce])

  return { ref, isInView }
}
