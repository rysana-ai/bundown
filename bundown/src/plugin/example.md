# example

```shell
echo "Hello from example.md"
```

```typescript -t time
console.log('This only runs with --tag "time"', Date.now())
```

```typescript -f ./src/plugin/test.ts
console.log(`This won't run, since it uses -f`)
```

```typescript --os mac --os linux
console.log(`This only runs on mac or linux`)
```

```python
print("Python works too!")
```

```go
package main

import "fmt"

func main() {
	fmt.Println("Go works too!")
}
```

```typescript
import EXAMPLE from '@/src/plugin/example.md'

console.log('Hello from bundown!')

// This is recursive.
// Running example.md will execute the
// bash and typescript blocks above.
// Then, the following line will execute,
// which runs example.md all over again!
// It's bundown from inside bundown!
// You probably don't want to keep this
// running for too long though, since the
// processes don't exit (yet)...
EXAMPLE.run()
```
