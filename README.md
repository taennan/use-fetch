# Use Fetch

_Yet another hook in your_ [`@helpful-hooks`](npm-helpful-hooks) _toolbox!_

The `@helpful-hooks/use-fetch` package is designed to be a lightweight, flexible and extensible solution for making fetch requests and api calls

It follows a similar design to established packages like [rtk-query](npm-rtk-query) and [@tanstack/react-query](npm-tanstack-react-query), but allows for __easy__ and __complete__ customization over the raw requests and responses, when requests are sent, whether they are sent at all, how urls, request and response payloads are processed before being sent on their way and much more.

Excited by the possibilities? Read on to find out more!

## Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [In-Depth Usage](#in-depth-usage)
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

## Basic Usage

The `useFetch` hook is filled with many useful features to help with api calls. Below is the basic gist of how `useFetch` is meant to be used in a React app which displays a list of Todos from an api. 

However, as there are too many uses and techniques to cleany demonstrate in a single README, please see the [In-Depth Usage](#in-depth-usage) section for links to further documentation

#### api.ts

```ts
import { useFetch } from '@helpful-hooks/use-fetch'

// Database Types
interface Todo {
    id: number
    name: string
    completed: boolean
}

interface SearchTodosParams {
    id?: number
    name?: string
    completed?: boolean
}

interface CreateTodoBody {
    name: string
}

// useFetch can be used directly in a component, but is far cleaner and DRYer when abstracted over in a custom hook
export const useSearchTodosQuery = (params: SearchTodosParams) => 
    useFetch<Todo[], SearchTodosParams>({
        queryArgs: params,
        query: (args) => ({
            url: 'https://my-api.com/todos',
            params: args
        })
    })

export const useCreateTodoQuery = () => 
    useFetch<Todo, CreateTodoBody>({
        triggerOnLoad: false,
        query: (args) => ({
            url: 'https://my-api.com/todos',
            method: 'POST',
            body: args
        })
    })
```

#### Todos.tsx

```tsx
import { useSearchTodosQuery, useCreateTodoQuery } from './api'

export const Todos = () => {
    const [searchTodosParams] = useState({ completed: true })
    const searchTodosQuery = useSearchTodosQuery(searchTodosParams)
    const createTodoQuery = useCreateTodoQuery()

    const createTodo = async (name: string) => {
        // Creates a new Todo with specified name, 
        // then re-runs the search query to update the list of Todo's
        await createTodoQuery.trigger({ name })
        await searchTodosQuery.trigger(searchTodosParams)
    }

    return (
        <>
            <h1>Things left to do:</h1>
            {searchTodosQuery.loading && <p>Loading...</p>}
            {searchTodosQuery.error && <p>Could not retreive Todos</p>}
            {searchTodosQuery.data && searchTodosQuery.data.map((todo, i) => (
                <p>{i} - {todo.name}</p>
            ))}

            <hr />

            <h1>Add something new to do:</h1>
            <button 
                disabled={createTodoQuery.loading}
                onClick={() => {
                    const todoName = getNewTodoName()
                    createTodo(todoName)
                }}>
                Generate new Todo
            </button>
        </>
    )
}
```

## In-Depth Usage

If you would like to find out about the other cool fetures provided by this hook, check out the links below to our documentation pages:

- [The Basics](docs-basics)
- [Customizing requests](docs-customizing-requests)
- [Manually triggering requests](docs-manually-triggering-requests)
- [Modifying responses](docs-modifying-responses)
- [Custom fetchers](docs-custom-fetchers)
- [Typescript tips](docs-typescript-tips)

## Licence

This package uses the MIT licence. Feel free to use it in whatever morally correct way you'd like

## Contributing

All contributions are welcome. If you notice any bugs or have any feature request or questions, please open an issue in our [Github repo](github-repo)

[github-repo]: https://github.com/taennan/use-fetch

[docs-basics]:               https://github.com/taennan/use-fetch/blob/main/docs/basics.md
[docs-customizing-requests]:          https://github.com/taennan/use-fetch/blob/main/docs/customizing-requests.md
[docs-manually-triggering-requests]:  https://github.com/taennan/use-fetch/blob/main/docs/manually-triggering-requests.md
[docs-modifying-responses]:           https://github.com/taennan/use-fetch/blob/main/docs/modifying-responses.md
[docs-custom-fetchers]:               https://github.com/taennan/use-fetch/blob/main/docs/custom-fetchers.md
[docs-typescript-tips]:               https://github.com/taennan/use-fetch/blob/main/docs/typescript-tips.md

[npm-helpful-hooks]: https://www.npmjs.com/search?q=%40helpful-hooks
[npm-rtk-query]: https://www.npmjs.com/package/@reduxjs/toolkit
[npm-tanstack-react-query]: https://www.npmjs.com/package/@tanstack/react-query
