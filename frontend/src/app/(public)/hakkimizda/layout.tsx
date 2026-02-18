import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    'Neza İnşaat olarak misyonumuz, vizyonumuz ve tarihçemiz. Güvenilir inşaat çözümleri ile sektördeki yerimiz.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
