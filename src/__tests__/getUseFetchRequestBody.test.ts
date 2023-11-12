import { getUseFetchRequestBody } from '../utils/getUseFetchRequestBody'

describe('getUseFetchRequestBody', () => {
  it('is defined', () => {
    expect(getUseFetchRequestBody).toBeDefined()
  })

  it('correctly overrides passed args', () => {
    const expected = { a: 20 }
    const actual = getUseFetchRequestBody({ a: 10 }, expected)
    
    expect(actual).toEqual(expected)
  })

  it('accepts functions as args', () => {
    const expected0 = { a: 10, b: '24' }
    const expected1 = { b: '24' }
    const actual = getUseFetchRequestBody(() => expected0, () => expected1)

    expect(actual).toEqual({
      ...expected0,
      ...expected1,
    })
  })
})
