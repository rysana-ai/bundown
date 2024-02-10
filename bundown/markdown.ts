import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { mathFromMarkdown, mathToMarkdown } from 'mdast-util-math'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'
import { math } from 'micromark-extension-math'
import * as ui from './ui'
export const Markdown = {
  parse(input: string) {
    return fromMarkdown(input, {
      extensions: [gfm(), math()],
      mdastExtensions: [gfmFromMarkdown(), mathFromMarkdown()],
    })
  },
  stringify(tree: any) {
    return ui.highlight(
      'markdown',
      toMarkdown(tree, {
        extensions: [gfmToMarkdown(), mathToMarkdown()],
      }),
    )
  },
}
