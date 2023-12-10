import type { HttpMethod, RequestBody, RequestHeaders, RequestParams } from './http'

export type ResultType = 'text' | 'json'

export type UseFetchArgsResultType = ResultType | 'infer'

export type TransformRequestHeadersFn = (headers?: RequestHeaders) => RequestHeaders | undefined
export type TransformRequestBodyFn = (body?: RequestBody) => RequestBody
export type TransformRequestParamsFn = (params?: RequestParams) => RequestParams | undefined
export type TransformRequestUrlFn = (url: string) => string
export type TransformRequestFn = (request: Request) => Request
export type TransformResponseFn = (response: Response) => Response
export type TransformResultFn = (result?: any) => any
export type TransformErrorFn = (error?: any) => any

export interface FetcherFnArgs {
  request: Request
  url: string
  headers?: RequestHeaders
  params?: RequestParams
  body?: RequestBody
  resultType?: UseFetchArgsResultType
  errorResultType?: UseFetchArgsResultType
}

export type FetcherReturn<Result> =
  | {
      error: undefined
      result: Result
    }
  | {
      error: any
      result: undefined
    }

export type FetcherFn<Result> = (args: FetcherFnArgs) => Promise<FetcherReturn<Result>>

export interface FetchOptions {
  url: string
  method?: HttpMethod
  params?: RequestParams
  body?: RequestBody
  headers?: RequestHeaders
  resultType?: UseFetchArgsResultType
  errorResultType?: UseFetchArgsResultType
}

export interface UseFetchArgs<Result, QueryArgs> {
  query: (args: QueryArgs) => FetchOptions
  queryArgs?: QueryArgs
  initialData?: Result
  triggerOnLoad?: boolean
  triggerOnQueryArgsChange?: boolean
  fetcher?: FetcherFn<Result>
  transformRequestHeaders?: TransformRequestHeadersFn
  transformRequestBody?: TransformRequestBodyFn
  transformRequestParams?: TransformRequestParamsFn
  transformRequestUrl?: TransformRequestUrlFn
  transformRequest?: TransformRequestFn
  transformResponse?: TransformResponseFn
  transformResult?: TransformResultFn
  transformError?: TransformErrorFn
}

export interface UseFetchReturn<Result, QueryArgs> {
  data?: Result
  error?: any
  loading: boolean
  fetched: boolean
  trigger: UseFetchTriggerFn<Result, QueryArgs>
  reset: () => void
}

export type UseFetchTriggerReturn<Result> =
  | {
      error: undefined
      result: Result
    }
  | {
      error: any
      result: undefined
    }

export type UseFetchTriggerFn<Result, QueryArgs> = (
  args: QueryArgs,
) => Promise<UseFetchTriggerReturn<Result>>

export type UseFetchHook<Result, QueryArgs> = (
  args: UseFetchArgs<Result, QueryArgs>,
) => UseFetchReturn<Result, QueryArgs>

export type InternalTriggerFn<Result> = (
  fetchOptions: FetchOptions,
) => Promise<UseFetchTriggerReturn<Result>>
