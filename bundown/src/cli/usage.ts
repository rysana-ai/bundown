import * as ui from './ui'

export const usage = (params: { version: string; os: string }) =>
  '\n' +
  `${ui.magenta.bold`Bundown`} is a fast Markdown runtime and bundler. ` +
  `${ui.gray(`(${params.version})`)}\n
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
  ['', ui.cyan`--os`, ui.gray(params.os), 'Only run on chosen operating system'],
  [ui.cyan`-f` + ',', ui.cyan`--file`, ui.gray`<file>`, 'Link block to a file path'],
])}
Learn more about Bundown:    ${ui.blue`https://rysana.com/bundown`}\n`
