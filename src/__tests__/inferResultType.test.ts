import 'whatwg-fetch'
import { inferResultType } from '../utils/inferResultType'

const responseFromContentType = (contentType: string): Response =>
  new Response('', {
    headers: {
      'content-type': contentType,
    },
  })

describe('inferResultType', () => {
  it('is defined', () => {
    expect(inferResultType).toBeDefined()
  })

  it("returns 'json' when header content type is 'application/json'", () => {
    const response = responseFromContentType('application/json')
    const expected = 'json'
    const actual = inferResultType(response)

    expect(actual).toBe(expected)
  })

  it("returns 'text' when header content type is text-like", () => {
    const contentTypes = ['text/html', 'text/xml']
    for (const contentType of contentTypes) {
      const response = responseFromContentType(contentType)
      const expected = 'text'
      const actual = inferResultType(response)

      expect(actual).toBe(expected)
    }
  })

  it('returns null when header content type cannot be inferred', () => {
    const response = responseFromContentType('nonexistent-mime-type')
    const expected = null
    const actual = inferResultType(response)

    expect(actual).toBe(expected)
  })
})
