# Typescript Tips

## Typing the hook

The `useFetch` hook accepts __3__ type args

The first is the type of the result you expect to receive as the body of a response from an api call

The second is a `Record<string, any>`-like type which determines the url params appended to the url

The third is the type of the request body you will be sending in an api call

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

// We use `never` as the body type to stop us from passing bodies to the request in either the hook args or trigger function
const typedParamsQuery = useFetch<Person, SearchArgs, never>(options)

// Here `never` is used again, but to stop url params being passed
const typedBodyQuery = useFetch<Person, never, SearchArgs>(options)

// Or, we could just allow url params AND bodies for whatever reason
const typedFullyQuery = useFetch<Person, SearchArgs, SearchArgs>(options)
```

## Body types

The body of a fetch request can be typed as a `string`, `number`, `null`, `undefined` or any type that satisfies `Record<string, any>`
