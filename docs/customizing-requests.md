# Customizing Requests

Custom functions can be passed to the `useFetch` hook in order to make transformations to the query params, headers, body and even the raw `Request` object being sent to the api

Each transform function accepts the raw object or value to be modified and should return a new one with whatever changes you would like to have made to it

These can be very useful in cases where you may need to change a request body or url params from `camelCase` to `snake_case` for certain api's. Request headers can also be added before being sent to an api

```ts
import type { RequestHeaders, RequestBody, RequestParams } from '@helpful-hooks/use-fetch'

const transformRequestBody = (body?: RequestBody): RequestBody => {
    // We can return undefined if we are not sending any body with the reqeust
    return undefined
}

const transformRequestHeaders = (headers?: RequestHeaders): RequestHeaders | undefined => {
    // Here is a simplified real-life use case for setting access tokens in the header
    const accessToken = someStore.getAccessToken()
    return {
        ...headers,
        accessToken,
    }
}

const transformRequestParams = (urlParams?: RequestParams): RequestParams | undefined => {
    // If we do not want to make any changes, return the values passed to the function
    return urlParams
}

const transformRequestUrl = (url: string): string => {
    // As this executes after `transformRequestParams`, the `url` arg will include all query params appended to it
    return 'http://modified-url'
}

const transformRequest = (request: Request): Request => {
    // We can also access the raw Request object
    // This callback executes last, so it will have any transformed values from the previous callbacks
    return request
}

const transformRequestQuery = useFetch({
    ...otherOptions,
    // Internally, the transform functions are called in the order they are listed here
    transformRequestBody,
    transformRequestHeaders,
    transformRequestParams,
    transformRequestUrl,
    transformRequest,
})
```
