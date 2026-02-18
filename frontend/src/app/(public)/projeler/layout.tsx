import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projelerimiz',
  description:
    'Neza İnşaat projeleri. Konut, ticari ve endüstriyel projelerimizi keşfedin. Tamamlanan ve devam eden projeler.',
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
