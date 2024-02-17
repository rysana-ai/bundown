import { type ShellOutput, $ } from 'bun'

export type Runtime = (typeof runtimes)[number]

const runtimes = [ 'sh', 'bash', 'python', 'go' ] as const satisfies string[]

export const runtime = {
  from: {
    name: (name?: string): Runtime | undefined => {
      if (!name) return undefined
      return runtimes.find(runtime => runtime.toLowerCase() === name.toLowerCase())
    }
  },
  call: async (params: { runtime?: Runtime, path: string, args?: string[] }): Promise<ShellOutput> => {
    let runtime = params.runtime
    if (!params.runtime) {
      if (params.path.endsWith('.sh')) runtime = 'sh'
      else if (params.path.endsWith('.bash')) runtime = 'bash'
      else if (params.path.endsWith('.py')) runtime = 'python'
      else if (params.path.endsWith('.go')) runtime = 'go'
    }
    if (!runtime) throw new Error(`No runtime available based on file extension for ${params.path}`)
    if (runtime === 'sh') return await $`sh ${params.path}`
    if (runtime === 'bash') return await $`bash ${params.path}`
    if (runtime === 'python') return await $`python ${params.path}`
    if (runtime === 'go') return await $`go run ${params.path}`
    throw new Error(`Runtime "${runtime}" not found when running ${params.path}`)
  }
}
