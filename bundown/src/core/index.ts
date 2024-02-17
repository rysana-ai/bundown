import type { Language } from '../sdk/language'
import type { Runtime } from '../sdk/runtime'
import type { OperatingSystem } from '../sdk/os'
import { sdk } from '../sdk/index'
import { log } from '../cli/log'
import * as ui from '../cli/ui'

import type { Code, Root } from 'mdast'
import { join } from 'node:path'
import { readdir } from 'node:fs/promises'
import { type ShellOutput, type BunFile, file, write } from 'bun'

export async function run (params: { source: string, tag?: string[], print?: boolean }) {
  const source = await resolveSource(params.source)
  const text = await sourceToMarkdown(source)
  const markdown = sdk.markdown.from.text(text)
  await prepare({ path: params.source, markdown }).run({ tag: params.tag, print: params.print })
}

export async function read ({ path }: { path: string }) {
  const markdown = await sdk.markdown.from.path(path)
  return prepare({ path, markdown })
}

export function prepare ({ path, markdown }: { path: string, markdown: { tree: Root } }) {
  return {
    markdown,
    run: async (params?: { tag?: string[], print?: boolean }) => {
      if (params?.print) console.log()
      for (const node of markdown.tree.children) {
        if (node.type === 'code') {
          const block = enrich({ path, block: node, tag: params?.tag })
          if (params?.print) {
            log(({ console, ui }) => {
              console.log(ui.box.full(block.data.label)(ui.highlight(block.data.highlighter || 'txt', block.value)))
            })
          }
          if (block.data.shouldRun) {
            const path = block.data.safePrefixedPath || block.data.tempPath
            if (!path) throw new Error('Missing runtime path for block')
            await sdk.text.to.path({ text: block.value, path })
            const { exitCode } = await sdk.runtime.call({ runtime: block.data.runtime, path, args: [] }) 
            if (exitCode !== 0) throw new Error(`Non-zero (${exitCode}) exit code for block at ${block.data.location}`)
          }
          if (params?.print) console.log()
        } else {
          if (params?.print) {
            log(({ console, ui }) => {
              console.log(ui.box.inset(ui.highlight('markdown', sdk.markdown.to.text({ markdown: { tree: node } }))))
            })
          }
        }
      }
    }
  }
}

export function enrich (params: { path: string, block: Code, tag?: string[] }) {
  const block = {
    ...params.block,
    data: {
      ...params.block.data,
      label: ((params.block.lang || '') + ' ' + (params.block.meta || '')).trim(),
      location: undefined as string | undefined,
      language: undefined as Language | undefined,
      highlighter: undefined as string | undefined,
      extension: undefined as `.${string}` | undefined,
      contentSha512: sdk.hash.sha512.from.text(params.block.value),
      configSha512: undefined as string | undefined,
      tempPath: undefined as string | undefined,
      safePrefixedPath: undefined as string | undefined,
      runtime: undefined as Runtime | undefined,
      // Resolve block args.
      args: sdk.markdown.block.args({ block: params.block }),
      os: [] as OperatingSystem[],
      errors: [] as Array<{ message: string, fatal: boolean }>,
      shouldRun: undefined as boolean | undefined,
      run: undefined as (() => Promise<ShellOutput>) | undefined
    }
  }
  // Add positional information, like "README.md:11" that points to the
  // line number location of the code block in the markdown file.
  if (block.position?.start.line) {
    block.data.location = `${params.path}:${block.position.start.line}`
  } else {
    block.data.errors.push({ message: 'Missing positional information for block', fatal: true })
  }
  // Resolve language and highlighter name.
  block.data.language = block.lang ? sdk.language.from.name(block.lang) : undefined
  block.data.highlighter = block.lang || 'txt'
  // Resolve --os flags.
  if (block.data.args?.values.os) {
    for (const arg of block.data.args.values.os) {
      const os = sdk.os.from.name(arg)
      if (os) {
        block.data.os.push(os)
      } else {
        block.data.errors.push({ message: 'Invalid --os flag on block', fatal: true })
      }
    }
  }
  // Resolve the runtime, file extension, and temporary path.
  if (block.data.language === 'JavaScript') {
    block.data.runtime = 'bun'
    block.data.extension = '.js'
  }
  if (block.data.language === 'TypeScript') {
    block.data.runtime = 'bun'
    block.data.extension = '.ts'
  }
  if (block.data.language === 'Shell') {
    block.data.runtime = 'bun'
    block.data.extension = '.bun.sh'
  }
  if (block.data.language === 'Python') {
    block.data.runtime = 'python'
    block.data.extension = '.py'
  }
  if (block.data.language === 'Go') {
    block.data.runtime = 'go'
    block.data.extension = '.go'
  }
  if (block.data.extension) {
    block.data.tempPath = `${process.env['HOME'] || '.'}/.bundown/tmp/${block.data.contentSha512}${block.data.extension}`
  }
  // Hash the block config with sha512. This should only be done after all
  // potentially cacheable resolution steps.
  block.data.configSha512 = sdk.hash.sha512.from.object(block)
  // If multiple --os flags are provided, the block will only run if the
  // current platform matches any one of the specified os flags.
  const shouldRunOnOs =
    !block.data.args?.values.os?.length ||
    block.data.os.length === 0 ||
    block.data.os.some(os => sdk.os.matches.os(os))
  // If multiple --tag flags are provided, the block will only run if the
  // current tags matches any one of the specified tag flags.
  const hasApplicableTags =
    (!params.tag?.length && !block.data.args?.values.tag?.length) ||
    params.tag?.some(tag => block.data.args?.values.tag?.includes(tag))  
  // If block is a supported runnable language.
  const hasRunnableLangauge =
    block.data.language === 'JavaScript' ||
    block.data.language === 'TypeScript' ||
    block.data.language === 'Shell'      ||
    block.data.language === 'Python'     ||
    block.data.language === 'Go'
  // If block has fatal errors.
  const hasFatalErrors = block.data.errors.some(e => e.fatal)
  // Only mark the block as runnable if it meets all the required conditions.
  block.data.shouldRun =
    !block.data.args?.values.file &&
    shouldRunOnOs &&
    hasApplicableTags &&
    hasRunnableLangauge &&
    !hasFatalErrors
  return block
}

export async function sync (params: { source: string, destination: string, print?: boolean }) {
  const source = await resolveSource(params.source)
  if (source.type === 'directory') {
    throw new Error('Bundown sync requires a file as the source.')
  }
  const destination = await resolveSource(params.destination)
  if (destination.type === 'file' || destination.type === 'url') {
    throw new Error('Bundown sync requires a directory as the destination.')
  }
  const { tree } = sdk.markdown.from.text(await sourceToMarkdown(source))
  const files: Record<string, { lang: string; content: string }> = {}
  for (const node of tree.children) {
    if (node.type === 'code') {
      const parsed = sdk.markdown.block.args({ block: node })
      const file = parsed?.values.file
      if (file) {
        if (!files[file]) {
          const language = sdk.language.from.name(node.lang || '')
          files[file] = { lang: ((language && node.lang) ? node.lang : undefined) || 'txt' || '', content: '' }
        }
        files[file].content += node.value + '\n'
      }
    }
  }
  if (params.print) console.log()
  console.log(ui.bold`bundown sync`)
  if (params.print) console.log()
  const entries = Object.entries(files)
  if (entries.length === 0) console.log(ui.red`No files found to sync.\n`)
  for (const [filename, { lang, content }] of entries) {
    const path = join(params.destination, filename)
    await write(path, content)
    const info = ui.green`synced to ` + ui.bold(path)
    if (params.print) {
      console.log(ui.box.full(info)(ui.highlight(lang, content.replace(/\n$/, ''))))
    } else {
      console.log(info)
    }
  }
  if (params.print) console.log()
}

export type Source =
  | { type: 'directory'; path: string; files: string[] }
  | { type: 'file'; file: BunFile }
  | { type: 'url'; url: URL }

export async function resolveSource(source: string): Promise<Source> {
  try {
    const files = await readdir(source, { recursive: true })
    return { type: 'directory', path: source, files }
  } catch (error) {
    if (await file(source).exists()) {
      return { type: 'file', file: file(source) }
    }
    try {
      const url = new URL(source)
      return { type: 'url', url }
    } catch (error) {
      throw new Error(`Could not resolve source "${source}"`)
    }
  }
}

export async function sourceToMarkdown(source: Source) {
  if (source.type === 'directory') {
    for (const defaultFile of ['README.md', 'index.md']) {
      if (source.files.some(file => file.toLowerCase() === defaultFile.toLowerCase())) {
        source = { type: 'file', file: file(join(source.path, defaultFile)) }
        break
      }
    }
    if (source.type === 'directory') {
      throw new Error('Bundown run requires a file as input.')
    }
  }
  if (source.type === 'url') return await (await fetch(source.url)).text()
  return await source.file.text()
}
