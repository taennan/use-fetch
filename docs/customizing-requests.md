# Customizing Requests

Custom functions can be passed to the `useFetch` hook in order to make transformations to the query params, headers, body and even the raw `Request` object being sent to the api

Each transform function accepts the raw object to be modified and should return a new object with whatever changes you would like to have made to it

These can be very useful in cases where you may need to change a request body or url params from `camelCase` to `snake_case` for certain api's. Request headers can also be added before being sent to an api

```ts
type UrlParams = Record<string, any>
type FetchBody = Record<string, any>
type FetchHeaders = Record<string, any>

const transformRequestParams = (urlParams?: UrlParams): UrlParams | undefined => {
    // Modify `urlParams` however you'd like
    const modifiedParams = toSnakeCase(urlParams)
    return modifiedParams
}

const transformRequestBody = (body?: FetchBody): FetchBody | undefined => {
    // We can return undefined if we are not sending any body with the reqeust
    return undefined
}

const transformRequestHeaders = (headers?: FetchHeaders): FetchHeaders | undefined => {
    // Here is a simplified real-life use case for setting access tokens in the header
    const accessToken = someStore.getAccessToken()
    return {
        ...headers,
        accessToken,
    }
}

const transformRequest = (request: Request): Request => {
    // We can also access the raw Request object
    // This callback executes last, so it will have any transformed values from the previous callbacks
    // Unlike the others, we must return a Request object instead of an optional undefined
    return request
}

const transformRequestQuery = useFetch<Result, UrlParams, FetchBody>({
    ...otherOptions,
    // Internally, the transform functions are called in the order they are listed here
    transformRequestParams,
    transformRequestBody,
    transformRequestHeaders,
    transformRequest,
})
```
