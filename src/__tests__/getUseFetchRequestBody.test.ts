import { getUseFetchRequestBody } from '../utils/getUseFetchRequestBody'

describe('getUseFetchRequestBody', () => {
  it('is defined', () => {
    expect(getUseFetchRequestBody).toBeDefined()
  })

  it('correctly merges dictionary-like args', () => {
    const expected = { a: 20 }
    const actual = getUseFetchRequestBody({ a: 10 }, expected)

    expect(actual).toEqual(expected)
  })

  it('correctly overrides non-dictionary-like args', () => {
    type Body = string | number

    const expected = 'AWESOME!'
    const actual = getUseFetchRequestBody<Body>(23, expected)

    expect(actual).toEqual(expected)
  })

  it('falls back to base arg when trigger arg is undefined', () => {
    type Body = string | undefined

    const expected = 'I was expecting you...'
    const actual = getUseFetchRequestBody<Body>(expected, undefined)

    expect(actual).toEqual(expected)
  })

  it('does not fall back to base arg when trigger arg is null', () => {
    type Body = string | null

    const expected = null
    const actual = getUseFetchRequestBody<Body>('I was not expecting you...', expected)

    expect(actual).toEqual(expected)
  })

  it('accepts functions as args', () => {
    const expected0 = { a: 10, b: '24' }
    const expected1 = { b: '24' }
    const actual = getUseFetchRequestBody(
      () => expected0,
      () => expected1,
    )

    expect(actual).toEqual({
      ...expected0,
      ...expected1,
    })
  })
})
