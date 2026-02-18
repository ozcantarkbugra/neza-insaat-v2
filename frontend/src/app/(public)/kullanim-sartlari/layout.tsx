import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Şartları',
  description: 'Neza İnşaat web sitesi kullanım şartları.',
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
