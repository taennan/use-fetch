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
const noArgsQuery = useFetch<Result, void>({
    query: () => ({ url: '...' })
})

// Which will be triggered like this:
await noArgsQuery.trigger()
```
