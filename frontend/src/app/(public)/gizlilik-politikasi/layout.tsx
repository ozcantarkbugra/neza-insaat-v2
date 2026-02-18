import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Neza İnşaat gizlilik politikası. Kişisel verilerinizin korunması hakkında bilgi.',
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
