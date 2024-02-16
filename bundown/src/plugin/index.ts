import type { read } from '../core/index'
import type { BunPlugin } from 'bun'

export type MarkdownExports = Awaited<ReturnType<typeof read>>

function debug (message?: any, ...optionalParams: any[]): void {
  if (!process.env['BUNDOWN_PLUGIN_DEBUG']) return
  console.debug(message, ...optionalParams)
}

export function plugin (): BunPlugin {
  const bundown: BunPlugin = {
    name: 'Bundown loader',
    async setup (build) {
      debug('plugin', { stage: 'setup', plugin: bundown.name, main: Bun.main })
      // Import the SDK, which contains a utility that turns markdown into a syntax tree.
      const { read } = await import('../core/index')
      // When a .md, .markdown, or .bundown file is imported:
      build.onLoad({ filter: /\.(md|markdown|bundown)$/ }, async (args) => {
        debug('plugin', { stage: 'load', plugin: bundown.name, main: Bun.main, path: args.path })
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
    }
  }
  return bundown
}
