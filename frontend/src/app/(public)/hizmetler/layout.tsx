import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hizmetlerimiz',
  description:
    'Neza İnşaat hizmetleri. Konut inşaatı, ticari yapılar, endüstriyel tesisler, taahhüt hizmetleri ve kentsel dönüşüm.',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
