#!/usr/bin/env bun
import { unlink } from 'node:fs/promises'
import { $, type ShellOutput, file, write } from 'bun'
import { bold, cyan, gray, magenta } from 'picocolors'
import { version } from './package.json'
const usage =
  `\n${magenta(bold('Bundown'))} is a fast Markdown runtime and bundler. ` +
  `${gray(`(${version})`)}\n
${bold(`Usage: bundown <file.md> ${cyan('[...flags]')}`)}\n
${bold('Commands:')}
  ${gray('./my-script.md')}    Execute a file with Bundown\n
  ${bold(cyan('upgrade'))}           Upgrade to the latest version of Bundown\n
${bold('Flags:')}
  ${cyan('-p')}, ${cyan('--print')}       Pretty-print source during execution
  ${cyan('-v')}, ${cyan('--version')}     Print version and exit
  ${cyan('-h')}, ${cyan('--help')}        Display this menu and exit\n`
type Flags = Record<string, boolean | string>
function parseArgs(args: string[]) {
  if (args.length === 0) return { flags: { help: true } }
  if (args.length === 1 && args[0] === 'upgrade') return { command: 'upgrade', flags: {} }
  const output: { path?: string; flags: Flags; command?: string } = { flags: {} }
  for (let arg of args) {
    if (arg[0] === '-') {
      if (arg[1] !== '-') {
        switch (arg) {
          case '-h':
            arg = '--help'
            break
          case '-v':
            arg = '--version'
            break
          case '-p':
            arg = '--print'
            break
        }
      }
      output.flags[arg.slice(2)] = true
      continue
    }
    if (!output.path) {
      output.path = arg
      continue
    }
    console.warn(`Unrecognized argument "${arg}"`)
  }
  return output
}
function printBlock(content: string, language: string) {
  return `console.log(\`${
    (language === 'markdown' ? '\n' : gray(`\n\\\`\\\`\\\`${language}\n`)) +
    content.trim().replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${') +
    (language === 'markdown' ? '' : gray('\n\\`\\`\\`'))
  }\`)\n`
}
function parseMarkdown(markdown: string, flags: Flags) {
  let state: 'text' | 'code-lang' | 'code-text' = 'text'
  let script = 'import { $ } from "bun"\n\n'
  let block = { language: '', content: '' }
  for (let j = 0; j < markdown.length; j++) {
    switch (state) {
      case 'text':
        if ((j === 0 || markdown[j - 1] === '\n') && markdown.slice(j, j + 3) === '```') {
          if (flags.print) script += printBlock(block.content, block.language)
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
          let language = block.language.split(/\s+/)[0].toLowerCase()
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
          if (flags.print) script += printBlock(block.content, block.language)
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
              console.warn(`Unrecognized language "${block.language}"`)
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
  const { path, flags, command } = parseArgs(process.argv.slice(2))
  if (command === 'upgrade') {
    const bin = (await $`which bundown`.text()).replace(/bundown/g, '')
    try {
      await $`${bin.includes('bun') ? 'bun' : bin.includes('pnpm') ? 'pnpm' : 'npm'} i -g bundown`
    } catch (error) {
      throw new Error(`Failed to upgrade bundown: ${error}`)
    }
    process.exit(0)
  }
  if (flags.help) {
    console.log(usage)
    process.exit(0)
  }
  if (flags.version) {
    console.log(version)
    process.exit(0)
  }
  if (!path || file(path).size === 0) {
    throw new Error(`File at path "${path}" is empty or not found.`)
  }
  const markdown = await file(path).text()
  const filename = `${process.env.HOME}/.bundown/tmp/${crypto.randomUUID()}.ts`
  write(filename, parseMarkdown(markdown, flags))
  let shellOutput: ShellOutput | undefined = undefined
  try {
    shellOutput = await $`bun ${filename}`
  } catch (processError) {
    console.error(processError)
  } finally {
    await unlink(filename)
    process.exit(shellOutput?.exitCode ?? 0)
  }
} catch (bundownError) {
  console.log(usage)
  console.error(bundownError)
  process.exit(1)
}