#!/usr/bin/env bun
import { unlink } from 'node:fs/promises'
import { $, type ShellOutput, file, write } from 'bun'

const usage = '\nbundown <file.md>\n'
function parse(markdown: string) {
  let state: 'text' | 'code-lang' | 'code-text' = 'text'
  let script = 'import { $ } from "bun"\n\n'
  let block = { language: '', content: '' }
  for (let j = 0; j < markdown.length; j++) {
    switch (state) {
      case 'text':
        if ((j === 0 || markdown[j - 1] === '\n') && markdown.slice(j, j + 3) === '```') {
          j += 2
          block = { language: '', content: '' }
          state = 'code-lang'
          break
        }
        if (j === 0) {
          block = { language: 'markdown', content: markdown[j] }
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
        if (markdown.slice(j - 1, j + 3) === '\n```') {
          switch (block.language) {
            case 'typescript':
              script += block.content + '\n'
              break
            case 'javascript':
              script += block.content + '\n'
              break
            case 'shell':
              for (const line of block.content
                .split('\n')
                .filter(line => line.trim().length > 0)) {
                script += `await $\`${line}\`\n\n`
              }
              break
            default:
              console.warn(`Unknown language "${block.language}"`)
          }
          block = { language: 'markdown', content: '' }
          j += 2
          state = 'text'
          break
        }
        block.content += markdown[j]
        break
    }
  }
  return script
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
  const filename = `${process.env.HOME}/.bundown/tmp/${crypto.randomUUID()}.ts`
  write(filename, parse(markdown))
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
