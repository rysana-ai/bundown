import { dependencies, version } from '../../package.json'
import { language } from './language'
import { os } from './os'
import { path } from './path'
import { runtime } from './runtime'
import { uri } from './uri'

import type { Nodes, Node, Code } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { mathFromMarkdown, mathToMarkdown } from 'mdast-util-math'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'
import { math } from 'micromark-extension-math'
import { visit } from 'unist-util-visit'
import { parseArgs } from 'node:util'
import { CryptoHasher, file, write } from 'bun'

export const sdk = {
  package: { dependencies, version },
  language,
  os,
  path,
  runtime,
  uri,
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
      visit: ({ markdown, visitor }: { markdown: { tree: Nodes }, visitor: (node: Node) => void }) => {
        visit(markdown.tree, visitor)
      },
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
            file:     { short: 'f', type: 'string', multiple: false },
            runtime:  { short: 'r', type: 'string', multiple: false },
            tag:      { short: 't', type: 'string', multiple: true  },
            os:       {             type: 'string', multiple: true  }
          }
        })
      }
    }
  }
}
