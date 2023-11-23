import type { FnReturns } from './common'
import type { HttpMethod, RequestBody, RequestHeaders, RequestParams } from './http'

export type ResultType = 'text' | 'json'

export type UseFetchArgsResultType = ResultType | 'infer'

export interface UseFetchTriggerArgs<Params extends RequestParams, Body extends RequestBody> {
  url?: string | FnReturns<string>
  headers?: RequestHeaders | FnReturns<RequestHeaders>
  params?: Params | FnReturns<Params>
  body?: Body | FnReturns<Body>
}

export interface FetcherFnArgs {
  request: Request
  headers?: RequestHeaders
  params?: RequestParams
  body?: RequestBody
}

export interface FetcherFnReturn<Result> {
  result: Result
  response?: Response
}

export type FetcherFn<Result> = (args: FetcherFnArgs) => Promise<FetcherFnReturn<Result>>

export interface UseFetchArgs<Params extends RequestParams, Body extends RequestBody, Result>
  extends Omit<UseFetchTriggerArgs<Params, Body>, 'url'> {
  url: string | FnReturns<string>
  method?: HttpMethod
  resultType?: UseFetchArgsResultType
  errorResultType?: UseFetchArgsResultType
  initialData?: Result
  triggerOnLoad?: boolean
  triggerOnUrlChange?: boolean
  triggerOnParamChange?: boolean
  triggerOnBodyChange?: boolean
  fetcher?: FetcherFn<Result>
  transformRequestHeaders?: (headers?: RequestHeaders) => RequestHeaders
  transformRequestParams?: (params?: Params) => RequestParams
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
