import { isDictionaryLike } from '../utils/isDictionaryLike'

describe('is', () => {
  it('is defined', () => {
    expect(isDictionaryLike).toBeDefined()
  })

  it('returns true when passed an object', () => {
    expect(isDictionaryLike({})).toBe(true)
    expect(isDictionaryLike({ a: 10, b: '2' })).toBe(true)
  })

  it('returns false when passed anything that is not an object', () => {
    expect(isDictionaryLike([0, 1, 2])).toBe(false)
    expect(isDictionaryLike(new Array())).toBe(false)
    expect(isDictionaryLike('{}')).toBe(false)
    expect(isDictionaryLike(42)).toBe(false)
  })
})
