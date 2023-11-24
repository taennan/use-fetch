# Modifying Responses

Responses received from api calls can be modified similar to how we are able to modify requests (see [here](docs-customizing-requests) for more info)

Each transform function accepts the raw object to be modified and should return a new object with whatever changes you would like to have made to it

```ts
const transformResponse = (response: Response): Response => {
    // Do not access the body of a response in this callback as it is needed later by `useFetch` internally
    // If you need to access or modify the response body, do so in the `transformResult`callback
    // If using a custom fetcher, this callback will have no effect
    const modifiedResponse = modifyResponse(response)
    return modifiedResponse
}

const transformResult = (result: any): any => {
    // Here, we can access and modify the body of response
    const modifiedResult = toCamelCase(result)
    return modifiedResult
}

const transformResponseQuery = useFetch<Result, never, never>({
    ...otherOptions,
    // Internally, the transform functions are called in the order they are listed here
    transformResponse,
    transformResult,
})
```

[docs-customizing-requests]: https://github.com/taennan/use-fetch/blob/main/docs/customizing-requests.md
