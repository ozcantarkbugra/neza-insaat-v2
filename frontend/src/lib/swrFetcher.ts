import api from './api'

export const swrFetcher = (url: string) =>
  api.get(url).then((res) => res.data)
