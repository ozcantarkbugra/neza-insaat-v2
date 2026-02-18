import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'Neza İnşaat KVKK aydınlatma metni. Kişisel verilerinizin işlenmesi hakkında bilgilendirme.',
}

export default function KvkkLayout({ children }: { children: React.ReactNode }) {
  return children
}
