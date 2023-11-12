import type { UseFetchArgsResultType } from '../types/useFetch'

import { inferResultType } from './inferResultType'

export const getUseFetchResultFromResponse = async (
  response: Response,
  resultType: UseFetchArgsResultType,
) => {
  const { ok } = response
  const inferredOrDefaultResultType =
    resultType === 'infer' || !ok ? inferResultType(response) : resultType
  const finalResultType = inferredOrDefaultResultType ?? 'text'

  if (finalResultType === 'json') return response.json()
  if (finalResultType === 'text') return response.text()
  return undefined
}
