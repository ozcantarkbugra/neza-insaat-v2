import useSWR from 'swr'
import { swrFetcher } from '@/lib/swrFetcher'

export type SiteSettings = Record<string, string>

const SWR_CONFIG = { revalidateOnFocus: true, dedupingInterval: 30 * 1000 }

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<SiteSettings>(
    '/settings',
    swrFetcher,
    SWR_CONFIG
  )

  return {
    settings: data ?? {},
    isLoading,
    isError: !!error,
    mutate,
  }
}
