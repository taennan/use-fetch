import type { UseFetchArgsResultType } from '../types/useFetch'

import { inferResultType } from './inferResultType'

export const getUseFetchResultFromResponse = async (
  response: Response,
  successResultType: UseFetchArgsResultType,
  errorResultType: UseFetchArgsResultType,
): Promise<any> => {
  const { ok } = response
  const resultType = ok ? successResultType : errorResultType
  const inferredResultType = resultType === 'infer' ? inferResultType(response) : resultType
  const finalResultType = inferredResultType ?? 'text'

  if (finalResultType === 'json') return response.json()
  if (finalResultType === 'text') return response.text()
  return undefined
}
