import { getUseFetchUrlParams } from '../utils/getUseFetchUrlParams'

describe('getUseFetchUrlParams', () => {
  it('is defined', () => {
    expect(getUseFetchUrlParams).toBeDefined()
  })

  it('correctly overrides passed args', () => {
    const expected = { a: 20 }
    const actual = getUseFetchUrlParams({ a: 10 }, expected)

    expect(actual).toEqual(expected)
  })

  it('accepts functions as args', () => {
    const expected0 = { a: 10 }
    const expected1 = { a: 10, b: 24 }
    const actual = getUseFetchUrlParams(() => expected0, () => expected1)

    expect(actual).toEqual({
      ...expected0,
      ...expected1,
    })
  })
})
