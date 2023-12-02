import type { HttpMethod, RequestBody, RequestHeaders, RequestParams } from './http'

export type ResultType = 'text' | 'json'

export type UseFetchArgsResultType = ResultType | 'infer'

export interface FetcherFnArgs {
  request: Request
  headers?: RequestHeaders
  params?: RequestParams
  body?: RequestBody
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
}

export interface UseFetchArgs<Result, QueryArgs> {
  query: (args: QueryArgs) => FetchOptions
  resultType?: UseFetchArgsResultType
  errorResultType?: UseFetchArgsResultType
  initialArgs?: QueryArgs
  initialData?: Result
  fetcher?: FetcherFn<Result>
  transformRequestHeaders?: (headers?: RequestHeaders) => RequestHeaders
  transformRequestParams?: (params?: RequestParams) => RequestParams
  transformRequestBody?: (body?: RequestBody) => RequestBody
  transformRequest?: (request: Request) => Request
  transformResponse?: (response: Response) => Response
  transformResult?: (result?: any) => any
  transformError?: (error?: any) => any
}

export interface UseFetchReturn<Result, QueryArgs> {
  data?: Result
  error?: any
  loading: boolean
  fetched: boolean
  trigger: UseFetchTriggerFn<Result, QueryArgs>
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
