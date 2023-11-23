import type { UseFetchArgs, UseFetchTriggerArgs } from '../types/useFetch'
import type { RequestBody } from '../types/http'

export const getUseFetchRequestBody = <Body extends RequestBody>(
  baseBody: UseFetchTriggerArgs<any, Body>['body'],
  triggerBody: UseFetchTriggerArgs<any, Body>['body'],
  transformFn?: UseFetchArgs<any, Body, any>['transformRequestBody'],
): RequestBody => {
  const rawBaseBody = typeof baseBody === 'function' ? baseBody() : baseBody
  const rawTriggerBody = typeof triggerBody === 'function' ? triggerBody() : triggerBody

  const rawBody = rawTriggerBody === undefined ? rawBaseBody : rawTriggerBody
  return transformFn ? transformFn(rawBody) : rawBody
}
