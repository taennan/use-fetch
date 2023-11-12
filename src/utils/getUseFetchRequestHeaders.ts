import type { UseFetchArgs, UseFetchTriggerArgs, RequestHeaders } from '../types/useFetch'

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
