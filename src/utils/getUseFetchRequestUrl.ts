import type { RequestParams } from "../types/http"

export const getUseFetchRequestUrl = (url: string, queryParams?: RequestParams): string => {
  const urlQuery = Object.entries(queryParams ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const urlSeperator = urlQuery ? '?' : ''

  const result = `${url}${urlSeperator}${urlQuery}`
  return result
}
