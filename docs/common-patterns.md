# Common Patterns

## Passing request data

The data passed to `queryArgs` in `useFetch` is used internally by the `query` function in order to generate a `Request`.

If an object, the data passed to `queryArgs` __MUST__ be wrapped in `useState` or `useMemo` to stop infinite fetches when `triggerOnQueryArgsChange` is true

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

## Setting initial data

Use the `intitialData` option in `useFetch` to set the `data` returned by the hook before any fetches are made

This is useful in SSR environments, as ordinarily, automatic fetches are made after the component has mounted __on the client side__

```ts
const { data, fetched } = useFetch({
    initialData: 54,
    triggerOnLoad: false,
    query: () => ({
        url: '...'
    })
})

console.info(data === 54)        // -> true
console.info(fetched === false)  // -> true
```

## Reset state

Use the `clear` function returned from `useFetch` to set `data` and `error` to `undefined`

```ts
const { data, error, clear } = useFetch({
    initialData: 'abcd',
    query: () => ({
        url: '...'
    })
})

console.info(data === 'abcd')      // -> true

clear()

console.info(data === undefined)   // -> true
console.info(error === undefined)  // -> true
```

The `clear` function only resets `data` and `error`. Properties like `fetched` and `loading` will remain unchanged

To reset the hook to it's initial state (setting `fetched` and `loading` back to `false`), the `reset` function can be called

Note that with `reset`, the `data` property will be set to the `initialData` passed to `useFetch` (if any)

```ts
const { data, fetched, trigger, reset } = useFetch({
    initialData: 'abcd',
    triggerOnLoad: false,
    query: () => ({
        url: '...'
    })
})

console.info(data === 'abcd')    // -> true
console.info(fetched === false)  // -> true

await trigger()

console.info(data === 'something-returned-from-fetch')  // -> true
console.info(fetched === true)                          // -> true

reset()

console.info(data === 'abcd')    // -> true
console.info(fetched === false)  // -> true
```

## Declaring custom hooks outside components

As `useFetch` is designed to be as flexible as possible, it exposes many args which are not always required in most cases

It is recommended to wrap `useFetch` in a custom hook outside any component to keep it reusable and to only expose the necessary args inside components

```ts
// This hook can then be imported into a component and will run whenever `email` is changed
const getUserByEmailQuery = (email: string) =>
    useFetch({
        queryArgs: email,
        query: (args) => ({
            url: 'http://my-api.com',
            params: { email }
        })
    })
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
const query = useFetch({
    ...options,
    triggerOnQueryArgsChange: false,
})
```

## Explicitly setting result type

The `useFetch` hook automatically infers whether to parse a response body as `text` or `json` based on the `content-type` header sent with the response

If `content-type` is '`application/json`', `response.json()` will be used to extract the response body, otherwise it will use `response.text()`

To force the use of either `response.json()` or `response.text()` use the `resultType` and `errorResultType` options

```ts
const query = useFetch({
    query: () => ({
        url: '...',
        // `resultType` is used for successful requests, `errorResultType` for unsuccessful ones
        // Can be one of 'text', 'json' or 'infer'
        // Using 'infer' results in the default behaviour
        resultType: 'text',
        errorResultType: 'json'
    })
})
```
