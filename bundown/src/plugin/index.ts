import type { read } from '../core/index'
import type { runtime } from '../sdk/runtime'
import type { BunPlugin } from 'bun'

export type MarkdownExports = Awaited<ReturnType<typeof read>>
export type CallExports = { call: (typeof runtime)['call'] }

function debug(message?: any, ...optionalParams: any[]): void {
  if (!process.env['BUNDOWN_PLUGIN_DEBUG']) return
  console.debug(message, ...optionalParams)
}

/**
 * Drop this plugin into any `bun` project to get
 * support for running lots of languages with `bun`.
 *
 * If you are a user of bundown:
 *
 * 1. `bun install bundown`
 * 2. Create `bunfig.toml` and add `preload = ["bundown/plugin/register"]`
 * 3. Run `bun <file>` to test it out on .sh, .py, .go, and other files
 *
 * If you are working on developing bundown:
 *
 * 1. Create `bunfig.toml` and add `preload = ["./src/plugin/register.ts"]`
 * 2. Run `bun ./src/example/example.go` to test it out
 */
export function plugin(): BunPlugin {
  const bundown: BunPlugin = {
    name: 'Bundown loader',
    async setup(build) {
      debug('plugin', { stage: 'setup', plugin: bundown.name, main: Bun.main })
      // When a .md, .markdown, or .bundown file is imported:
      build.onLoad({ filter: /\.(md|markdown|bundown)$/ }, async args => {
        debug('plugin', { stage: 'load', plugin: bundown.name, main: Bun.main, path: args.path })
        // Import the SDK, which contains a utility that turns markdown into a syntax tree.
        const { read } = await import('../core/index')
        // Read the file, parse the file into a syntax tree, prepare it.
        const mod = await read({ path: args.path })
        // If the file is being run with `bun <file>`, run the TypeScript blocks.
        if (Bun.main === args.path) {
          debug('plugin', { stage: 'run', plugin: bundown.name, main: Bun.main, path: args.path })
          await mod.run()
        }
        // Return it as a module.
        const exports: { default: MarkdownExports } = { default: mod }
        // Using the special bun loader for JS objects.
        return { loader: 'object', exports }
      })
      // When a .sh, .py, .go file is imported (the way bun works, this won't be called with .bun.sh):
      build.onLoad({ filter: /\.(sh|py|go)$/ }, async args => {
        // Import the SDK, which contains a runtime utility.
        const { runtime } = await import('../sdk/runtime')
        // If the file is being run with `bun <file>`, execute the file.
        if (Bun.main === args.path) {
          // Parse any arguments that configure this plugin.
          const { parseArgs } = await import('node:util')
          const parsed = parseArgs({
            args: process.argv.slice(2),
            options: {
              'bundown-runtime': { type: 'string' },
              brrrrr: { type: 'string' },
              brrr: { type: 'string' },
            },
          })
          // Allow the user to specify/override the inferred runtime.
          const runtimeArg =
            parsed.values['bundown-runtime'] || parsed.values['brrrrr'] || parsed.values['brrr']
          const runtimeResolved = runtime.from.name(runtimeArg)
          // Error if a runtime was specified but not resolved by the plugin.
          if (runtimeArg && !runtimeResolved) {
            throw new Error(`Invalid runtime specified: ${runtimeArg}`)
          }
          // Execute the file.
          const { exitCode } = await runtime.call({
            runtime: runtimeResolved,
            path: args.path,
            args: [],
          })
          // If it wasn't successful, set the exit code of this process to the exit code of the runtime process.
          if (exitCode !== 0) process.exitCode = exitCode
        }
        // Return it as a module.
        const exports: { default: CallExports } = { default: { call: runtime.call } }
        // Using the special bun loader for JS objects.
        return { loader: 'object', exports }
      })
    },
  }
  return bundown
}
