import 'whatwg-fetch'
import { getUseFetchResultFromResponse } from '../utils/getUseFetchResultFromResponse'

describe('getUseFetchResultFromResponse', () => {
  it('is defined', () => {
    expect(getUseFetchResultFromResponse).toBeDefined()
  })

  it('returns specified result type on successful response', async () => {
    const mockResult = { who: 'let the dogs out' }
    const response = new Response(JSON.stringify(mockResult))

    const expected = mockResult
    const actual = await getUseFetchResultFromResponse(response, 'json', 'text')

    expect(actual).toEqual(expected)
  })

  it('returns specified result type on unsuccessful response', async () => {
    const mockResult = "Can't touch this!"
    const response = new Response(mockResult, {
      status: 403,
      headers: { 'content-type': 'text/plain' },
    })

    const expected = mockResult
    const actual = await getUseFetchResultFromResponse(response, 'json', 'text')

    expect(actual).toEqual(expected)
  })

  it('returns inferred result type on any response', async () => {
    const responseData = [
      {
        status: 200,
        body: 'Gimme Gimme Gimme!',
        contentType: 'text/plain',
      },
      {
        status: 404,
        body: JSON.stringify({
          and: 'no one heard at all',
          not: 'even the chairs',
        }),
        contentType: 'application/json',
      },
    ] as const

    for (const data of responseData) {
      const { body, status, contentType } = data
      const response = new Response(
        body, 
        { 
            status, 
            headers: { 'content-type': contentType } 
        }
    )

      const expected = contentType === 'application/json' ? JSON.parse(body) : body
      const actual = await getUseFetchResultFromResponse(response, 'infer', 'infer')

      expect(actual).toEqual(expected)
    }
  })
})
