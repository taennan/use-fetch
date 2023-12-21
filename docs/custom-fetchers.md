# Custom Fetchers

If you would like complete control over how reqeusts are sent, it is possible to pass a custom fetcher function as an arg of `useFetch`

This is not to be confused with modifying a request, as that can be done using the transform functions which can also be passed to `useFetch` (for more info on this, see [here](docs-customizing-requests))

A custom fetcher should take an object with the following fields as it's single parameter:

- `url`
- `params`
- `body`
- `headers`
- `resultType`
- `errorResultType`
- `request`

All the above are the values returned by the `query` function passed to the hook, with the exception being `request`, which is the `Request` object generated from all the previous fields

Since the fetcher is called after all the transformation functions are called, all the above fields will not necessarily be the same as the values passed to the `query` function

The custom fetcher should then return a single object with the following fields:

- `result` - The optional value to be used as `data` returned by the hook
- `error` - The optional value to be used as `error` returned by the hook

If an error occurs inside the fetcher, set `result` to `undefined` in order to ensure the hook is correctly set to it's error state. Otherwise, `error` should be left as `undefined`

```ts
const fetcher = async (args) => {
    const { request, headers, params, body } = args

    // Example 1
    // We can initiate the fetch ourselves like `useFetch` does by default
    const response = await fetch(request)
    const result = await response.json()
    return { result }

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
        return { result }
    }

    // Example 3
    // In the event of an error, return `undefined` as the result
    try {
        const result = await failToGetData()
        return { result }
    } catch (error) {
        return { error }
    }
}

const customFetcherQuery = useFetch({
    ...options,
    fetcher
})
```

[docs-customizing-requests]: https://github.com/taennan/use-fetch/blob/main/docs/customizing-requests.md
