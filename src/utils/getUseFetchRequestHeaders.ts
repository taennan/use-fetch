import type { UseFetchArgs } from '../types/useFetch'
import type { RequestHeaders } from '../types/http'

export const getUseFetchRequestHeaders = (
  headers?: RequestHeaders,
  transformFn?: UseFetchArgs<any, any>['transformRequestHeaders'],
): RequestHeaders => {
  const rawHeaders = typeof headers === 'function' ? headers() : headers
  return transformFn ? transformFn(rawHeaders) : rawHeaders
}
