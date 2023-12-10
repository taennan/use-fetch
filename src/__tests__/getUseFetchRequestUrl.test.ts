import { getUseFetchRequestUrl } from '../utils/getUseFetchRequestUrl'

describe('getUseFetchRequestUrl', () => {
  it('is defined', () => {
    expect(getUseFetchRequestUrl).toBeDefined()
  })

  it('appends query params to base url', () => {
    const baseUrl = 'http://www.test.com'
    const expected = `${baseUrl}?a=Apple&B=2`
    const actual = getUseFetchRequestUrl(baseUrl, {
      a: 'Apple',
      B: 2,
    })
    expect(actual).toBe(expected)
  })
})
