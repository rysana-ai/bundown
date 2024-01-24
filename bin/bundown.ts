#!/usr/bin/env bun
import { unlink } from 'node:fs/promises'
import { $, type ShellOutput, file, write } from 'bun'

const usage = '\nbundown <file.md>\n'
function parse(markdown: string) {
  const blocks: { language: string; content: string }[] = []
  let state: 'text' | 'code-lang' | 'code-text' = 'text'
  for (let j = 0; j < markdown.length; j++) {
    const block = blocks[blocks.length - 1] || { language: '', content: '' }
    switch (state) {
      case 'text':
        if (
          (j === 0 || markdown[j - 1] === '\n') &&
          markdown[j] === '`' &&
          markdown[j + 1] === '`' &&
          markdown[j + 2] === '`'
        ) {
          blocks.push({ language: '', content: '' })
          j += 2
          state = 'code-lang'
          break
        }
        if (j === 0) {
          blocks.push({ language: 'markdown', content: markdown[j] || '' })
          break
        }
        block.content += markdown[j]
        break
      case 'code-lang':
        if (markdown[j] === '\n') {
          let language = block.language.split(/\s+/)[0]
          switch (language) {
            case 'ts':
              language = 'typescript'
              break
            case 'js':
              language = 'javascript'
              break
            case 'sh':
              language = 'shell'
              break
            case 'bash':
              language = 'shell'
              break
            case 'zsh':
              language = 'shell'
              break
            default:
              language = ''
          }
          block.language = language || '?'
          state = 'code-text'
          break
        }
        block.language += markdown[j]
        break
      case 'code-text':
        if (
          markdown[j - 1] === '\n' &&
          markdown[j] === '`' &&
          markdown[j + 1] === '`' &&
          markdown[j + 2] === '`'
        ) {
          blocks.push({ language: 'markdown', content: '' })
          j += 2
          state = 'text'
          break
        }
        block.content += markdown[j]
        break
    }
  }
  return blocks
}
try {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.log(usage)
    process.exit(1)
  }
  const [path] = args
  if (!path || file(path).size === 0) {
    throw new Error(`File at path "${path}" is empty or not found.`)
  }
  const markdown = await file(path).text()
  const blocks = parse(markdown)
  let script = 'import { $ } from "bun"\n\n'
  for (const block of blocks) {
    switch (block.language) {
      case 'typescript':
        script += block.content + '\n'
        break
      case 'javascript':
        script += block.content + '\n'
        break
      case 'shell':
        for (const line of block.content.split('\n').filter(line => line.trim().length > 0)) {
          script += `await $\`${line}\`\n\n`
        }
        break
      case 'markdown':
        if (process.env.BD_VERBOSE) console.log(block.content)
        break
      default:
        console.warn(`Unknown language "${block.language}"`)
    }
  }
  const filename = `${process.env.HOME}/.bundown/tmp/${crypto.randomUUID()}.ts`
  write(filename, script)
  let processShellOutput: ShellOutput | undefined = undefined
  try {
    processShellOutput = await $`bun ${filename}`
  } catch (processException) {
    console.error(processException)
  } finally {
    await unlink(filename)
    process.exit(processShellOutput?.exitCode ?? 0)
  }
} catch (error) {
  console.log(usage)
  console.error(error)
  process.exit(1)
}
