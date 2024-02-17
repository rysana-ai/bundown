# example

```bash
echo "Hello from example.md"
```

```typescript
console.log(Date.now())
```

```typescript -f ./src/plugin/test.ts
console.log(`This won't run, since it uses -f`)
```

```typescript
import EXAMPLE from '../src/plugin/example.md'

console.log('Hello from bundown!')

// This is recursive.
// Running example.md will execute the
// bash and typescript blocks above.
// Then, the following line will execute,
// which runs example.md all over again!
// It's bundown from inside bundown!
EXAMPLE.run()
```
