import { getUseFetchRequestUrl } from '../utils/getUseFetchRequestUrl'

describe('getUseFetchRequestUrl', () => {
  it('is defined', () => {
    expect(getUseFetchRequestUrl).toBeDefined()
  })

  it('correctly overrides passed args', () => {
    const expected = 'http://override.com'
    const actual = getUseFetchRequestUrl('http://overridden.com', expected, {})

    expect(actual).toEqual(expected)
  })

  it('accepts functions as args', () => {
    const url0 = 'http://test0.com'
    const url1 = 'http://test1.com'
    const actual = getUseFetchRequestUrl(
      () => url0,
      () => url1,
      {},
    )

    expect(actual).toEqual(url1)
  })

  it('falls back to first url if second is falsy', () => {
    for (const falsyUrl of [undefined, '']) {
      const expected = 'http://test0.com'
      const actual = getUseFetchRequestUrl(expected, falsyUrl, {})

      expect(actual).toEqual(expected)
    }
  })

  it('appends query params to base url', () => {
    const baseUrl = 'http://www.test.com'
    const expected = `${baseUrl}?a=Apple&B=2`
    const actual = getUseFetchRequestUrl(baseUrl, '', {
      a: 'Apple',
      B: 2,
    })
    expect(actual).toBe(expected)
  })
})
