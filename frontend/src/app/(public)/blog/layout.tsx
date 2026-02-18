import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Neza İnşaat blog yazıları. İnşaat sektörü haberleri, proje güncellemeleri ve sektör analizleri.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
