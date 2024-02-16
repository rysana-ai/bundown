export type Language = (typeof languages)[number]['name']

const languages = [
  { name: 'JavaScript', aliases: ['js', 'javascript', 'jsx', 'cjs', 'mjs'] },
  { name: 'Shell', aliases: ['sh', 'bash', 'zsh', 'shell'] },
  { name: 'TypeScript', aliases: ['ts', 'tsx', 'typescript', 'mts', 'cts'] },
  { name: 'C', aliases: ['c', 'h', 'cu', 'cuda'] },
  { name: 'C++', aliases: ['c++', 'h++', 'cpp', 'hpp', 'hh', 'hxx', 'cxx', 'cc'] },
  { name: 'C#', aliases: ['cs', 'c#', 'csharp'] },
  { name: 'CSS', aliases: ['css'] },
  { name: 'Diff', aliases: ['diff', 'patch'] },
  { name: 'Go', aliases: ['go', 'golang'] },
  { name: 'GraphQL', aliases: ['graphql'] },
  { name: 'HTML', aliases: ['html', 'htm'] },
  { name: 'Arduino', aliases: ['ino', 'arduino'] },
  { name: 'Java', aliases: ['java', 'jsp'] },
  { name: 'JSON', aliases: ['json'] },
  { name: 'Kotlin', aliases: ['kt', 'kotlin'] },
  { name: 'Less', aliases: ['less'] },
  { name: 'Lua', aliases: ['lua'] },
  { name: 'Makefile', aliases: ['makefile', 'mk', 'mak', 'make'] },
  { name: 'Markdown', aliases: ['md', 'markdown', 'license', 'mkdown', 'mkd'] },
  { name: 'Objective-C', aliases: ['objc', 'objectivec', 'mm'] },
  { name: 'Perl', aliases: ['pl', 'pm', 'perl'] },
  { name: 'PHP', aliases: ['php'] },
  { name: 'Python', aliases: ['py', 'python', 'gyp'] },
  { name: 'R', aliases: ['r'] },
  { name: 'Ruby', aliases: ['rb', 'ruby', 'gemspec', 'podspec', 'thor', 'irb'] },
  { name: 'Rust', aliases: ['rs', 'rust'] },
  { name: 'SCSS', aliases: ['scss'] },
  { name: 'SQL', aliases: ['sql', 'pgsql', 'postgres', 'postgresql'] },
  { name: 'Swift', aliases: ['swift'] },
  { name: 'TOML', aliases: ['toml', 'ini'] },
  { name: 'Text', aliases: ['txt', 'text', 'plaintext', '.gitignore'] },
  { name: 'VB.NET', aliases: ['vb', 'vbnet'] },
  { name: 'WebAssembly', aliases: ['wasm'] },
  { name: 'XML', aliases: ['xml', 'svg'] },
  { name: 'YAML', aliases: ['yml', 'yaml'] },
] as const satisfies Array<{ name: string, aliases: string[] }>

export const language = {
  from: {
    name: (name?: string): Language | undefined => {
      if (!name) return undefined
      return languages.find(language => {
        if (language.name.toLowerCase() === name.toLowerCase()) return true
        return language.aliases.some(alias => alias.toLowerCase() === name.toLowerCase())
      })?.name
    }
  }
}
