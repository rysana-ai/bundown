#!/usr/bin/env bun

import { languages } from './languages'
import * as ui from '../cli/ui'
import { sdk } from '../sdk/index'

import { join } from 'node:path'
import { readdir } from 'node:fs/promises'
import { type BunFile, type ShellOutput, $, file, write } from 'bun'

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
          const language = languages.find(({ aliases }) =>
            aliases.some(alias => alias === node.lang?.toLowerCase()),
          )
          files[file] = { lang: language?.aliases?.[0] || 'txt' || '', content: '' }
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

export async function run (params: { source: string, tag?: string[], print?: boolean }) {
  const markdown = await sourceToMarkdown(await resolveSource(params.source))
  const { tree } = sdk.markdown.from.text(markdown)
  const files: Record<string, string> = { script: 'import { $ } from "bun"\n\n' }
  function print(input = '', force = false) {
    if (params.print || force)
      files['script'] += `console.log(\`${input
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$')}\`)\n`
  }
  print()
  for (const node of tree.children) {
    if (node.type === 'code') {
      const label = ((node.lang || '') + ' ' + (node.meta || '')).trim()
      const language = languages.find(({ aliases }) =>
        aliases.some(alias => alias === node.lang?.toLowerCase()),
      )
      node.lang = language?.aliases?.[0] || 'txt'
      print(ui.box.full(label)(ui.highlight(node.lang, node.value)))
      const parsed = sdk.markdown.block.args({ block: node })
      if (
        !parsed?.values.file &&
        (!parsed?.values.os || sdk.os.platform === parsed.values.os) &&
        ((!params.tag?.length && !parsed?.values.tag?.length) ||
          params.tag?.some(tag => parsed?.values.tag?.includes(tag))) &&
        language?.run
      ) {
        language.run({ input: node.value, files })
      }
      print()
    } else {
      print(ui.box.inset(ui.highlight('markdown', sdk.markdown.to.text({ markdown: { tree: node } }))))
    }
  }
  const dotbundown = `${process.env['HOME']}/.bundown`
  const filename = `${dotbundown}/tmp/${sdk.hash.sha512.from.text(crypto.randomUUID())}.ts`
  await write(filename, files['script'])
  let shellOutput: ShellOutput | undefined = undefined
  try {
    shellOutput = await $`FORCE_COLOR=1 bun ${filename}`
  } finally {
    await $`rm -rf ${dotbundown}/tmp/`
    process.exit(shellOutput?.exitCode ?? 0)
  }
}

type Source =
  | { type: 'directory'; path: string; files: string[] }
  | { type: 'file'; file: BunFile }
  | { type: 'url'; url: URL }

async function resolveSource(source: string): Promise<Source> {
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

async function sourceToMarkdown(source: Source) {
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
