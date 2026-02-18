import type { Metadata } from 'next'
import PublicLayoutClient from '@/components/layout/PublicLayoutClient'

export const metadata: Metadata = {
  description:
    'Neza İnşaat - Güvenilir inşaat çözümleri. Konut, ticari ve endüstriyel projelerde kalite ve güven. Projelerimizi keşfedin.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>
}
