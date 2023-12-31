import { enableFetchMocks } from 'jest-fetch-mock'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useMemo } from 'react'
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

    const { result: hook } = renderHook(() =>
      useFetch({
        query: () => ({
          url: MOCK_URL + 'data',
        }),
      }),
    )

    await waitFor(() => {
      expect(hook.current.data).toBeDefined()
      expect(hook.current.data).toBe(mockResult)
      expect(hook.current.error).not.toBeDefined()
    })
  })

  it('sets error on unsuccessful fetch', async () => {
    const mockError = {
      message: 'Not found',
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockError), {
      status: 404,
    })

    const { result: hook } = renderHook(() =>
      useFetch({
        query: () => ({
          url: MOCK_URL + 'error',
          errorResultType: 'json',
        }),
      }),
    )

    await waitFor(() => {
      expect(hook.current.data).not.toBeDefined()
      expect(hook.current.error).toBeDefined()
      expect(hook.current.error).toEqual(mockError)
    })
  })

  it('will not immediately trigger if triggerOnLoad === false', async () => {
    const mockResult = 'SUCCESS'
    fetchMock.mockResponseOnce(mockResult)

    const { result: hook } = renderHook(() =>
      useFetch<any, void>({
        triggerOnLoad: false,
        query: () => ({
          url: MOCK_URL + 'no-trigger-on-load',
        }),
      }),
    )

    expect(hook.current.data).not.toBeDefined()
    expect(hook.current.error).not.toBeDefined()
    expect(hook.current.fetched).toEqual(false)

    act(() => {
      hook.current.trigger()
    })

    await waitFor(() => {
      expect(hook.current.data).toBeDefined()
      expect(hook.current.data).toBe(mockResult)
      expect(hook.current.error).not.toBeDefined()
    })
  })

  it('triggers a fetch on query args change', async () => {
    let triggerCount: number = 0
    let queryArgs = { num: 7 }
    const getResult = (n: number) => ({
      message: `Number is ${n}`,
    })

    fetchMock.mockResponse(async (req) => {
      triggerCount++
      const { num } = await req.json()
      return JSON.stringify(getResult(num))
    })

    const { result: hook, rerender } = renderHook(() =>
      useFetch({
        triggerOnLoad: false,
        queryArgs,
        query: (args) => ({
          url: MOCK_URL + 'query-arg-change-trigger',
          method: 'POST',
          resultType: 'json',
          body: args,
        }),
      }),
    )

    expect(triggerCount).toEqual(0)
    expect(hook.current.data).not.toBeDefined()
    expect(hook.current.error).not.toBeDefined()
    expect(hook.current.fetched).toBe(false)

    queryArgs = { num: 117 }
    rerender()

    await waitFor(() => {
      expect(triggerCount).toEqual(1)
      expect(hook.current.data).toBeDefined()
      expect(hook.current.data).toEqual(getResult(queryArgs.num))
      expect(hook.current.error).not.toBeDefined()
      expect(hook.current.fetched).toBe(true)
    })
  })

  it('does not trigger a fetch on change to triggerOnQueryArgsChange', async () => {
    let triggerCount: number = 0
    let triggerOnQueryArgsChange = false

    fetchMock.mockResponse(async () => {
      triggerCount++
      return 'SUCCESS'
    })

    const { result: memoHook } = renderHook(() => useMemo(() => 10, []))
    const { result: hook, rerender } = renderHook(() =>
      useFetch({
        triggerOnLoad: false,
        triggerOnQueryArgsChange,
        queryArgs: memoHook.current,
        query: () => ({
          url: MOCK_URL + 'no-trigger-on-change-to-triggerOnQueryArgsChange',
        }),
      }),
    )

    expect(triggerCount).toEqual(0)
    expect(hook.current.data).not.toBeDefined()
    expect(hook.current.error).not.toBeDefined()
    expect(hook.current.fetched).toBe(false)

    triggerOnQueryArgsChange = true
    rerender()

    await waitFor(() => {
      expect(triggerCount).toEqual(0)
      expect(hook.current.data).not.toBeDefined()
      expect(hook.current.error).not.toBeDefined()
      expect(hook.current.fetched).toBe(false)
    })
  })

  it('uses passed params in url', async () => {
    const url = MOCK_URL + 'fn-param'
    const urlParams = {
      a: 'Apple',
      b: 2,
    }

    fetchMock.mockResponseOnce(async (req) => {
      expect(req.url).toMatch(new RegExp(`^${url}\?`))
      expect(req.url).toMatch('a=Apple')
      expect(req.url).toMatch('b=2')
      return 'SUCCESS'
    })

    renderHook(() =>
      useFetch({
        query: () => ({
          url,
          params: urlParams,
        }),
      }),
    )

    await waitFor(() => {})
  })

  it('transforms body before sending request', async () => {
    const mockBody = {
      a: 'Apple',
      b: 2,
    }

    fetchMock.mockResponseOnce(async (req) => req.text())

    const { result: hook } = renderHook(() =>
      useFetch({
        query: () => ({
          url: MOCK_URL + 'transform-request-body',
          method: 'POST',
          resultType: 'json',
          body: mockBody,
        }),
        transformRequestBody: (body) => {
          if (!body) return body
          const entries = Object.entries(body).map(([k, v]) => [k.toUpperCase(), v])
          return Object.fromEntries(entries)
        },
      }),
    )

    await waitFor(() => {
      expect(hook.current.data).toBeDefined()
      expect(hook.current.data).toEqual({
        A: mockBody.a,
        B: mockBody.b,
      })
      expect(hook.current.error).not.toBeDefined()
    })
  })

  it('returns result from trigger function on successful request', async () => {
    const mockResult = 'WOOHOO!'
    fetchMock.mockResponseOnce(mockResult)

    const { result: hook } = renderHook(() =>
      useFetch<string, void>({
        triggerOnLoad: false,
        query: () => ({
          url: MOCK_URL + 'success-trigger',
        }),
      }),
    )
    
    await act(async () => {
      const { error, result } = await hook.current.trigger()
      expect(error).not.toBeDefined()
      expect(result).toBeDefined()
      expect(result).toEqual(mockResult)
    })
  })

  it('returns error from trigger function on unsuccessful request', async () => {
    const mockError = {
      message: 'Not found',
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockError), {
      status: 404,
    })

    const { result: hook } = renderHook(() =>
      useFetch<typeof mockError, void>({
        triggerOnLoad: false,
        query: () => ({
          url: MOCK_URL + 'error-trigger',
          errorResultType: 'json',
        }),
      }),
    )

    await act(async () => {
      const { error, result } = await hook.current.trigger()
      expect(error).toBeDefined()
      expect(error).toEqual(mockError)
      expect(result).not.toBeDefined()
    })
  })

  it('sets data to undefined when `clear` is called', async () => {
    const { result: hook } = renderHook(() =>
      useFetch<number, void>({
        triggerOnLoad: false,
        initialData: 123,
        query: () => ({
          url: MOCK_URL + 'data-clear',
          errorResultType: 'json',
        }),
      }),
    )

    expect(hook.current.data).toBe(123)

    act(hook.current.clear)

    expect(hook.current.data).not.toBeDefined()
  })

  it('sets error to undefined when `clear` is called', async () => {
    const mockError = {
      message: 'Not found',
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockError), {
      status: 404,
    })

    const { result: hook } = renderHook(() =>
      useFetch<typeof mockError, void>({
        query: () => ({
          url: MOCK_URL + 'error-clear',
          errorResultType: 'json',
        }),
      }),
    )

    await waitFor(() => {
      expect(hook.current.data).not.toBeDefined()
      expect(hook.current.error).toEqual(mockError)
    })

    act(hook.current.clear)

    await waitFor(() => {
      expect(hook.current.data).not.toBeDefined()
      expect(hook.current.error).not.toBeDefined()
    })
  })

  it('resets to initial state when `reset` is called', async () => {
    const initialData = '1234'
    const responseData = 'abcd'

    fetchMock.mockResponseOnce(responseData)

    const { result: hook } = renderHook(() =>
      useFetch<string, void>({
        initialData,
        triggerOnLoad: false,
        query: () => ({
          url: MOCK_URL + 'reset',
        }),
      }),
    )

    expect(hook.current.data).toBe(initialData)
    expect(hook.current.fetched).toBe(false)

    await act(hook.current.trigger)

    await waitFor(() => {
      expect(hook.current.data).toBe(responseData)
      expect(hook.current.fetched).toBe(true)
    })

    act(hook.current.reset)

    await waitFor(() => {
      expect(hook.current.data).toBe(initialData)
      expect(hook.current.fetched).toBe(false)
    })
  })
})
