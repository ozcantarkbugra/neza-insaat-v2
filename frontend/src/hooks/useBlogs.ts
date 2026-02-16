import useSWR from 'swr'
import { swrFetcher } from '@/lib/swrFetcher'
import type { Blog } from '@/types'

const SWR_CONFIG = { revalidateOnFocus: false, dedupingInterval: 60000 }

export function useBlogs(params?: { status?: string; limit?: number }) {
  const query = new URLSearchParams()
  if (params?.status) query.set('status', params.status)
  if (params?.limit) query.set('limit', String(params.limit))
  const url = `/blogs${query.toString() ? `?${query}` : ''}`

  const { data, error, isLoading, mutate } = useSWR<{ blogs: Blog[]; pagination?: any }>(
    url,
    swrFetcher,
    SWR_CONFIG
  )

  return {
    blogs: data?.blogs ?? [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    mutate,
  }
}
