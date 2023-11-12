import type { UseFetchArgs } from '../types/useFetch'

export const getUseFetchRequestUrl = (
  baseUrl: UseFetchArgs<any, any, any>['url'],
  triggerUrl: UseFetchArgs<any, any, any>['url'] | undefined,
  queryParams: Record<string, any>,
): string => {
  const url0 = typeof baseUrl === 'function' ? baseUrl() : baseUrl
  const url1 = typeof triggerUrl === 'function' ? triggerUrl() : triggerUrl
  const url = url1 ? url1 : url0

  const urlQuery = Object.entries(queryParams ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const urlSeperator = urlQuery ? '?' : ''

  const result = `${url}${urlSeperator}${urlQuery}`
  return result
}
