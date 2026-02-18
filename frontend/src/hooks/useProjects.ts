import useSWR from 'swr'
import { swrFetcher } from '@/lib/swrFetcher'
import type { Project } from '@/types'

const SWR_CONFIG = { revalidateOnFocus: false, dedupingInterval: 60000 }

export function useProjects(params?: { featured?: boolean; limit?: number }) {
  const query = new URLSearchParams()
  if (params?.featured !== undefined) query.set('featured', String(params.featured))
  if (params?.limit) query.set('limit', String(params.limit))
  const url = `/projects${query.toString() ? `?${query}` : ''}`

  const { data, error, isLoading, mutate } = useSWR<{ projects: Project[]; pagination?: any }>(
    url,
    swrFetcher,
    SWR_CONFIG
  )

  return {
    projects: Array.isArray(data) ? data : (data?.projects ?? []),
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    mutate,
  }
}
