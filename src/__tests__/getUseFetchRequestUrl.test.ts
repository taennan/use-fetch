import { getUseFetchRequestUrl } from '../utils/getUseFetchRequestUrl'

describe('getUseFetchRequestUrl', () => {
  it('is defined', () => {
    expect(getUseFetchRequestUrl).toBeDefined()
  })

  it('returns url passed if nothing else is passed', () => {
    const expected = 'http://expected.com'
    const actual = getUseFetchRequestUrl(expected)

    expect(actual).toBe(expected)
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

  it('runs transformation on url if transform function is passed', () => {
    const expected = 'http://expected.com'
    const actual = getUseFetchRequestUrl('http://unexpected.com/', {}, () => expected)

    expect(actual).toBe(expected)
  })
})
