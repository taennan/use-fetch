import { getUseFetchRequestHeaders } from '../utils/getUseFetchRequestHeaders'

describe('getUseFetchRequestHeaders', () => {
  it('is defined', () => {
    expect(getUseFetchRequestHeaders).toBeDefined()
  })

  it('correctly overrides passed args', () => {
    const expected = { 'content-type': 'application/json' }
    const actual = getUseFetchRequestHeaders({ 'content-type': 'text/html' }, expected)

    expect(actual).toEqual(expected)
  })

  it('accepts functions as args', () => {
    const expected0 = { 'content-type': 'application/json' }
    const expected1 = { 'access-token': 'GIMME_ACCESS!! ;)' }
    const actual = getUseFetchRequestHeaders(
      () => expected0,
      () => expected1,
    )

    expect(actual).toEqual({
      ...expected0,
      ...expected1,
    })
  })
})
