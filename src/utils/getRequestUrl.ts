import type { RequestParams } from '../types/useFetch'

export const getRequestUrl = (baseUrl: string, queryParams?: RequestParams): string => {
  const urlQuery = Object.entries(queryParams ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const urlSeperator = urlQuery ? '?' : ''
  const result = `${baseUrl}${urlSeperator}${urlQuery}`
  return result
}
