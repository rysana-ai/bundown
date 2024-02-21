import * as ui from './ui'

export function log(message: (params: { console: typeof console; ui: typeof ui }) => void): void {
  message({ console, ui })
}
