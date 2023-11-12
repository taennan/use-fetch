import type { UseFetchArgs, UseFetchTriggerArgs, RequestParams } from '../types/useFetch'

export const getUseFetchUrlParams = <Params extends RequestParams>(
  baseParams: UseFetchTriggerArgs<Params, any>['params'],
  triggerParams: UseFetchTriggerArgs<Params, any>['params'],
  transformFn?: UseFetchArgs<Params, any, any>['transformRequestParams'],
): Params => {
  const baseObj = typeof baseParams === 'function' ? baseParams() : baseParams
  const triggerObj = typeof triggerParams === 'function' ? triggerParams() : triggerParams
  const rawParams = {
    ...baseObj,
    ...triggerObj,
  }
  return transformFn ? transformFn(rawParams) : rawParams
}
