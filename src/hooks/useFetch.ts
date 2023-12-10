import type {
  FetcherFn,
  InternalTriggerFn,
  UseFetchArgs,
  UseFetchReturn,
  UseFetchTriggerFn,
} from '../types/useFetch'

import { useState, useEffect } from 'react'
import { getUseFetchRequestUrl } from '../utils/getUseFetchRequestUrl'
import { getUseFetchResultFromResponse } from '../utils/getUseFetchResultFromResponse'

import { NON_BODY_HTTP_METHODS } from '../constants/http'

export const useFetch = <Result, QueryArgs>(
  baseArgs: UseFetchArgs<Result, QueryArgs>,
): UseFetchReturn<Result, QueryArgs> => {
  const {
    query,
    queryArgs,
    initialData,
    triggerOnLoad = true,
    triggerOnQueryArgsChange = true,
    transformRequestBody,
    transformRequestHeaders,
    transformRequestParams,
    transformRequestUrl,
    transformRequest,
    transformResponse,
    transformResult,
    transformError,
    fetcher: baseFetcher,
  } = baseArgs

  const [data, setData] = useState<Result | undefined>(initialData)
  const [error, setError] = useState<any | undefined>()

  const [inited, setInited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const fetcher: FetcherFn<Result> = async (args) => {
    if (baseFetcher) return baseFetcher(args)

    const { request, resultType = 'infer', errorResultType = 'infer' } = args

    const rawResponse = await fetch(request)
    const response = transformResponse ? transformResponse(rawResponse) : rawResponse

    const result = await getUseFetchResultFromResponse(response, resultType, errorResultType)

    if (response.ok) {
      return {
        result,
        error: undefined,
      }
    }

    return {
      error: result,
      result: undefined,
    }
  }

  const internalTrigger: InternalTriggerFn<Result> = async (fetchOptions) => {
    const {
      method = 'GET',
      params: rawParams,
      url: rawUrl,
      body: rawBody,
      headers: rawHeaders,
      resultType,
      errorResultType,
    } = fetchOptions

    const allowBody = !NON_BODY_HTTP_METHODS.includes(method)

    const body = transformRequestBody ? transformRequestBody(rawBody) : rawBody
    const headers = transformRequestHeaders ? transformRequestHeaders(rawHeaders) : rawHeaders
    const params = transformRequestParams ? transformRequestParams(rawParams) : rawParams
    const url = getUseFetchRequestUrl(rawUrl, params, transformRequestUrl)

    const rawRequest = new Request(url, {
      method,
      headers,
      body: allowBody ? JSON.stringify(body) : undefined,
    })
    const request = transformRequest ? transformRequest(rawRequest) : rawRequest

    setLoading(true)

    const { result: rawResult, error: rawError } = await fetcher({
      request,
      url,
      method,
      headers,
      params,
      body,
      resultType,
      errorResultType,
    })

    const success = !rawError

    const result: Result = success && transformResult ? transformResult(rawResult) : rawResult
    const transformedError = !success && transformError ? transformError(rawError) : rawError

    setData(success ? result : undefined)
    setError(success ? undefined : transformedError)

    setLoading(false)
    setFetched(true)

    if (success) {
      return {
        error: undefined,
        result,
      }
    }

    return {
      error: rawError,
      result: undefined,
    }
  }

  const trigger: UseFetchTriggerFn<Result, QueryArgs> = async (args) => {
    const fetchOptions = query(args)
    const result = internalTrigger(fetchOptions)
    return result
  }

  const reset = () => {
    setData(undefined)
    setError(undefined)
  }

  useEffect(() => {
    if (!triggerOnLoad || inited) {
      setInited(true)
      return
    }
    trigger(queryArgs as QueryArgs)
    setInited(true)
  }, [])

  useEffect(() => {
    if (!triggerOnQueryArgsChange || !inited) return
    trigger(queryArgs as QueryArgs)
  }, [queryArgs])

  return {
    data,
    error,
    loading,
    fetched,
    trigger,
    reset,
  }
}
