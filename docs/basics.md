# The Basics

## Contents

- [Passing request data](#passing-request-data)
- [Using response data](#using-response-data)
- [Determining when requests are automatically sent](#determining-when-requests-are-automatically-sent)
- [Explicitly setting result type](#explicitly-setting-result-type)

## Passing request data

The data passed to `queryArgs` in `useFetch` is used internally by the `query` function in order to generate a `Request`

By default, any change in `queryArgs` will cause a request to be sent automatically

If the data passed to `queryArgs` is an object, it __MUST__ be wrapped in `useState` or `useMemo` to stop infinite fetches when `triggerOnQueryArgsChange` is true

```ts
import { useState, useCallback } from 'react'

const [headers] = useState({ accessToken: 'gimme_access!' })
const [body] = useState({ a: 'B', c: 'Easy as 1, 2, 3' })
const queryArgs = useMemo(() => ({ headers, body }), [headers, body])

const query = useFetch({
    queryArgs,
    query: ({ headers, body }) => ({
        url: 'http://my-api',
        headers,
        body,
    })
})
```

## Using response data

The `useFetch` hook returns the following which can be used in rendering your component:
- `data`: The body returned from a successful request
- `loading`: Is `true` if the fetch is underway
- `fetched`: Is `true` if at least one fetch has been made
- `error`: The body returned from an unsuccessful request

```tsx
import { useFetch } from '@helpful-hooks/use-fetch'

const QuoteOfTheDayComponent = () => {
    const { data, loading, error } = useFetch(options)

    if (error) return <p>Oops... something went wrong</p>

    if (loading) return <p>Loading...</p>

    if (data) {
        const { quote, author, book } = data
        return (
            <>
                <h1>The quote of the day is</h1>
                <blockquote>
                    <p>{quote}</p>
                    <footer>{author}<cite>{book}</cite></footer>
                </blockquote>
            </>
        )
    }

    return null
}
```

## Determining when requests are automatically sent

By default, `useFetch` triggers fetches at these times:
- On mount
- On change to `queryArgs` arg

These can all be toggled using the following `boolean` args passed to the `useFetch` hook
- `triggerOnLoad`
- `triggerOnQueryArgsChange`

The following example will only automatically trigger a fetch when mounted, but not when `queryArgs` change

```ts
const triggerToggleQuery = useFetch({
    ...options,
    triggerOnQueryArgsChange: false,
})
```

## Explicitly setting result type

The `useFetch` hook automatically infers whether to parse a response body as `text` or `json` based on the `content-type` header sent with the response

If `content-type` is '`application/json`', `response.json()` will be used to extract the response body, otherwise it will use `response.text()`

To force the use of either `response.json()` or `response.text()` use the `resultType` and `errorResultType` options in the `useFetch` args

```ts
const resultTypeQuery = useFetch({
    ...options,
    // `resultType` is used for successful requests, `errorResultType` for unsuccessful ones
    // Can be one of 'text', 'json' or 'infer'
    // Using 'infer' results in the default behaviour
    resultType: 'text',
    errorResultType: 'json'
})
```
