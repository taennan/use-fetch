import { getRequestUrl } from '../utils/getRequestUrl'

describe('getRequestUrl', () => {
  it('is defined', () => {
    expect(getRequestUrl).toBeDefined()
  })

  it('returns the base url', () => {
    const expected = 'http://www.test.com/'
    const actual = getRequestUrl(expected)
    expect(actual).toBe(expected)
  })

  it('appends query params to base url', () => {
    const baseUrl = 'http://www.test.com'
    const expected = `${baseUrl}?a=Apple&B=2`
    const actual = getRequestUrl(baseUrl, {
      a: 'Apple',
      B: 2,
    })
    expect(actual).toBe(expected)
  })
})
