export const getUseFetchRequestUrl = (url: string, queryParams: Record<string, any>): string => {
  const urlQuery = Object.entries(queryParams ?? {})
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const urlSeperator = urlQuery ? '?' : ''

  const result = `${url}${urlSeperator}${urlQuery}`
  return result
}
