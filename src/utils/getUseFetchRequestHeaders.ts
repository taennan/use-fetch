import type { UseFetchArgs, UseFetchTriggerArgs } from '../types/useFetch'
import type { RequestHeaders } from '../types/http'

export const getUseFetchRequestHeaders = (
  baseHeaders: UseFetchTriggerArgs<any, any>['headers'],
  triggerHeaders: UseFetchTriggerArgs<any, any>['headers'],
  transformFn?: UseFetchArgs<any, any, any>['transformRequestHeaders'],
): RequestHeaders => {
  const baseObj = typeof baseHeaders === 'function' ? baseHeaders() : baseHeaders
  const triggerObj = typeof triggerHeaders === 'function' ? triggerHeaders() : triggerHeaders
  const rawHeaders = {
    ...baseObj,
    ...triggerObj,
  }
  return transformFn ? transformFn(rawHeaders) : rawHeaders
}
