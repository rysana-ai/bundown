import type { Language } from '../sdk/language'

import { type ShellOutput, $ } from 'bun'

export type Runtime = (typeof runtimes)[number]['name']

const runtimes = [
  { name: 'bun', run: async ({ path, args }) => await $`FORCE_COLOR=1 bun ${path}` },
  { name: 'sh', run: async ({ path, args }) => await $`FORCE_COLOR=1 sh ${path}` },
  { name: 'bash', run: async ({ path, args }) => await $`FORCE_COLOR=1 bash ${path}` },
  { name: 'zsh', run: async ({ path, args }) => await $`FORCE_COLOR=1 zsh ${path}` },
  { name: 'python', run: async ({ path, args }) => await $`FORCE_COLOR=1 python3 ${path}` },
  { name: 'go', run: async ({ path, args }) => await $`FORCE_COLOR=1 go run ${path}` },
] as const satisfies Array<{
  name: string
  run: (params: { path: string; args?: string[] }) => Promise<ShellOutput>
}>

export const runtime = {
  from: {
    name: (name?: string): Runtime | undefined => {
      if (!name) return undefined
      return runtimes.find(runtime => runtime.name.toLowerCase() === name.toLowerCase())?.name
    },
  },
  call: async (params: {
    runtime?: Runtime
    lang?: Language
    path: string
    args?: string[]
  }): Promise<ShellOutput> => {
    let runtime = params.runtime
    if (!params.runtime) {
      if (params.path.endsWith('.bun.sh')) runtime = 'bun'
      else if (params.path.endsWith('.sh')) runtime = 'sh'
      else if (params.path.endsWith('.py')) runtime = 'python'
      else if (params.path.endsWith('.go')) runtime = 'go'
    }
    if (!runtime)
      throw new Error(`No runtime available based on file extension for ${params.path}`)
    const run = runtimes.find(r => r.name === runtime)?.run
    if (!run) throw new Error(`Runtime "${runtime}" not found when running ${params.path}`)
    return await run({ path: params.path, args: params.args })
  },
}
