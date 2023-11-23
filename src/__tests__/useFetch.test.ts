import { enableFetchMocks } from 'jest-fetch-mock'
import { act, renderHook } from '@testing-library/react-hooks'
import { useFetch } from '../hooks/useFetch'

enableFetchMocks()

beforeEach(() => {
  fetchMock.resetMocks()
})

const MOCK_URL = 'http://www.helpful-hooks.com/use-fetch/'

describe('useFetch', () => {
  it('is defined', () => {
    expect(useFetch).toBeDefined()
  })

  it('sets data on successful fetch', async () => {
    const mockResult = 'SUCCESS'
    fetchMock.mockResponseOnce(mockResult)

    const { result: hook, waitForNextUpdate } = renderHook(() =>
      useFetch({ url: MOCK_URL + 'data-test', resultType: 'text' }),
    )

    await waitForNextUpdate()

    expect(hook.current.data).toBeDefined()
    expect(hook.current.data).toEqual(mockResult)
    expect(hook.current.error).not.toBeDefined()
  })

  it('sets error on unsuccessful fetch', async () => {
    const mockError = {
      message: 'Not found',
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockError), {
      status: 404
    })

    const { result: hook, waitForNextUpdate } = renderHook(() =>
      useFetch({ url: MOCK_URL + 'error-test', errorResultType: 'json' }),
    )

    await waitForNextUpdate()

    expect(hook.current.data).not.toBeDefined()
    expect(hook.current.error).toBeDefined()
    expect(hook.current.error).toEqual(mockError)
  })

  it('will not immediately trigger if triggerOnLoad === false', async () => {
    const mockResult = 'SUCCESS'
    fetchMock.mockResponseOnce(mockResult)

    const { result: hook, waitForNextUpdate } = renderHook(() =>
      useFetch({ url: MOCK_URL + 'error-test', resultType: 'text', triggerOnLoad: false }),
    )

    expect(hook.current.data).not.toBeDefined()
    expect(hook.current.error).not.toBeDefined()
    expect(hook.current.fetched).toEqual(false)

    act(() => {
      hook.current.trigger()
    })

    await waitForNextUpdate()

    expect(hook.current.data).toBeDefined()
    expect(hook.current.data).toEqual(mockResult)
    expect(hook.current.error).not.toBeDefined()
  })

  it('uses correct body when passed via function', async () => {
    const mockBody = {
      a: 'Apple',
      b: 2,
    }
    const getBody = () => mockBody

    fetchMock.mockResponseOnce(async (req) => {
      const body = await req.json()
      return JSON.stringify(body)
    })

    const { result: hook, waitForNextUpdate } = renderHook(() =>
      useFetch({
        method: 'POST',
        resultType: 'json',
        url: MOCK_URL + 'fn-body-test',
        body: getBody,
      }),
    )

    await waitForNextUpdate()

    expect(hook.current.data).toBeDefined()
    expect(hook.current.data).toEqual(mockBody)
    expect(hook.current.error).not.toBeDefined()
  })

  it('uses correct params when passed via function', async () => {
    const url = MOCK_URL + 'fn-param-test'
    const urlParams = {
      a: 'Apple',
      b: 2,
    }
    const getUrlParams = () => urlParams

    fetchMock.mockResponseOnce(async (req) => {
      expect(req.url).toMatch(new RegExp(`^${url}\?`))
      expect(req.url).toMatch('a=Apple')
      expect(req.url).toMatch('b=2')
      return 'SUCCESS'
    })

    const { waitForNextUpdate } = renderHook(() =>
      useFetch({
        url,
        resultType: 'text',
        params: getUrlParams,
      }),
    )

    await waitForNextUpdate()
  })

  it('triggers a fetch on param change', async () => {
    const mockResult = 'TEST'
    let urlParams = { a: 10 }
    let triggerCount: number = 0

    fetchMock.mockResponse(async () => {
      triggerCount++
      return mockResult
    })

    const {
      result: hook,
      rerender,
      waitForNextUpdate,
    } = renderHook(() =>
      useFetch({
        url: MOCK_URL + 'param-change-fetch',
        resultType: 'text',
        params: urlParams,
        triggerOnLoad: false,
      }),
    )

    expect(triggerCount).toEqual(0)
    expect(hook.current.data).not.toBeDefined()
    expect(hook.current.error).not.toBeDefined()

    urlParams = { a: 43 }
    rerender()

    await waitForNextUpdate()

    expect(triggerCount).toEqual(1)
    expect(hook.current.data).toBeDefined()
    expect(hook.current.data).toEqual(mockResult)
    expect(hook.current.error).not.toBeDefined()
  })

  it('does not trigger a fetch on change to triggerOnBodyChange', async () => {
    let triggerCount: number = 0
    let triggerOnBodyChange = false
    const body = {}

    fetchMock.mockResponse(async () => {
      triggerCount++
      return 'SUCCESS'
    })

    const { result: hook, rerender } = renderHook(() =>
      useFetch({
        url: MOCK_URL + 'no-trigger-on-change-to-triggerOnBodyChange',
        resultType: 'text',
        method: 'post',
        body,
        triggerOnLoad: false,
        triggerOnBodyChange,
      }),
    )

    expect(triggerCount).toEqual(0)
    expect(hook.current.data).not.toBeDefined()
    expect(hook.current.error).not.toBeDefined()

    triggerOnBodyChange = true
    rerender()

    expect(triggerCount).toEqual(0)
    expect(hook.current.data).not.toBeDefined()
    expect(hook.current.error).not.toBeDefined()
  })

  it('transforms body before sending request', async () => {
    const mockBody = {
      a: 'Apple',
      b: 2,
    }
    const getBody = () => mockBody

    fetchMock.mockResponseOnce(async (req) => {
      const body = await req.json()
      const convertedBody = Object.fromEntries(
        Object.entries(body).map(([k, v]) => [k.toUpperCase(), v]),
      )
      return JSON.stringify(convertedBody)
    })

    const { result: hook, waitForNextUpdate } = renderHook(() =>
      useFetch({
        method: 'POST',
        resultType: 'json',
        url: MOCK_URL + 'transform-request-body',
        body: getBody,
        transformRequestBody: (body) => {
          if (!body) return body
          const entries = Object.entries(body).map(([k, v]) => [k.toUpperCase(), v])
          return Object.fromEntries(entries)
        },
      }),
    )

    await waitForNextUpdate()

    expect(hook.current.data).toBeDefined()
    expect(hook.current.data).toEqual({
      A: mockBody.a,
      B: mockBody.b,
    })
    expect(hook.current.error).not.toBeDefined()
  })
})
