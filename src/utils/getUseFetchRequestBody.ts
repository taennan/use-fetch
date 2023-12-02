import type { UseFetchArgs } from '../types/useFetch'
import type { RequestBody } from '../types/http'

export const getUseFetchRequestBody = (
  body: RequestBody,
  transformFn?: UseFetchArgs<any, any>['transformRequestBody'],
): RequestBody => {
  const rawBody = typeof body === 'function' ? body() : body
  return transformFn ? transformFn(rawBody) : rawBody
}
