# Manually Triggering Requests

By default, requests are sent on mount and on any change to the `url`, `params` or `body` args passed to `useFetch`

This is usedful for simpler `GET` requests, but we often find ourselves having to trigger an api call on some arbitrary user interaction or at intervals when polling

The `useFetch` hook returns a `trigger` function which, when called, will execute a fetch.

```tsx
import { useFetch } from '@helpful-hooks.use-fetch'

interface CreateUserBody {
    email: string
    password: string
}

const useCreateUserQuery = () => useFetch<User, never, CreateUserBody | undefined>({
    url: 'https://my-api.com/',
    triggerOnLoad: false,
}) 

const UserRegistration = () => {
    const createUserQuery = useCreateUserQuery()

    const onFormSubmit = async (data: CreateUserBody) => {
        // Manually runs fetch with data from form
        const newUser = await createUserQuery.trigger({ body: data })
        console.log('Created user', newUser)
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

Although the `url`, `params` and `body` of a fetch can be configured with the base hook args, the `trigger` function can override the base args with any args passed directly to it
