import type { UseFetchArgs } from '../types/useFetch'
import type { RequestParams } from '../types/http'

export const getUseFetchUrlParams = (
  params?: RequestParams,
  transformFn?: UseFetchArgs<any, any>['transformRequestParams'],
): RequestParams => {
  const rawParams = typeof params === 'function' ? params() : params
  return transformFn ? transformFn(rawParams) : rawParams
}
