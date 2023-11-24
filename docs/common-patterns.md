# Common Patterns

## Passing request data

The `params`, `body`, `headers` and `url` of a request can be passed as either raw objects or functions which return an object (or `string` in the case of `url`) to be used by the request

If used directly in components, these objects and functions __MUST__ be wrapped in `useCallback` to stop fetches from triggering continuously

```ts
import { useState, useCallback } from 'react'

const [params] = useState({ a: 1, b: '2' })
const getHeaders = useCallback(() => {
    return { accessToken: 'gimme_access!' }
})

const noFunctionQuery = useFetch({
    // If passing a raw string or number, we do not need to wrap in state
    url: 'http://my-api',
    body: 42,
    // When passing an object, we must wrap it in state to stop constant fetches
    params,
    // We also must wrap functions in useCallback to stop constant fetches
    headers: getHeaders,
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

## Declaring custom hooks outside components

As `useFetch` is designed to be as flexible as possible, it exposes many args which are not always required in most cases

It is recommended to wrap `useFetch` in a custom hook outside any component to keep it reusable and to only expose the necessary args inside components

```ts
interface User {
    id: number
    email: string
}

interface SearchArgs {
    id: number
    email: string
}

// This hook can then be imported into a component and will run whenever `email` is changed
const getUserByEmailQuery = (email: string) => (
    useFetch<User, SearchArgs, never>({
        url: 'http://my-api.com',
        params: { email }
    })
)
```

## Determining when requests are automatically sent

By default, `useFetch` triggers fetches at these times:
- On mount
- On change to `params` arg
- On change to `body` arg if not a `GET` or `HEAD` request
- On change to `url` arg

These can all be toggled using the following `boolean` args
- `triggerOnLoad`
- `triggerOnUrlChange`
- `triggerOnParamChange`
- `triggerOnBodyChange`

The following example will only automatically trigger a fetch when mounted and when the `params` arg changes

```ts
const triggerToggleQuery = useFetch({
    ...options,
    triggerOnUrlChange: false,
    triggerOnParamChange: false,
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
