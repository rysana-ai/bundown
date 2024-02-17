#!/usr/bin/env bun

import { usage } from './usage'
import { log } from './log'
import { sdk } from '../sdk/index'
import { sync, run } from '../v1/bundown'

import { $, semver } from 'bun'
import { parseArgs } from 'node:util'
import { match, P } from 'ts-pattern'

export async function cli (params: { args: string[] }): Promise<void> {
  const args = parseArgs({
    args: params.args,
    strict: true,
    allowPositionals: true,
    options: {
      // v1
      help:    { short: 'h', type: 'boolean', multiple: false },
      version: { short: 'v', type: 'boolean', multiple: false },
      print:   { short: 'p', type: 'boolean', multiple: false },
      tag:     { short: 't', type: 'string',  multiple: true  },
      // v2
      file:    { short: 'f', type: 'string',  multiple: false },
      runtime: { short: 'r', type: 'string',  multiple: false },
      os:      {             type: 'string',  multiple: false },
    }
  })
  const expectedBunVersion = '^1.0.26'
  const bunVersion = {
    expectedBunVersion,
    satisfied: semver.satisfies(Bun.version, expectedBunVersion),
    order: semver.order(Bun.version, expectedBunVersion)
  }
  const handle = match({ args, bunVersion })
  .with({ args: { values: { help: true } } }, () => {
    return async () => {
      log(({ console }) => {
        console.info(usage({ version: sdk.package.version, os: sdk.os.platform }))
      })
    }
  })
  .with({ args: { values: { version: true } } }, () => {
    return async () => {
      log(({ console }) => {
        console.info(sdk.package.version)
      })
    }
  })
  .with({ bunVersion: { satisfied: false } }, ({ bunVersion }) => {
    return async () => {
      log(({ console, ui }) => {
        console.info(`\nBundown requires Bun version ${expectedBunVersion}, but found ${Bun.version}.`)
        if (bunVersion.order === -1) {
          console.info(`Please run ${ui.bold.underline`bun upgrade`} to update to the latest version of Bun.`)
        }
      })
      throw new CliError('Invalid Bun version.')
    }
  })
  .with({ args: { positionals: ['upgrade', ...P.array(P.nullish)] } }, () => {
    return async () => {
      const bin = (await $`which bundown`.text()).replace(/bundown/g, '')
      const packageManager = bin.includes('bun') ? 'bun' : bin.includes('pnpm') ? 'pnpm' : 'npm'
      const { exitCode } = await $`${packageManager} i -g bundown@latest`
      if (exitCode !== 0) throw new CliError('Error during upgrade.')
    }
  })
  .with({ args: { positionals: ['sync', P.string.minLength(1), P.string.minLength(1), ...P.array(P.nullish)] } }, ({ args }) => {
    return async () => {
      return await sync({ source: args.positionals[1], destination: args.positionals[2], print: args.values.print })
    }
  })
  .with({ args: { positionals: ['sync'] } }, () => {
    return async () => {
      throw new CliError('Bundown sync requires two arguments: source and destination.')
    }
  })
  .with({ args: { positionals: ['run', P.string.minLength(1), ...P.array(P.nullish)] } }, ({ args }) => {
    return async () => {
      await run({ source: args.positionals[1] })
    }
  })
  .with({ args: { positionals: ['run'] } }, () => {
    return async () => {
      throw new CliError('Bundown run requires a single argument: source (path, URL, etc.)')
    }
  })
  .with({ args: { positionals: [P.string.minLength(1), ...P.array(P.nullish)] } }, ({ args }) => {
    return async () => {
      await run({ source: args.positionals[0] })
    }
  })
  .with({ args: { positionals: [P.string, ...P.array(P.string)] } }, ({ args }) => {
    return async () => {
      const arg = args.positionals.at(args.positionals.length - 1)
      throw new CliError(arg ? `Unrecognized argument: ${arg}` : `Unrecognized argument (empty)`)
    }
  })
  .with({ args: { positionals: P.array(P.nullish) } }, () => {
    return async () => {
      throw new CliError('Missing command.')
    }
  })
  .otherwise(() => {
    return async () => {
      throw new CliError('Invalid command.')
    }
  }) satisfies () => Promise<void>
  await handle()
}

export class CliError extends Error {
  constructor (message: string, cause?: unknown) {
    super(message, { cause })
  }
}

if (import.meta.path === Bun.main || process.argv[1] === Bun.main) {
  cli({ args: process.argv.slice(2) }).catch(error => {
    log(({ console, ui }) => {
      console.error('\n' + ui.box.top(`Use ${ui.bold('bundown -h')} for help`, ui.red) + '\n')
      console.error((error instanceof CliError) ? `  ${error.message}` : error)
      console.error(ui.box.bottom(ui.red))
    })
    process.exitCode = 1
  })
}
