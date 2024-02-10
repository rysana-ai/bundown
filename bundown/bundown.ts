#!/usr/bin/env bun
import { readdir } from 'node:fs/promises'
import { platform } from 'node:os'
import { join } from 'node:path'
import { type BunFile, CryptoHasher, file, semver, write } from 'bun'
import { languages } from './languages'
import { Markdown } from './markdown'
import { dependencies, version } from './package.json'
import * as ui from './ui'
const os = platform()
const usage =
  `\n${ui.magenta.bold`Bundown`} is a fast Markdown runtime and bundler. ` +
  `${ui.gray(`(${version})`)}\n
${ui.bold(`Usage: bundown <commmand> ${ui.cyan`[...flags]`} [...args]`)}\n
${ui.bold`Commands:`}
${ui.table({ columns: [26, 40] })([
  [ui.magenta.bold`run` + ui.gray`? app.md`, 'Execute a file with Bundown,'],
  [ui.gray`     app`, '..from a directory,'],
  [ui.gray`     https://.../app.md`, '..from a URL\n'],
  [ui.yellow.bold`sync` + ui.gray` app.md app`, 'Unpack a file to a directory,'],
  [ui.yellow.bold`sync` + ui.gray` app app.md`, 'or pack a directory into a file\n'],
  [ui.cyan.bold`upgrade`, 'Upgrade to the latest version of Bundown'],
])}
${ui.bold`Flags:`}
${ui.table({ columns: [3, 10, 11, 40] })([
  [ui.cyan`-t` + ',', ui.cyan`--tag`, ui.gray`<tag>`, 'Filter code blocks by tag'],
  [ui.cyan`-p` + ',', ui.cyan`--print`, '', 'Pretty-print source during execution'],
  [ui.cyan`-v` + ',', ui.cyan`--version`, '', 'Print version and exit'],
  [ui.cyan`-h` + ',', ui.cyan`--help`, '', 'Display this menu and exit'],
])}
${ui.bold`Blocks:`}
${ui.table({ columns: [3, 10, 11, 40] })([
  [ui.cyan`-t` + ',', ui.cyan`--tag`, ui.gray`<tag>`, 'Tag block for filtering'],
  ['', ui.cyan`--os`, ui.gray(os), 'Only run on chosen operating system'],
  [ui.cyan`-f` + ',', ui.cyan`--file`, ui.gray`<file>`, 'Link block to a file path'],
])}
Learn more about Bundown:    ${ui.blue`https://rysana.com/bundown`}\n`
type Flags = { help?: boolean; version?: boolean; print?: boolean; tags?: string[] }
type Args = { flags: Flags; command?: string; args: string[] }
function parseArgs(args: string[]) {
  if (args.length === 0) return { flags: { help: true }, args: [] }
  if (args[0] === 'upgrade') return { command: 'upgrade', flags: {}, args: [] }
  const output: Args = { flags: { tags: [] }, args: [] }
  for (let j = 0; j < args.length; j++) {
    let arg = args[j]
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
          case '-t':
            arg = '--tag'
            break
        }
      }
      if (arg === '--tag') {
        output.flags.tags?.push(args[++j])
        continue
      }
      output.flags[arg.slice(2)] = true
      continue
    }
    if (!output.command) {
      if (['sync', 'run'].includes(arg)) {
        output.command = arg
        continue
      }
      output.command = 'run'
    }
    output.args.push(arg)
  }
  return output
}
const { flags, command, args } = parseArgs(process.argv.slice(2))
if (!semver.satisfies(Bun.version, dependencies.bun)) {
  console.log(usage)
  console.error(
    `\nBundown requires Bun version ${dependencies.bun}, but found ${Bun.version}.\n` +
      `Please run ${ui.bold.underline`bun upgrade`} to update to the latest version of Bun.\n`,
  )
  process.exit(1)
}
import { $, type ShellOutput } from 'bun'
function parseCodeMeta(meta: string | null | undefined) {
  const args = meta?.split(/\s+/) || []
  const flags: { file?: string; os?: string; tags?: string[] } = { tags: [] }
  for (let j = 0; j < args.length; j++) {
    let arg = args[j]
    if (arg[0] === '-') {
      if (arg[1] !== '-') {
        switch (arg) {
          case '-f':
            arg = '--file'
            break
          case '-t':
            arg = '--tag'
            break
        }
      }
      switch (arg) {
        case '--file':
          flags.file = args[++j]
          break
        case '--tag':
          flags.tags?.push(args[++j])
          break
        case '--os':
          flags.os = args[++j]
          if (flags.os === 'mac') flags.os = 'darwin'
          break
        default:
          console.warn(`Unrecognized block argument "${arg}"`)
          break
      }
      continue
    }
    console.warn(`Unrecognized block argument "${arg}"`)
  }
  return { flags }
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
    for (const defaultFile of ['readme.md', 'README.md', 'index.md']) {
      if (source.files.includes(defaultFile)) {
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
function sha256(input: string) {
  return new CryptoHasher('sha256').update(input).digest('hex')
}
try {
  if (command === 'upgrade') {
    const bin = (await $`which bundown`.text()).replace(/bundown/g, '')
    const packageManager = bin.includes('bun') ? 'bun' : bin.includes('pnpm') ? 'pnpm' : 'npm'
    await $`${packageManager} i -g bundown@latest`
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
  if (command === 'sync') {
    if (args.length !== 2) {
      throw new Error('Bundown sync requires two arguments: source and destination.')
    }
    const source = await resolveSource(args[0])
    if (source.type === 'directory') {
      throw new Error('Bundown sync requires a file as the source.')
    }
    const destination = await resolveSource(args[1])
    if (destination.type === 'file' || destination.type === 'url') {
      throw new Error('Bundown sync requires a directory as the destination.')
    }
    const tree = Markdown.parse(await sourceToMarkdown(source))
    const files: Record<string, { lang: string; content: string }> = {}
    for (const node of tree.children) {
      if (node.type === 'code') {
        const meta = parseCodeMeta(node.meta)
        if (meta.flags.file) {
          if (!files[meta.flags.file]) {
            const language = languages.find(({ aliases }) =>
              aliases.some(alias => alias === node.lang?.toLowerCase()),
            )
            files[meta.flags.file] = { lang: language?.aliases?.[0] || 'txt' || '', content: '' }
          }
          files[meta.flags.file].content += node.value + '\n'
        }
      }
    }
    if (flags.print) console.log()
    console.log(ui.bold`bundown sync`)
    if (flags.print) console.log()
    const entries = Object.entries(files)
    if (entries.length === 0) console.log(ui.red`No files found to sync.\n`)
    for (const [filename, { lang, content }] of entries) {
      const path = join(args[1], filename)
      await write(path, content)
      const info = ui.green`synced to ` + ui.bold(path)
      if (flags.print) {
        console.log(ui.box.full(info)(ui.highlight(lang, content.replace(/\n$/, ''))))
      } else {
        console.log(info)
      }
    }
    if (flags.print) console.log()
    process.exit(0)
  }
  if (args.length !== 1) {
    throw new Error('Bundown run requires a single argument: source (path, URL, etc.)')
  }
  const markdown = await sourceToMarkdown(await resolveSource(args[0]))
  const tree = Markdown.parse(markdown)
  const files: Record<string, string> = { script: 'import { $ } from "bun"\n\n' }
  function print(input = '', force = false) {
    if (flags.print || force)
      files.script += `console.log(\`${input
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
      const meta = parseCodeMeta(node.meta)
      if (
        !meta.flags.file &&
        (!meta.flags.os || os === meta.flags.os) &&
        ((!flags.tags?.length && !meta.flags.tags?.length) ||
          flags.tags?.some(tag => meta.flags.tags?.includes(tag))) &&
        language?.run
      ) {
        language.run({ input: node.value, files })
      }
      print()
    } else {
      print(ui.box.inset(Markdown.stringify(node)))
    }
  }
  const dotbundown = `${process.env.HOME}/.bundown`
  const filename = `${dotbundown}/tmp/${sha256(crypto.randomUUID())}.ts`
  await write(filename, files.script)
  let shellOutput: ShellOutput | undefined = undefined
  try {
    shellOutput = await $`FORCE_COLOR=1 bun ${filename}`
  } catch (processError) {
    throw new Error(processError)
  } finally {
    await $`rm -rf ${dotbundown}/tmp/`
    process.exit(shellOutput?.exitCode ?? 0)
  }
} catch (bundownError) {
  console.log('\n' + ui.box.top(`Use ${ui.bold('bundown -h')} for help`, ui.red) + '\n')
  console.log(bundownError)
  console.log(ui.box.bottom(ui.red))
  process.exit(1)
}
