# Manually Triggering Requests

By default, requests are sent on mount and on any change to the `queryArgs` passed to `useFetch`

This is useful for simpler `GET` requests, but we often find ourselves having to trigger an api call on some arbitrary user interaction or at intervals when polling

The `useFetch` hook returns a `trigger` function which, when called, will execute a fetch.

```tsx
import { useFetch } from '@helpful-hooks/use-fetch'

interface CreateUserBody {
    email: string
    password: string
}

const useCreateUserQuery = () => 
    useFetch<User, CreateUserBody>({
        triggerOnLoad: false,
        query: (args) => ({
            url: 'https://my-api.com/',
            method: 'POST',
            body: args
        })
    }) 

const UserRegistration = () => {
    const createUserQuery = useCreateUserQuery()

    const onFormSubmit = async (data: CreateUserBody) => {
        // Manually runs fetch with data from form
        const newUser = await createUserQuery.trigger(data)
    }

    return (
        <form onSubmit={onFormSubmit}>
            <input name="email" />
            <input name="password" />
            <button>Submit</button>
        </form>
    )
}
```

In the above example, we set `triggerOnLoad` to false as we will only be triggering the fetch on user interaction. This is also necessary because we have not passed any `queryArgs` to be used by the hook on automatic triggers

As we have typed the hook with `CreateUserBody` as the second generic arg, any args passed to the `trigger` function will only accept that type

If we do not need to pass an args to `query`, via `trigger`, we can type our hooks with `void`

```ts
const query = useFetch<Result, void>({
    query: () => ({ url: '...' })
})

// Which will be triggered like this:
await query.trigger()
```

There may also be cases where we need to manually re-run the query with the current `queryArgs`, but do not want to have to pass the args to the `trigger` function

In cases such as these, the `useFetch` hook returns a `retrigger` function which does exactly that

```ts
const query = useFetch({
    queryArgs: 'some random args',
    query: () => ({ url: '...' })
})

// No need to pass args to `trigger`, it will use the current value of `queryArgs`
await query.retrigger()
```
