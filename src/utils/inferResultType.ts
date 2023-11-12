import type { ResultType } from '../types/useFetch'

export const inferResultType = (response: Response): ResultType | null => {
  const contentType = response.headers.get('content-type')
  if (contentType === 'application/json') return 'json'
  if (contentType?.includes('text')) return 'text'
  return null
}
