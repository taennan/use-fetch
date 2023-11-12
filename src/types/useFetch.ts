import type { FnReturns } from './common'
import type { HttpMethod } from './http'

export type ResultType = 'text' | 'json'

export type UseFetchArgsResultType = ResultType | 'infer'

export type RequestHeaders = Record<string, any>

export type RequestParams = Record<string, any> | void

export type RequestBody = Record<string, any> | string | number | null | undefined | void

export interface UseFetchTriggerArgs<Params extends RequestParams, Body extends RequestBody> {
  headers?: RequestHeaders | FnReturns<RequestHeaders>
  params?: Params | FnReturns<Params>
  body?: Body | FnReturns<Body>
}

export interface FetcherFnArgs<Params extends RequestParams, Body extends RequestBody> {
  request: Request
  headers?: RequestHeaders
  params?: Params
  body?: Body
}

export interface FetcherFnReturn<Result> {
  result: Result
  response?: Response
}

export type FetcherFn<Params extends RequestParams, Body extends RequestBody, Result> = (
  args: FetcherFnArgs<Params, Body>,
) => Promise<FetcherFnReturn<Result>>

export interface UseFetchArgs<Params extends RequestParams, Body extends RequestBody, Result>
  extends UseFetchTriggerArgs<Params, Body> {
  url: string
  method?: HttpMethod
  resultType?: UseFetchArgsResultType
  initialData?: Result
  triggerOnLoad?: boolean
  triggerOnParamChange?: boolean
  triggerOnBodyChange?: boolean
  fetcher?: FetcherFn<Params, Body, Result>
  transformRequestHeaders?: (headers?: RequestHeaders) => RequestHeaders
  transformRequestParams?: (params?: RequestParams) => RequestParams
  transformRequestBody?: (body?: RequestBody) => RequestBody
  transformRequest?: (request: Request) => Request
  transformResponse?: (response: Response) => Response
  transformResult?: (result: any) => any
}

export interface UseFetchReturn<Result, Params extends RequestParams, Body extends RequestBody> {
  data?: Result
  error?: any
  loading: boolean
  fetched: boolean
  trigger: UseFetchTriggerFn<Result, Params, Body>
}

export type UseFetchTriggerFn<Result, Params extends RequestParams, Body extends RequestBody> = (
  args?: UseFetchTriggerArgs<Params, Body>,
) => Promise<Result>

export type UseFetchHook<Result, Params extends RequestParams, Body extends RequestBody> = (
  args: UseFetchArgs<Params, Body, Result>,
) => UseFetchReturn<Result, Params, Body>
