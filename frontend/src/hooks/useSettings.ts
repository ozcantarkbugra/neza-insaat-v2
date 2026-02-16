import useSWR from 'swr'
import { swrFetcher } from '@/lib/swrFetcher'

export type SiteSettings = Record<string, string>

const SWR_CONFIG = { revalidateOnFocus: false, dedupingInterval: 5 * 60 * 1000 } // 5 min cache

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
