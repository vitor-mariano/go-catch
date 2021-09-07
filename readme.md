# Go Catch

Handle errors without try/catch, in the Go style. Compatible with async and sync functions, preserving its types.

## Installation

```
npm install --save go-catch
```

Import `goCatch` for async functions or `goCatchWrap` for regular sync functions.

```ts
import { goCatch, goCatchWrap } from 'go-catch';
```

## Examples

### Regular sync function

```ts
// Without Go Catch
const result = JSON.parse(value);

// With Go Catch
const [result, err] = goCatchWrap(JSON.parse)(value);
```

```ts
import { goCatchWrap } from 'go-catch';

interface Response {
  value: number;
}

// You can specify the return type of the function using generics
// or let TypeScript infer it automatically.
const [parsedValue, parseError] = goCatchWrap<Response>(JSON.parse)(input);

// You can handle errors checking their types or simply checking whether
// they are null
if (parseError instanceof SyntaxError) {
  console.error('Invalid response: ' + input);
  process.exit(1);
}

// After validated that there are no errors, you can use the
// non-null assertion operator to tell TypeScript that parsedValue
// should not be treated as null.
parsedValue!.a;
```

### Async functions

```ts
import { goCatch } from 'go-catch';

async function getUser(...args): Promise<User> | null {
  // With async functions, you can call the function directly inside of the goCatch as an argument.
  const [response, err] = await goCatch(axios.get<User>('/user', params));

  if (err) {
    return console.error(err);
  }

  response!.data;

  // ...
}
```
