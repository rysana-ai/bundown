import { dependencies, version } from '../../package.json'
import { language } from './language'
import { runtime } from './runtime'
import { path } from './path'
import { uri } from './uri'

import type { Nodes, Node, Code } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { mathFromMarkdown, mathToMarkdown } from 'mdast-util-math'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'
import { math } from 'micromark-extension-math'
import { visit } from 'unist-util-visit'
import { platform } from 'node:process'
import { parseArgs } from 'node:util'
import { $, semver, file, write, CryptoHasher } from 'bun'

export const sdk = {
  package: { dependencies, version },
  language,
  runtime,
  path,
  uri,
  os: {
    platform,
    has: {
      version: async (params: { name: string, version: { command: string, expected: string } }) => {
        const osHasBin = await sdk.os.has.bin({ name: params.name })
        if (!osHasBin.has) return { has: false } as const
        const version = await $`${osHasBin.bin} ${params.version.command}`
        if (version.exitCode === 1) return { has: false } as const
        const versionString = version.stdout.toString('utf-8')
        if (versionString !== params.version.expected) return { has: false } as const
        const order = semver.order(versionString, params.version.expected)
        const compatibility = order === 0 ? 'versions are equal' :
          order === 1  ? 'os is newer than expected' :
          order === -1 ? 'os is older than expected' :
          undefined
        return {
          has: true,
          bin: osHasBin.bin,
          version: versionString,
          compatibility,
          semver: semver.satisfies(versionString, params.version.expected)
        } as const
      },
      bin: async (params: { name: string }) => {
        const bin = await $`command -v ${params.name}`
        if (bin.exitCode === 0) return { has: true, bin: bin.stdout.toString('utf-8') } as const
        return { has: false } as const
      }
    }
  },
  hash: {
    sha512: {
      from: {
        path: async (path: string) => sdk.hash.sha512.from.text(await sdk.text.from.path(path)),
        object: (obj: unknown) => sdk.hash.sha512.from.text(JSON.stringify(obj, null, 2)),
        text: (text: string) => new CryptoHasher('sha512').update(text).digest('hex')
      }
    }
  },
  text: {
    from: {
      path: async (path: string) => await file(path).text()
    },
    to: {
      path: async ({ text, path }: { text: string, path: string }) => await write(path, text, { createPath: true })
    }
  },
  markdown: {
    from: {
      path: async (path: string) => sdk.markdown.from.text(await sdk.text.from.path(path)),
      text: (text: string) => ({
        tree: fromMarkdown(text, {
          extensions: [gfm(), math()],
          mdastExtensions: [gfmFromMarkdown(), mathFromMarkdown()]
        })
      })
    },
    to: {
      path: async ({ markdown, path }: { markdown: { tree: Nodes }, path: string }) => {
        return await sdk.text.to.path({ text: sdk.markdown.to.text({ markdown }), path })
      },
      text: ({ markdown }: { markdown: { tree: Nodes } }) => {
        return toMarkdown(markdown.tree, {
          extensions: [gfmToMarkdown(), mathToMarkdown()]
        })
      }
    },
    nodes: {
      filter: ({ markdown, filter }: { markdown: { tree: Nodes }, filter: (node: Node) => boolean }) => {
        const result: Node[] = []
        visit(markdown.tree, (node) => {
          if (filter(node)) result.push(node)
        })
        return result
      }
    },
    blocks: {
      filter: ({ markdown, filter }: { markdown: { tree: Nodes }, filter?: (node: Node) => boolean }) => {
        return sdk.markdown.nodes.filter({ markdown, filter: (node) => node.type === 'code' && (filter ? filter(node) : true) }) as Code[]
      }
    },
    block: {
      args: ({ block }: { block: Code }) => {
        if (!block.meta) return undefined
        return parseArgs({
          args: [...block.meta.split(/\s+/)],
          strict: true,
          allowPositionals: false,
          options: {
            file:    { short: 'f', type: 'string', multiple: false },
            os:      {             type: 'string', multiple: false },
            runtime: { short: 'r', type: 'string', multiple: false },
            tag:     { short: 't', type: 'string', multiple: true  }
          }
        })
      }
    }
  }
}
