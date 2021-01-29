# Maybe

## Installation

```bash
npm install ts-maybe
```

## Usage

### Standalone

```typescript
import Maybe, { isSomething } from 'ts-maybe';

const numbers = [1, 2, undefined, 3, null, 4]
  .map(Maybe.Just)
  .filter(isSomething);

console.log(numbers); // [ Maybe.Just(1), Maybe.Just(2), Maybe.Just(3), Maybe.Just(4)]
```

### With promises

```typescript
import Maybe from 'ts-maybe';

const personName = fetch('https://api/person/1')
  .then(Maybe.Just)
  .then(Maybe.Map(JSON.parse))
  .then(
    Maybe.Case({
      Just(person) {
        return person.name;
      },
      Nothing() {
        throw new Error('Could not fetch person');
      },
    })
  );
```
