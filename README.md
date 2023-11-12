# Use Fetch

## Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Basic Options](#basic-options)
  - [Return Value](#return-value)
  - [Manually Trigger a Request](#manually-trigger-a-request)
  - [Advanced Options](#advanced-options)
- [Licence](#licence)
- [Contributing](#contributing)

## Installation

With `yarn`

```sh
yarn add @helpful-hooks/use-fetch
```

With `npm`

```sh
npm install @helpful-hooks/use-fetch
```

## Usage

### Basic Example

The following shows how `useFetch` can be used in a component that renders data for a hypothetical user queried from an API

```ts
import { useFetch } from '@helpful-hooks/use-fetch'
import { useState } from 'react'

const MyComponent = () => {
  const [userId, setUserId] = useState(0)

  // When triggered, will send a GET request with the url: 
  // http://my.api/example?id=<userId>
  const query = useFetch<User>({
    url: 'http://my.api/example',
    params: {
      id: userId,
    },
  })

  return (
    <>
      {query.loading ? 'Loading...' : null}
      {query.error ? 'An error occurred' : null}
      {query.data ? (
        <p>Found User</p>
        <p>Id: {query.data.id}</p>
        <p>Name: {query.data.name}</p>
      ) : null}
    </>
  )
}
```

### Basic Options

The only option required for `useFetch` is the base `url` used in the request. 

All other options are used for customizing the url params, body, headers, etc.

Here are some of the more common options that can be used

```ts
const query = useFetch({
  // - The base url (Required)
  url: 'http://my.api/example',

  // - HTTP method ('get' by default)
  method: 'get'

  // - Determines whether response bodies are parsed as json or text ('json' by default)
  // - Can be one of 'json' or 'text'
  resultType: 'json'

  // - Query params to append to the url
  // - Can be an object or function which returns an object
  // - Will automatically be converted to a string of url params
  params: {
    a: 10,
    b: '20'
  },

  // - Body sent with the Request
  // - Can be an object or function which returns an object
  // - Will have no effect if making a GET or HEAD request
  body: {
    guid: 'gid://...'
  },

  // - Headers sent with the request
  // - Can be an object or function which returns an object
  headers: () => ({
    accessToken: '...'
  }),

  // - Whether a request is sent on initial render (true by default)
  triggerOnLoad: true
  // - Whether a request is sent when `params` option has changed (true by default)
  triggerOnParamChange: true
  // - Whether a request is sent when `body` option has changed (true by default)
  // - Will have no effect if making a GET or HEAD request
  triggerOnBodyChange: true
})
```

### Return Value

```ts
const {
  // - Data returned from request
  // - Is undefined on error or before a request is made
  data,
  // - True if awaiting response from api call
  loading,
  // - True if at least one request has been made
  fetched,
  // - Error returned from unsuccsessful request
  error,
  // - A function which can be used to manually send a request
  trigger,
} = useFetch(options)
```

### Manually Trigger a Request

Use the `trigger` function returned from the `useFetch` hook to manually send a request

Here is a basic example of how `trigger` can be used to send a POST request when creating a hypothetical user

```ts
const createUserQuery = useFetch<User>({
  url: '...',
  method: 'POST',
  triggerOnLoad: false,
})

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const createUser = async () => {
  const result = await createUserQuery.trigger({
    body: {
      email,
      password
    }
  })
}

return (
  <>
    ...
    <button onClick={createUser}>Register</button>
  </>
)
```

Trigger takes an object as it's argument which can be used to configure the `body`, `params` and `headers` of the request. The options are identical to the `body`, `params` and `headers` options of the `useFetch` hook

```ts
const query = useFetch(options)

// ...

const result = await query.trigger({
  params: { 
    a: 10 
  },
  body: { 
    b: '20' 
  },
  headers: () => ({
    accessToken: '...'
  }),
})
```

Since the request `body`, `params` and `headers` can be passed through the `useFetch` hook or the `trigger` function, any conflicting fields will be overridden by the `trigger` function

In the example below, running the request manually with `trigger` will result with the `a` field to be `25`, instead of the `10` specified in the `useFetch` options

```ts
const query = useFetch({
  ...,
  body: { a: 10 }
})

// ...

// Will send request with body { a: 25 }, NOT { a: 10 }
const result = await trigger({
  body: { a: 25 }
})
```

### Advanced Options

```ts
const query = useFetch({
  ...,
  transformRequestHeaders?: (headers?: RequestHeaders) => RequestHeaders,
  transformRequestParams?: (params?: RequestParams) => RequestParams,
  transformRequestBody?: (body?: RequestBody) => RequestBody,
  transformRequest?: (request: Request) => Request,
  transformResponse?: (response: Response) => Response,
  transformResult?: (result: any) => any,
})
```

## Licence

MIT

## Contributing

All contiributions are welcome. If you notice any bugs or have any feature request, please open an issue on our Gihub repo