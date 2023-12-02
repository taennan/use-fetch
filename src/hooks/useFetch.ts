import type { FetcherFn, UseFetchArgs, UseFetchReturn, UseFetchTriggerFn } from '../types/useFetch'
import type { RequestBody, RequestParams } from '../types/http'

import { useState, useEffect } from 'react'
import { getUseFetchRequestBody } from '../utils/getUseFetchRequestBody'
import { getUseFetchRequestHeaders } from '../utils/getUseFetchRequestHeaders'
import { getUseFetchRequestUrl } from '../utils/getUseFetchRequestUrl'
import { getUseFetchResultFromResponse } from '../utils/getUseFetchResultFromResponse'
import { getUseFetchUrlParams } from '../utils/getUseFetchUrlParams'

import { NON_BODY_HTTP_METHODS } from '../constants/http'

export const useFetch = <Result, Params extends RequestParams, Body extends RequestBody>(
  baseArgs: UseFetchArgs<Result, Params, Body>,
): UseFetchReturn<Result, Params, Body> => {
  const {
    method = 'GET',
    resultType = 'infer',
    errorResultType = 'infer',
    initialData,
    triggerOnLoad = true,
    triggerOnUrlChange = true,
    triggerOnParamChange = true,
    triggerOnBodyChange = true,
    transformRequestParams,
    transformRequestBody,
    transformRequestHeaders,
    transformRequest,
    transformResponse,
    transformResult,
    transformError,
    fetcher: baseFetcher,
  } = baseArgs

  const allowBody = !NON_BODY_HTTP_METHODS.includes(method)

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
        error: undefined 
      }
    }

    return { 
      error: result, 
      result: undefined 
    }
  }

  const trigger: UseFetchTriggerFn<Result, Params, Body> = async (triggerArgs = {}) => {
    const params = getUseFetchUrlParams<Params>(
      baseArgs.params,
      triggerArgs.params,
      transformRequestParams,
    )
    const url = getUseFetchRequestUrl(baseArgs.url, triggerArgs.url, params)
    const body = getUseFetchRequestBody(baseArgs.body, triggerArgs.body, transformRequestBody)
    const headers = getUseFetchRequestHeaders(
      baseArgs.headers,
      triggerArgs.headers,
      transformRequestHeaders,
    )

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

  useEffect(() => {
    if (triggerOnLoad) trigger()
    setInited(true)
  }, [])

  useEffect(() => {
    if (!triggerOnUrlChange || !inited) return
    trigger()
  }, [baseArgs.url])

  useEffect(() => {
    if (!triggerOnParamChange || !inited) return
    trigger()
  }, [baseArgs.params])

  useEffect(() => {
    if (!allowBody || !triggerOnBodyChange || !inited) return
    trigger()
  }, [baseArgs.body])

  return {
    data,
    error,
    loading,
    fetched,
    trigger,
  }
}
