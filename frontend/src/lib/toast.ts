import { notifications } from '@mantine/notifications'

export const toast = {
  success: (message: string, title?: string) => {
    notifications.show({ message, title: title ?? 'Başarılı', color: 'green' })
  },
  error: (message: string, title?: string) => {
    notifications.show({ message, title: title ?? 'Hata', color: 'red' })
  },
  warning: (message: string, title?: string) => {
    notifications.show({ message, title: title ?? 'Uyarı', color: 'yellow' })
  },
}
