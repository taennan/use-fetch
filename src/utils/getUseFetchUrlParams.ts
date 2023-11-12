import type { UseFetchArgs, UseFetchTriggerArgs } from '../types/useFetch'
import type { RequestParams } from '../types/http'

export const getUseFetchUrlParams = <Params extends RequestParams>(
  baseParams: UseFetchTriggerArgs<Params, any>['params'],
  triggerParams: UseFetchTriggerArgs<Params, any>['params'],
  transformFn?: UseFetchArgs<Params, any, any>['transformRequestParams'],
): RequestParams => {
  const baseObj = typeof baseParams === 'function' ? baseParams() : baseParams
  const triggerObj = typeof triggerParams === 'function' ? triggerParams() : triggerParams
  const rawParams = {
    ...baseObj,
    ...triggerObj,
  } as Params
  return transformFn ? transformFn(rawParams) : rawParams
}
