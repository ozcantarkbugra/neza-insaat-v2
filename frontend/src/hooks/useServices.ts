import useSWR from 'swr'
import { swrFetcher } from '@/lib/swrFetcher'
import type { Service } from '@/types'

const SWR_CONFIG = { revalidateOnFocus: false, dedupingInterval: 60000 }

export function useServices(featured?: boolean) {
  const url = featured !== undefined ? `/services?featured=${featured}` : '/services'

  const { data, error, isLoading, mutate } = useSWR<Service[]>(url, swrFetcher, SWR_CONFIG)

  return {
    services: Array.isArray(data) ? data : [],
    isLoading,
    isError: !!error,
    mutate,
  }
}
