# Typescript Tips

## Typing the hook

The `useFetch` hook accepts __2__ type args

The first is the type of the result you expect to receive as the body of a response from an api call

The second is the type of the `queryArgs` passed to the `query` function, which internally is used to build every request sent

```ts
interface Person {
    id: number
    name: string
    dateOfBirth: Date
}

interface SearchArgs {
    name: string
    dateOfBirth: Date
}

const typedQuery = (searchArgs: SearchArgs) => 
    useFetch<Person, SearchArgs>({
        queryArgs: searchArgs,
        query: (args) => ({
            url: '...',
            body: args,
        })
    })

// We use `void` as the `queryArgs` type to stop us from passing args to the request builder in either the hook args or trigger function
const noArgsQuery = useFetch<Person, void>({
    // We won't be allowed to have args in the query function or pass queryArgs to the hook at all
    query: () => ({ url: '...' })
})
```

## Body types

The body of a fetch request can be typed as a `string`, `number`, `null`, `undefined` or any type that satisfies `Record<string, any>`
