import type {
  FetcherFn,
  InternalTriggerFn,
  UseFetchArgs,
  UseFetchReturn,
  UseFetchTriggerFn,
} from '../types/useFetch'

import { useState, useEffect } from 'react'
import { getUseFetchRequestBody } from '../utils/getUseFetchRequestBody'
import { getUseFetchRequestHeaders } from '../utils/getUseFetchRequestHeaders'
import { getUseFetchRequestUrl } from '../utils/getUseFetchRequestUrl'
import { getUseFetchResultFromResponse } from '../utils/getUseFetchResultFromResponse'
import { getUseFetchUrlParams } from '../utils/getUseFetchUrlParams'

import { NON_BODY_HTTP_METHODS } from '../constants/http'

export const useFetch = <Result, QueryArgs>(
  baseArgs: UseFetchArgs<Result, QueryArgs>,
): UseFetchReturn<Result, QueryArgs> => {
  const {
    query,
    resultType = 'infer',
    errorResultType = 'infer',
    initialArgs,
    initialData,
    transformRequestParams,
    transformRequestBody,
    transformRequestHeaders,
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

    const { request } = args

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
    } = fetchOptions

    const allowBody = !NON_BODY_HTTP_METHODS.includes(method)

    const params = getUseFetchUrlParams(rawParams, transformRequestParams)
    const url = getUseFetchRequestUrl(rawUrl, params)
    const body = getUseFetchRequestBody(rawBody, transformRequestBody)
    const headers = getUseFetchRequestHeaders(rawHeaders, transformRequestHeaders)

    const rawRequest = new Request(url, {
      method,
      headers,
      body: allowBody ? JSON.stringify(body) : undefined,
    })
    const request = transformRequest ? transformRequest(rawRequest) : rawRequest

    setLoading(true)

    const { result: rawResult, error: rawError } = await fetcher({
      request,
      headers,
      params,
      body,
    })
    const result: Result = transformResult ? transformResult(rawResult) : rawResult
    const transformedError = transformError ? transformError(rawError) : rawError

    const success = !rawError
    setData(success ? result : undefined)
    setError(success ? undefined : transformedError)

    setLoading(false)
    setFetched(true)
    setInited(true)

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

  useEffect(() => {
    if (inited || initialArgs === undefined) return
    trigger(initialArgs)
  }, [])

  return {
    data,
    error,
    loading,
    fetched,
    trigger,
  }
}
