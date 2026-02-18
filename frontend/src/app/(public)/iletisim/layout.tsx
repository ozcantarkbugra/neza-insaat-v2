import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İletişim',
  description:
    'Neza İnşaat ile iletişime geçin. Projeleriniz hakkında bilgi almak veya teklif istemek için bize ulaşın.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
