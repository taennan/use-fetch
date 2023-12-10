import type { TransformRequestUrlFn } from "../types/useFetch"
import type { RequestParams } from "../types/http"

export const getUseFetchRequestUrl = (url: string, queryParams?: RequestParams, transformFn?: TransformRequestUrlFn): string => {
  const urlQuery = Object.entries(queryParams ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const urlSeperator = urlQuery ? '?' : ''

  const rawUrl = `${url}${urlSeperator}${urlQuery}`
  const result = transformFn ? transformFn(rawUrl) : rawUrl
  return result
}
