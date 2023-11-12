import type { UseFetchArgs, UseFetchTriggerArgs, RequestBody } from '../types/useFetch'

export const getUseFetchRequestBody = <Body extends RequestBody>(
  baseBody: UseFetchTriggerArgs<any, Body>['body'],
  triggerBody: UseFetchTriggerArgs<any, Body>['body'],
  transformFn?: UseFetchArgs<any, Body, any>['transformRequestBody'],
): Body => {
  const baseObj = typeof baseBody === 'function' ? baseBody() : baseBody
  const triggerObj = typeof triggerBody === 'function' ? triggerBody() : triggerBody
  const rawBody = {
    ...baseObj,
    ...triggerObj,
  }
  return transformFn ? transformFn(rawBody) : rawBody
}
