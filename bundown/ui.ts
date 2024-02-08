import chalk from 'chalk'
import { common, createEmphasize } from 'emphasize'
import stringWidth from 'string-width'
const emphasize = createEmphasize(common)
export const bold = chalk.bold
export const gray = chalk.hex('777')
export const blue = chalk.hex('5bd')
export const yellow = chalk.hex('fc7')
export const cyan = chalk.hex('7ce')
export const magenta = chalk.hex('f87')
export const red = chalk.hex('f34')
export const green = chalk.hex('4e6')
export function highlight(language: string, input: string) {
  return emphasize.highlight(language, input, {
    comment: chalk.hex('777'),
    keyword: chalk.hex('97d'),
    number: chalk.hex('8fa'),
    string: chalk.hex('f96'),
    'meta meta-string': chalk.hex('f87'),
    literal: chalk.hex('f87'),
    doctag: chalk.hex('f87'),
    regexp: chalk.hex('f42'),
    title: chalk.hex('5bd'),
    name: chalk.hex('5bd'),
    'selector-id': chalk.hex('fc7'),
    'selector-class': chalk.hex('fc7'),
    'selector-tag': chalk.hex('fc7'),
    'selector-attr': chalk.hex('5bd'),
    'selector-pseudo': chalk.hex('fc7'),
    attribute: chalk.hex('7ce'),
    attr: chalk.hex('7ce'),
    variable: chalk.hex('7ce'),
    'template-variable': chalk.hex('7ce'),
    'class title': chalk.hex('7ce'),
    type: chalk.hex('f87'),
    symbol: chalk.hex('f87'),
    bullet: chalk.hex('f87'),
    subst: chalk.hex('f87'),
    meta: chalk.hex('f87'),
    'meta keyword': chalk.hex('f87'),
    link: chalk.underline.hex('7ce'),
    built_in: chalk.hex('7ce'),
    quote: chalk.hex('999'),
    addition: chalk.hex('ad8'),
    deletion: chalk.hex('e65'),
    section: chalk.underline.bold.white,
    emphasis: chalk.italic,
    strong: chalk.bold.white,
    formula: chalk.inverse,
  }).value
}
const columns = process.stdout.columns
export const box = {
  top(label = '') {
    return chalk.dim('╭─') + label + chalk.dim('─'.repeat(columns - stringWidth(label) - 3) + '╮')
  },
  divider() {
    return chalk.dim('├' + '─'.repeat(columns - 2) + '┤')
  },
  bottom() {
    return chalk.dim('╰' + '─'.repeat(columns - 2) + '╯\n')
  },
}
export function table(options: { columns?: number[] } = {}) {
  return (rows: string[][]) => {
    const gap = { x: 1 }
    const padding = { l: 2, b: 1 }
    const columns = options.columns || []
    if (!columns.length) {
      for (const row of rows) {
        for (let i = 0; i < row.length; i++) {
          columns[i] = Math.max(columns[i] || 0, stringWidth(row[i]))
        }
      }
    }
    return (
      rows
        .map(
          row =>
            ' '.repeat(padding.l) +
            columns
              .map((width, i) => row[i] + ' '.repeat(width - stringWidth(row[i])))
              .join(' '.repeat(gap.x)),
        )
        .join('\n') + '\n'.repeat(padding.b)
    )
  }
}
