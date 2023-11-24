# Custom Fetchers

If you would like complete control over how reqeusts are sent, it is possible to pass a custom fetcher function as an arg of `useFetch`

This is not to be confused with modifying a request, as that can be done using the transform functions which can also be passed to `useFetch` (for more info on this, see [here](docs-customizing-requests))

A custom fetcher takes the url params, body, headers and `Request` object and should return an optional `Response` object as well as a value to be used as the `data` returned by `useFetch`

```ts
const fetcher = async (args) => {
    const { request, headers, params, body } = args

    // Example 1
    // We can initiate the fetch ourselves like `useFetch` does by default
    const response = await fetch(request)
    const result = await response.json()
    return { response, result }

    // Example 2
    // We don't even need to make the fetch, but we must always return some data to be returned by the hook
    // If we have a data cache, we can check the request to see if we already have data available for that request
    const dataIsInCache = cacheHasDataForRequest(args)
    if (dataIsInCache) {
        const result = getDataFromCache(args)
        // Here, we don't need to return a Response object, as we didn't actually make one
        return { result }
    } else {
        // ...make the fetch as in Example 1
        return { response, result }
    }
}

const customFetcherQuery = useFetch({
    ...options,
    fetcher
})
```

[docs-customizing-requests]: https://github.com/taennan/use-fetch/blob/main/docs/customizing-requests.md
